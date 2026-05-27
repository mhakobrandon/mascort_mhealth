import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Search, TrendingUp, AlertCircle, Pill } from 'lucide-react'
import { getPreventionMethods, type PreventionMethod } from '../services/api'

const CATEGORIES = [
  { key: '', label: 'All Methods' },
  { key: 'contraception', label: 'Contraception' },
  { key: 'hiv_prevention', label: 'HIV Prevention' },
  { key: 'emergency', label: 'Emergency' },
]

function categoryColor(cat: string) {
  if (cat === 'hiv_prevention') return { bg: 'bg-green-50 border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' }
  if (cat === 'emergency') return { bg: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' }
  return { bg: 'bg-primary-50 border-primary-200', text: 'text-primary-700', badge: 'bg-primary-100 text-primary-700' }
}

function categoryLabel(cat: string) {
  if (cat === 'hiv_prevention') return 'HIV Prevention'
  if (cat === 'emergency') return 'Emergency'
  return 'Contraception'
}

export default function PreventionPage() {
  const [methods, setMethods] = useState<PreventionMethod[]>([])
  const [filtered, setFiltered] = useState<PreventionMethod[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getPreventionMethods(activeCategory || undefined)
      .then((data) => { setMethods(data); setFiltered(data); setLoading(false) })
      .catch((e) => { setError(String(e)); setLoading(false) })
  }, [activeCategory])

  useEffect(() => {
    if (!search) { setFiltered(methods); return }
    const q = search.toLowerCase()
    setFiltered(methods.filter((m) =>
      m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    ))
  }, [search, methods])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Prevention Methods</h1>
        <p className="text-gray-500">Evidence-based options for HIV and pregnancy prevention</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search methods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={40} />
          <p className="font-semibold mb-2">Could not load prevention methods</p>
          <p className="text-gray-500 text-sm mb-4">Check that the API server is running</p>
          <button onClick={() => window.location.reload()} className="btn-primary inline-flex">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} methods found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((method) => {
              const colors = categoryColor(method.category)
              return (
                <Link
                  key={method.id}
                  to={`/prevention/${method.id}`}
                  className={`card border ${colors.bg} p-6 hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {method.category === 'hiv_prevention' ? (
                        <Shield className={colors.text} size={20} />
                      ) : method.category === 'emergency' ? (
                        <AlertCircle className={colors.text} size={20} />
                      ) : (
                        <Pill className={colors.text} size={20} />
                      )}
                    </div>
                    <span className={`badge ${colors.badge} text-xs`}>{categoryLabel(method.category)}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{method.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{method.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{method.effectiveness}% effective</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            method.effectiveness >= 90 ? 'bg-green-500' :
                            method.effectiveness >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${method.effectiveness}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">💰 {method.cost}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="font-semibold text-gray-600">No methods found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
