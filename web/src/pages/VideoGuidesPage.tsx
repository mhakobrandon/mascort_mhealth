import { useState } from 'react'
import { Play, Clock, Eye } from 'lucide-react'

interface VideoGuide {
  id: number
  title: string
  description: string
  duration: string
  category: string
  views: number
  color: string
}

const GUIDES: VideoGuide[] = [
  { id: 1, title: 'How to Use a Male Condom Correctly', description: 'Step-by-step guide to correct condom use for maximum protection.', duration: '3:03', category: 'condom_use', views: 1250, color: 'primary' },
  { id: 2, title: 'Understanding Oral Contraceptives', description: 'What you need to know about the pill — how it works and what to do if you miss a dose.', duration: '4:05', category: 'contraception', views: 890, color: 'primary' },
  { id: 3, title: 'HIV Self-Testing: Step-by-Step', description: 'How to use an HIV rapid self-test kit at home and what results mean.', duration: '5:10', category: 'hiv_testing', views: 2100, color: 'green' },
  { id: 4, title: 'What is PrEP and Who Should Take It?', description: 'Pre-exposure prophylaxis explained — who it\'s for and where to get it in Zimbabwe.', duration: '3:18', category: 'hiv_prevention', views: 1640, color: 'green' },
  { id: 5, title: 'Emergency Contraception (Morning-After Pill)', description: 'When and how to use emergency contraception, common myths debunked.', duration: '2:40', category: 'contraception', views: 3200, color: 'primary' },
  { id: 6, title: 'Talking to Your Partner About Sexual Health', description: 'Tips for open conversations about consent, testing and contraception.', duration: '4:35', category: 'relationships', views: 940, color: 'blue' },
]

const CATEGORIES = ['All', 'HIV Prevention', 'Contraception', 'HIV Testing', 'Relationships']
const CATEGORY_KEYS: Record<string, string> = {
  'All': '', 'HIV Prevention': 'hiv_prevention', 'Contraception': 'contraception',
  'HIV Testing': 'hiv_testing', 'Relationships': 'relationships',
}

function colorClasses(color: string) {
  if (color === 'green') return { bg: 'bg-green-50', icon: 'text-green-600', btn: 'bg-green-500 hover:bg-green-600' }
  if (color === 'blue') return { bg: 'bg-blue-50', icon: 'text-blue-600', btn: 'bg-blue-500 hover:bg-blue-600' }
  return { bg: 'bg-primary-50', icon: 'text-primary-600', btn: 'bg-primary-600 hover:bg-primary-700' }
}

export default function VideoGuidesPage() {
  const [active, setActive] = useState('All')

  const key = CATEGORY_KEYS[active]
  const filtered = key ? GUIDES.filter((g) => g.category === key) : GUIDES

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Video Guides</h1>
        <p className="text-gray-500">Step-by-step health tutorials from verified sources</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((guide) => {
          const colors = colorClasses(guide.color)
          return (
            <div key={guide.id} className="card overflow-hidden hover:shadow-md transition-all">
              {/* Thumbnail */}
              <div className={`${colors.bg} h-44 flex items-center justify-center relative`}>
                <Play className={`${colors.icon} w-16 h-16 opacity-60`} />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock size={10} /> {guide.duration}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-base mb-2 line-clamp-2">{guide.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Eye size={12} /> {guide.views.toLocaleString()} views
                  </div>
                  <button className={`${colors.btn} text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5`}>
                    <Play size={12} /> Watch
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
