import { useState, useRef, useEffect } from 'react'
import { Play, Clock, Eye, X, Video } from 'lucide-react'

interface VideoGuide {
  id: number
  title: string
  description: string
  duration: string
  category: string
  views: number
  color: string
  videoSrc: string | null
  poster: string | null
}

const GUIDES: VideoGuide[] = [
  {
    id: 1,
    title: 'How to Use a Male Condom Correctly',
    description: 'Step-by-step guide to correct condom use for maximum protection against pregnancy and STIs.',
    duration: '3:03',
    category: 'contraception',
    views: 1250,
    color: 'primary',
    videoSrc: '/videos/how-to-use-condom.mp4',
    poster: '/Male_condom.png',
  },
  {
    id: 2,
    title: 'Understanding Oral Contraceptives',
    description: "What you need to know about the pill — how it works and what to do if you miss a dose.",
    duration: '4:05',
    category: 'contraception',
    views: 890,
    color: 'primary',
    videoSrc: null,
    poster: null,
  },
  {
    id: 3,
    title: 'HIV Self-Testing: Step-by-Step',
    description: 'How to use an HIV rapid self-test kit at home and what your results mean.',
    duration: '5:10',
    category: 'hiv_testing',
    views: 2100,
    color: 'green',
    videoSrc: '/videos/hiv-testing.mp4',
    poster: null,
  },
  {
    id: 4,
    title: 'What is PrEP and Who Should Take It?',
    description: "Pre-exposure prophylaxis explained — how to use it and where to get it in Zimbabwe.",
    duration: '3:18',
    category: 'hiv_prevention',
    views: 1640,
    color: 'green',
    videoSrc: '/videos/how-to-use-prep.mp4',
    poster: '/DAILY ORAL PREP 1.jpg',
  },
  {
    id: 5,
    title: 'Emergency Contraception (Morning-After Pill)',
    description: 'When and how to use emergency contraception within 72 hours — common myths debunked.',
    duration: '2:40',
    category: 'contraception',
    views: 3200,
    color: 'primary',
    videoSrc: '/videos/morning-after-pill.mp4',
    poster: '/emergency contraception.png',
  },
  {
    id: 6,
    title: 'Talking to Your Partner About Sexual Health',
    description: 'Tips for open, honest conversations about consent, testing, and contraception.',
    duration: '4:35',
    category: 'relationships',
    views: 940,
    color: 'blue',
    videoSrc: '/videos/talking-to-partner-sexual-health.mp4',
    poster: '/hero-person.png',
  },
  {
    id: 7,
    title: 'HIV Prevention: What You Need to Know',
    description: 'A comprehensive overview of HIV prevention strategies including PrEP, condoms, and regular testing.',
    duration: '5:00',
    category: 'hiv_prevention',
    views: 1800,
    color: 'green',
    videoSrc: '/videos/hiv-prevention.mp4',
    poster: null,
  },
  {
    id: 8,
    title: 'Methods of HIV Prevention Explained',
    description: 'Detailed breakdown of all available HIV prevention methods and how to choose what works for you.',
    duration: '4:20',
    category: 'hiv_prevention',
    views: 1200,
    color: 'green',
    videoSrc: '/videos/methods-of-hiv-prevention.mp4',
    poster: null,
  },
]

const CATEGORIES = ['All', 'HIV Prevention', 'Contraception', 'HIV Testing', 'Relationships']
const CATEGORY_KEYS: Record<string, string> = {
  'All': '',
  'HIV Prevention': 'hiv_prevention',
  'Contraception': 'contraception',
  'HIV Testing': 'hiv_testing',
  'Relationships': 'relationships',
}

function colorClasses(color: string) {
  if (color === 'green') return { bg: 'bg-green-50', icon: 'text-green-500', accent: 'bg-green-500 hover:bg-green-600' }
  if (color === 'blue') return { bg: 'bg-blue-50', icon: 'text-blue-500', accent: 'bg-blue-500 hover:bg-blue-600' }
  return { bg: 'bg-[#93C962]/10', icon: 'text-[#5A7D3B]', accent: 'bg-[#93C962] hover:bg-[#7ab050]' }
}

function VideoModal({ guide, onClose }: { guide: VideoGuide; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      videoRef.current?.pause()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="min-w-0 mr-3">
            <h3 className="text-white font-semibold text-sm leading-snug truncate">{guide.title}</h3>
            <p className="text-white/40 text-xs mt-0.5">{guide.duration} · {guide.views.toLocaleString()} views</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Video player */}
        <div className="bg-black">
          <video
            ref={videoRef}
            src={guide.videoSrc!}
            poster={guide.poster ? encodeURI(guide.poster) : undefined}
            controls
            autoPlay
            preload="metadata"
            playsInline
            className="w-full aspect-video"
          >
            <source src={guide.videoSrc!} type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        {/* Description */}
        <div className="px-5 py-4">
          <p className="text-white/60 text-sm leading-relaxed">{guide.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function VideoGuidesPage() {
  const [active, setActive] = useState('All')
  const [playingGuide, setPlayingGuide] = useState<VideoGuide | null>(null)

  const key = CATEGORY_KEYS[active]
  const filtered = key ? GUIDES.filter(g => g.category === key) : GUIDES

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Video Guides</h1>
        <p className="text-gray-500">Step-by-step health tutorials from verified sources</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-[#93C962] text-[#1A2E0A]'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#93C962]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(guide => {
          const colors = colorClasses(guide.color)
          const hasVideo = !!guide.videoSrc

          return (
            <div
              key={guide.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div
                className={`relative h-44 overflow-hidden ${hasVideo ? 'cursor-pointer bg-gray-900' : colors.bg} group`}
                onClick={() => hasVideo && setPlayingGuide(guide)}
              >
                {guide.poster ? (
                  <img
                    src={encodeURI(guide.poster)}
                    alt={guide.title}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-50 transition-opacity duration-200"
                  />
                ) : (
                  !hasVideo && (
                    <Video className={`absolute inset-0 m-auto ${colors.icon} w-14 h-14 opacity-25`} />
                  )
                )}

                {/* Play button overlay */}
                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200 shadow-lg">
                      <Play className="text-white fill-white w-6 h-6 ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Coming soon badge */}
                {!hasVideo && (
                  <div className="absolute top-3 right-3 bg-gray-100 text-gray-400 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Coming Soon
                  </div>
                )}

                {/* Duration badge */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock size={10} /> {guide.duration}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 leading-snug">{guide.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Eye size={12} /> {guide.views.toLocaleString()} views
                  </div>
                  {hasVideo ? (
                    <button
                      onClick={() => setPlayingGuide(guide)}
                      className={`${colors.accent} text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5`}
                    >
                      <Play size={12} className="fill-white" /> Watch
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {playingGuide && (
        <VideoModal guide={playingGuide} onClose={() => setPlayingGuide(null)} />
      )}
    </div>
  )
}
