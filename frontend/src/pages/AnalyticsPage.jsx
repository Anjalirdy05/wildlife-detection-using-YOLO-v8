import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { generateHistoricalData, getAnimalStats, getHourlyData, ANIMALS } from '../utils/mockData'

const COLORS = ['#00ff88', '#ff3333', '#ffaa00', '#00aaff', '#8855ff', '#ff6600', '#00ffcc', '#ff0088', '#88ff00', '#ffcc00']

function StatCard({ label, value, sub, color = 'text-wild-green', icon }) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className={`font-display font-bold text-3xl ${color}`}>{value}</div>
      </div>
      <div className="font-display font-semibold text-white text-sm">{label}</div>
      {sub && <div className="font-mono text-[10px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs font-mono">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [detections, setDetections] = useState([])
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    setDetections(generateHistoricalData(100))
    const interval = setInterval(() => {
      setDetections(prev => [generateHistoricalData(1)[0], ...prev.slice(0, 199)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const animalStats = getAnimalStats(detections)
  const hourlyData = getHourlyData(detections)
  const dangerCount = detections.filter(d => d.danger).length
  const avgConf = detections.length ? Math.round(detections.reduce((s, d) => s + d.confidence, 0) / detections.length) : 0

  // Camera breakdown
  const camData = ['CAM-001', 'CAM-002', 'CAM-003'].map(cam => ({
    name: cam,
    detections: detections.filter(d => d.camera === cam).length,
    alerts: detections.filter(d => d.camera === cam && d.danger).length,
  }))

  // Danger vs safe
  const pieData = [
    { name: 'Danger Species', value: dangerCount },
    { name: 'Safe Species', value: detections.length - dangerCount },
  ]

  // Trend - last 12 data points aggregated
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const hour = new Date()
    hour.setHours(hour.getHours() - (11 - i))
    const label = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const base = 2 + Math.floor(Math.random() * 8)
    return { time: label, detections: base, alerts: Math.floor(base * 0.3), confidence: 78 + Math.random() * 20 }
  })

  return (
    <div className="p-6 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-wide">ANALYTICS DASHBOARD</h2>
          <p className="text-gray-500 text-sm font-mono mt-0.5">Real-time intelligence & behavioral analysis</p>
        </div>
        <div className="flex gap-2">
          {['1h', '6h', '24h', '7d'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${timeRange === r ? 'border-wild-green/50 bg-wild-green/10 text-wild-green' : 'border-wild-border text-gray-500 hover:text-gray-400'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Detections" value={detections.length} sub="All species · All cameras" icon="🎯" color="text-wild-green" />
        <StatCard label="Danger Alerts" value={dangerCount} sub="Tiger, Lion, Leopard, Wolf, Bear" icon="🚨" color="text-red-400" />
        <StatCard label="Avg Confidence" value={`${avgConf}%`} sub="YOLOv8 detection accuracy" icon="🧠" color="text-amber-400" />
        <StatCard label="Species Detected" value={animalStats.filter(a => a.count > 0).length} sub={`of ${ANIMALS.length} total species`} icon="🦁" color="text-blue-400" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Area Chart - Detection Trend */}
        <div className="col-span-8 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white text-sm tracking-wide">DETECTION TREND</h3>
            <div className="live-indicator"><div className="live-dot" style={{ width: 6, height: 6 }} /><span className="text-[10px]">LIVE</span></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3333" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3333" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,40,64,0.5)" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10 }} />
              <Area type="monotone" dataKey="detections" stroke="#00ff88" strokeWidth={2} fill="url(#detGrad)" name="Detections" />
              <Area type="monotone" dataKey="alerts" stroke="#ff3333" strokeWidth={2} fill="url(#alertGrad)" name="Alerts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Danger vs Safe */}
        <div className="col-span-4 glass-card p-5">
          <h3 className="font-display font-bold text-white text-sm tracking-wide mb-4">THREAT BREAKDOWN</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#ff3333" />
                <Cell fill="#00ff88" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? '#ff3333' : '#00ff88' }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="text-white font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Animal frequency bar chart */}
        <div className="col-span-7 glass-card p-5">
          <h3 className="font-display font-bold text-white text-sm tracking-wide mb-4">SPECIES FREQUENCY</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={animalStats.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,40,64,0.5)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Exo 2' }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Detections" radius={[0, 4, 4, 0]}>
                {animalStats.slice(0, 8).map((entry, i) => {
                  const danger = ['Tiger', 'Lion', 'Leopard', 'Wolf', 'Bear'].includes(entry.name)
                  return <Cell key={i} fill={danger ? '#ff3333' : COLORS[i % COLORS.length]} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly activity */}
        <div className="col-span-5 glass-card p-5">
          <h3 className="font-display font-bold text-white text-sm tracking-wide mb-4">HOURLY ACTIVITY</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,40,64,0.5)" />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="detections" fill="#00ff88" opacity={0.7} radius={[2, 2, 0, 0]} name="Detections" />
              <Bar dataKey="alerts" fill="#ff3333" opacity={0.7} radius={[2, 2, 0, 0]} name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Camera Performance Table */}
      <div className="glass-card p-5">
        <h3 className="font-display font-bold text-white text-sm tracking-wide mb-4">CAMERA PERFORMANCE</h3>
        <div className="grid grid-cols-3 gap-4">
          {camData.map((cam, i) => (
            <div key={cam.name} className="glass-card p-4 border-wild-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-white">📹 {cam.name}</span>
                <div className="live-indicator"><div className="live-dot" style={{ width: 5, height: 5 }} /></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Detections</span>
                  <span className="text-wild-green font-bold">{cam.detections}</span>
                </div>
                <div className="h-1.5 bg-wild-border rounded-full">
                  <div className="h-full bg-wild-green rounded-full" style={{ width: `${Math.min(100, cam.detections * 3)}%` }} />
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Danger Alerts</span>
                  <span className="text-red-400 font-bold">{cam.alerts}</span>
                </div>
                <div className="h-1.5 bg-wild-border rounded-full">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, cam.alerts * 8)}%` }} />
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-gray-500">Alert Rate</span>
                  <span className="text-amber-400">{cam.detections ? Math.round(cam.alerts / cam.detections * 100) : 0}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
