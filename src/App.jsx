import React, { useState } from 'react';
import LandingHub from './views/LandingHub.jsx';
import PreventionOverview from './views/PreventionOverview.jsx';
import HowItWorks from './views/HowItWorks.jsx';
import EffectivenessDetails from './views/EffectivenessDetails.jsx';
import VideoLibrary from './views/VideoLibrary.jsx';
import Testimonials from './views/Testimonials.jsx';
import FindServices from './views/FindServices.jsx';
import SupplyModal from './components/SupplyModal.jsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1); // 1-7 tracking the views
  const [supplyModalOpen, setSupplyModalOpen] = useState(false);

  const navLinks = [
    { id: 1, label: "Landing Hub (Dashboard)", icon: "🏠" },
    { id: 2, label: "HIV & Pregnancy Prevention", icon: "🎗️" },
    { id: 3, label: "How PrEP Works", icon: "🧬" },
    { id: 4, label: "Effectiveness & Details", icon: "📊" },
    { id: 5, label: "How-To Video Library", icon: "📺" },
    { id: 6, label: "Student Testimonials", icon: "💬" },
    { id: 7, label: "Find Services", icon: "📍" }
  ];

  const renderActiveWorkspace = () => {
    switch (currentScreen) {
      case 1: 
        return <LandingHub onNavigate={setCurrentScreen} onOpenSupply={() => setSupplyModalOpen(true)} />;
      case 2: 
        return <PreventionOverview onNavigate={setCurrentScreen} />;
      case 3: 
        return <HowItWorks onNavigate={setCurrentScreen} />;
      case 4: 
        return <EffectivenessDetails onNavigate={setCurrentScreen} />;
      case 5: 
        return <VideoLibrary onNavigate={setCurrentScreen} />;
      case 6: 
        return <Testimonials onNavigate={setCurrentScreen} />;
      case 7: 
        return <FindServices onNavigate={setCurrentScreen} />;
      default: 
        return <LandingHub onNavigate={setCurrentScreen} onOpenSupply={() => setSupplyModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 antialiased font-sans flex flex-col justify-between pb-14 select-none">
      
      {/* BROWSER APP TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 bg-[#4C1D95] rounded-md flex items-center justify-center text-[11px] text-white font-black">m</div>
          <span className="text-xs font-bold text-slate-400 tracking-wide">mascot student health portal</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-3 py-1 text-[11px] font-mono font-semibold">
          localhost:5173
        </div>
      </header>

      {/* APPLICATION FRAME WORKSPACE */}
      <div className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
        
        {/* SIDEBAR NAVIGATION CONTROL COMPONENT */}
        <aside className="w-full lg:w-[290px] bg-[#4C1D95] text-purple-100 shrink-0 flex flex-col p-5 justify-between border-r border-purple-950/20 shadow-xl relative z-20">
          <div className="space-y-6">
            
            {/* Mascot Identity Block */}
            <div className="flex items-center space-x-3 px-1 pt-1">
              <div className="w-9 h-9 bg-white text-[#4C1D95] rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                m
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white leading-none">mascot</h1>
                <p className="text-[9px] text-purple-300 font-bold uppercase tracking-widest mt-1">YOUR HEALTH. YOUR CHOICE.</p>
              </div>
            </div>

            {/* University Verified Account Context Box */}
            <div className="bg-purple-900/40 border border-purple-400/20 rounded-2xl p-4 flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-4 border-purple-500/30 flex items-center justify-center text-2xl shadow-inner">
                🧑🏽‍🎓
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wide">Student Account</h4>
                <p className="text-[10px] text-purple-300 font-bold tracking-tight mt-0.5">University Network Verified</p>
              </div>
            </div>

            {/* Main List Navigation Router Anchors */}
            <nav className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-purple-300/50 px-2.5 mb-2">Main Navigation</p>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentScreen(link.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left text-xs font-black tracking-wide transition-all ${
                    currentScreen === link.id
                      ? 'bg-purple-900 text-white shadow-md border-l-4 border-purple-400 pl-4'
                      : 'hover:bg-purple-900/40 text-purple-200 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t border-purple-800/40 text-[10px] font-bold text-purple-300/60 flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            AES-256 Encrypted Connection
          </div>
        </aside>

        {/* WORKSPACE & UTILITY SPLIT LAYER PANELS */}
        <div className="flex-grow flex flex-col xl:flex-row items-stretch min-w-0">
          
          {/* Central Active View Workspace Box */}
          <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
            {renderActiveWorkspace()}
          </main>

          {/* RIGHT UTILITY INFODESK FEED - Conditional: Only mounts on screen 1 */}
          {currentScreen === 1 && (
            <aside className="w-full xl:w-[350px] p-6 lg:p-8 xl:pl-0 space-y-5 shrink-0 flex flex-col justify-start animate-fadeIn">
              
              {/* Active Testimonials Side Feed */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Peer Feedback</h4>
                  <button onClick={() => setCurrentScreen(6)} className="text-[10px] font-black text-purple-600 hover:underline">View all</button>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 relative">
                  <p className="text-xs text-slate-600 font-bold italic leading-relaxed pl-1">
                    "PrEP gives me peace of mind and I love how easy it is to access across campus."
                  </p>
                  <p className="text-[10px] font-black text-slate-400 text-right mt-2">— Tawa, 21</p>
                </div>
              </div>

              {/* Nearby Clinical Resource Directory Feed */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Campus Services</h4>
                    <button onClick={() => setCurrentScreen(7)} className="text-[10px] font-black text-purple-600 hover:underline">View all</button>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: "Campus Health Centre", dist: "0.2 km", status: "Open Now", tags: ["HIV Testing", "PrEP", "Counseling"], icon: "🏥" },
                      { name: "City Clinic Zimbabwe", dist: "0.8 km", status: "Open Now", tags: ["HIV Testing", "PrEP", "PEP"], icon: "🏢" },
                      { name: "Pharmacy (Condoms)", dist: "0.6 km", status: "Open Now", tags: ["Condoms", "Lubricants"], icon: "💊" }
                    ].map((facility) => (
                      <div key={facility.name} className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl space-y-2 hover:border-slate-200 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-base">{facility.icon}</span>
                            <div>
                              <h5 className="text-xs font-black text-slate-900 leading-tight">{facility.name}</h5>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{facility.dist} • <span className="text-emerald-600">{facility.status}</span></p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {facility.tags.map(tag => (
                            <span key={tag} className="text-[9px] bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md font-bold">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setCurrentScreen(7)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs py-2.5 rounded-xl border border-slate-200/80 transition-all text-center mt-4">
                  🗺️ View Full Campus Map
                </button>
              </div>

            </aside>
          )}

        </div>
      </div>

      {/* EMERGENCY CRISIS FOOTER HELPER CONTROL BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0F172A] text-white z-50 border-t border-slate-800 px-6 py-3.5">
        <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">
              Need Urgent Help?
            </span>
            <span className="text-slate-400 font-medium text-[11px] hidden lg:inline">
              PEP blocks potential exposure vectors cleanly if deployed within a critical 72-hour timeline window.
            </span>
          </div>
          <div className="flex items-center space-x-5 text-[11px] font-black text-slate-300">
            <a href="tel:+263242" className="hover:text-white text-purple-400 transition-colors">📞 Call Helpline: 24/7 Support</a>
            <span className="text-slate-700">|</span>
            <button onClick={() => setCurrentScreen(7)} className="hover:text-white transition-colors">📍 Locate Care Facilities</button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Secure Session: A2S-258</span>
          </div>
        </div>
      </footer>

      {/* SYSTEM PROVISIONING OVERLAY MODAL */}
      <SupplyModal isOpen={supplyModalOpen} onClose={() => setSupplyModalOpen(false)} />
    </div>
  );
}