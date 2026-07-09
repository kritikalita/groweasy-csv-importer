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
    const rawRows = AIService.parseCSV(csvText);

    if (rawRows.length === 0) {
      res.status(400).json({ error: 'The uploaded CSV file contains no data rows.' });
      return;
    }

    const finalRecords: CRMRecord[] = [];
    let totalSkipped = 0;

    // 4. Batch Processing Loop (Send 25 records per batch iteration)
    const BATCH_SIZE = 25;
    for (let i = 0; i < rawRows.length; i += BATCH_SIZE) {
      const batch = rawRows.slice(i, i + BATCH_SIZE);
      
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(rawRows.length / BATCH_SIZE)}...`);
      
      const response = await AIService.processBatch(batch);
      
      finalRecords.push(...response.records);
      totalSkipped += response.skippedCount;
    }

    // 5. Send back structured summary tracking fields
    res.status(200).json({
      records: finalRecords,
      totalImported: finalRecords.length,
      totalSkipped: totalSkipped,
    });

  } catch (error: any) {
    console.error('Fatal Import Route Error:', error);
    res.status(500).json({ error: 'An internal error occurred while parsing your import.' });
  }
};