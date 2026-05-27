import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Lock, RefreshCw } from 'lucide-react'
import { sendChatMessage } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  'How do condoms prevent HIV?',
  'What are side effects of the pill?',
  'Where can I get an HIV test?',
  'Is the morning-after pill safe?',
  'How effective is PrEP?',
  'What is an IUD?',
]

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hi! I'm MASCOT AI, your confidential health assistant. 🌿\n\n" +
    "I can help you with:\n" +
    "• HIV prevention & testing\n" +
    "• Contraception options\n" +
    "• Sexual health & wellness\n" +
    "• Finding health services near you\n\n" +
    "All conversations are private and anonymous. What would you like to know?",
  timestamp: new Date(),
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      const res = await sendChatMessage(text, conversationId)
      if (res.conversation_id) setConversationId(res.conversation_id)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: res.response,
        timestamp: new Date(),
      }])
    } catch {
      setMessages((prev) => [...prev, {
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
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-sm">
          <Bot className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h1 className="font-black text-xl">MASCOT AI</h1>
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Online
          </div>
        </div>
        <button onClick={resetChat} className="p-2 hover:bg-gray-100 rounded-lg" title="New conversation">
          <RefreshCw size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Privacy banner */}
      <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-xl px-4 py-2 mb-4 text-sm text-primary-700">
        <Lock size={14} />
        Private & anonymous — no personal data stored
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shrink-0 mt-1">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions — shown only after welcome */}
        {messages.length === 1 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 ml-11">Try asking:</p>
            <div className="ml-11 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm bg-primary-50 border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 items-end bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
          }}
          placeholder="Ask about your health..."
          rows={1}
          className="flex-1 resize-none outline-none text-sm leading-relaxed max-h-32"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
