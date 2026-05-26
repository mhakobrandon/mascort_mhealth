import { useState, useEffect } from 'react'
import { Search, Phone, Clock, MapPin, Heart, AlertCircle } from 'lucide-react'
import { getClinics, type Clinic } from '../services/api'

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filtered, setFiltered] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [lgbtqOnly, setLgbtqOnly] = useState(false)

  useEffect(() => {
    getClinics()
      .then((data) => { setClinics(data); setFiltered(data); setLoading(false) })
      .catch((e) => { setError(String(e)); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = clinics
    if (lgbtqOnly) result = result.filter((c) => c.is_lgbtq_friendly)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, lgbtqOnly, clinics])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Services</h1>
        <p className="text-gray-500">Clinics and health services near you in Zimbabwe</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setLgbtqOnly(!lgbtqOnly)}
          className={`px-4 py-3 rounded-xl border font-medium text-sm flex items-center gap-2 transition-colors ${
            lgbtqOnly ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
          }`}
        >
          <Heart size={16} />
          LGBTQ+ Friendly
        </button>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-8 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={40} />
          <p className="font-semibold mb-2">Could not load clinics</p>
          <p className="text-gray-500 text-sm">Make sure the API server is running</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} clinics found</p>
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((clinic) => (
              <div key={clinic.id} className="card p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{clinic.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin size={13} />
                      {clinic.location}
                    </div>
                  </div>
                  {clinic.is_lgbtq_friendly && (
                    <span className="badge bg-purple-100 text-purple-700 flex items-center gap-1">
                      <Heart size={10} />
                      LGBTQ+
                    </span>
                  )}
                </div>

                {/* Services */}
                {clinic.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {clinic.services.slice(0, 4).map((s) => (
                      <span key={s} className="badge bg-gray-100 text-gray-600 text-xs">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {clinic.services.length > 4 && (
                      <span className="badge bg-gray-100 text-gray-500 text-xs">+{clinic.services.length - 4} more</span>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Clock size={13} />
                    {clinic.opening_hours}
                  </div>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <Phone size={13} />
                    {clinic.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="font-semibold text-gray-600">No clinics found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
