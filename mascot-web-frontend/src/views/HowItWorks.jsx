import React from 'react';

export default function HowItWorks({ onNavigate }) {
  const processSteps = [
    { title: "1. Clinical Screening Intake", desc: "A confidential baseline finger-prick blood marker clearance confirms active health index before launching.", icon: "🩺" },
    { title: "2. Daily Maintenance Shield", desc: "When sustained systematically, active components build protective blockades around immune pathways.", icon: "🛡️" },
    { title: "3. Quarterly Assessment Loop", desc: "Routine health updates ensure consistent systemic alignment and prescription replenishment.", icon: "🗓️" }
  ];

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Biological Mechanisms</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">How PrEP Works</h2>
        </div>
        <button onClick={() => onNavigate(4)} className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all">View Efficacy Data &rarr;</button>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs space-y-6 text-left">
        <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-2xl">
          Pre-Exposure Prophylaxis (PrEP) stops infections from reproducing. If exposed, the internal cellular firewall blocks replication attempts entirely.
        </p>

        <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {processSteps.map((step) => (
            <div key={step.title} className="flex items-start space-x-4 relative z-10 group">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 text-lg flex items-center justify-center group-hover:border-purple-400 transition-colors shrink-0 shadow-3xs">
                {step.icon}
              </div>
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex-grow group-hover:bg-white group-hover:border-slate-200 transition-all">
                <h4 className="text-xs font-black text-slate-900">{step.title}</h4>
                <p className="text-[11px] text-slate-400 font-bold mt-1 leading-normal">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}