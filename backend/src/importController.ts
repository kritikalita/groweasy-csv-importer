// backend/src/importController.ts
import { Request, Response } from 'express';
import Papa from 'papaparse';
import { AIService } from './services/aiService';
import { CRMRecord } from './types/crm';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const importCSVHandler = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // 1. Core structural guard checks
    if (!req.file) {
      res.status(400).json({ error: 'Please upload a valid CSV file.' });
      return;
    }

    const csvText = req.file.buffer.toString('utf-8');
    
    // Parse raw CSV text directly into JSON key-value blocks
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const allRawRows = parsed.data;

    if (allRawRows.length === 0) {
      res.status(400).json({ error: 'The uploaded CSV file contains no data rows.' });
      return;
    }

    const finalImportedRecords: CRMRecord[] = [];
    let totalSkippedCount = 0;
    const aggregatedSkippedDetails: any[] = [];
    
    const BATCH_SIZE = 25;

    // 2. Iterate and process directly through the AI Mapping Engine
    for (let i = 0; i < allRawRows.length; i += BATCH_SIZE) {
      const batch = allRawRows.slice(i, i + BATCH_SIZE);
      console.log(`🔄 Mapping batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allRawRows.length / BATCH_SIZE)} via Groq AI...`);
      
      const response = await AIService.processBatch(batch);
      
      finalImportedRecords.push(...response.records);
      totalSkippedCount += response.skippedCount;
      
      if (response.skippedRecords && Array.isArray(response.skippedRecords)) {
        aggregatedSkippedDetails.push(...response.skippedRecords);
      }
    }

    // 3. Telemetry inspection logs for monitoring AI parsing precision
    console.log("=== FINAL BACKEND PAYLOAD INSPECTION ===");
    console.log("Total Imported Records to return:", finalImportedRecords.length);
    console.log("Total Skipped Count to return:", totalSkippedCount);
    console.log("Raw Records Array Sample:", JSON.stringify(finalImportedRecords));
    console.log("========================================");

    // 4. Return structured payload exactly matching UI data display specifications
    res.status(200).json({
      records: finalImportedRecords, 
      totalImported: finalImportedRecords.length, 
      totalSkipped: totalSkippedCount,
      skippedRecords: aggregatedSkippedDetails 
    });

  } catch (error: any) {
    console.error('Fatal Import Route Error:', error);
    res.status(500).json({ error: 'An internal error occurred while parsing your import.' });
  }
};