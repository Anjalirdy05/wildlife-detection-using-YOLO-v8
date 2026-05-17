import React, { useState, useEffect, useRef } from 'react'
import { generateDetection, CAMERAS } from '../utils/mockData'
import GoogleMap from '../components/GoogleMap'

function SvgMap({ detections }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = 800
    const H = canvas.height = 500

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#060d08'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(0,255,136,0.06)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Terrain features (stylized forest zones)
    const forestZones = [
      { x: 150, y: 120, rx: 120, ry: 80, color: 'rgba(0,60,20,0.4)' },
      { x: 500, y: 200, rx: 150, ry: 100, color: 'rgba(0,50,15,0.35)' },
      { x: 300, y: 380, rx: 180, ry: 70, color: 'rgba(0,70,25,0.4)' },
      { x: 680, y: 350, rx: 100, ry: 90, color: 'rgba(0,55,20,0.3)' },
    ]
    forestZones.forEach(z => {
      ctx.fillStyle = z.color
      ctx.beginPath()
      ctx.ellipse(z.x, z.y, z.rx, z.ry, 0, 0, Math.PI * 2)
      ctx.fill()
      // Trees symbols
      for (let i = 0; i < 8; i++) {
        const tx = z.x + (Math.random() - 0.5) * z.rx * 1.5
        const ty = z.y + (Math.random() - 0.5) * z.ry * 1.5
        ctx.fillStyle = 'rgba(0,120,40,0.5)'
        ctx.beginPath()
        ctx.arc(tx, ty, 6, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Water body
    ctx.fillStyle = 'rgba(0,80,150,0.2)'
    ctx.strokeStyle = 'rgba(0,150,255,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(420, 320, 60, 30, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Paths / roads
    ctx.strokeStyle = 'rgba(100,100,60,0.3)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 8])
    ctx.beginPath()
    ctx.moveTo(50, 250); ctx.bezierCurveTo(200, 200, 400, 300, 750, 200)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(200, 450); ctx.bezierCurveTo(300, 350, 500, 400, 650, 300)
    ctx.stroke()
    ctx.setLineDash([])

    // Camera positions
    CAMERAS.forEach((cam, i) => {
      const positions = [{ x: 180, y: 150 }, { x: 480, y: 290 }, { x: 650, y: 180 }]
      const pos = positions[i]
      
      // Camera zone circle
      ctx.strokeStyle = 'rgba(0,255,136,0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 6])
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 70, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Camera icon
      ctx.fillStyle = 'rgba(0,255,136,0.15)'
      ctx.strokeStyle = 'rgba(0,255,136,0.6)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#00ff88'
      ctx.font = 'bold 11px JetBrains Mono'
      ctx.textAlign = 'center'
      ctx.fillText('📹', pos.x, pos.y + 4)

      ctx.fillStyle = 'rgba(0,255,136,0.8)'
      ctx.font = '9px JetBrains Mono'
      ctx.fillText(cam.id, pos.x, pos.y + 24)
    })

    // Detection heatmap dots
    detections.slice(0, 60).forEach((det, i) => {
      const camPositions = [{ x: 180, y: 150 }, { x: 480, y: 290 }, { x: 650, y: 180 }]
      const camIdx = CAMERAS.findIndex(c => c.id === det.camera)
      if (camIdx < 0) return
      const base = camPositions[camIdx]
      const dx = base.x + (Math.sin(i * 137) * 60)
      const dy = base.y + (Math.cos(i * 97) * 50)

      const color = det.danger ? 'rgba(255,51,51,' : 'rgba(0,255,136,'
      const age = i / 60
      const alpha = Math.max(0.1, 0.8 - age * 0.6)

      ctx.fillStyle = `${color}${alpha})`
      ctx.beginPath()
      ctx.arc(dx, dy, det.danger ? 5 : 3, 0, Math.PI * 2)
      ctx.fill()

      if (det.danger) {
        ctx.strokeStyle = `rgba(255,51,51,${alpha * 0.5})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(dx, dy, 10, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Track ID label for recent ones
      if (i < 5) {
        ctx.fillStyle = det.danger ? 'rgba(255,100,100,0.9)' : 'rgba(0,255,136,0.9)'
        ctx.font = '8px JetBrains Mono'
        ctx.textAlign = 'left'
        ctx.fillText(`${det.emoji}${det.animal}`, dx + 8, dy + 3)
      }
    })

    // Compass
    ctx.fillStyle = 'rgba(0,255,136,0.6)'
    ctx.font = 'bold 10px Rajdhani'
    ctx.textAlign = 'center'
    ctx.fillText('N', W - 25, 30)
    ctx.fillText('↑', W - 25, 42)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = '8px JetBrains Mono'
    ctx.fillText('SECTOR MAP', 60, H - 10)

    // Scale bar
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(20, H - 25); ctx.lineTo(120, H - 25); ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '8px JetBrains Mono'
    ctx.textAlign = 'center'
    ctx.fillText('1.0 KM', 70, H - 12)

  }, [detections])

  return (
    <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ display: 'block' }} />
  )
}

export default function LocationPage() {
  const [detections, setDetections] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  useEffect(() => {
    const init = Array.from({ length: 50 }, () => {
      const d = generateDetection()
      d.timestamp = new Date(Date.now() - Math.random() * 7200000)
      return d
    })
    setDetections(init)

    const interval = setInterval(() => {
      setDetections(prev => [generateDetection(), ...prev.slice(0, 99)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Group by track ID for paths
  const tracks = {}
  detections.forEach(d => {
    if (!tracks[d.trackId]) tracks[d.trackId] = []
    tracks[d.trackId].push(d)
  })

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-white tracking-wide">DETECTION MAP</h2>
        <p className="text-gray-500 text-sm font-mono mt-0.5">Real-time animal location tracking & movement paths</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Map */}
        <div className="col-span-8">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="live-indicator"><div className="live-dot" /><span className="text-xs">LIVE TRACKING</span></div>
                <span className="font-mono text-[10px] text-gray-500">{detections.length} total positions</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> DANGER</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> SAFE</span>
                <span className="flex items-center gap-1"><span>📹</span> CAMERA</span>
              </div>
            </div>
            <GoogleMap detections={detections} onAnimalClick={setSelectedAnimal} />
          </div>
        </div>

        {/* Panel */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Active tracks */}
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-white text-sm mb-3 tracking-wide">ACTIVE TRACKS</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 220 }}>
              {Object.entries(tracks).slice(0, 12).map(([trackId, dets]) => {
                const latest = dets[0]
                return (
                  <div key={trackId}
                    onClick={() => setSelectedAnimal(trackId === selectedAnimal ? null : trackId)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${trackId === selectedAnimal ? 'bg-wild-green/10 border border-wild-green/30' : 'hover:bg-white/3'}`}>
                    <span className="text-xl">{latest.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-display font-semibold text-xs ${latest.danger ? 'text-red-400' : 'text-white'}`}>
                          {latest.animal}
                        </span>
                        {latest.danger && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      </div>
                      <div className="font-mono text-[10px] text-gray-500">{trackId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-gray-400">{latest.camera}</div>
                      <div className="font-mono text-[10px] text-gray-600">{dets.length} pts</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent detections */}
          <div className="glass-card p-4 flex-1">
            <h3 className="font-display font-bold text-white text-sm mb-3 tracking-wide">RECENT POSITIONS</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 300 }}>
              {detections.slice(0, 20).map((det, i) => (
                <div key={det.id} className={`p-2 rounded-lg text-xs ${i === 0 ? 'animate-fadeUp' : ''} ${det.danger ? 'bg-red-500/8 border border-red-500/20' : 'hover:bg-white/2'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{det.emoji}</span>
                      <span className={`font-display font-semibold ${det.danger ? 'text-red-400' : 'text-white'}`}>{det.animal}</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">{new Date(det.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-mono text-[10px] text-gray-500 mt-0.5">
                    📍 {det.location} · {det.lat.toFixed(4)}°N, {det.lng.toFixed(4)}°E
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera coverage */}
          <div className="glass-card p-4">
            <h3 className="font-display font-bold text-white text-sm mb-3 tracking-wide">CAMERA COVERAGE</h3>
            {CAMERAS.map((cam, i) => {
              const camDets = detections.filter(d => d.camera === cam.id).length
              const pct = Math.round((camDets / Math.max(detections.length, 1)) * 100)
              return (
                <div key={cam.id} className="mb-3">
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="text-gray-400">📹 {cam.id} · {cam.name}</span>
                    <span className="text-wild-green">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-wild-border rounded-full overflow-hidden">
                    <div className="h-full bg-wild-green rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
