import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, RefreshCw, Sparkles, ShieldCheck, Lock } from 'lucide-react'
import { sendChatMessage } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const PROMPTS = [
  'HIV Prevention Tips',
  'Contraception Advice',
  'Find Clinics Near You',
  'Private & Anonymous',
  'Free Health Support',
  'Ask a Health Question',
]

const SUGGESTIONS = [
  'How do condoms prevent HIV?',
  'What are side effects of the pill?',
  'Where can I get an HIV test?',
  'How effective is PrEP?',
]

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hi! I'm MASCOT AI, your confidential health assistant. 🌿\n\n" +
    "I can help you with:\n" +
    "• HIV prevention & testing\n" +
    "• Contraception options\n" +
    "• Sexual health & wellness\n\n" +
    "All conversations are private and anonymous. What would you like to know?",
  timestamp: new Date(),
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit' })
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [promptIdx, setPromptIdx] = useState(0)
  const [promptKey, setPromptKey] = useState(0)

  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Animate chat window
  useEffect(() => {
    if (open) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 240)
      return () => clearTimeout(t)
    }
  }, [open])

  // Rotate prompts every 2.6s
  useEffect(() => {
    const t = setInterval(() => {
      setPromptIdx(i => (i + 1) % PROMPTS.length)
      setPromptKey(k => k + 1)
    }, 2600)
    return () => clearInterval(t)
  }, [])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`
  }, [input])

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Click outside to close
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!open) return
      const inBtn = btnRef.current?.contains(e.target as Node)
      const inChat = chatRef.current?.contains(e.target as Node)
      if (!inBtn && !inChat) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    try {
      const res = await sendChatMessage(text.trim(), conversationId)
      if (res.conversation_id) setConversationId(res.conversation_id)
      setMessages(prev => [...prev, { role: 'assistant', content: res.response, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  function resetChat() {
    setMessages([WELCOME])
    setConversationId(undefined)
    setInput('')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  return (
    <>
      {/* ── Chat window — independently fixed above button ── */}
      {visible && (
        <div
          ref={chatRef}
          className={open ? 'chat-widget-open' : 'chat-widget-close'}
          style={{
            position: 'fixed',
            bottom: 110,
            right: 24,
            zIndex: 1098,
            width: 'min(390px, calc(100vw - 32px))',
            height: 'min(570px, calc(100vh - 140px))',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 12px 50px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(147,201,98,0.3)',
          }}
        >
          {/* Header */}
          <div style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1e3810 0%, #3d6b20 100%)',
            padding: '13px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 13,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <span style={{
                position: 'absolute', bottom: -1, right: -1,
                width: 12, height: 12, borderRadius: '50%',
                background: '#4ade80', border: '2.5px solid #1e3810',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>MASCOT AI</span>
                <span style={{
                  background: 'rgba(74,222,128,0.2)', color: '#86efac',
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 9999, border: '1px solid rgba(74,222,128,0.3)',
                }}>● ONLINE</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 1 }}>
                Confidential health assistant · Zimbabwe
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={resetChat} title="New chat" style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
                borderRadius: 8, padding: 7, color: 'rgba(255,255,255,0.75)',
                display: 'flex', alignItems: 'center',
              }}>
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
                borderRadius: 8, padding: 7, color: 'rgba(255,255,255,0.75)',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, background: '#F7FBF2' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 14,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0, marginBottom: 18,
                    background: 'linear-gradient(135deg, #1e3810, #93C962)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Bot size={12} color="#fff" />
                  </div>
                )}
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                }}>
                  <div style={{
                    padding: '10px 14px', fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-line',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #3d6b20, #93C962)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#1F2937',
                    boxShadow: msg.role === 'user'
                      ? '0 3px 10px rgba(61,107,32,0.35)' : '0 1px 4px rgba(0,0,0,0.07)',
                    border: msg.role === 'assistant' ? '1px solid #f0f0f0' : 'none',
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 3, padding: '0 2px' }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                {msg.role === 'user' && <div style={{ width: 28, flexShrink: 0 }} />}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 9,
                  background: 'linear-gradient(135deg, #1e3810, #93C962)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={12} color="#fff" />
                </div>
                <div style={{
                  background: '#fff', borderRadius: '16px 16px 16px 4px',
                  padding: '11px 15px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  border: '1px solid #f0f0f0',
                }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <span key={j} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#93C962',
                        display: 'inline-block',
                        animation: 'chatBounce 1.2s ease-in-out infinite',
                        animationDelay: `${j * 0.18}s`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div style={{ paddingLeft: 36, paddingTop: 4 }}>
                <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={11} color="#93C962" /> Try asking
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={{
                      fontSize: 11, background: '#fff',
                      border: '1px solid rgba(147,201,98,0.5)',
                      color: '#3d6b20', padding: '5px 11px', borderRadius: 9999,
                      cursor: 'pointer', fontWeight: 500,
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '10px 14px 13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <ShieldCheck size={11} color="#93C962" />
              <span style={{ fontSize: 10, color: '#9ca3af' }}>Private &amp; anonymous · no data stored</span>
            </div>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-end',
              background: '#f9fafb', border: '1.5px solid #e5e7eb',
              borderRadius: 14, padding: '8px 10px 8px 14px',
            }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
                }}
                placeholder="Ask about HIV, contraception…"
                rows={1}
                style={{
                  flex: 1, resize: 'none', outline: 'none', fontSize: 13,
                  lineHeight: 1.5, color: '#1f2937', background: 'transparent',
                  border: 'none', maxHeight: 100, fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  background: input.trim() && !isTyping
                    ? 'linear-gradient(135deg, #3d6b20, #93C962)' : '#e5e7eb',
                  color: input.trim() && !isTyping ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 7 }}>
              <span style={{ fontSize: 10, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Lock size={9} /> End-to-end private
              </span>
              <span style={{ fontSize: 10, color: '#d1d5db' }}>Enter to send</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Column: label above, button below ───────────────── */}
      <div
        ref={btnRef}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1100,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
        }}
      >
        {/* Text-only label card — hidden when chat is open */}
        {!open && (
          <div
            className="chat-label-float chat-label-in"
            onClick={() => setOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #1e3810 0%, #3d6b20 55%, #5a8a30 100%)',
              borderRadius: 14,
              padding: '11px 18px',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 6px 28px rgba(30,56,16,0.42)',
              border: '1px solid rgba(147,201,98,0.22)',
              maxWidth: 'min(220px, calc(100vw - 100px))',
            }}
          >
            {/* Rotating text */}
            <div
              key={promptKey}
              className="chat-prompt-in"
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '-0.01em',
              }}
            >
              {PROMPTS[promptIdx]}
            </div>

            {/* Downward speech bubble tail, aligned to button center (~31px from right) */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              right: 31,
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '9px solid #3d6b20',
            }} />
          </div>
        )}

        {/* Floating button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Ping ring */}
          {!open && (
            <div className="chat-ping" style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(147,201,98,0.45)',
              pointerEvents: 'none',
            }} />
          )}

          <button
            onClick={() => setOpen(o => !o)}
            title={open ? 'Close AI Chat' : 'Ask MASCOT AI'}
            className={open ? '' : 'chat-btn-glow'}
            style={{
              width: 62, height: 62, borderRadius: '50%', border: 'none',
              background: open
                ? 'linear-gradient(135deg, #1e3810, #3d6b20)'
                : 'linear-gradient(135deg, #3d6b20, #93C962)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s, background 0.25s',
              position: 'relative',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
          >
            <div style={{ transition: 'transform 0.25s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {open ? <X size={26} /> : <Bot size={26} />}
            </div>

            {!open && (
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 12, height: 12, borderRadius: '50%',
                background: '#4ade80', border: '2.5px solid #fff',
              }} />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
