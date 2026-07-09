import { Request, Response } from 'express';
import { AIService } from './services/aiService';
import { CRMRecord } from './types/crm';

// Define a custom interface extending Express Request to accommodate Multer's file field
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const importCSVHandler = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // 1. Safety Check: Ensure a file was actually uploaded
    if (!req.file) {
      res.status(400).json({ error: 'Please upload a valid CSV file.' });
      return;
    }

    // 2. Read file contents into text memory
    const csvText = req.file.buffer.toString('utf-8');

    // 3. Convert CSV rows to structured JavaScript arrays
    const allRawRows = AIService.parseCSV(csvText);

    if (allRawRows.length === 0) {
      res.status(400).json({ error: 'The uploaded CSV file contains no data rows.' });
      return;
    }

    const rowsToProcess: any[] = [];
    const skippedRecords: any[] = [];

    // 🌟 REQ IMPLEMENTATION: Rule 7 Pre-Screening Validation Layer
    // Scan headers/keys dynamically for any column containing variations of 'mail', 'phone', 'contact', 'mobile', or 'num'
    for (const row of allRawRows) {
      const keys = Object.keys(row);
      
      // Concatenate all field values in the row to find contact clues
      let combinedContactText = '';
      keys.forEach((key) => {
        const lowerKey = key.toLowerCase();
        const val = String(row[key] || '').trim();
        
        if (
          lowerKey.includes('mail') || 
          lowerKey.includes('phone') || 
          lowerKey.includes('contact') || 
          lowerKey.includes('mobile') || 
          lowerKey.includes('num') || 
          val.includes('@') || 
          /^\+?[0-9\s\-]{7,15}$/.test(val)
        ) {
          combinedContactText += ' ' + val;
        }
      });

      // Simple regex check: does it have an email (@) or digits for a phone number?
      const hasEmail = combinedContactText.includes('@');
      const hasPhone = /[0-9]{7,}/.test(combinedContactText);

      if (hasEmail || hasPhone) {
        rowsToProcess.push(row);
      } else {
        // If it fails Rule 7, append the raw data row into our diagnostic logs
        skippedRecords.push(row);
      }
    }

    // 4. Batch Processing Loop (Send 25 valid records per batch iteration)
    const finalRecords: CRMRecord[] = [];
    let totalAIEngineSkipped = 0;

    // 4. Batch Processing Loop (Send 25 valid records per batch iteration)
    const BATCH_SIZE = 25;
    for (let i = 0; i < rowsToProcess.length; i += BATCH_SIZE) {
      const batch = rowsToProcess.slice(i, i + BATCH_SIZE);
      
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(rowsToProcess.length / BATCH_SIZE)}...`);
      
      const response = await AIService.processBatch(batch);
      
      finalRecords.push(...response.records);
      totalAIEngineSkipped += response.skippedCount;
      
      // 🚀 FIX: Use type assertion to cast response safely and satisfy the compiler
      const rawResponseObj = response as any;
      if (rawResponseObj.skippedRecords && Array.isArray(rawResponseObj.skippedRecords)) {
        skippedRecords.push(...rawResponseObj.skippedRecords);
      }
    }

    // 5. Send back structured summary tracking fields including the raw skipped rows array
    res.status(200).json({
      records: finalRecords,
      totalImported: finalRecords.length,
      totalSkipped: skippedRecords.length + totalAIEngineSkipped,
      skippedRecords: skippedRecords // 🚀 Passed down directly to power your new frontend dropdown card!
    });

  } catch (error: any) {
    console.error('Fatal Import Route Error:', error);
    res.status(500).json({ error: 'An internal error occurred while parsing your import.' });
  }
};