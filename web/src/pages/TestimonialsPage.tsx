import { useState } from 'react'
import { Star, Plus, X } from 'lucide-react'

const TESTIMONIALS = [
  { id: 1, author: 'Chiedza, 21', content: 'MASCOT helped me understand my options when I was confused about contraception. The AI answered all my questions without judgment. I finally feel in control of my health.', rating: 5, topic: 'contraception' },
  { id: 2, author: 'Tatenda, 23', content: 'I was scared to get tested for HIV but the app explained the process calmly and helped me find a clinic nearby. Knowledge is power!', rating: 5, topic: 'hiv_prevention' },
  { id: 3, author: 'Ruvimbo, 20', content: 'The video guides are amazing. I never knew how to properly use a condom before. Clear, no-nonsense instructions made all the difference.', rating: 5, topic: 'contraception' },
  { id: 4, author: 'Munyaradzi, 22', content: "As a student, I can't always afford to see a doctor. MASCOT gives me reliable health information and connects me to free services. Absolute lifesaver.", rating: 5, topic: 'general' },
  { id: 5, author: 'Shamiso, 24', content: "I used the commodity request feature to get HIV self-test kits delivered discreetly. No embarrassment, no judgment. This is how healthcare should work.", rating: 5, topic: 'hiv_prevention' },
  { id: 6, author: 'Farai, 19', content: "The counselling booking feature connected me to a wonderful counsellor. I feel so much better now.", rating: 4, topic: 'counselling' },
]

function topicColor(t: string) {
  if (t === 'hiv_prevention') return 'bg-green-100 text-green-700'
  if (t === 'counselling') return 'bg-blue-100 text-blue-700'
  return 'bg-primary-100 text-primary-700'
}

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">Community Stories</h1>
          <p className="text-gray-500">Real experiences from real students</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Share Yours'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { value: '2,400+', label: 'Students Helped', color: 'text-primary-600 bg-primary-50' },
          { value: '4.9/5', label: 'Average Rating', color: 'text-green-600 bg-green-50' },
          { value: '98%', label: 'Would Recommend', color: 'text-amber-600 bg-amber-50' },
        ].map(({ value, label, color }) => (
          <div key={label} className={`${color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm opacity-70">{label}</div>
          </div>
        ))}
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="card p-6 mb-8 border-primary-200">
          <h2 className="font-semibold text-lg mb-4">Share Your Experience</h2>
          <p className="text-sm text-gray-500 mb-4">Anonymous — reviewed before publishing</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder='Your name or nickname (e.g. "Tino, 22")'
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              rows={4}
              placeholder="How has MASCOT mHealth helped you?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={24} className="text-amber-400 fill-amber-400 cursor-pointer" />
              ))}
            </div>
            <button
              onClick={() => { setSubmitted(true); setShowForm(false) }}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Submit Story
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-green-700 text-sm">
          Thank you! Your story has been submitted for review.
        </div>
      )}

      {/* Stories grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="card p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-lg shrink-0">
                {t.author[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{t.author}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className={`badge text-xs ${topicColor(t.topic)}`}>
                    {t.topic.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">"{t.content}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}
