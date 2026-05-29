import { useState, useEffect, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Search, Phone, Clock, MapPin, Heart, AlertCircle,
  Navigation, List, Map as MapIcon, Star, X,
  Users, Activity, Building2, Pill, X as CloseIcon,
} from 'lucide-react'
import { getClinics, getNearbyClinics, type Clinic } from '../services/api'

/* ── Types ──────────────────────────────────────────────────── */
type ServiceCategory = 'all' | 'campus' | 'youth' | 'hiv' | 'contraception' | 'support'
type ViewMode = 'list' | 'map'

/* ── Service category config ────────────────────────────────── */
const SERVICE_CATS: Array<{
  key: ServiceCategory
  label: string
  services: string[]
  icon: React.ReactNode
}> = [
  { key: 'all',           label: 'All Services',   services: [],                                                         icon: <Building2 size={13} /> },
  { key: 'campus',        label: 'Campus Health',  services: ['youth_clinic', 'counselling'],                            icon: <Building2 size={13} /> },
  { key: 'youth',         label: 'Youth Clinics',  services: ['youth_clinic'],                                           icon: <Users size={13} /> },
  { key: 'hiv',           label: 'HIV & PrEP',     services: ['hiv_testing', 'prep', 'hiv_self_test', 'sti_treatment'],  icon: <Activity size={13} /> },
  { key: 'contraception', label: 'Contraception',  services: ['contraception', 'antenatal'],                             icon: <Pill size={13} /> },
  { key: 'support',       label: 'Support Groups', services: ['counselling', 'support_group'],                           icon: <Users size={13} /> },
]

/* ── Helpers ────────────────────────────────────────────────── */
function parseOpenNow(hours: string): boolean | null {
  if (!hours) return null
  try {
    const now = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = now.getDay()
    const m = hours.match(/^(\w{3})-(\w{3})\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/)
    if (!m) return null
    const [, d1, d2, h1, mn1, h2, mn2] = m
    const s = days.indexOf(d1), e = days.indexOf(d2)
    const inDay = s <= e ? today >= s && today <= e : today >= s || today <= e
    if (!inDay) return false
    const cur = now.getHours() * 60 + now.getMinutes()
    return cur >= parseInt(h1) * 60 + parseInt(mn1) && cur < parseInt(h2) * 60 + parseInt(mn2)
  } catch { return null }
}

function matchesCat(clinic: Clinic, cat: ServiceCategory): boolean {
  if (cat === 'all') return true
  const cfg = SERVICE_CATS.find(c => c.key === cat)
  return cfg ? cfg.services.some(s => clinic.services.includes(s)) : false
}

/* ── Map marker icons (DivIcon — avoids Vite asset issues) ──── */
function makePin(bg: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:28px;height:28px;background:${bg};
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.32);
    "></div>`,
    iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -32], className: '',
  })
}
const PIN_OPEN    = makePin('#10b981')
const PIN_CLOSED  = makePin('#ef4444')
const PIN_UNKNOWN = makePin('#6b7280')
function pinFor(isOpen: boolean | null) {
  if (isOpen === true)  return PIN_OPEN
  if (isOpen === false) return PIN_CLOSED
  return PIN_UNKNOWN
}

/* ── MapController: flies to new center when location changes ── */
function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.flyTo(center, 13, { duration: 1.2 }) }, [center, map])
  return null
}

