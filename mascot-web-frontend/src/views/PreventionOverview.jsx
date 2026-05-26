import React, { useState } from 'react';

export default function PreventionOverview({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('hiv'); // 'hiv' or 'pregnancy'
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const hivChoices = [
    { title: "PrEP", desc: "Pre-Exposure Protection daily pills", metric: "99%", icon: "💊", target: 3 },
    { title: "Condoms", desc: "External & Internal triple barrier options", metric: "98%", icon: "🛡️", target: 4 },
    { title: "HIV Self-Test", desc: "Confidential oral fluid or finger-prick kits", metric: null, icon: "🧪", target: 7 },
    { title: "PEP", desc: "Post-Exposure Therapy within 72 hours max", metric: "Emergency", icon: "🚨", target: 4 }
  ];

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      
      {/* SECTION TABS HEADER ROW */}
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Prevention Systems Matrix</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Efficacy & Resource Routing</h2>
        </div>
        
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-stretch sm:self-auto">
          <button 
            onClick={() => setActiveTab('hiv')}
            className={`flex-grow sm:flex-grow-0 font-black text-[10px] px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'hiv' ? 'bg-[#4C1D95] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            HIV Prevention
          </button>
          <button 
            onClick={() => setActiveTab('pregnancy')}
            className={`flex-grow sm:flex-grow-0 font-black text-[10px] px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'pregnancy' ? 'bg-[#4C1D95] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pregnancy Prevention
          </button>
        </div>
      </div>

      {/* CORE CONTROLS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RESOURCE CARDS BLOCK */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 self-start">
          {activeTab === 'hiv' ? (
            hivChoices.map((item) => (
              <div 
                key={item.title}
                onClick={() => onNavigate(item.target)}
                className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex items-center justify-between cursor-pointer group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#4C1D95] border border-purple-100/50 flex items-center justify-center text-xl group-hover:bg-purple-100 transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-[#4C1D95] transition-colors flex items-center gap-2">
                      {item.title}
                      {item.metric && (
                        <span className="text-[9px] font-mono font-black bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-md">{item.metric}</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-[#4C1D95] font-mono font-black transition-all pl-2 group-hover:translate-x-0.5">&rarr;</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs">
              🤰🏽 Emergency Contraceptive and daily options cataloging updates loading shortly...
            </div>
          )}
        </div>

        {/* INTERACTIVE COMPONENT: LIVE DIAGNOSTIC BOX */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white border border-purple-100 p-5 rounded-2xl flex flex-col justify-between shadow-xs text-left min-h-[220px]">
          {!quizStarted ? (
            <>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-white border border-purple-100 text-[#4C1D95] rounded-xl flex items-center justify-center text-sm shadow-3xs">📋</div>
                <h4 className="text-xs font-black text-purple-950">Prevention Method Selector</h4>
                <p className="text-[11px] text-purple-800/80 leading-relaxed font-bold">Unsure which resource matches your active lifestyle frame profile? Complete this swift assessment node sequence.</p>
              </div>
              <button onClick={() => setQuizStarted(true)} className="bg-[#4C1D95] hover:bg-purple-900 text-white font-black text-[11px] py-2.5 rounded-xl transition-all shadow-md shadow-purple-200 mt-4 cursor-pointer text-center">
                Initialize Evaluation &rarr;
              </button>
            </>
          ) : !quizAnswer ? (
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <p className="text-xs font-black text-purple-950">Q1: Did a potential exposure happen within the trailing 72-hour historical window block?</p>
              <div className="space-y-2">
                <button onClick={() => setQuizAnswer('pep')} className="w-full text-left bg-white border border-purple-200 hover:border-red-400 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all">Yes, less than 72 hours ago</button>
                <button onClick={() => setQuizAnswer('prep')} className="w-full text-left bg-white border border-purple-200 hover:border-purple-400 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all">No, looking for ongoing routine safety</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-center py-1">
              <span className="text-xl">🎯</span>
              <h4 className="text-xs font-black text-slate-900">Recommended Routing Pathway:</h4>
              <p className="text-xs font-black bg-white border border-purple-200 py-2 rounded-xl text-[#4C1D95] uppercase tracking-wider">
                {quizAnswer === 'pep' ? "🚨 Immediate Emergency PEP Route" : "💊 Daily Routine PrEP Track"}
              </p>
              <button onClick={() => { setQuizStarted(false); setQuizAnswer(null); }} className="text-[10px] text-purple-600 hover:underline font-black mt-2">Reset Diagnostic</button>
            </div>
          )}
        </div>

      </div>

      {/* HORIZONTAL MULTIMEDIA VIDEO GRID ROW */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Video Resource Modules Library</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "PrEP Right Way", dur: "2:36", thumb: "👩🏽‍⚕️" },
            { title: "Using Self-Test", dur: "2:45", thumb: "🧪" },
            { title: "PEP Emergency Plan", dur: "3:10", thumb: "🚨" },
            { title: "Video Guides Overview", dur: "1:50", thumb: "📺" }
          ].map((vid) => (
            <div 
              key={vid.title}
              onClick={() => onNavigate(5)}
              className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-xl p-3 flex flex-col space-y-3 shadow-xs hover:shadow-sm transition-all cursor-pointer group text-left"
            >
              <div className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
                <span className="text-2xl opacity-75 transform group-hover:scale-105 transition-transform">{vid.thumb}</span>
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[10px] text-slate-900 shadow-xs pl-0.5">▶</div>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[8px] font-black px-1 rounded">{vid.dur}</span>
              </div>
              <div>
                <h5 className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-[#4C1D95] transition-colors">{vid.title}</h5>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">Clinical Tutorial Node</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}