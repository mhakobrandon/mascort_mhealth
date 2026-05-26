import React from 'react';

export default function EffectivenessDetails() {
  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 shadow-xs text-left">
        <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Validated Clinical Datasets</span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Statistical Effectiveness & Comparison</h2>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-5 text-left">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Method Protection Threshold Matrix</h3>
        
        <div className="overflow-hidden border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="p-3.5">Prevention Category Method</th>
                <th className="p-3.5 text-center">Efficacy Rate Index</th>
                <th className="p-3.5">Optimal Treatment Schedule Requirement</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 text-slate-700 font-bold">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 text-purple-900">Oral Daily PrEP Pill System</td>
                <td className="p-3.5 text-center text-emerald-600 font-black">~99%</td>
                <td className="p-3.5 text-slate-400 font-medium">Consolidated daily ingestion profile without missing slots.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 text-purple-900">External Latex Barrier Units</td>
                <td className="p-3.5 text-center text-emerald-600 font-black">~98%</td>
                <td className="p-3.5 text-slate-400 font-medium">Consistent handling deployment sequence during every event.</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 text-purple-900">Emergency Post Exposure PEP Link</td>
                <td className="p-3.5 text-center text-amber-600 font-black">Highly High</td>
                <td className="p-3.5 text-slate-400 font-medium">Full continuous 28-day lifecycle course initialization inside 72 hours.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}