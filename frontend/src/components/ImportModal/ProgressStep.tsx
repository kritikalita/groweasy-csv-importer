'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressStepProps {
  currentBatchIndex: number;
  totalBatchesCount: number;
  isDarkMode: boolean;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({
  currentBatchIndex,
  totalBatchesCount,
  isDarkMode,
}) => {
  const percentComplete = totalBatchesCount > 0 ? (currentBatchIndex / totalBatchesCount) * 100 : 0;

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center space-y-5">
      <Loader2 className="w-8 h-8 text-[#F09070] animate-spin" />
      <div className="space-y-1">
        <h4 className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          GrowEasy AI is Mapping Fields...
        </h4>
        <p className="text-xs text-slate-400">
          Processing batch <span className="text-[#F09070] font-bold">{currentBatchIndex}</span> of {totalBatchesCount}
        </p>
      </div>
      
      <div className={`w-full max-w-xs h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-[#F09070] transition-all duration-300 rounded-full"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
};