import { useState } from 'react'
import { Package, Home, Store, Check, Lock } from 'lucide-react'
import { requestCommodity } from '../services/api'

const ITEMS = [
  { value: 'condom', label: 'Condoms', icon: '🛡️' },
  { value: 'pill', label: 'Contraceptive Pills', icon: '💊' },
  { value: 'injectable', label: 'Injectable', icon: '💉' },
  { value: 'implant', label: 'Implant', icon: '🩹' },
  { value: 'iud', label: 'IUD', icon: '🔵' },
  { value: 'hiv_self_test', label: 'HIV Self-Test Kit', icon: '🔬' },
]

export default function RequestSuppliesPage() {
  const [itemType, setItemType] = useState('condom')
  const [quantity, setQuantity] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location.trim()) { setError('Please enter a location'); return }
    setSubmitting(true)
    setError(null)
    try {
      await requestCommodity({ item_type: itemType, quantity, delivery_method: deliveryMethod, delivery_location: location })
      setSuccess(true)
    } catch (err) {
      setError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="text-green-500" size={40} />
      </div>
      <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
      <p className="text-gray-500 mb-8">
        Your request for <strong>{ITEMS.find((i) => i.value === itemType)?.label}</strong> has been received.
        {deliveryMethod === 'pickup'
          ? ' You\'ll be notified when it\'s ready for collection.'
          : ' Your order will be delivered discreetly.'}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => { setSuccess(false); setQuantity(1); setLocation('') }}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          Another Request
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request Supplies</h1>
        <p className="text-gray-500">Free, discreet delivery of prevention commodities</p>
      </div>

      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-8 text-sm text-purple-700">
        <Lock size={14} />
        All requests are confidential and delivered discreetly
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Item selection */}
        <div>
          <h2 className="font-semibold text-lg mb-4">What do you need?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ITEMS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setItemType(item.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  itemType === item.value
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className={`text-sm font-medium ${itemType === item.value ? 'text-purple-700' : 'text-gray-700'}`}>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Quantity</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-lg transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Delivery method */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Delivery Method</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'pickup', icon: Store, label: 'Pick Up', sub: 'Collect at clinic' },
              { value: 'home_delivery', icon: Home, label: 'Home Delivery', sub: 'Delivered discreetly' },
            ].map(({ value, icon: Icon, label, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDeliveryMethod(value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  deliveryMethod === value ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Icon className={`mx-auto mb-2 ${deliveryMethod === value ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
                <div className={`font-semibold text-sm ${deliveryMethod === value ? 'text-purple-700' : 'text-gray-700'}`}>{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="font-semibold text-lg mb-2">
            {deliveryMethod === 'pickup' ? 'Preferred Clinic / Area' : 'Delivery Address'}
          </h2>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={
              deliveryMethod === 'pickup' ? 'e.g. UZ Campus, Harare' : 'e.g. Room 204, Swinton Hall, UZ'
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Package size={18} />
          )}
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
