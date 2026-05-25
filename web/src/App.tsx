import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ensureAuth } from './services/api'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PreventionPage from './pages/PreventionPage'
import PreventionDetailPage from './pages/PreventionDetailPage'
import ClinicsPage from './pages/ClinicsPage'
import AIChatPage from './pages/AIChatPage'
import VideoGuidesPage from './pages/VideoGuidesPage'
import TestimonialsPage from './pages/TestimonialsPage'
import RequestSuppliesPage from './pages/RequestSuppliesPage'

export default function App() {
  useEffect(() => {
    ensureAuth().catch(console.warn)
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/prevention" element={<PreventionPage />} />
        <Route path="/prevention/:id" element={<PreventionDetailPage />} />
        <Route path="/clinics" element={<ClinicsPage />} />
        <Route path="/chat" element={<AIChatPage />} />
        <Route path="/videos" element={<VideoGuidesPage />} />
        <Route path="/stories" element={<TestimonialsPage />} />
        <Route path="/request" element={<RequestSuppliesPage />} />
      </Route>
    </Routes>
  )
}
