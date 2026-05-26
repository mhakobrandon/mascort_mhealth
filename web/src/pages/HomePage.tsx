import { Link } from 'react-router-dom'
import { Shield, MapPin, Bot, Package, Play, Quote, ArrowRight, Lock, Heart, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-sm mb-6">
            <Lock size={14} />
            Private & Anonymous Health Support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your Health, Your Choice
          </h1>
          <p className="text-xl text-white/85 mb-8 max-w-2xl mx-auto">
            Safe, judgment-free sexual health information for Zimbabwe's tertiary students.
            HIV prevention, contraception, and support — right here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/prevention"
              className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              Explore Prevention Methods
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/chat"
              className="bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <Bot size={18} />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">2,400+</div>
            <div className="text-sm text-gray-500">Students Helped</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">Free</div>
            <div className="text-sm text-gray-500">100% Free Service</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-500">24/7</div>
            <div className="text-sm text-gray-500">AI Support Available</div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">What do you need?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: 'Prevention\nMethods', color: 'purple', to: '/prevention', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-600' },
            { icon: MapPin, label: 'Find a\nClinic', color: 'green', to: '/clinics', bg: 'bg-green-50 border-green-200', text: 'text-green-600' },
            { icon: Package, label: 'Request\nSupplies', color: 'amber', to: '/request', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
            { icon: Bot, label: 'AI Health\nAssistant', color: 'blue', to: '/chat', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
          ].map(({ icon: Icon, label, to, bg, text }) => (
            <Link
              key={to}
              to={to}
              className={`${bg} border rounded-2xl p-6 text-center hover:shadow-md transition-all group`}
            >
              <Icon className={`${text} mx-auto mb-3 group-hover:scale-110 transition-transform`} size={32} />
              <div className={`${text} font-semibold text-sm whitespace-pre-line`}>{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Bot size={36} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Ask MASCOT AI Anything</h3>
            <p className="text-white/80 text-sm">
              Confidential answers about HIV, contraception, pregnancy, and more.
              Powered by verified health documents from Zimbabwe's health experts.
            </p>
          </div>
          <Link
            to="/chat"
            className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors shrink-0 flex items-center gap-2"
          >
            Start Chatting <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Content sections */}
      <section className="max-w-6xl mx-auto px-4 pb-12 grid md:grid-cols-2 gap-6">
        <Link to="/videos" className="card p-6 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Play className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Video Guides</h3>
              <p className="text-sm text-gray-500">Step-by-step health tutorials</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Watch clear, accurate health tutorials — condom use, HIV testing, contraception options, and more.
          </p>
          <div className="mt-4 flex items-center gap-1 text-purple-600 text-sm font-medium">
            Watch Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link to="/stories" className="card p-6 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Quote className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Community Stories</h3>
              <p className="text-sm text-gray-500">Real experiences, real support</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Read anonymous testimonials from peers who've used MASCOT to take control of their health.
          </p>
          <div className="mt-4 flex items-center gap-1 text-green-600 text-sm font-medium">
            Read Stories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Trust section */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Students Trust MASCOT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: 'Completely Anonymous', desc: 'No name, email, or phone required. Identified only by a random ID.', color: 'text-purple-500 bg-purple-50' },
              { icon: Heart, title: 'Non-Judgmental', desc: 'A safe space — no stigma, no shame. All questions are welcome.', color: 'text-red-500 bg-red-50' },
              { icon: Users, title: 'Expert Verified', desc: 'Information from CeSHHAR Zimbabwe health professionals.', color: 'text-green-500 bg-green-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
