'use client';

import React from 'react';
import { Upload, Download, Info } from 'lucide-react';

interface DropZoneStepProps {
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  handleFile: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDarkMode: boolean;
}

export const DropZoneStep: React.FC<DropZoneStepProps> = ({
  isDragging,
  setIsDragging,
  handleFile,
  fileInputRef,
  isDarkMode,
}) => {
  return (
    <div className="p-6">
      <div 
        onClick={() => fileInputRef.current?.click()} 
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }} 
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }} 
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }} 
        className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${isDragging ? 'border-orange-400 bg-orange-50/10 scale-[0.99]' : (isDarkMode ? 'border-slate-700 bg-slate-900/10 hover:border-slate-600' : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50/60')}`}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-teal-400' : 'bg-white border-slate-200 text-teal-600 shadow-sm'}`}>
          <Upload className="w-5 h-5" />
        </div>

        <h4 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          {isDragging ? "Drop your CSV template file now" : "Drop your CSV file here"}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">or click to browse files</p>
        
        <div className={`inline-flex items-center space-x-1.5 mt-4 text-[11px] px-3 py-1 rounded-full border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200/60 text-slate-500'}`}>
          <Info className="w-3.5 h-3.5 opacity-70" />
          <span>Supported file: .csv (max 5MB)</span>
        </div>

        <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-5 leading-relaxed font-medium">
          Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
        </p>

        <div className="mt-5">
          <button 
            type="button" 
            onClick={(e) => e.stopPropagation()} 
            className={`text-xs font-bold border px-4 py-2 rounded-xl transition-all inline-flex items-center space-x-2 ${isDarkMode ? 'text-teal-400 bg-teal-950/20 border-teal-900/60 hover:bg-teal-950/40' : 'text-teal-700 bg-teal-50 border-teal-100 hover:bg-teal-100/60'}`}
          >
            <Download className="w-3.5 h-3.5" /> 
            <span>Download Sample CSV Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};