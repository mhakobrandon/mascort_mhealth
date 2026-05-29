import { useState, useRef, useEffect } from 'react'
import { Bot, Send, RefreshCw, Sparkles, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendChatMessage } from '../services/api'

type Lang = 'en' | 'sn' | 'nd'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface LangConfig {
  fullName: string
  welcome: string
  suggestions: string[]
  placeholder: string
  newChat: string
  tryAsking: string
  errorMsg: string
}

const LANG_CONFIG: Record<Lang, LangConfig> = {
  en: {
    fullName: 'English',
    welcome:
      "Hi! I'm MASCOT AI, your confidential health assistant. 🌿\n\n" +
      "I can help you with:\n" +
      "• HIV prevention & testing\n" +
      "• Contraception options\n" +
      "• Sexual health & wellness\n" +
      "• Finding health services near you\n\n" +
      "All conversations are private and anonymous. What would you like to know?",
    suggestions: [
      'How do condoms prevent HIV?',
      'What are side effects of the pill?',
      'Where can I get an HIV test?',
      'Is the morning-after pill safe?',
      'How effective is PrEP?',
      'What is an IUD?',
    ],
    placeholder: 'Ask about HIV prevention, contraception, sexual health…',
    newChat: 'New chat',
    tryAsking: 'Try asking one of these',
    errorMsg: "Sorry, I'm having trouble connecting right now. Please check your connection and try again.",
  },
  sn: {
    fullName: 'Shona',
    welcome:
      "Mhoro! Ndini MASCOT AI, mubatsiri wako wechakavanzika wehutano. 🌿\n\n" +
      "Ndinogona kukubatsira ne:\n" +
      "• Kurwisa uye kuongororwa kweHIV\n" +
      "• Nzira dzekunzvenga mimba\n" +
      "• Hutano hwepabonde\n" +
      "• Kutsvaga masevhisi ehutano pedyo newe\n\n" +
      "Makurukuro ese akachengetwa uye asiri pachena. Unoda kuziva chii?",
    suggestions: [
      'Makondomu anodzivirira sei HIV?',
      'Miriro yepiritsi ipi?',
      'Ndinogona kuongorora HIV kupi?',
      'Piritsi remangwana rinodiwa here?',
      'PrEP inoshanda sei?',
      'IUD chii?',
    ],
    placeholder: 'Bvunza nezve HIV, kudzivirira mimba, hutano hwepabonde…',
    newChat: 'Kutaura kutsva',
    tryAsking: 'Edza kubvunza izvi',
    errorMsg: 'Ndinexhara, pane dambudziko rekubatanidza. Tarisa uhusavhara hwako uye uedze zvekare.',
  },
  nd: {
    fullName: 'Ndebele',
    welcome:
      "Sawubona! NginguMASCOT AI, umsizi wakho wempilo oyimfihlo. 🌿\n\n" +
      "Ngingakusiza nge:\n" +
      "• Ukuvikela i-HIV lokuhlolwa\n" +
      "• Izindlela zokuvikela ukhulelwa\n" +
      "• Impilo yobulili\n" +
      "• Ukuthola izinsizakalo zempilo eduze kwakho\n\n" +
      "Zonke izingxoxo ziyimfihlo futhi azinakuphenywa. Ufuna ukwazi ini?",
    suggestions: [
      'Amacondom avikela kanjani i-HIV?',
      'Amapilisi anezinhlungu zini?',
      'Ngingahlolwa i-HIV kuphi?',
      'Ipilisi lentambama livikelekile yini?',
      'I-PrEP isebenza kangakanani?',
      'I-IUD yini?',
    ],
    placeholder: 'Buza nge-HIV, ukuvikela ukhulelwa, impilo yobulili…',
    newChat: 'Ingxoxo entsha',
    tryAsking: 'Zama ukubuza lezi',
    errorMsg: 'Ngiyaxolisa, ngizinkinga zokuxhumana. Hlola uxhumano lwakho bese uzama futhi.',
  },
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit' })
}

