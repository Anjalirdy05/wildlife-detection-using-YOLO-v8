import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './components/layout/DashboardLayout'
import LiveFeedPage from './pages/LiveFeedPage'
import AlertsPage from './pages/AlertsPage'
import DetectionPage from './pages/DetectionPage'
import LocationPage from './pages/LocationPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { Toaster } from 'react-hot-toast'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-wild-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-wild-green border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-wild-green text-sm tracking-widest">INITIALIZING...</p>
      </div>
    </div>
  )
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1520',
            color: '#e2e8f0',
            border: '1px solid rgba(26,40,64,0.8)',
            fontFamily: 'Exo 2, sans-serif',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard/live" replace />} />
          <Route path="live" element={<LiveFeedPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="detections" element={<DetectionPage />} />
          <Route path="locations" element={<LocationPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
