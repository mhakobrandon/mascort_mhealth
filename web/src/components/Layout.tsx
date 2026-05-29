import { Outlet, NavLink } from 'react-router-dom'
import {
  Home, Shield, MapPin, Play, Quote, Package, Menu, X, LogOut,
} from 'lucide-react'
import { useState } from 'react'
import AuthModal, { type AuthMode } from './AuthModal'
import { useAuth } from '../context/AuthContext'
import AIChatWidget from './AIChatWidget'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/prevention', icon: Shield, label: 'Prevention' },
  { to: '/clinics', icon: MapPin, label: 'Clinics' },
  { to: '/videos', icon: Play, label: 'Videos' },
  { to: '/stories', icon: Quote, label: 'Stories' },
  { to: '/request', icon: Package, label: 'Supplies' },
]

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #93C962, #6baa3a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: Math.round(size * 0.43), flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function MascotLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
      <img
        src="/mascot-logo.png"
        alt="MASCOT mHealth logo"
        style={{ width: 95, height: 95, objectFit: 'contain' }}
      />
      <img
        src="/mascot-text.png"
        alt="mascot"
        style={{ height: 39, width: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}

export default function Layout({ withFooter = true, withHeader = true }: { withFooter?: boolean; withHeader?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const { user, logout } = useAuth()

  function openAuth(mode: AuthMode) {
    setMobileOpen(false)
    setAuthMode(mode)
  }

  return (
    <div className={withFooter ? 'min-h-screen flex flex-col bg-[#F5FAF0]' : 'h-screen flex flex-col overflow-hidden bg-[#F5FAF0]'}>
      {/* Top navbar */}
      {withHeader && <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        {/*
          3-zone grid matching hero's max-w-6xl mx-auto px-4.
          Logo left-edge = "Your Health, Your Choice" left-edge.
          Height = 84px to hold the 63px logo with comfortable padding.
        */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 16,
          height: 100,
          maxWidth: '72rem',   /* max-w-6xl = 72rem = 1152px */
          margin: '0 auto',
          padding: '0 16px',   /* px-4 = 16px, same as hero */
          width: '100%',
          boxSizing: 'border-box',
        }} className="hidden md:grid">

          {/* ZONE 1 — Logo: left-aligned, matches hero text left edge */}
          <MascotLogo />

          {/* ZONE 2 — Nav pill centered in 1fr column */}
          <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 9999, padding: 5, gap: 2 }}>
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 13px', borderRadius: 9999,
                    fontSize: 13, fontWeight: 500,
                    whiteSpace: 'nowrap', textDecoration: 'none',
                    transition: 'all 0.15s',
                    background: isActive ? '#fff' : 'transparent',
                    color: isActive ? '#1F2937' : '#6B7280',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  })}
                >
                  <Icon size={13} />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* ZONE 3 — Auth (shrinks to content, sits right beside the nav) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F0FDE8', border: '1.5px solid #C6E9A0', borderRadius: 9999, padding: '5px 14px 5px 6px', whiteSpace: 'nowrap' }}>
                  <Avatar name={user.username} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#3A6020' }}>{user.username}</span>
                </div>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9999, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#6B7280', whiteSpace: 'nowrap' }}>
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth('login')} style={{ padding: '7px 18px', borderRadius: 9999, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                  Log In
                </button>
                <button onClick={() => openAuth('signup')} style={{ padding: '7px 18px', borderRadius: 9999, border: 'none', background: '#93C962', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(147,201,98,0.45)' }}>
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>

        {/* Mobile top bar — visible only below md */}
        <div className="md:hidden flex items-center justify-between px-4" style={{ height: 100 }}>
          <MascotLogo />
          <button
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-600"
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
            {user ? (
              <div className="mt-2 mb-1 space-y-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDE8', border: '1.5px solid #C6E9A0', borderRadius: 12, padding: '10px 14px' }}>
                  <Avatar name={user.username} size={34} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#3A6020' }}>{user.username}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); logout() }}
                  className="flex w-full items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <div className="mt-2 mb-1 flex gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="flex-1 flex items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="flex-1 flex items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold bg-[#93C962] text-white hover:bg-[#7ab050] transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </header>}

      {/* Page content */}
      <main className={withFooter ? 'flex-1 pb-20' : 'flex-1 overflow-hidden'}>
        <Outlet />
      </main>

      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}

      <AIChatWidget />

      {/* Footer — hidden on chat layout */}
      {withFooter && (
        <footer className="bg-white border-t border-gray-100 shadow-sm py-10 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-0 mb-3">
                  <img
                    src="/mascot-logo.png"
                    alt="MASCOT mHealth logo"
                    style={{ width: 66, height: 66, objectFit: 'contain' }}
                  />
                  <img
                    src="/mascot-text.png"
                    alt="mascot"
                    style={{ height: 28, width: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <p className="text-sm text-gray-400 max-w-xs">
                  Self-care for young people in Zimbabwe. Free, confidential health support.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-gray-500">
                <div>
                  <div className="text-gray-900 font-semibold mb-3">Services</div>
                  <div className="space-y-2">
                    <div>Prevention Methods</div>
                    <div>Find Clinics</div>
                    <div>Request Supplies</div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-900 font-semibold mb-3">Learn</div>
                  <div className="space-y-2">
                    <div>Video Guides</div>
                    <div>AI Health Chat</div>
                    <div>Community Stories</div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-900 font-semibold mb-3">About</div>
                  <div className="space-y-2">
                    <div>Team HealthBridge</div>
                    <div>CeSHHAR Zimbabwe</div>
                    <div>Hackathon 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
