import React, { useState, useEffect } from 'react'
import { generateDetection } from '../utils/mockData'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Initial batch
    const initial = Array.from({ length: 15 }, () => {
      const d = generateDetection()
      d.timestamp = new Date(Date.now() - Math.random() * 3600000)
      return d
    }).sort((a, b) => b.timestamp - a.timestamp)
    setAlerts(initial)

    const interval = setInterval(() => {
      const det = generateDetection()
      if (det.danger || Math.random() > 0.5) {
        setAlerts(prev => [det, ...prev.slice(0, 99)])
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const filtered = alerts.filter(a => {
    if (filter === 'danger' && !a.danger) return false
    if (filter === 'safe' && a.danger) return false
    if (search && !a.animal.toLowerCase().includes(search.toLowerCase()) && !a.camera.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const dangerCount = alerts.filter(a => a.danger).length
  const todayCount = alerts.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length

  const acknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-white tracking-wide">ALERT CENTER</h2>
        <p className="text-gray-500 text-sm font-mono mt-0.5">Real-time threat notifications & incident management</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'TOTAL ALERTS', value: alerts.length, color: 'text-white', bg: 'border-wild-border' },
          { label: 'DANGER ALERTS', value: dangerCount, color: 'text-wild-red', bg: 'border-red-500/20', glow: true },
          { label: 'TODAY', value: todayCount, color: 'text-wild-amber', bg: 'border-amber-500/20' },
          { label: 'UNACKNOWLEDGED', value: alerts.filter(a => !a.acknowledged).length, color: 'text-wild-blue', bg: 'border-blue-500/20' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 border ${s.bg} ${s.glow ? 'shadow-red-500/10 shadow-lg' : ''}`}>
            <div className={`font-display font-bold text-3xl ${s.color}`}>{s.value}</div>
            <div className="font-mono text-[10px] text-gray-500 mt-1 tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          className="input-wild max-w-xs"
          placeholder="🔍 Search alerts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px' }}
        />
        {['all', 'danger', 'safe'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-xs px-4 py-2 rounded-lg border transition-all uppercase ${filter === f
              ? f === 'danger' ? 'border-red-500/50 bg-red-500/10 text-red-400'
                : f === 'safe' ? 'border-green-500/50 bg-green-500/10 text-green-400'
                : 'border-wild-green/50 bg-wild-green/10 text-wild-green'
              : 'border-wild-border text-gray-500 hover:text-gray-400'}`}>
            {f === 'all' ? '📋 All' : f === 'danger' ? '🚨 Danger' : '✅ Safe'}
          </button>
        ))}
        <div className="ml-auto font-mono text-xs text-gray-500">{filtered.length} alerts shown</div>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filtered.map((alert, i) => (
          <div key={alert.id}
            className={`rounded-xl p-4 border transition-all animate-fadeUp ${alert.acknowledged ? 'opacity-50' : ''} ${alert.danger
              ? 'bg-red-500/8 border-red-500/25 hover:border-red-500/40'
              : 'glass-card hover:border-gray-600'}`}
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${alert.danger ? 'bg-red-500/15' : 'bg-green-500/10'}`}>
                  {alert.emoji}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-display font-bold text-lg ${alert.danger ? 'text-red-400' : 'text-white'}`}>
                      {alert.animal}
                    </span>
                    {alert.danger && (
                      <span className="danger-badge">⚠️ DANGER SPECIES</span>
                    )}
                    <span className={alert.confidence >= 90 ? 'confidence-high' : alert.confidence >= 80 ? 'confidence-med' : 'confidence-low'}>
                      {alert.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px] text-gray-400">
                    <span>📹 {alert.camera} · {alert.cameraName}</span>
                    <span>📍 {alert.location}</span>
                    <span>🏷️ {alert.trackId}</span>
                    <span>🕐 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledge(alert.id)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-wild-green/30 text-wild-green hover:bg-wild-green/10 transition-all"
                  >
                    ✓ ACK
                  </button>
                ) : (
                  <span className="text-xs font-mono text-gray-600 border border-gray-700 px-3 py-1.5 rounded-lg">✓ DONE</span>
                )}
                {alert.danger && (
                  <button className="text-xs font-mono px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                    🔔 DISPATCH
                  </button>
                )}
              </div>
            </div>

            {/* Danger bar */}
            {alert.danger && (
              <div className="mt-3 h-0.5 bg-red-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: `${alert.confidence}%` }} />
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-5xl mb-4">🔕</div>
            <div className="font-display text-xl">No alerts found</div>
            <div className="font-mono text-sm mt-2">Adjust your filters to see more</div>
          </div>
        )}
      </div>
    </div>
  )
}
