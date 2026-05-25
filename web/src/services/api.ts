import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Attach auth token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ==================== AUTH ====================

export async function registerAnonymous() {
  const { data } = await api.post('/auth/register')
  localStorage.setItem('auth_token', data.token)
  localStorage.setItem('user_id', data.user_id)
  return data as { user_id: string; token: string; session_token: string }
}

export async function ensureAuth() {
  if (!localStorage.getItem('auth_token')) {
    await registerAnonymous()
  }
}

// ==================== PREVENTION ====================

export interface PreventionMethod {
  id: number
  name: string
  category: string
  description: string
  effectiveness: number
  cost: string
  side_effects: string
  how_to_use: string
  details?: { steps?: string[]; effectiveness?: string; side_effects?: string }
}

export async function getPreventionMethods(category?: string) {
  const params = category ? { category } : {}
  const { data } = await api.get<PreventionMethod[]>('/prevention/', { params })
  return data
}

export async function getPreventionMethod(id: number) {
  const { data } = await api.get<PreventionMethod>(`/prevention/${id}`)
  return data
}

export async function searchPreventionMethods(query: string) {
  const { data } = await api.get<PreventionMethod[]>('/prevention/search/', { params: { query } })
  return data
}

// ==================== CLINICS ====================

export interface Clinic {
  id: number
  name: string
  location: string
  latitude: number
  longitude: number
  phone: string
  services: string[]
  opening_hours: string
  is_lgbtq_friendly: boolean
  rating: number
  distance_km?: number
}

export async function getClinics(services?: string) {
  const params = services ? { services } : {}
  const { data } = await api.get<Clinic[]>('/clinics/', { params })
  return data
}

export async function getNearbyClinics(lat: number, lon: number, radiusKm = 5) {
  const { data } = await api.get<Clinic[]>('/clinics/nearby', {
    params: { latitude: lat, longitude: lon, radius_km: radiusKm },
  })
  return data
}

// ==================== AI ASSISTANT ====================

export interface ChatResponse {
  conversation_id: number | null
  response: string
  confidence: number
  sources: string[]
  timestamp: string
}

export async function sendChatMessage(message: string, conversationId?: number) {
  const body: Record<string, unknown> = { message }
  if (conversationId) body.conversation_id = conversationId
  const { data } = await api.post<ChatResponse>('/ai/chat', body)
  return data
}

// ==================== COMMODITY REQUESTS ====================

export interface CommodityRequestPayload {
  item_type: string
  quantity: number
  delivery_method: string
  delivery_location: string
}

export async function requestCommodity(payload: CommodityRequestPayload) {
  const { data } = await api.post('/counselling/commodities/', payload)
  return data
}

// ==================== HEALTH CHECK ====================

export async function healthCheck() {
  const { data } = await api.get('/health')
  return data as { status: string; service: string; timestamp: string }
}
