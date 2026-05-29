import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, MapPin, Bot, Package, Play, Quote,
  ArrowRight, Heart, Users, Lock,
  ThumbsUp, Settings, Clock, Zap, Star,
} from 'lucide-react'

const PHONE_SLIDES = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png', '/6.png']
const OVERLAY_KEY = 'mascot-phone-overlay'

type OPos = { top: number; left: number; w: number; h: number; rot: number }
const DEFAULT_POS: OPos = { top: 12, left: 59, w: 21, h: 40, rot: 18 }

function loadPos(): OPos {
  try {
    const raw = localStorage.getItem(OVERLAY_KEY)
    if (raw) return { ...DEFAULT_POS, ...JSON.parse(raw) }
  } catch { /* */ }
  return DEFAULT_POS
}

type Drag =
  | { kind: 'move';   sx: number; sy: number; sp: OPos }
  | { kind: 'resize'; sx: number; sy: number; sp: OPos }
  | { kind: 'rotate'; cx: number; cy: number; sa: number; sp: OPos }

function PhoneCarousel() {
  const [idx, setIdx] = useState(0)
  const [editing, setEditing] = useState(false)
  const [pos, setPos] = useState<OPos>(loadPos)
  const drag = useRef<Drag | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => {
      if (!drag.current) setIdx(i => (i + 1) % PHONE_SLIDES.length)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  function parentWH() {
    const p = ref.current?.parentElement
    return p ? { w: p.offsetWidth, h: p.offsetHeight } : { w: 520, h: 520 }
  }

  // ── Move ─────────────────────────────────────────────────
  function onMoveDown(e: React.PointerEvent) {
    if (!editing) return
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { kind: 'move', sx: e.clientX, sy: e.clientY, sp: { ...pos } }
  }
  function onMoveMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d || d.kind !== 'move') return
    const { w, h } = parentWH()
    setPos(p => ({
      ...p,
      top:  Math.max(0, Math.min(90, d.sp.top  + ((e.clientY - d.sy) / h) * 100)),
      left: Math.max(0, Math.min(90, d.sp.left + ((e.clientX - d.sx) / w) * 100)),
    }))
  }

  // ── Resize ───────────────────────────────────────────────
  function onResizeDown(e: React.PointerEvent) {
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { kind: 'resize', sx: e.clientX, sy: e.clientY, sp: { ...pos } }
  }
  function onResizeMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d || d.kind !== 'resize') return
    const { w, h } = parentWH()
    setPos(p => ({
      ...p,
      w: Math.max(8, Math.min(85, d.sp.w + ((e.clientX - d.sx) / w) * 100)),
      h: Math.max(8, Math.min(85, d.sp.h + ((e.clientY - d.sy) / h) * 100)),
    }))
  }

  // ── Rotate ───────────────────────────────────────────────
  function onRotateDown(e: React.PointerEvent) {
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const r = ref.current!.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top  + r.height / 2
    drag.current = { kind: 'rotate', cx, cy, sa: Math.atan2(e.clientY - cy, e.clientX - cx), sp: { ...pos } }
  }
  function onRotateMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d || d.kind !== 'rotate') return
    const angle = Math.atan2(e.clientY - d.cy, e.clientX - d.cx)
    setPos(p => ({ ...p, rot: d.sp.rot + (angle - d.sa) * (180 / Math.PI) }))
  }

  function endDrag() { drag.current = null }

  function confirm() {
    localStorage.setItem(OVERLAY_KEY, JSON.stringify(pos))
    setEditing(false)
  }
  function reset() {
    setPos(DEFAULT_POS)
    localStorage.removeItem(OVERLAY_KEY)
    setEditing(false)
  }

  const H = 22

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        width: `${pos.w}%`,
        height: `${pos.h}%`,
        transform: `rotate(${pos.rot}deg)`,
        transformOrigin: 'center center',
        overflow: 'visible',
        zIndex: editing ? 30 : 1,
        cursor: editing ? 'move' : 'default',
        touchAction: editing ? 'none' : 'auto',
      }}
      onDoubleClick={e => { if (!editing) { e.stopPropagation(); setEditing(true) } }}
      onPointerDown={editing ? onMoveDown : undefined}
      onPointerMove={editing ? onMoveMove : undefined}
      onPointerUp={endDrag}
    >
      {/* ── Clipped image box ─── */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: editing ? 8 : '8px 8px 12px 12px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: editing
          ? '0 0 0 2.5px #93C962, 0 0 0 6px rgba(147,201,98,0.22)'
          : 'inset 0 0 0 1.5px rgba(0,0,0,0.07)',
      }}>
        {PHONE_SLIDES.map((src, i) => (
          <img
            key={src} src={src} alt={`Slide ${i + 1}`} draggable={false}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain',
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 0.65s ease-in-out',
              userSelect: 'none', pointerEvents: 'none',
            }}
          />
        ))}

        {editing && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(147,201,98,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: 8, color: '#3d6b20', fontWeight: 800,
              background: 'rgba(255,255,255,0.92)',
              padding: '2px 8px', borderRadius: 99,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              drag · rotate · resize
            </span>
          </div>
        )}
      </div>

      {/* ── Slide dots (not editing) ─── */}
      {!editing && (
        <div style={{
          position: 'absolute', bottom: 10, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 5, zIndex: 5,
        }}>
          {PHONE_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 14 : 5, height: 5, borderRadius: 99,
                border: 'none', padding: 0, cursor: 'pointer',
                background: i === idx ? '#93C962' : 'rgba(0,0,0,0.18)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Edit mode handles ─── */}
      {editing && (
        <>
          {/* Rotate handle — top-center */}
          <div
            style={{
              position: 'absolute', top: -(H + 8), left: '50%',
              transform: 'translateX(-50%)',
              width: H, height: H, borderRadius: '50%',
              background: '#fff', border: '2px solid #93C962',
              boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
              cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'none', userSelect: 'none',
            }}
            onPointerDown={onRotateDown}
            onPointerMove={onRotateMove}
            onPointerUp={endDrag}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5" stroke="#93C962" strokeWidth="1.7" strokeLinecap="round"/>
              <path d="M6 0 L6 3 L8 1.5Z" fill="#93C962"/>
            </svg>
          </div>
          {/* Connector */}
          <div style={{
            position: 'absolute', top: -8, left: '50%',
            width: 1.5, height: 8, background: '#93C962',
            transform: 'translateX(-50%)',
          }} />

          {/* Resize handle — bottom-right */}
          <div
            style={{
              position: 'absolute', bottom: -(H / 2), right: -(H / 2),
              width: H, height: H, borderRadius: 5,
              background: '#93C962',
              boxShadow: '0 2px 10px rgba(147,201,98,0.5)',
              cursor: 'se-resize', display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'none', userSelect: 'none',
            }}
            onPointerDown={onResizeDown}
            onPointerMove={onResizeMove}
            onPointerUp={endDrag}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 8L8 1M5 8L8 5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Corner dots on remaining corners (decorative) */}
          {[
            { top: -5, left: -5 }, { top: -5, right: -5 }, { bottom: -5, left: -5 },
          ].map((style, i) => (
            <div key={i} style={{
              position: 'absolute', ...style,
              width: 10, height: 10, borderRadius: '50%',
              background: '#fff', border: '2px solid #93C962',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
            }} />
          ))}

          {/* Done + Reset */}
          <div style={{
            position: 'absolute', bottom: -(H / 2) - 34, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={confirm}
              style={{
                background: 'linear-gradient(135deg,#3d6b20,#93C962)',
                color: '#fff', border: 'none',
                borderRadius: 99, padding: '5px 15px',
                fontSize: 11, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(147,201,98,0.5)',
                whiteSpace: 'nowrap', letterSpacing: '0.03em',
              }}
            >
              ✓ Done
            </button>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={reset}
              style={{
                background: '#fff', color: '#6B7280',
                border: '1.5px solid #E5E7EB',
                borderRadius: 99, padding: '5px 11px',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Reset
            </button>
          </div>
        </>
      )}

      {/* Double-click hint (not editing) */}
      {!editing && (
        <div style={{
          position: 'absolute', bottom: -20, left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: 8, fontWeight: 700,
          padding: '2px 7px', borderRadius: 99,
          whiteSpace: 'nowrap', pointerEvents: 'none',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          opacity: 0.75,
        }}>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#F2F9E6] overflow-hidden relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#93C962]/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#93C962]/8 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-5 md:py-8 grid md:grid-cols-2 gap-8 md:gap-10 items-center relative">

          {/* Mobile-only image — above text */}
          <div className="md:hidden flex justify-center animate-fade-in-up">
            <div className="relative w-[320px] h-[320px] bg-[#E0F2C4] rounded-[2rem] overflow-hidden shadow-xl">
              <img
                src="/hero-person.png"
                alt="Happy student"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Left: text */}
          <div className="flex flex-col gap-5">
            {/* Youth badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-1.5 bg-[#93C962]/15 text-[#5A7D3B] px-3 py-1.5 rounded-full text-sm font-bold w-fit border border-[#93C962]/20">
              <Zap size={13} className="fill-[#93C962] text-[#93C962]" />
              Your Personal Self-care Assistant
            </div>

            <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-4xl md:text-5xl font-black leading-[1.05] tracking-tight text-[#93C962]">
              Knowledge <br />Protects. <br />Choices Empower.
            </h1>

            <p className="animate-fade-in-up-delay-2 text-gray-600 text-lg md:text-xl leading-relaxed max-w-md">
              Safe, judgment-free sexual health information for Zimbabwe's tertiary students.
              HIV prevention, contraception, and support — right here.
            </p>

            {/* Buttons */}
            <div className="animate-fade-in-up-delay-3 flex flex-col gap-3 max-w-md">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/prevention"
                  className="flex-1 bg-[#93C962] text-white px-5 py-3.5 rounded-xl font-bold text-base hover:bg-[#76A44E] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#93C962]/30 active:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Shield size={20} /> Explore Prevention Methods
                </Link>
                <Link
                  to="/chat"
                  className="flex-1 bg-[#93C962] text-white px-5 py-3.5 rounded-xl font-bold text-base hover:bg-[#76A44E] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#93C962]/30 active:translate-y-0 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Bot size={20} /> Ask AI Assistant
                </Link>
              </div>
              <Link
                to="/request"
                className="w-full border-2 border-[#93C962] text-[#76A44E] px-5 py-3.5 rounded-xl font-bold text-base hover:bg-[#93C962] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#93C962]/25 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <Package size={20} /> Distribution &amp; Commodity Request
              </Link>
            </div>
          </div>

          {/* Right: desktop image with float animation + phone carousel */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-[520px] h-[520px] bg-[#E0F2C4] rounded-[2.5rem] overflow-hidden animate-float shadow-2xl shadow-[#93C962]/20">
              <img
                src="/hero-person.png"
                alt="Happy student"
                className="w-full h-full object-cover"
              />
              <PhoneCarousel />
              <div className="absolute inset-0 rounded-[2.5rem] ring-4 ring-[#93C962]/15 pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats strip (fixed bottom bar) ───────────────── */}
      <section className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 py-3 shadow-lg animate-drop-flash">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { icon: ThumbsUp, value: '2,400+', label: 'Students Helped' },
            { icon: Settings,  value: 'Free',   label: 'Always Free' },
            { icon: Clock,     value: '24/7',   label: 'AI Support' },
            { icon: Lock,      value: '100%',   label: 'Confidential' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1 first:pl-0 last:pr-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F2F9E6] flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#93C962]" />
              </div>
              <div>
                <div className="text-sm md:text-lg font-black text-[#76A44E]">{value}</div>
                <div className="text-[10px] md:text-xs text-gray-400 leading-none">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick actions ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#F2F9E6] text-[#5A7D3B] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-[#C4E896]">
            Services
          </span>
          <h2 className="text-2xl md:text-3xl font-black mb-2">What do you need?</h2>
          <p className="text-gray-500">Choose a service to get started</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield,  label: 'Prevention\nMethods',  to: '/prevention', grad: 'from-[#93C962] to-[#5A7D3B]', bg: 'bg-[#F2F9E6] hover:bg-[#E0F2C4]', text: 'text-[#3D5528]', border: 'border-[#C4E896] hover:border-[#93C962]' },
            { icon: MapPin,  label: 'Find a\nClinic',       to: '/clinics',    grad: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-200 hover:border-emerald-400' },
            { icon: Package, label: 'Request\nSupplies',    to: '/request',    grad: 'from-amber-400 to-orange-500',   bg: 'bg-amber-50 hover:bg-amber-100',     text: 'text-amber-900',   border: 'border-amber-200 hover:border-amber-400' },
            { icon: Bot,     label: 'AI Health\nAssistant', to: '/chat',       grad: 'from-sky-400 to-blue-600',       bg: 'bg-sky-50 hover:bg-sky-100',         text: 'text-sky-900',     border: 'border-sky-200 hover:border-sky-400' },
          ].map(({ icon: Icon, label, to, grad, bg, text, border }) => (
            <Link
              key={to}
              to={to}
              className={`${bg} border-2 ${border} rounded-2xl p-5 md:p-6 text-center hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group`}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 shadow-md`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className={`${text} font-bold text-sm md:text-[15px] whitespace-pre-line leading-snug`}>{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI Banner ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="bg-gradient-to-r from-[#3D5528] via-[#5A7D3B] to-[#76A44E] rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 p-2 ring-2 ring-white/25">
            <img src="/mascot-logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div className="flex-1 text-center md:text-left relative">
            <div className="flex items-center gap-1.5 justify-center md:justify-start mb-1">
              <Star size={13} className="fill-yellow-300 text-yellow-300" />
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider">AI-Powered · Verified</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-1.5">Ask MASCOT AI Anything</h3>
            <p className="text-white/75 text-sm leading-relaxed">
              Confidential answers about HIV, contraception, pregnancy, and more —
              powered by Zimbabwe's verified health experts.
            </p>
          </div>
          <Link
            to="/chat"
            className="relative bg-white text-[#3D5528] px-6 py-3 rounded-xl font-black hover:bg-[#F2F9E6] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20 transition-all shrink-0 flex items-center gap-2 shadow-xl shadow-black/15"
          >
            Start Chatting <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Content cards ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-6">
        <Link to="/videos" className="card hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#93C962] to-[#76A44E]" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#93C962] to-[#5A7D3B] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Play className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Video Guides</h3>
                <p className="text-xs text-gray-400">Step-by-step health tutorials</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Watch clear, accurate health tutorials — condom use, HIV testing, contraception options, and more.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[#76A44E] text-sm font-bold">
              Watch Now <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>

        <Link to="/stories" className="card hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Quote className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg">Community Stories</h3>
                <p className="text-xs text-gray-400">Real experiences, real support</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Read anonymous testimonials from peers who've used MASCOT to take control of their health.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-green-600 text-sm font-bold">
              Read Stories <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>
      </section>

      {/* ── Trust section ─────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#F2F9E6] text-[#5A7D3B] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-[#C4E896]">
            Why Us
          </span>
          <h2 className="text-2xl md:text-3xl font-black mb-2">Why Students Trust MASCOT</h2>
          <p className="text-gray-500 mb-10">Built for Zimbabwe's youth, with your privacy first</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lock,  title: 'Completely Anonymous', desc: 'No name, email, or phone required. Identified only by a random session ID.', grad: 'from-[#93C962] to-[#5A7D3B]' },
              { icon: Heart, title: 'Non-Judgmental',       desc: 'A safe space — no stigma, no shame. All questions are welcome here.',       grad: 'from-rose-400 to-red-500' },
              { icon: Users, title: 'Expert Verified',      desc: 'All information is verified by CeSHHAR Zimbabwe health professionals.',      grad: 'from-emerald-400 to-green-600' },
            ].map(({ icon: Icon, title, desc, grad }) => (
              <div key={title} className="bg-gray-50 hover:bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group border border-gray-100 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-black text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
