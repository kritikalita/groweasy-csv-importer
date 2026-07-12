'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompleteStepProps {
  totalImported: number;
  totalSkipped: number;
  isDarkMode: boolean;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({
  totalImported,
  totalSkipped,
  isDarkMode,
}) => {
  return (
    <div className="p-8 text-center space-y-5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border shadow-sm ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
        <CheckCircle className="w-6 h-6" />
      </div>
      <h4 className={`text-lg font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Lead Migration Complete!</h4>
      <div className="flex justify-center space-x-4">
        <div className={`p-3 border rounded-xl ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
          <span className={`text-xs font-bold block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Imported: {totalImported}</span>
        </div>
        <div className={`p-3 border rounded-xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-xs text-slate-400 font-bold block">Skipped: {totalSkipped}</span>
        </div>
      </div>
    </div>
  );
};