import React from 'react';

export default function Testimonials() {
  const journals = [
    { quote: "PrEP gives me peace of mind and I love how easy it is to access across campus without getting judged.", author: "Tawa", age: 21, tag: "Routine PrEP" },
    { quote: "I was super stressed after an emergency accident, but finding information about the 72-hour PEP loop saved me.", author: "Anonymous Student", age: 22, tag: "Emergency PEP" },
    { quote: "The discrete pickup codes are perfect. Being able to secure rapid screening testing kits through a localized locker without revealing my name is brilliant.", author: "Rudo", age: 20, tag: "Self-Testing" },
    { quote: "It completely simplifies the conversation. Having validated clinical metrics right next to active clinics makes navigating clean healthcare simple.", author: "Emanuel", age: 23, tag: "General Support" }
  ];

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      
      {/* HEADER SECTION LAYOUT BOX */}
      <div className="bg-white border border-slate-200/60 rounded-2xl px-6 py-4 text-left shadow-xs">
        <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">Peer Support Index</span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Student Voice Testimonials</h2>
      </div>

      {/* TWO-COLUMN CARD MATRIX TIMELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {journals.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            {/* STYLIZED BACKGROUND ICON BLOCK */}
            <span className="absolute -top-1 right-2 text-6xl text-slate-50 font-serif select-none pointer-events-none leading-none">“</span>

            <div className="space-y-3 relative z-10">
              <span className="inline-block text-[8px] font-black uppercase tracking-wider bg-purple-50 text-[#4C1D95] border border-purple-100 px-2 py-0.5 rounded-md">
                {item.tag}
              </span>
              <p className="text-xs text-slate-600 font-bold italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                <span>Verified Peer Network Record</span>
              </div>
              <span className="text-slate-500">— {item.author}, {item.age}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DISCREET SYSTEM PRIVACY BANNER */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-purple-100 p-5 rounded-2xl border border-purple-950/20 text-left shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black text-white">Want to share your story anonymously?</h4>
          <p className="text-[11px] text-purple-300 font-bold">Your journal entries are encrypted and stripped of student network IDs before verification logs post.</p>
        </div>
        <button className="bg-white hover:bg-purple-50 text-[#4C1D95] font-black text-[11px] px-4 py-2 rounded-xl shadow-md transition-all self-stretch sm:self-auto text-center cursor-pointer">
          Submit Anonymously
        </button>
      </div>

    </div>
  );
}