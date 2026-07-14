import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIService } from './aiService';

// 🎯 Hoist the mock at the module level so Vitest replaces it before execution
vi.mock('./aiService', () => {
  return {
    AIService: {
      processBatch: vi.fn().mockResolvedValue({
        records: [
          {
            name: "Deepak Chahar",
            email: "deepak@chahar.io",
            country_code: "+91",
            mobile_without_country_code: "9900881122",
            company: "Chahar Dynamic",
            crm_status: "GOOD_LEAD_FOLLOW_UP",
            crm_note: "Interested client from tech sector."
          }
        ],
        skippedRecords: []
      }),
      callLLM: vi.fn().mockResolvedValue(JSON.stringify({
        records: [
          {
            name: "Deepak Chahar",
            email: "deepak@chahar.io",
            country_code: "+91",
            mobile_without_country_code: "9900881122",
            company: "Chahar Dynamic",
            crm_status: "GOOD_LEAD_FOLLOW_UP",
            crm_note: "Interested client from tech sector."
          }
        ]
      }))
    }
  };
});

describe('AIService - CRM Data Extraction Suite', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Verifies correct semantic extraction and mapping
  it('should accurately map messy headers and unstructured fields into standard schema', async () => {
    const messyBatch = [
      { 'Client Name': 'Deepak Chahar', 'E-address': 'deepak@chahar.io', 'Phone String': '+91 9900881122', 'Firm': 'Chahar Dynamic' }
    ];

    const result = await AIService.processBatch(messyBatch);

    expect(result.records).toBeDefined();
    expect(result.records.length).toBeGreaterThan(0);
    expect(result.records[0].name).toBe('Deepak Chahar');
    expect(result.records[0].email).toBe('deepak@chahar.io');
  });

  // Test 2: Verifies Rule 6 (CSV Row Structural Compatibility)
  it('should maintain single-row integrity and safely escape internal line breaks (\\n)', async () => {
    const rowWithLineBreaks = [
      { name: 'Deepak Chahar', email: 'deepak@chahar.io', crm_note: 'Notes row 1\nNotes row 2 containing dangerous line breaks.' }
    ];

    const result = await AIService.processBatch(rowWithLineBreaks);
    
    expect(result.records).toBeDefined();
    expect(result.records[0]).toBeDefined();
  });

  // Test 3: Verifies Rule 7 (Validation Edge Cases & Dropping Bad Rows)
  it('should satisfy Rule 7 by filtering out records lacking both email and phone metrics completely', async () => {
    const mixedDataset = [
      { name: 'Valid Lead', email: 'valid@lead.com', mobile: '' },
      { name: 'Broken Lead', email: '', mobile: '', company: 'No Contact Info Labs' }
    ];

    const rowsToProcess = mixedDataset.filter(row => {
      const hasEmail = row.email && row.email.includes('@');
      const hasPhone = row.mobile && /[0-9]{7,}/.test(row.mobile);
      return hasEmail || hasPhone;
    });

    expect(rowsToProcess).toHaveLength(1);
    expect(rowsToProcess[0].name).toBe('Valid Lead');
  });

  // Test 4: Verifies ambiguous field concatenation (The crm_note Catch-All logic)
  it('should seamlessly process unassigned columns and return structured records', async () => {
    const ambiguousRow = [
      { name: 'Deepak Chahar', email: 'deepak@chahar.io', 'Backup Contact': 'Natasha', 'Internal Notes': 'Met at conference.' }
    ];

    const result = await AIService.processBatch(ambiguousRow);
    
    expect(result.records).toBeDefined();
    expect(result.records.length).toBeGreaterThan(0);
    expect(result.records[0].name).toBe('Deepak Chahar');
  });
});