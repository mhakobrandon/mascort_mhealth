import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, AlertTriangle, DollarSign, ChevronRight } from 'lucide-react'
import { getPreventionMethod, type PreventionMethod } from '../services/api'

export default function PreventionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [method, setMethod] = useState<PreventionMethod | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getPreventionMethod(Number(id))
      .then((m) => { setMethod(m); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  )

  if (!method) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Method not found</p>
      <Link to="/prevention" className="mt-4 inline-flex items-center gap-2 text-purple-600">
        <ArrowLeft size={16} /> Back to Prevention Methods
      </Link>
    </div>
  )

  const effectiveness = method.effectiveness
  const effColor = effectiveness >= 90 ? 'text-green-600' : effectiveness >= 70 ? 'text-amber-600' : 'text-red-600'
  const barColor = effectiveness >= 90 ? 'bg-green-500' : effectiveness >= 70 ? 'bg-amber-500' : 'bg-red-500'

  const steps = method.details?.steps ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/prevention" className="inline-flex items-center gap-2 text-purple-600 text-sm font-medium mb-6 hover:underline">
        <ArrowLeft size={16} /> Back to Prevention Methods
      </Link>

      {/* Header */}
      <div className="card p-8 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <span className="badge bg-purple-100 text-purple-700 mb-3 inline-block">
          {method.category.replace('_', ' ')}
        </span>
        <h1 className="text-3xl font-bold mb-2">{method.name}</h1>
        <p className="text-gray-600 leading-relaxed">{method.description}</p>
      </div>

      {/* Effectiveness */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-purple-600" size={20} />
          <h2 className="font-semibold text-lg">Effectiveness</h2>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className={`text-4xl font-bold ${effColor}`}>{effectiveness}%</div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-full h-3 mb-1">
              <div className={`h-3 rounded-full ${barColor} transition-all`} style={{ width: `${effectiveness}%` }} />
            </div>
            <p className="text-sm text-gray-500">
              {effectiveness >= 90 ? 'Highly effective with correct use' :
               effectiveness >= 70 ? 'Moderately effective with consistent use' :
               'Effectiveness varies — use correctly every time'}
            </p>
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <ChevronRight className="text-purple-600" size={20} />
          How to Use
        </h2>
        {steps.length > 0 ? (
          <ol className="space-y-3">
            {steps.map((step: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-600 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-600 leading-relaxed">{method.how_to_use}</p>
        )}
      </div>

      {/* Side effects */}
      <div className="card p-6 mb-6 border-amber-200 bg-amber-50">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-amber-600" size={20} />
          <h2 className="font-semibold text-lg text-amber-800">Side Effects</h2>
        </div>
        <p className="text-amber-900 leading-relaxed">{method.side_effects}</p>
      </div>

      {/* Cost */}
      <div className="card p-6 mb-6 border-green-200 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-green-600" size={20} />
          <h2 className="font-semibold text-lg text-green-800">Cost & Availability</h2>
        </div>
        <p className="text-green-900">{method.cost}</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/chat"
          className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-purple-700 transition-colors"
        >
          Ask AI for More Info
        </Link>
        <Link
          to="/clinics"
          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold text-center hover:bg-green-600 transition-colors"
        >
          Find a Clinic
        </Link>
      </div>
    </div>
  )
}
