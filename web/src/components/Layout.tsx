import { Outlet, NavLink } from 'react-router-dom'
import {
  Home, Shield, MapPin, Bot, Play, Quote, Package, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/prevention', icon: Shield, label: 'Prevention' },
  { to: '/clinics', icon: MapPin, label: 'Clinics' },
  { to: '/chat', icon: Bot, label: 'AI Chat' },
  { to: '/videos', icon: Play, label: 'Videos' },
  { to: '/stories', icon: Quote, label: 'Stories' },
  { to: '/request', icon: Package, label: 'Supplies' },
]

function MascotLogo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/mascot-logo.png"
        alt="MASCOT mHealth logo"
        className="w-[90px] h-[90px] object-contain"
      />
      <img
        src="/mascot-text.png"
        alt="mascot"
        className="h-12 w-auto object-contain"
      />
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAF0]">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto pl-0 pr-6 h-24 flex items-center justify-between">
          <MascotLogo />

          {/* Desktop nav — pill container matching reference */}
          <nav className="hidden md:flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-2 px-4 bg-white">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium mb-1 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <img
                  src="/mascot-logo.png"
                  alt="MASCOT mHealth logo"
                  className="w-[66px] h-[66px] object-contain brightness-0 invert"
                />
                <div>
                  <img src="/mascot-text.png" alt="mascot" className="h-7 w-auto object-contain brightness-0 invert mb-0.5" />
                  <div className="text-primary-400 text-[10px] font-semibold tracking-widest uppercase">mHealth</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                Self-care for young people in Zimbabwe. Free, confidential health support.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Services</div>
                <div className="space-y-2">
                  <div>Prevention Methods</div>
                  <div>Find Clinics</div>
                  <div>Request Supplies</div>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Learn</div>
                <div className="space-y-2">
                  <div>Video Guides</div>
                  <div>AI Health Chat</div>
                  <div>Community Stories</div>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">About</div>
                <div className="space-y-2">
                  <div>Team HealthBridge</div>
                  <div>CeSHHAR Zimbabwe</div>
                  <div>Hackathon 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>MASCOT Hackathon 2026 · University of Zimbabwe</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
              <span>All conversations are private and anonymous</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