function makeWelcome(lang: Lang): Message {
  return { role: 'assistant', content: LANG_CONFIG[lang].welcome, timestamp: new Date() }
}

export default function AIChatPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [messages, setMessages] = useState<Message[]>([makeWelcome('en')])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`
  }, [input])

  function switchLang(newLang: Lang) {
    setLang(newLang)
    setMessages([makeWelcome(newLang)])
    setConversationId(undefined)
    setInput('')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    setInput('')

    const cfg = LANG_CONFIG[lang]
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      const res = await sendChatMessage(text.trim(), conversationId, lang)
      if (res.conversation_id) setConversationId(res.conversation_id)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.response,
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: cfg.errorMsg,
        timestamp: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  function resetChat() {
    setMessages([makeWelcome(lang)])
    setConversationId(undefined)
    setInput('')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const cfg = LANG_CONFIG[lang]
  const showSuggestions = messages.length === 1 && !isTyping

  return (
    <div className="flex flex-col h-full bg-[#F7FBF2]">

      {/* ── Chat header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-[18px] flex items-center gap-[18px]">

          {/* Bot avatar */}
          <div className="w-[60px] h-[60px] rounded-[20px] bg-[#93C962] flex items-center justify-center flex-shrink-0">
            <Bot size={30} className="text-white" />
          </div>

          {/* Name + subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-[22px] tracking-tight leading-tight">MASCOT AI</h1>
            <p className="text-sm text-gray-400 truncate mt-0.5">Your confidential health assistant · Zimbabwe</p>
          </div>

          {/* Language switcher pill */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 flex-shrink-0">
            {(['en', 'sn', 'nd'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                title={LANG_CONFIG[l].fullName}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === l
                    ? 'bg-[#93C962] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="flex items-center gap-[9px] px-[18px] py-[9px] rounded-2xl text-sm font-medium bg-[#93C962] text-white hover:bg-[#7ab050] transition-colors shadow-sm"
              title="Start a new conversation"
            >
              <RefreshCw size={19} />
              <span className="hidden sm:inline">{cfg.newChat}</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-[9px] px-[18px] py-[9px] rounded-2xl text-sm font-medium bg-[#93C962] text-white hover:bg-[#7ab050] transition-colors shadow-sm"
              title="Go to Home"
            >
              <Home size={19} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 items-end animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#93C962] flex items-center justify-center flex-shrink-0 mb-5">
                  <Bot size={14} className="text-white" />
                </div>
              )}

              <div className={`group flex flex-col max-w-[80%] sm:max-w-[72%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#93C962] text-white rounded-2xl rounded-tr-sm shadow-sm'
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-1 text-[10px] text-gray-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {msg.role === 'user' && <div className="w-8 flex-shrink-0" />}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-end">
              <div className="w-8 h-8 rounded-xl bg-[#93C962] flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-[#93C962] rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Suggestion chips ─────────────────────────────────── */}
      {showSuggestions && (
        <div className="flex-shrink-0 bg-[#F7FBF2] max-w-3xl w-full mx-auto px-4 sm:px-6 pb-3">
          <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
            <Sparkles size={12} className="text-[#93C962]" />
            {cfg.tryAsking}
          </p>
          <div className="flex flex-wrap gap-2">
            {cfg.suggestions.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-white border border-[#93C962]/40 text-[#5A7D3B] px-3.5 py-2 rounded-full hover:bg-[#93C962]/10 hover:border-[#93C962] hover:shadow-sm transition-all font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input area ───────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-3 items-end bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#93C962] focus-within:shadow-[0_0_0_4px_rgba(147,201,98,0.12)] transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder={cfg.placeholder}
              rows={1}
              className="flex-1 resize-none outline-none text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 bg-transparent max-h-32"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                input.trim() && !isTyping
                  ? 'bg-[#93C962] text-white shadow-sm hover:bg-[#7ab050] hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
