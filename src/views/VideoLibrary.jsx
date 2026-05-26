import React, { useState } from 'react';

export default function VideoLibrary() {
  const [activeFilter, setActiveFilter] = useState('All');

  const videoModules = [
    { id: 1, title: "PrEP the Right Way", category: "PrEP", dur: "2:36", thumb: "👩🏽‍⚕️", desc: "Step-by-step clinical instructions on routine daily intake schedules." },
    { id: 2, title: "Using Your Self-Test Kit", category: "Testing", dur: "2:45", thumb: "🧪", desc: "How to accurately interpret confidential rapid screening results cleanly." },
    { id: 3, title: "PEP Emergency Plan", category: "PEP", dur: "3:10", thumb: "🚨", desc: "Critical timelines and steps to follow if an exposure window opens." },
    { id: 4, title: "Video Guides Overview", category: "General", dur: "1:50", thumb: "📺", desc: "An entry-level map outlining the various student support channels." },
    { id: 5, title: "Understanding Window Periods", category: "Testing", dur: "4:15", thumb: "🧬", desc: "The science behind tracking incubation timelines accurately." },
    { id: 6, title: "Navigating Campus Locker Hubs", category: "General", dur: "2:10", thumb: "📦", desc: "How to use generated hash tokens to fetch discreet wellness items." }
  ];

  const categories = ['All', 'PrEP', 'PEP', 'Testing', 'General'];

  const filteredVideos = activeFilter === 'All' 
    ? videoModules 
    : videoModules.filter(v => v.category === activeFilter);

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      
      {/* HEADER DASHBOARD CARD */}
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="text-left">
          <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Multimedia Resources</span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Educational Video Library</h2>
        </div>

        {/* CATEGORY FILTER STRIP */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-grow sm:flex-grow-0 text-[10px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === cat 
                  ? 'bg-[#4C1D95] text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CORE MEDIA GRID SYSTEM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((vid) => (
          <div 
            key={vid.id}
            className="bg-white border border-slate-200/60 hover:border-purple-300 rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group text-left cursor-pointer"
          >
            <div className="space-y-3">
              {/* VIDEO LAYER BOX WITH DYNAMIC HOVER */}
              <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-950/10 shadow-inner">
                <span className="text-3xl opacity-80 transform group-hover:scale-110 duration-200 transition-transform">{vid.thumb}</span>
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center text-xs text-slate-900 shadow-md pl-0.5 transform group-hover:scale-105 transition-transform">
                    ▶
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded">
                  {vid.dur}
                </span>
                <span className="absolute top-2 left-2 bg-white/90 border border-slate-200/40 text-[#4C1D95] font-mono text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  {vid.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 group-hover:text-[#4C1D95] transition-colors leading-tight">
                  {vid.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold mt-1.5 leading-relaxed">
                  {vid.desc}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 mt-4 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider">
              <span>Verified Module</span>
              <span className="text-purple-600 group-hover:translate-x-0.5 transition-transform">Watch Guide &rarr;</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}