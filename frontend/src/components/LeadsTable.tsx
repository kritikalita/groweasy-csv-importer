"use client";

import React, { useState, useRef, useEffect } from "react";

interface LeadsTableProps {
  allLeads: any[];
  isDarkMode: boolean;
}

export default function LeadsTable({ allLeads, isDarkMode }: LeadsTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400); // Default viewport window box sizing fallback

  const ROW_HEIGHT = 53; // Standard average pixel height for your multi-line flex lead layout rows
  const BUFFER_COUNT = 5; // Rows padding overhead to prevent flickering during rapid track scrolls

  // 1. Keep track of dynamic container heights or screen resizing
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight || 400);
    }
  }, [allLeads.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // 2. Linear Virtualized Segment Boundary Computations
  const totalRows = allLeads.length;
  const totalHeight = totalRows * ROW_HEIGHT;

  // Compute indices for window bounds safely bounded by array constraints
  let startIndex = Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_COUNT;
  startIndex = Math.max(0, startIndex);

  let endIndex =
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_COUNT;
  endIndex = Math.min(totalRows - 1, endIndex);

  // Slice down memory load down to target components active visible rows subset
  const visibleLeads =
    totalRows > 0 ? allLeads.slice(startIndex, endIndex + 1) : [];
  const offsetY = startIndex * ROW_HEIGHT;

  return (
    <div
      className={`border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${isDarkMode ? "bg-[#0F1322] border-slate-800/60 shadow-black/40" : "bg-white border-slate-200"}`}
    >
      <div
        className={`p-4 border-b font-bold text-sm transition-colors duration-300 ${isDarkMode ? "border-slate-800/80 bg-slate-900/20 text-slate-200" : "border-slate-100 bg-slate-50/50 text-slate-800"}`}
      >
        Your Leads
      </div>

      {/* 🔄 Scroll tracking window wrapper */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-auto max-h-[500px]" // Strict height boundary window layer for virtualization calculations
      >
        {allLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            No leads imported yet. Open the lead importer channel to get
            started!
          </div>
        ) : (
          /* Total structural height padding layout spacer */
          <div
            style={{
              height: `${totalHeight}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {/* Real viewport rendering block offset via transform translate shifts */}
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? "bg-[#0B0F19] border-slate-800/80 text-slate-400" : "bg-slate-50/30 border-slate-100 text-slate-400"}`}
                  >
                    <th className="p-4 pl-6 w-[20%]">Lead Name</th>
                    <th className="p-4 w-[20%]">Email</th>
                    <th className="p-4 w-[15%]">Contact</th>
                    <th className="p-4 w-[15%]">Date Created</th>
                    <th className="p-4 w-[15%]">Company</th>
                    <th className="p-4 w-[15%]">Status</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs transition-colors duration-300 ${isDarkMode ? "divide-slate-800/60 text-slate-300" : "divide-slate-100 text-slate-700"}`}
                >
                  {visibleLeads.map((lead, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <tr
                        key={globalIndex}
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className={`transition-colors duration-150 ${isDarkMode ? "hover:bg-slate-900/30" : "hover:bg-slate-50/50"}`}
                      >
                        <td
                          className={`p-4 pl-6 font-semibold truncate max-w-[180px] ${isDarkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {lead.name || "—"}
                        </td>
                        <td
                          className={`p-4 truncate max-w-[180px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {lead.email || "—"}
                        </td>
                        <td className="p-4 font-medium whitespace-nowrap">
                          {lead.country_code || ""}{" "}
                          {lead.mobile_without_country_code || "—"}
                        </td>
                        <td className="p-4 text-slate-400 whitespace-nowrap">
                          {lead.created_at &&
                          !isNaN(Date.parse(lead.created_at))
                            ? new Date(lead.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : new Date().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </td>
                        <td className="p-4 text-slate-400 truncate max-w-[150px]">
                          {lead.company || "—"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase border tracking-wide inline-block min-w-[110px] text-center
    ${
      lead.crm_status === "SALE_DONE"
        ? isDarkMode
          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          : "bg-indigo-5 text-indigo-600 border-indigo-100"
        : lead.crm_status === "GOOD_LEAD_FOLLOW_UP"
          ? isDarkMode
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-emerald-5 text-emerald-600 border-emerald-100"
          : lead.crm_status === "DID_NOT_CONNECT"
            ? isDarkMode
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-blue-50 text-blue-600 border-blue-100"
            : isDarkMode
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-rose-50 text-rose-600 border-rose-100" // BAD_LEAD fallback
    }`}
                          >
                            {lead.crm_status === "SALE_DONE"
                              ? "Sale Done"
                              : lead.crm_status === "GOOD_LEAD_FOLLOW_UP"
                                ? "Good Lead"
                                : lead.crm_status === "DID_NOT_CONNECT"
                                  ? "Did Not Connect"
                                  : "Bad Lead"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
