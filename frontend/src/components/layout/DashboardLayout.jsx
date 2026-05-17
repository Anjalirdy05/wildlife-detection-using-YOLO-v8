import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { generateDetection } from '../../utils/mockData'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { path: '/dashboard/live', label: 'LIVE FEED', icon: '📹', desc: 'Camera streams' },
  { path: '/dashboard/alerts', label: 'ALERTS', icon: '🚨', desc: 'Notifications', badge: 'alerts' },
  { path: '/dashboard/detections', label: 'DETECTIONS', icon: '🎯', desc: 'Detection log' },
  { path: '/dashboard/locations', label: 'LOCATIONS', icon: '🗺️', desc: 'Animal tracking' },
  { path: '/dashboard/analytics', label: 'ANALYTICS', icon: '📊', desc: 'Data insights' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [detectionCount, setDetectionCount] = useState(0)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate incoming detections
    const interval = setInterval(() => {
      const det = generateDetection()
      setDetectionCount(c => c + 1)
      if (det.danger) {
        setAlerts(prev => [det, ...prev.slice(0, 19)])
        toast.custom((t) => (
          <div className={`alert-danger flex items-center gap-3 max-w-sm ${t.visible ? 'animate-slideIn' : ''}`}>
            <span className="text-2xl">{det.emoji}</span>
            <div>
              <div className="font-display font-bold text-wild-red text-sm">⚠️ DANGER: {det.animal.toUpperCase()}</div>
              <div className="text-xs text-gray-400">{det.cameraName} · {det.confidence}% confidence</div>
            </div>
          </div>
        ), { duration: 4000 })
      }
    }, 5000 + Math.random() * 8000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Signed out safely')
  }

  const formatTime = (d) => d.toTimeString().slice(0, 8)
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="flex h-screen bg-wild-bg overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} border-r border-wild-border relative z-20`}
        style={{ background: 'rgba(6,10,15,0.95)', backdropFilter: 'blur(20px)' }}>
        
        {/* Logo */}
        <div className="p-4 border-b border-wild-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-wild-green/10 border border-wild-green/30 flex items-center justify-center text-lg flex-shrink-0">
            🦁
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 
              onClick={() => navigate('/')}
              className="font-display font-bold text-lg text-wild-green neon-text tracking-widest leading-none cursor-pointer hover:text-wild-green/80 transition-colors"
            >
              WILDEYE
            </h1>
              <p className="font-mono text-[9px] text-gray-500 tracking-wider">AI DETECTION v2.0</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Status */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-wild-border">
            <div className="flex items-center justify-between mb-2">
              <div className="live-indicator text-[10px]">
                <div className="live-dot" style={{ width: 6, height: 6 }} />
                <span>SYSTEM LIVE</span>
              </div>
              <span className="font-mono text-[10px] text-gray-500">{formatTime(time)}</span>
            </div>
            <div className="font-mono text-[10px] text-gray-600">{formatDate(time)}</div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`sidebar-item w-full ${active ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-display font-semibold text-sm tracking-wide">{item.label}</div>
                    <div className="text-[10px] text-gray-600">{item.desc}</div>
                  </div>
                )}
                {!collapsed && item.badge === 'alerts' && alerts.length > 0 && (
                  <span className="danger-badge text-[10px] px-1.5 py-0.5">
                    {alerts.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Stats mini */}
        {!collapsed && (
          <div className="p-3 border-t border-wild-border space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-gray-500">DETECTIONS</span>
              <span className="text-wild-green">{detectionCount + 2847}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-gray-500">ALERTS TODAY</span>
              <span className="text-wild-red">{alerts.length + 143}</span>
            </div>
            <div className="h-1.5 rounded-full bg-wild-border overflow-hidden">
              <div className="h-full bg-wild-green rounded-full animate-pulse" style={{ width: '73%' }} />
            </div>
            <div className="text-[10px] font-mono text-gray-500">CPU: 73% · RAM: 4.2GB</div>
          </div>
        )}

        {/* User */}
        <div className={`p-3 border-t border-wild-border flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-wild-green/20 border border-wild-green/30 flex items-center justify-center text-sm flex-shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-sm text-white truncate">{user?.name}</div>
              <div className="font-mono text-[10px] text-gray-500 uppercase">{user?.role}</div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-gray-600 hover:text-wild-red transition-colors text-sm">
              ⏻
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top bar */}
        <header className="h-12 border-b border-wild-border flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: 'rgba(6,10,15,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-white text-sm tracking-wide">
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'DASHBOARD'}
            </span>
            <div className="live-indicator">
              <div className="live-dot" style={{ width: 6, height: 6 }} />
              <span className="text-[10px]">3 CAMERAS ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-gray-500">{detectionCount} new detections</span>
            <div className="w-px h-4 bg-wild-border" />
            <span className="font-mono text-xs text-gray-400">{formatTime(time)}</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ alerts, detectionCount, time }} />
        </div>
      </main>
    </div>
  )
}
