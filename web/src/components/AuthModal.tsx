import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export type AuthMode = 'login' | 'signup'

interface AuthModalProps {
  initialMode: AuthMode
  onClose: () => void
}

/* ── SVG helpers ─────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-43.9-141.9-110c-42.6-75.3-72.5-196.3-72.5-311.2 0-163.6 107.5-250 213.6-250 51.1 0 101.7 37.4 133.4 37.4 30.5 0 87.9-42.2 148.9-42.2zM441.7 87.5c27.3-33.5 45.6-80.4 45.6-127.3 0-6.5-.6-13-1.9-18.2-43.3 1.6-95.3 28.9-126.8 66.2-24.3 27.9-46.1 74.8-46.1 122.4 0 7.1 1.3 14.3 1.9 16.6 2.6.3 6.5.6 10.4.6 38.8 0 88.1-26.1 116.9-60.3z"/>
    </svg>
  )
}

function Sparkle() {
  return (
    <svg width="52" height="52" viewBox="0 0 72 72" fill="none"
      style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0.28, pointerEvents: 'none' }}>
      <path d="M36 8 L38 32 L62 36 L38 40 L36 64 L34 40 L10 36 L34 32 Z" fill="#93C962"/>
      <path d="M56 4 L57 14 L67 16 L57 18 L56 28 L55 18 L45 16 L55 14 Z" fill="#93C962"/>
      <path d="M18 52 L19 59 L26 60 L19 61 L18 68 L17 61 L10 60 L17 59 Z" fill="#93C962"/>
    </svg>
  )
}

/* ── Shared micro-styles ─────────────────────────────────── */
const S = {
  field: { display: 'flex', flexDirection: 'column', gap: 3 } as React.CSSProperties,
  label: { fontSize: 11.5, fontWeight: 600, color: '#374151' } as React.CSSProperties,
  iconWrap: {
    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
    color: '#9CA3AF', display: 'flex',
  } as React.CSSProperties,
  input: (err?: string, rightPad?: boolean): React.CSSProperties => ({
    width: '100%', paddingLeft: 32, paddingRight: rightPad ? 34 : 10,
    paddingTop: 8, paddingBottom: 8,
    border: `1.5px solid ${err ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: 8, fontSize: 12.5, background: '#fff',
    outline: 'none', boxSizing: 'border-box', color: '#111827',
    transition: 'border-color 0.15s',
  }),
  eyeBtn: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex',
  } as React.CSSProperties,
  errMsg: { fontSize: 10.5, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 3 } as React.CSSProperties,
  submitBtn: {
    width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg, #93C962 0%, #6baa3a 100%)',
    color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
    boxShadow: '0 3px 12px rgba(147,201,98,0.38)',
  } as React.CSSProperties,
  switchLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#5A7D3B', fontWeight: 700, padding: 0, fontSize: 11.5,
  } as React.CSSProperties,
}

/* ── Login form ──────────────────────────────────────────── */
function LoginForm({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const { login } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!emailOrUsername.trim()) return setError('Please enter your email or username.')
    if (!password) return setError('Please enter your password.')
    setLoading(true)
    setTimeout(() => {
      const err = login(emailOrUsername.trim(), password)
      setLoading(false)
      if (err) setError(err)
      else onClose()
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: '#DC2626' }}>{error}</span>
        </div>
      )}

      <div style={S.field}>
        <label style={S.label}>Email or Username</label>
        <div style={{ position: 'relative' }}>
          <span style={S.iconWrap}><Mail size={13} /></span>
          <input type="text" value={emailOrUsername} onChange={e => { setEmailOrUsername(e.target.value); setError('') }}
            placeholder="Enter email or username" style={S.input()} />
        </div>
      </div>

      <div style={S.field}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={S.label}>Password</label>
          <a href="#" style={{ fontSize: 11, color: '#5A7D3B', textDecoration: 'none', fontWeight: 500 }}>
            Forgot password?
          </a>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={S.iconWrap}><Lock size={13} /></span>
          <input type={showPw ? 'text' : 'password'} value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Enter password" style={S.input(undefined, true)} />
          <button type="button" onClick={() => setShowPw(p => !p)} style={S.eyeBtn}>
            {showPw ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11.5, color: '#6B7280' }}>
        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
          style={{ accentColor: '#93C962', width: 12, height: 12 }} />
        Remember me
      </label>

      <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.75 : 1 }}>
        {loading ? 'Signing in…' : 'Log In'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Or log in with</span>
        <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 0', borderRadius: 8, border: '1.5px solid #E5E7EB',
          background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151',
        }}>
          <GoogleIcon /> Google
        </button>
        <button type="button" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 0', borderRadius: 8, border: '1.5px solid #E5E7EB',
          background: '#111827', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#fff',
        }}>
          <AppleIcon /> Apple
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: '#6B7280', margin: 0 }}>
        New to Mascot?{' '}
        <button type="button" onClick={onSwitch} style={S.switchLink}>Create an Account</button>
      </p>
    </form>
  )
}

/* ── Signup form ─────────────────────────────────────────── */
function SignupForm({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = 'Full name is required.'
    if (!email.includes('@') || !email.includes('.')) e.email = 'Enter a valid email address.'
    if (!username.trim()) e.username = 'Username is required.'
    else if (username.trim().length < 3) e.username = 'Username must be at least 3 characters.'
    if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (password !== confirm) e.confirm = 'Passwords do not match.'
    if (!agreed) e.terms = 'You must agree to continue.'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    setTimeout(() => {
      const err = signup(fullName, email, username, password)
      setLoading(false)
      if (err) setGlobalError(err)
      else setSuccess(true)
    }, 400)
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#F0FDE8', border: '2px solid #93C962', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={26} color="#5A7D3B" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Account Created!</h3>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Welcome, <strong style={{ color: '#5A7D3B' }}>{fullName.split(' ')[0]}</strong>!<br />
            Your account is ready. Log in to get started.
          </p>
        </div>
        <button onClick={onSwitch} style={{ ...S.submitBtn, marginTop: 4 }}>
          Log In Now
        </button>
        <button type="button" onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: '#9CA3AF' }}>
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {globalError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: '#DC2626' }}>{globalError}</span>
        </div>
      )}

      {/* Full name */}
      <div style={S.field}>
        <label style={S.label}>Full Name</label>
        <div style={{ position: 'relative' }}>
          <span style={S.iconWrap}><User size={13} /></span>
          <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setErrors(v => ({ ...v, fullName: '' })) }}
            placeholder="Your full name" style={S.input(errors.fullName)} />
        </div>
        {errors.fullName && <span style={S.errMsg}><AlertCircle size={10} />{errors.fullName}</span>}
      </div>

      {/* Email */}
      <div style={S.field}>
        <label style={S.label}>Email</label>
        <div style={{ position: 'relative' }}>
          <span style={S.iconWrap}><Mail size={13} /></span>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }}
            placeholder="Your email address" style={S.input(errors.email)} />
        </div>
        {errors.email && <span style={S.errMsg}><AlertCircle size={10} />{errors.email}</span>}
      </div>

      {/* Username */}
      <div style={S.field}>
        <label style={S.label}>Username</label>
        <div style={{ position: 'relative' }}>
          <span style={S.iconWrap}><User size={13} /></span>
          <input type="text" value={username} onChange={e => { setUsername(e.target.value); setErrors(v => ({ ...v, username: '' })) }}
            placeholder="Choose a username" style={S.input(errors.username)} />
        </div>
        {errors.username && <span style={S.errMsg}><AlertCircle size={10} />{errors.username}</span>}
      </div>

      {/* Password + Confirm side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={S.field}>
          <label style={S.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <span style={S.iconWrap}><Lock size={13} /></span>
            <input type={showPw ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '', confirm: '' })) }}
              placeholder="Min 6 chars" style={S.input(errors.password, true)} />
            <button type="button" onClick={() => setShowPw(p => !p)} style={S.eyeBtn}>
              {showPw ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          </div>
          {errors.password && <span style={S.errMsg}><AlertCircle size={10} />{errors.password}</span>}
        </div>
        <div style={S.field}>
          <label style={S.label}>Confirm</label>
          <div style={{ position: 'relative' }}>
            <span style={S.iconWrap}><Lock size={13} /></span>
            <input type={showConfirm ? 'text' : 'password'} value={confirm}
              onChange={e => { setConfirm(e.target.value); setErrors(v => ({ ...v, confirm: '' })) }}
              placeholder="Re-enter" style={S.input(errors.confirm, true)} />
            <button type="button" onClick={() => setShowConfirm(p => !p)} style={S.eyeBtn}>
              {showConfirm ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          </div>
          {errors.confirm && <span style={S.errMsg}><AlertCircle size={10} />{errors.confirm}</span>}
        </div>
      </div>

      {/* Terms */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer', fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>
        <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(v => ({ ...v, terms: '' })) }}
          style={{ accentColor: '#93C962', width: 12, height: 12, marginTop: 1, flexShrink: 0 }} />
        <span>
          I agree to the{' '}
          <span style={{ color: '#5A7D3B', fontWeight: 600 }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: '#5A7D3B', fontWeight: 600 }}>Privacy Policy</span>.
          {' '}All data is confidential.
        </span>
      </label>
      {errors.terms && <span style={{ ...S.errMsg, marginTop: -4 }}><AlertCircle size={10} />{errors.terms}</span>}

      <button type="submit" disabled={loading} style={{ ...S.submitBtn, opacity: loading ? 0.75 : 1 }}>
        {loading ? 'Creating Account…' : 'Create Account'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: '#6B7280', margin: 0 }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={S.switchLink}>Sign in</button>
      </p>
    </form>
  )
}

/* ── Modal shell ─────────────────────────────────────────── */
export default function AuthModal({ initialMode, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }) }, [mode])

  const titles = { login: 'Welcome Back', signup: 'Create Account' }
  const subtitles = {
    login: 'Log in to your confidential student dashboard.',
    signup: 'Join MASCOT — free, private health support.',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.52)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        ref={scrollRef}
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          backgroundColor: '#F3F3F3',
          borderRadius: 18,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
          position: 'relative',
          animation: 'authModalIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: 6,
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6B7280',
        }}>
          <X size={13} />
        </button>

        <div style={{ padding: '20px 24px 18px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <div style={{
              width: 42, height: 42, background: '#fff',
              border: '2px solid #93C962', borderRadius: 11,
              boxShadow: '0 3px 12px rgba(147,201,98,0.26)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6,
            }}>
              <img src="/mascot-logo.png" alt="MASCOT" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            </div>
            <img src="/mascot-text.png" alt="mascot" style={{ height: 16, width: 'auto', objectFit: 'contain' }} />
          </div>

          <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>
            {titles[mode]}
          </h2>
          <p style={{ textAlign: 'center', fontSize: 11.5, color: '#6B7280', margin: '0 0 14px' }}>
            {subtitles[mode]}
          </p>

          {mode === 'login'
            ? <LoginForm onSwitch={() => setMode('signup')} onClose={onClose} />
            : <SignupForm onSwitch={() => setMode('login')} onClose={onClose} />
          }
        </div>

        <Sparkle />
      </div>
    </div>
  )
}
