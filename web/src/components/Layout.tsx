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

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <header className="bg-gradient-to-r from-purple-700 to-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield size={18} />
            </div>
            <span className="font-bold text-lg tracking-wide">MASCOT mHealth</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/20 py-2 px-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium mb-1 ${
                    isActive ? 'bg-white/20' : 'text-white/80 hover:bg-white/10'
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
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={18} className="text-purple-400" />
            <span className="text-white font-semibold">MASCOT mHealth</span>
          </div>
          <p className="text-sm">
            A youth-centered health platform by Team HealthBridge — University of Zimbabwe
          </p>
          <p className="text-xs mt-2">MASCOT Hackathon 2026 · CeSHHAR Zimbabwe</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>All conversations are private and anonymous</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
