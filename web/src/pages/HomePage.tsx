import { Link } from 'react-router-dom'
import {
  Shield, MapPin, Bot, Package, Play, Quote,
  ArrowRight, Heart, Users, Lock,
  ThumbsUp, Settings, Clock,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#F2F9E6] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-14 grid md:grid-cols-2 gap-10 items-start">

          {/* Left: text content — same height as the 400 px green square */}
          <div className="flex flex-col h-[400px]">
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-[#93C962]">
              Your Health,<br />Your Choice
            </h1>

            <div className="flex-1" />

            <p className="text-gray-600 text-xl leading-relaxed max-w-md">
              Safe, judgment-free sexual health information for Zimbabwe's tertiary students.
              HIV prevention, contraception, and support — right here.
            </p>

            <div className="flex-1" />

            {/* buttons flush with green square bottom */}
            <div className="flex flex-col gap-3 max-w-md">
              <div className="flex gap-3">
                <Link
                  to="/prevention"
                  className="flex-1 bg-[#93C962] text-white px-5 py-3.5 rounded-xl font-bold text-lg hover:bg-[#76A44E] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Explore Prevention Methods
                </Link>
                <Link
                  to="/chat"
                  className="flex-1 bg-[#93C962] text-white px-5 py-3.5 rounded-xl font-bold text-lg hover:bg-[#76A44E] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Bot size={19} /> Ask AI Assistant
                </Link>
              </div>
              <Link
                to="/request"
                className="w-full border-2 border-[#93C962] text-[#76A44E] px-5 py-3.5 rounded-xl font-bold text-lg hover:bg-[#93C962] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Package size={19} /> Distribution &amp; Commodity Request
              </Link>
            </div>
          </div>

          {/* Right: image power-clipped into green rounded square */}
          <div className="hidden md:flex justify-center items-start">
            <div className="relative w-[400px] h-[400px] bg-[#E0F2C4] rounded-[2.5rem] overflow-hidden">
              <img
                src="/hero-person.png"
                alt="Happy student"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] object-cover"
              />
            </div>
          </div>

        </div>


      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-5 animate-drop-flash">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { icon: ThumbsUp, value: '2,400+', label: 'Students Helped' },
            { icon: Settings,  value: 'Free',   label: 'Always Free' },
            { icon: Clock,     value: '24/7',   label: 'AI Support' },
            { icon: Lock,      value: '100%',   label: 'Confidential' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-2 first:pl-0 last:pr-0">
              <div className="w-11 h-11 rounded-full bg-[#F2F9E6] flex items-center justify-center shrink-0">
                <Icon size={19} className="text-[#93C962]" />
              </div>
              <div>
                <div className="text-xl font-black text-[#76A44E]">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick actions ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">What do you need?</h2>
          <p className="text-gray-500">Choose a service to get started</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield,  label: 'Prevention\nMethods',    to: '/prevention', bg: 'bg-primary-50 border-primary-200 hover:border-primary-400', text: 'text-primary-600', icobg: 'bg-primary-500' },
            { icon: MapPin,  label: 'Find a\nClinic',         to: '/clinics',    bg: 'bg-green-50 border-green-200 hover:border-green-400',       text: 'text-green-700',   icobg: 'bg-green-500' },
            { icon: Package, label: 'Request\nSupplies',      to: '/request',    bg: 'bg-amber-50 border-amber-200 hover:border-amber-400',       text: 'text-amber-700',   icobg: 'bg-amber-500' },
            { icon: Bot,     label: 'AI Health\nAssistant',   to: '/chat',       bg: 'bg-blue-50 border-blue-200 hover:border-blue-400',          text: 'text-blue-700',    icobg: 'bg-blue-500' },
          ].map(({ icon: Icon, label, to, bg, text, icobg }) => (
            <Link
              key={to}
              to={to}
              className={`${bg} border-2 rounded-2xl p-6 text-center hover:shadow-lg transition-all group`}
            >
              <div className={`w-12 h-12 ${icobg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className={`${text} font-bold text-sm whitespace-pre-line leading-snug`}>{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI Banner ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 p-2">
            <img src="/mascot-logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-black mb-1.5">Ask MASCOT AI Anything</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Confidential answers about HIV, contraception, pregnancy, and more.
              Powered by verified health documents from Zimbabwe's health experts.
            </p>
          </div>
          <Link
            to="/chat"
            className="bg-white text-primary-700 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shrink-0 flex items-center gap-2 shadow-lg shadow-black/10"
          >
            Start Chatting <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Content cards ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-6">
        <Link to="/videos" className="card p-6 hover:shadow-md transition-all group border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Play className="text-primary-600" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Video Guides</h3>
              <p className="text-sm text-gray-400">Step-by-step health tutorials</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Watch clear, accurate health tutorials — condom use, HIV testing, contraception options, and more.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-primary-600 text-sm font-semibold">
            Watch Now <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/stories" className="card p-6 hover:shadow-md transition-all group border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Quote className="text-green-600" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Community Stories</h3>
              <p className="text-sm text-gray-400">Real experiences, real support</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Read anonymous testimonials from peers who've used MASCOT to take control of their health.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            Read Stories <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* ── Trust section ─────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Why Students Trust MASCOT</h2>
          <p className="text-gray-500 mb-12">Built for Zimbabwe's youth, with your privacy first</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock,  title: 'Completely Anonymous', desc: 'No name, email, or phone required. Identified only by a random session ID.', bg: 'bg-primary-50', iconColor: 'text-primary-600' },
              { icon: Heart, title: 'Non-Judgmental',       desc: 'A safe space — no stigma, no shame. All questions are welcome here.',        bg: 'bg-red-50',     iconColor: 'text-red-500' },
              { icon: Users, title: 'Expert Verified',      desc: 'All information is verified by CeSHHAR Zimbabwe health professionals.',       bg: 'bg-green-50',   iconColor: 'text-green-600' },
            ].map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div key={title} className="text-center group">
                <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon size={28} className={iconColor} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <section className="bg-primary-700 py-14">
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to take control of your health?</h2>
          <p className="text-primary-200 mb-8 text-sm leading-relaxed">
            Join thousands of Zimbabwe students making informed decisions about their health.
          </p>
          <Link
            to="/prevention"
            className="bg-white text-primary-700 px-8 py-4 rounded-xl font-black hover:bg-primary-50 transition-colors inline-flex items-center gap-2 shadow-lg"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
