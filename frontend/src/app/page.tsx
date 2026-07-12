'use client';

import React, { useState } from 'react';
import { FileText, Search, CheckCircle2, AlertTriangle, Users, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LeadsTable from '../components/LeadsTable';
import ImportModal from '../components/ImportModal';

export default function GrowEasyApplication() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'sources' | 'manage'>('sources');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // App state tracks both active leads and raw skipped fallback strings
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [skippedRows, setSkippedRows] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ totalImported: 0, totalSkipped: 0 });
  const [showSkippedDetails, setShowSkippedDetails] = useState(false);

  const handleUploadSuccess = (
    records: any[], 
    uploadMetrics: { totalImported: number; totalSkipped: number },
    rawSkipped: any[]
  ) => {
    // 🚀 Ensure we append or safely sync records directly
    setAllLeads(records || []);
    setSkippedRows(rawSkipped || []);
    setMetrics(uploadMetrics);
    setShowSkippedDetails(false); 
    setActiveTab('manage');
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#060913]' : 'bg-[#F8FAFC]'}`}>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {activeTab === 'sources' && (
          <div className="p-8 max-w-5xl w-full mx-auto space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lead Sources</h2>
              <p className="text-sm text-slate-500 mt-1">Connect, manage, and control all your lead channels from one dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className={`p-6 border rounded-2xl shadow-sm flex items-start space-x-4 ${isDarkMode ? 'bg-[#0F1322] border-slate-800/60 shadow-black/10' : 'bg-white border-slate-200'}`}>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-teal-950/60 text-teal-400' : 'bg-teal-50 text-teal-600'}`}><FileText className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h4 className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Bulk Import via CSV</h4>
                  <p className="text-xs text-slate-400 mt-1">Intelligently clean spreadsheets from custom layouts using AI mapping.</p>
                  <button onClick={() => setIsModalOpen(true)} className={`mt-4 px-4 py-2 text-xs font-bold rounded-xl ${isDarkMode ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-white'}`}>Open Importer Modal</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 gap-4 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Manage Your Leads</h2>
                <p className="text-sm text-slate-500 mt-0.5">Monitor lead status, assign tasks, and view AI processing telemetry.</p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-2 border rounded-xl max-w-sm w-full sm:w-auto ${isDarkMode ? 'bg-[#0F1322] border-slate-800/60' : 'bg-white border-slate-200'}`}>
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search leads..." className={`text-xs bg-transparent outline-none w-full ${isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-slate-700'}`} />
              </div>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 border rounded-2xl shadow-sm flex items-center space-x-4 ${isDarkMode ? 'bg-[#0F1322] border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Imported Records</span>
                  <span className={`text-2xl font-black block mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{metrics.totalImported}</span>
                </div>
              </div>

              {/* Clickable Card: Tracks Skipped Records Display Logic */}
              <div 
                onClick={() => metrics.totalSkipped > 0 && setShowSkippedDetails(!showSkippedDetails)}
                className={`p-4 border rounded-2xl shadow-sm flex items-center justify-between transition-all ${metrics.totalSkipped > 0 ? 'cursor-pointer hover:scale-[1.01]' : ''} ${isDarkMode ? 'bg-[#0F1322] border-slate-800/60' : 'bg-white border-slate-200/60'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50 text-amber-600'}`}><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Skipped Records</span>
                    <span className={`text-2xl font-black block mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{metrics.totalSkipped}</span>
                  </div>
                </div>
                {metrics.totalSkipped > 0 && (
                  <div className="text-slate-400 mr-2">
                    {showSkippedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                )}
              </div>

              <div className={`p-4 border rounded-2xl shadow-sm flex items-center space-x-4 ${isDarkMode ? 'bg-[#0F1322] border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}><Users className="w-5 h-5" /></div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Workspace Population</span>
                  <span className={`text-2xl font-black block mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{allLeads.length}</span>
                </div>
              </div>
            </div>

            {/* FEATURE EXPANSION: The Skipped Records Inspector Tray */}
            {showSkippedDetails && skippedRows.length > 0 && (
              <div className={`p-5 border rounded-2xl animate-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#121824] border-amber-500/20' : 'bg-amber-50/40 border-amber-200/60'}`}>
                <div className="flex items-center space-x-2 text-amber-600 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Skipped Data Logs (Rule 7 / Duplication Validation)</h4>
                </div>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-2">
                  {skippedRows.map((row, index) => (
                    <div 
                      key={index} 
                      className={`font-mono text-[11px] p-2.5 rounded-xl border truncate ${isDarkMode ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
                    >
                      <span className="font-bold text-rose-500 mr-2">[Item {index + 1} Log]:</span>
                      {typeof row === 'object' ? JSON.stringify(row) : String(row)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <LeadsTable allLeads={allLeads} isDarkMode={isDarkMode} />
          </div>
        )}
      </main>

      {isModalOpen && (
        <ImportModal onClose={() => setIsModalOpen(false)} onUploadSuccess={handleUploadSuccess} isDarkMode={isDarkMode} />
      )}

    </div>
  );
}