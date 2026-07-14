'use client';

import React from 'react';
import Image from 'next/image';
import { LayoutDashboard, UserPlus, Users2, Layers, ChevronRight, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeTab: 'sources' | 'manage';
  setActiveTab: (tab: 'sources' | 'manage') => void;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: SidebarProps) {
  return (
    <aside className={`w-64 border-r flex flex-col justify-between hidden md:flex flex-shrink-0 transition-all duration-300 ${isDarkMode ? 'bg-[#0B0F17] border-slate-800/60' : 'bg-white border-slate-200'}`}>
      <div>
        {/* Brand Header with official logo replacement */}
        <div className={`p-5 flex items-center space-x-2 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
          <div className="relative w-7 h-7 flex-shrink-0 overflow-hidden rounded-lg">
            <Image 
              src="/groweasy_logo.jpeg" // Change extension to .svg if applicable
              alt="GrowEasy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className={`font-extrabold text-xl tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300' : 'text-[#0F172A]'}`}>GrowEasy</span>
        </div>

        {/* User Account Capsule */}
        <div className={`m-4 p-3 border rounded-xl flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">VK</div>
            <div>
              <h4 className={`text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>VK Test</h4>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Owner</p>
            </div>
          </div>
          <ChevronRight className="w-3.6 h-3.6 text-slate-500" />
        </div>

        {/* Navigation Menu Tabs */}
        <nav className="px-3 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest my-3">Main</p>
          <button className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isDarkMode ? 'hover:bg-slate-900/50 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-50 text-slate-500'}`}><LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span></button>
          <button className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isDarkMode ? 'hover:bg-slate-900/50 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-50 text-slate-500'}`}><UserPlus className="w-4 h-4" /> <span>Generate Leads</span></button>
          
          <button 
            onClick={() => setActiveTab('manage')} 
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'manage' ? (isDarkMode ? 'bg-slate-900 border border-slate-800/60 text-teal-400 shadow-sm shadow-teal-500/5' : 'bg-teal-50 text-teal-700') : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Users2 className="w-4 h-4" /> <span>Manage Leads</span>
          </button>

          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest my-4">Control Center</p>
          <button 
            onClick={() => setActiveTab('sources')} 
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'sources' ? (isDarkMode ? 'bg-slate-900 border border-slate-800/60 text-teal-400 shadow-sm shadow-teal-500/5' : 'bg-teal-50 text-teal-700') : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Layers className="w-4 h-4" /> <span>Lead Sources</span>
          </button>
        </nav>
      </div>

      {/* Theme Switcher Footer Toggle */}
      <div className={`p-4 border-t flex flex-col space-y-3 transition-colors duration-300 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'}`}>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
        >
          <div className="flex items-center space-x-2">
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-200 text-slate-600'}`}>{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </aside>
  );
}