'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { AlertCircle, X } from 'lucide-react';

import { DropZoneStep } from './DropZoneStep';
import { PreviewGridStep } from './PreviewGridStep';
import { ProgressStep } from './ProgressStep';
import { CompleteStep } from './CompleteStep';

interface ImportModalProps {
  onClose: () => void;
  onUploadSuccess: (records: any[], metrics: { totalImported: number; totalSkipped: number }, skippedRows: any[]) => void;
  isDarkMode: boolean;
}

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok && (response.status === 429 || response.status >= 500) && retries > 0) {
      console.warn(`Batch failed with status ${response.status}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Network error encountered. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default function ImportModal({ onClose, onUploadSuccess, isDarkMode }: ImportModalProps) {
  const [modalStep, setModalStep] = useState<1 | 2 | 3 | 4>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [totalBatchesCount, setTotalBatchesCount] = useState(0);
  const [localMetrics, setLocalMetrics] = useState({ totalImported: 0, totalSkipped: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please provide a valid CSV file.');
      return;
    }
    setError(null);
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 15,
      complete: (res) => {
        if (res.data.length === 0) {
          setError('CSV file is empty.');
          return;
        }
        setPreviewHeaders(Object.keys(res.data[0] || {}).slice(0, 5));
        setPreviewRows(res.data);
        setModalStep(2);
      }
    });
  };

  const handleBackendUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setModalStep(3);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawRows = results.data;
        const BATCH_SIZE = 25;
        const totalBatches = Math.ceil(rawRows.length / BATCH_SIZE);
        
        setTotalBatchesCount(totalBatches);
        setCurrentBatchIndex(1);

        let finalWorkspaceRecords: any[] = [];
        let aggregateSkippedRows: any[] = [];
        let runningImportCount = 0;
        let runningSkippedCount = 0;

        try {
          // Locked to the loopback IPv4 interface matching your backend instance
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

          for (let i = 0; i < rawRows.length; i += BATCH_SIZE) {
            const currentBatchNumber = Math.floor(i / BATCH_SIZE) + 1;
            setCurrentBatchIndex(currentBatchNumber);

            const batchSlice = rawRows.slice(i, i + BATCH_SIZE);
            const unparsedCsvChunk = Papa.unparse(batchSlice);
            const blobChunk = new Blob([unparsedCsvChunk], { type: 'text/csv' });
            
            const formData = new FormData();
            formData.append('file', blobChunk, `batch_${currentBatchNumber}.csv`);

            const response = await fetchWithRetry(`${API_BASE_URL}/api/import`, {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) throw new Error(`Failed to map rows accurately during batch ${currentBatchNumber}.`);

            const data = await response.json();

            finalWorkspaceRecords = data.records;
            
            if (data.skippedRecords && Array.isArray(data.skippedRecords)) {
              aggregateSkippedRows = [...aggregateSkippedRows, ...data.skippedRecords];
            }
            
            runningImportCount += data.totalImported;
            runningSkippedCount += data.totalSkipped;

            setLocalMetrics({
              totalImported: runningImportCount,
              totalSkipped: runningSkippedCount
            });
          } // 🔄 End of batch execution loop

          onUploadSuccess(
            finalWorkspaceRecords, 
            { totalImported: runningImportCount, totalSkipped: runningSkippedCount },
            aggregateSkippedRows
          );

          setModalStep(4);
        } catch (err: any) {
          setError(err.message || 'Server extraction error occurred after multiple retries.');
          setModalStep(2);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all ${isDarkMode ? 'bg-slate-950/70' : 'bg-slate-900/40'}`}>
      <div className={`rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden relative border transition-all duration-300 ${isDarkMode ? 'bg-[#131926] border-slate-800/90 shadow-black/50' : 'bg-white border-slate-100'}`}>
        <button onClick={onClose} className={`absolute top-5 right-5 p-1 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}><X className="w-4 h-4" /></button>

        <div className={`p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Import Leads via CSV</h3>
          <p className="text-xs text-slate-400 mt-0.5">Upload a CSV file to bulk import leads into your system.</p>
        </div>

        {error && <div className={`mx-6 mt-4 p-3.5 border rounded-xl text-xs flex items-center space-x-2 ${isDarkMode ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'}`}><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}

        {modalStep === 1 && (
          <DropZoneStep 
            isDragging={isDragging} 
            setIsDragging={setIsDragging} 
            handleFile={handleFile} 
            fileInputRef={fileInputRef} 
            isDarkMode={isDarkMode} 
          />
        )}

        {modalStep === 2 && (
          <PreviewGridStep 
            selectedFile={selectedFile} 
            previewHeaders={previewHeaders} 
            previewRows={previewRows} 
            setModalStep={setModalStep} 
            isDarkMode={isDarkMode} 
          />
        )}

        {modalStep === 3 && (
          <ProgressStep 
            currentBatchIndex={currentBatchIndex} 
            totalBatchesCount={totalBatchesCount} 
            isDarkMode={isDarkMode} 
          />
        )}

        {modalStep === 4 && (
          <CompleteStep 
            totalImported={localMetrics.totalImported} 
            totalSkipped={localMetrics.totalSkipped} 
            isDarkMode={isDarkMode} 
          />
        )}

        <div className={`p-4 border-t flex items-center justify-end space-x-3 transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
          <button type="button" onClick={onClose} className={`px-6 py-2.5 text-xs font-bold border rounded-xl shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'}`}>Cancel</button>
          {modalStep === 2 && (
            <button 
              type="button" 
              onClick={handleBackendUpload} 
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#F09070] rounded-xl hover:opacity-95 transition-all shadow-sm"
            >
              Confirm & Import
            </button>
          )}
          {modalStep === 4 && <button type="button" onClick={onClose} className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? 'bg-teal-500 text-slate-950 hover:bg-teal-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Go to Leads Board</button>}
        </div>
      </div>
    </div>
  );
}