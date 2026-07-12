// backend/src/services/aiService.ts
import { Groq } from 'groq-sdk';
import { CRMRecord, AIResponseBatch } from '../types/crm';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export class AIService {
  /**
   * Processes a batch of raw, unvalidated CSV rows using the LLM.
   */
  public static async processBatch(batch: any[]): Promise<AIResponseBatch> {
    const systemInstruction = `
      You are an expert CRM Data Migration engine for GrowEasy. Map the incoming array of messy objects into our standardized schema.

      Target Schema Fields:
      - created_at: ISO timestamp string. If missing/invalid, use "2026-07-09T22:50:00.000Z".
      - name: Full name string. Default to "Unknown Lead".
      - email: Primary email string or null.
      - country_code: Country phone code string (e.g. "+91").
      - mobile_without_country_code: Digits only string, no country code prefix.
      - company, city, state, country, lead_owner, possession_time, description: Extract string values if available, else null.
      - crm_status: MUST strictly be one of: ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'].
        * Map "bought", "won", "paid" -> "SALE_DONE"
        * Map "no answer", "busy", "ringing" -> "DID_NOT_CONNECT"
        * Map "not interested", "junk" -> "BAD_LEAD"
        * Default fallback -> "GOOD_LEAD_FOLLOW_UP"
      - data_source: Strictly choose one of: ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'] or leave as "".
      - crm_note: General notes/remarks. Use '\\n' for internal newlines.

      CRITICAL FILTER RULE (Rule 7):
      1. If an object contains absolutely NO email address AND NO phone number anywhere in its properties, skip it by adding it to the 'skippedRecords' array instead.
      2. GARBAGE & PLACEHOLDER DATA FILTER: If a row contains placeholder text strings such as "Broken Row Data", "junk lead", or has headers but completely empty fields, you MUST classify it as malformed. Do not process it; add it to the 'skippedRecords' array instead with a clear reason.

      OUTPUT FORMAT:
      You MUST respond with a single valid JSON object containing exactly these two keys:
      {
        "records": [ { ... }, { ... } ],
        "skippedRecords": [ { "name": "...", "reason": "..." } ]
      }
    `;

    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',   // 🚀 High availability fallback model
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Process this raw JSON array data. Return raw minified JSON only, do NOT wrap your response in markdown code blocks or backticks:\n${JSON.stringify(batch)}` }
        ],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content || '{}';
      const aiResult = JSON.parse(text);

      const records = Array.isArray(aiResult.records) ? aiResult.records : [];
      const skippedRecords = Array.isArray(aiResult.skippedRecords) ? aiResult.skippedRecords : [];

      return {
        records,
        skippedCount: skippedRecords.length,
        skippedRecords
      };
    } catch (error) {
      console.error('AI Batch Process Error:', error);
      return { 
        records: [], 
        skippedCount: batch.length,
        skippedRecords: batch.map(b => ({ name: b['Client Name'] || 'Unknown', reason: "Processing Error" }))
      };
    }
  }
}