/* ── ClinicCard ─────────────────────────────────────────────── */
function ClinicCard({ clinic, selected, onClick }: {
  clinic: Clinic; selected: boolean; onClick: () => void
}) {
  const isOpen = parseOpenNow(clinic.opening_hours)
  const isHiv = clinic.services.some(s => ['hiv_testing', 'prep', 'hiv_self_test'].includes(s))

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        ${selected ? 'border-[#93C962] ring-2 ring-[#93C962]/30' : 'border-gray-100'}`}
    >
      <div className="p-5">
        {/* Status + distance row */}
        <div className="flex items-center justify-between mb-3">
          {isOpen !== null ? (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              isOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          ) : <div />}

          {clinic.distance_km !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full">
              <Navigation size={10} />
              {clinic.distance_km < 1
                ? `${Math.round(clinic.distance_km * 1000)} m`
                : `${clinic.distance_km.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Name + location */}
        <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-1">{clinic.name}</h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="truncate">{clinic.location}</span>
        </div>

        {/* Service tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {clinic.services.slice(0, 4).map(s => (
            <span key={s} className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-md font-medium">
              {s.replace(/_/g, ' ')}
            </span>
          ))}
          {clinic.services.length > 4 && (
            <span className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md">
              +{clinic.services.length - 4} more
            </span>
          )}
        </div>

        {/* Footer: rating + hours + call */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {clinic.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {clinic.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={11} />
              {clinic.opening_hours}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {clinic.is_lgbtq_friendly && (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                🇿🇼
              </span>
            )}
            <a
              href={`tel:${clinic.phone}`}
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 bg-[#93C962] text-[#1A2E0A] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#7ab050] transition-colors"
            >
              <Phone size={11} /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Selected clinic detail panel (map view) ─────────────────── */
function ClinicPanel({ clinic, onClose }: { clinic: Clinic; onClose: () => void }) {
  const isOpen = parseOpenNow(clinic.opening_hours)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          {isOpen !== null && (
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${
              isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          )}
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{clinic.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin size={11} />{clinic.location}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
          <CloseIcon size={14} className="text-gray-400" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {clinic.services.map(s => (
          <span key={s} className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-md">
            {s.replace(/_/g, ' ')}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Clock size={11} />{clinic.opening_hours}
        {clinic.distance_km !== undefined && (
          <><span className="text-gray-200">·</span>
          <Navigation size={11} className="text-sky-500" />
          <span className="text-sky-600 font-semibold">
            {clinic.distance_km < 1 ? `${Math.round(clinic.distance_km * 1000)} m` : `${clinic.distance_km.toFixed(1)} km`} away
          </span></>
        )}
      </div>

      <a
        href={`tel:${clinic.phone}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#93C962] text-[#1A2E0A] rounded-xl text-sm font-bold hover:bg-[#7ab050] transition-colors"
      >
        <Phone size={14} /> {clinic.phone}
      </a>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */
const HARARE: [number, number] = [-17.8252, 31.0335]

export default function ClinicsPage() {
  const [allClinics, setAllClinics]   = useState<Clinic[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [search, setSearch]           = useState('')
  const [lgbtqOnly, setLgbtqOnly]     = useState(false)
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all')
  const [viewMode, setViewMode]       = useState<ViewMode>('list')
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [userLocation, setUserLocation]     = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter]     = useState<[number, number]>(HARARE)
  const [locStatus, setLocStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    getClinics()
      .then(data => { setAllClinics(data); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { setLocStatus('error'); return }
    setLocStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const pos: [number, number] = [coords.latitude, coords.longitude]
        setUserLocation(pos)
        setMapCenter(pos)
        try {
          const nearby = await getNearbyClinics(coords.latitude, coords.longitude, 50)
          setAllClinics(nearby)
        } catch { /* keep existing list */ }
        setLocStatus('success')
      },
      () => setLocStatus('error'),
      { timeout: 8000, enableHighAccuracy: true },
    )
  }, [])

  const filtered = useMemo(() => {
    let result = allClinics
    if (lgbtqOnly) result = result.filter(c => c.is_lgbtq_friendly)
    if (activeCategory !== 'all') result = result.filter(c => matchesCat(c, activeCategory))
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.services.some(s => s.includes(q))
      )
    }
    if (userLocation) return [...result].sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999))
    return result
  }, [allClinics, lgbtqOnly, activeCategory, search, userLocation])

  const catCount = (key: ServiceCategory) =>
    key === 'all' ? allClinics.length : allClinics.filter(c => matchesCat(c, key)).length

  return (
    <div className="min-h-screen bg-[#F5FAF0]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Services</h1>
            <p className="text-gray-400 text-sm">
              Campus health centres, youth clinics, pharmacies &amp; support groups in Zimbabwe
            </p>
          </div>
          <button
            onClick={handleLocate}
            disabled={locStatus === 'loading'}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              locStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : locStatus === 'error'   ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-white text-gray-700 border-gray-200 hover:border-[#93C962] hover:text-[#5A7D3B]'
            }`}
          >
            <Navigation size={15} className={locStatus === 'loading' ? 'animate-pulse' : ''} />
            {locStatus === 'loading' ? 'Locating…'
              : locStatus === 'success' ? 'Using your location'
              : locStatus === 'error'   ? 'Location unavailable'
              : 'Use my location'}
          </button>
        </div>

        {/* ── Search + toggles ────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Search by name, location or service…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93C962]/30 focus:border-[#93C962] text-sm text-gray-700 placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setLgbtqOnly(v => !v)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
              lgbtqOnly ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
            }`}
          >
            <Heart size={14} /> LGBTQ+ Friendly
          </button>

          {/* List / Map toggle */}
          <div className="flex-shrink-0 flex bg-gray-100 rounded-xl p-1 gap-1">
            {(['list', 'map'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {v === 'list' ? <List size={14} /> : <MapIcon size={14} />}
                {v === 'list' ? 'List' : 'Map'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category pills ──────────────────────────── */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {SERVICE_CATS.map(cat => {
            const count = catCount(cat.key)
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? 'bg-[#93C962] border-[#93C962] text-[#1A2E0A] shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-[#93C962]/50 hover:text-gray-700'
                }`}
              >
                {cat.icon}
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                  isActive ? 'bg-[#1A2E0A]/15 text-[#1A2E0A]' : 'bg-gray-100 text-gray-400'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* ── Loading skeletons ───────────────────────── */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-52">
                <div className="flex justify-between mb-3">
                  <div className="h-5 bg-gray-100 rounded-full w-20" />
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-50 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-5 bg-gray-100 rounded w-20" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ──────────────────────────────────── */}
        {error && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-400" size={40} />
            <p className="font-semibold text-gray-700 mb-1">Could not load services</p>
            <p className="text-sm text-gray-400">Make sure the API server is running</p>
          </div>
        )}

        {/* ── Content ────────────────────────────────── */}
        {!loading && !error && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {filtered.length} {filtered.length === 1 ? 'service' : 'services'} found
              {locStatus === 'success' && ' · sorted by distance'}
            </p>

            {/* LIST VIEW */}
            {viewMode === 'list' && (
              filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(clinic => (
                    <ClinicCard
                      key={clinic.id}
                      clinic={clinic}
                      selected={selectedClinic?.id === clinic.id}
                      onClick={() => setSelectedClinic(s => s?.id === clinic.id ? null : clinic)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="font-semibold text-gray-600 mb-2">No services match your filters</p>
                  <button
                    onClick={() => { setSearch(''); setActiveCategory('all'); setLgbtqOnly(false) }}
                    className="text-sm text-[#5A7D3B] underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )
            )}

            {/* MAP VIEW */}
            {viewMode === 'map' && (
              <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
                <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100" style={{ height: '62vh' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController center={mapCenter} />

                    {/* User location pulse */}
                    {userLocation && (
                      <Circle
                        center={userLocation}
                        radius={300}
                        pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.18, weight: 2 }}
                      />
                    )}

                    {/* Clinic markers */}
                    {filtered.map(clinic => (
                      <Marker
                        key={clinic.id}
                        position={[clinic.latitude, clinic.longitude]}
                        icon={pinFor(parseOpenNow(clinic.opening_hours))}
                        eventHandlers={{ click: () => setSelectedClinic(clinic) }}
                      >
                        <Popup>
                          <div style={{ minWidth: 190, fontFamily: 'inherit' }}>
                            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{clinic.name}</p>
                            <p style={{ color: '#6b7280', fontSize: 11, marginBottom: 5 }}>{clinic.location}</p>
                            <p style={{ fontSize: 11, marginBottom: clinic.distance_km !== undefined ? 3 : 8 }}>
                              ⏰ {clinic.opening_hours}
                            </p>
                            {clinic.distance_km !== undefined && (
                              <p style={{ fontSize: 11, color: '#0369a1', marginBottom: 8 }}>
                                📍 {clinic.distance_km < 1
                                  ? `${Math.round(clinic.distance_km * 1000)} m away`
                                  : `${clinic.distance_km.toFixed(1)} km away`}
                              </p>
                            )}
                            <a href={`tel:${clinic.phone}`} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              background: '#93C962', color: '#1A2E0A',
                              padding: '6px 12px', borderRadius: 8,
                              fontSize: 11, fontWeight: 700, textDecoration: 'none',
                            }}>
                              📞 {clinic.phone}
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Side panel */}
                <div className="flex flex-col gap-3">
                  {/* Legend */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Map Legend</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { color: '#10b981', label: 'Open now' },
                        { color: '#ef4444', label: 'Closed' },
                        { color: '#6b7280', label: 'Hours unknown' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2.5">
                          <div style={{
                            width: 14, height: 14, borderRadius: '50% 50% 50% 0',
                            background: color, transform: 'rotate(-45deg)',
                            border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                            flexShrink: 0,
                          }} />
                          <span className="text-xs text-gray-600">{label}</span>
                        </div>
                      ))}
                      {userLocation && (
                        <div className="flex items-center gap-2.5 pt-1 border-t border-gray-100 mt-1">
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-400 bg-sky-200 flex-shrink-0" />
                          <span className="text-xs text-gray-600">Your location</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected clinic detail */}
                  {selectedClinic && (
                    <ClinicPanel clinic={selectedClinic} onClose={() => setSelectedClinic(null)} />
                  )}

                  {/* Prompt if nothing selected */}
                  {!selectedClinic && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                      <MapPin className="mx-auto mb-2 text-gray-300" size={28} />
                      <p className="text-sm text-gray-400">Tap a pin on the map to see clinic details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
