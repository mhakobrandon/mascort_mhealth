import React from 'react';

export default function LandingHub({ onNavigate, onOpenSupply }) {
  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      
      {/* HEADER SECTION PANEL BOX */}
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#4C1D95]">Student Wellness Portal</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Welcome Dashboard</h2>
        </div>
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-md shadow-emerald-200 animate-pulse" title="System Verified Safe"></span>
      </div>

      {/* CORE HERO PLATFORM INFOCARD COMPONENT BLOCK */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative overflow-hidden">
        
        <div className="md:col-span-7 space-y-3.5 text-left relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-purple-100 border border-purple-200/60 text-[#4C1D95] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
            <span>👋</span> <span>Verified Intake Protocol</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Private, supportive info for HIV & pregnancy prevention — <span className="text-[#4C1D95]">made for you.</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-lg">
            Navigate through validated data records, consult our automated interactive companion framework anonymously, or request supplies seamlessly.
          </p>
        </div>

        {/* CHARACTER GRAPHICS CLUSTER */}
        <div className="md:col-span-5 bg-gradient-to-br from-purple-50 via-indigo-50/30 to-slate-50 border border-purple-100/60 rounded-2xl p-5 flex items-center justify-center min-h-[150px] relative overflow-hidden group">
          <div className="flex items-center -space-x-5 overflow-hidden relative z-10">
            {/* Vector Character Left */}
            <div className="w-14 h-14 rounded-full border-4 border-white bg-amber-200 flex items-center justify-center text-2xl shadow-md transition-transform duration-200 group-hover:scale-105">
              👩🏽‍🎓
            </div>
            {/* Featured Vector Character Middle */}
            <div className="w-18 h-18 rounded-full border-4 border-white bg-purple-200 flex items-center justify-center text-3xl shadow-lg relative z-10 transition-transform duration-200 group-hover:scale-105">
              🧑🏾‍🎓
            </div>
            {/* Vector Character Right */}
            <div className="w-14 h-14 rounded-full border-4 border-white bg-emerald-200 flex items-center justify-center text-2xl shadow-md transition-transform duration-200 group-hover:scale-105">
              👩🏾‍⚕️
            </div>
          </div>
          {/* Decorative backdrop blobs */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>
          <div className="absolute -left-6 -top-6 w-20 h-20 bg-indigo-400/10 rounded-full blur-lg"></div>
        </div>

      </div>

      {/* CORE UTILITY PLATFORM ROUTING SELECTIONS GRID MAP */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">What would you like to do today?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Item Node 1 */}
          <div 
            onClick={() => onNavigate(2)}
            className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between items-start text-left cursor-pointer group"
          >
            <div className="space-y-4 w-full">
              <div className="w-10 h-10 bg-purple-50 text-[#4C1D95] border border-purple-100 rounded-xl flex items-center justify-center text-lg font-bold group-hover:bg-purple-100 transition-colors">
                ✨
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#4C1D95] transition-colors">Explore Prevention Systems</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mt-1">Analyze efficacy metrics, treatment options, and methods safely.</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-purple-600 group-hover:text-[#4C1D95] transition-colors mt-6 flex items-center gap-1 w-full pt-2 border-t border-slate-50">
              Open Resource Desk <span className="font-mono transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </div>

          {/* Card Item Node 2 */}
          <div 
            onClick={() => onNavigate(5)}
            className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between items-start text-left cursor-pointer group"
          >
            <div className="space-y-4 w-full">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center text-lg font-bold group-hover:bg-blue-100 transition-colors">
                🤖
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">Interactive Support Companion</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mt-1">Engage our confidential automated helper for guided counseling.</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-purple-600 group-hover:text-[#4C1D95] transition-colors mt-6 flex items-center gap-1 w-full pt-2 border-t border-slate-50">
              Initialize Companion <span className="font-mono transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </div>

          {/* Card Item Node 3 */}
          <div 
            onClick={onOpenSupply}
            className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between items-start text-left cursor-pointer group"
          >
            <div className="space-y-4 w-full">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center text-lg font-bold group-hover:bg-emerald-100 transition-colors">
                📦
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Discrete Supply Tokens</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mt-1">Request collection locker coupons securely without personal disclosure.</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-purple-600 group-hover:text-[#4C1D95] transition-colors mt-6 flex items-center gap-1 w-full pt-2 border-t border-slate-50">
              Generate Order Token <span className="font-mono transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}