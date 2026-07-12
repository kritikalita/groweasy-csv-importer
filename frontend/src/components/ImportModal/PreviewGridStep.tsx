'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface PreviewGridStepProps {
  selectedFile: File | null;
  previewHeaders: string[];
  previewRows: any[];
  setModalStep: (step: 1 | 2 | 3 | 4) => void;
  isDarkMode: boolean;
}

export const PreviewGridStep: React.FC<PreviewGridStepProps> = ({
  selectedFile,
  previewHeaders,
  previewRows,
  setModalStep,
  isDarkMode,
}) => {
  return (
    <div className="p-6 space-y-4">
      <div className={`p-3 border rounded-xl flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center space-x-3 text-xs truncate max-w-xs">
          <FileText className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <span className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{selectedFile?.name}</span>
        </div>
        <button onClick={() => setModalStep(1)} className="text-[10px] font-bold text-rose-500 hover:underline">Remove</button>
      </div>

      <div className={`border rounded-xl overflow-auto max-h-[220px] w-full transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <table className="w-full text-left border-collapse table-auto min-w-[600px] text-[11px]">
          <thead className={`font-bold uppercase tracking-wider sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>
            <tr>
              {previewHeaders.map((h) => (
                <th key={h} className={`p-2.5 border-b sticky top-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-600'}`}>
            {previewRows.map((row, rIdx) => (
              <tr key={rIdx} className={isDarkMode ? 'hover:bg-slate-900/10' : 'hover:bg-slate-50/40'}>
                {previewHeaders.map((h) => (
                  <td key={h} className="p-2.5 truncate max-w-[150px]">{row[h] || '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};