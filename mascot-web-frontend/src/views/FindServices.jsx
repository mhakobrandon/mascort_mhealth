import React from 'react';

export default function FindServices() {
  const centers = [
    { name: "University Campus Health Centre", loc: "Main Administration Ring Road, Gate 2 Block", phone: "+263 242 112233", time: "08:00 - 16:30" },
    { name: "City Clinic Health Node ZW", loc: "Downtown Central Medical Complex, Level 1", phone: "+263 242 445566", time: "24 Hours Operational" }
  ];

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 text-left shadow-xs">
        <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Physical Dispensary Locator</span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Campus Services Directory</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {centers.map(center => (
          <div key={center.name} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-purple-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-950">{center.name}</h4>
                <p className="text-[11px] text-slate-400 font-bold mt-1">📍 {center.loc}</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-black uppercase">Active</span>
            </div>
            
            <div className="pt-2.5 border-t border-slate-50 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
              <div>📞 Contact: <span className="text-slate-700 font-mono">{center.phone}</span></div>
              <div className="text-right">🕒 Hours: <span className="text-slate-700">{center.time}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}