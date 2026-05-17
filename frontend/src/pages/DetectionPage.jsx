import React, { useState, useEffect } from 'react'
import { generateHistoricalData, generateDetection, ANIMALS } from '../utils/mockData'

export default function DetectionPage() {
  const [detections, setDetections] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('time')

  useEffect(() => {
    setDetections(generateHistoricalData(50))
    const interval = setInterval(() => {
      setDetections(prev => [generateDetection(), ...prev.slice(0, 199)])
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const filtered = detections
    .filter(d => filter === 'all' || d.animal === filter)
    .filter(d => !search || d.animal.toLowerCase().includes(search.toLowerCase())
      || d.camera.toLowerCase().includes(search.toLowerCase())
      || d.trackId.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'time' ? new Date(b.timestamp) - new Date(a.timestamp)
      : sortBy === 'confidence' ? b.confidence - a.confidence : 0)

  const exportCSV = () => {
    const headers = 'ID,Animal,Confidence,Camera,Location,Track ID,Timestamp,Dangerous\n'
    const rows = filtered.map(d =>
      `${d.id},${d.animal},${d.confidence}%,${d.camera},${d.location},${d.trackId},${new Date(d.timestamp).toISOString()},${d.danger}`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'wildeye-detections.csv'; a.click()
  }

  return (
    <div className="p-6 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-wide">DETECTION LOG</h2>
          <p className="text-gray-500 text-sm font-mono mt-0.5">Complete animal detection database · YOLOv8</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary text-xs px-4 py-2 flex items-center gap-2">
          ⬇ EXPORT CSV
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="🔍 Search detections..."
          className="input-wild max-w-xs"
          style={{ padding: '8px 14px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input-wild"
          style={{ padding: '8px 14px', maxWidth: 180, background: 'rgba(13,21,32,0.9)' }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Animals</option>
          {ANIMALS.map(a => <option key={a.name} value={a.name}>{a.emoji} {a.name}</option>)}
        </select>
        <select
          className="input-wild"
          style={{ padding: '8px 14px', maxWidth: 160, background: 'rgba(13,21,32,0.9)' }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="time">Sort: Newest</option>
          <option value="confidence">Sort: Confidence</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <div className="live-indicator">
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            <span className="text-[11px]">LIVE UPDATING</span>
          </div>
          <span className="font-mono text-xs text-gray-500">{filtered.length} records</span>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wild-border">
                {['ID', 'ANIMAL', 'CONFIDENCE', 'CAMERA', 'LOCATION', 'TRACK ID', 'BBOX', 'TIME', 'STATUS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((det, i) => (
                <tr key={det.id}
                  className={`border-b border-wild-border/40 transition-colors ${det.danger ? 'hover:bg-red-500/5' : 'hover:bg-white/2'} ${i === 0 ? 'animate-fadeUp' : ''}`}>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{det.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{det.emoji}</span>
                      <span className={`font-display font-semibold text-sm ${det.danger ? 'text-red-400' : 'text-white'}`}>
                        {det.animal}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-wild-border overflow-hidden">
                        <div className={`h-full rounded-full ${det.confidence >= 90 ? 'bg-green-400' : det.confidence >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${det.confidence}%` }} />
                      </div>
                      <span className={`font-mono text-[11px] ${det.confidence >= 90 ? 'text-green-400' : det.confidence >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                        {det.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{det.camera}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{det.location}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-wild-blue" style={{ color: '#00aaff' }}>{det.trackId}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-600">
                    {det.bbox.x},{det.bbox.y},{det.bbox.w}×{det.bbox.h}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {new Date(det.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    {det.danger
                      ? <span className="danger-badge">⚠️ THREAT</span>
                      : <span className="confidence-high text-[10px]">✓ SAFE</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-display">No detections found</div>
          </div>
        )}
      </div>
    </div>
  )
}
