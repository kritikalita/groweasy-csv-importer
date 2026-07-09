import { Groq } from 'groq-sdk';
import Papa from 'papaparse';
import { CRMRecord, AIResponseBatch } from '../types/crm';
import dotenv from 'dotenv';

// Force load environmental configurations right here
dotenv.config();

// Explicitly pass the key inside the configuration object
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export class AIService {
  /**
   * Step A: Parse raw CSV text into simple key-value objects
   */
  public static parseCSV(csvText: string): any[] {
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return parsed.data;
  }

  /**
   * Step B: Send a batch of messy rows to Groq to map and clean
   */
  public static async processBatch(batch: any[]): Promise<AIResponseBatch> {
    const systemInstruction = `
      You are an expert CRM Data Migrator. Your job is to map an array of arbitrary key-value objects extracted from a messy user CSV into our standardized GrowEasy CRM format.

      Target Schema Fields & Validation Rules:
      - created_at: Ensure it's a valid string convertible via 'new Date(val)'.
      - name: Lead full name string.
      - email: Primary email address string.
      - country_code: Country phone code starting with '+' (e.g., '+91').
      - mobile_without_country_code: Mobile number without the country code prefix.
      - company: Company name string.
      - city: City string.
      - state: State string.
      - country: Country string.
      - lead_owner: Email or ID of the owner.
      - crm_status: MUST strictly be one of: ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']. If the input data contains phrases like "interested", "call back", or "follow up", map it to 'GOOD_LEAD_FOLLOW_UP'. If it contains "busy", "no answer", or "disconnected", map it to 'DID_NOT_CONNECT'. If it contains "not interested", "wrong number", or "junk", map it to 'BAD_LEAD'. If it contains "won", "closed", "purchased", or "done", map it to 'SALE_DONE'. If there is absolutely no hint, default it intelligently to 'GOOD_LEAD_FOLLOW_UP' instead of leaving it null.
      - data_source: MUST strictly be one of: ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots']. If none match confidently, leave it as an empty string "".
      - possession_time: Property possession time notes.
      - description: Additional description string.
      - crm_note: Use this for remarks, follow-up notes, comments, extra phone numbers, or extra emails.

      CRITICAL SYSTEM EXTRACTION RULES:
      1. Skip Criteria: If a record has NEITHER a valid email nor a mobile number, completely omit it from the returned records array and increment skippedCount.
      2. Multiple Contacts: If multiple email addresses or mobile numbers exist in a single record, map the first one to the standard field and append all remaining ones explicitly into 'crm_note'.
      3. Clean Rows: Do not introduce unintended raw newline breaks inside text values. Use '\\n' if a break is needed.

      Respond ONLY with a valid JSON object matching this structure:
      {
        "records": [],
        "skippedCount": 0
      }
    `;

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Process this raw batch data:\n${JSON.stringify(batch)}` }
        ],
        // This ensures the model outputs exactly structured JSON
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
        throw new Error('Received empty response from AI model.');
      }

      return JSON.parse(text) as AIResponseBatch;
    } catch (error) {
      console.error('Error compiling AI batch response:', error);
      return { records: [], skippedCount: batch.length };
    }
  }
}