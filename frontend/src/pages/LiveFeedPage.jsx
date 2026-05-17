import React, { useState, useEffect, useRef, useCallback } from 'react'
import { generateDetection, CAMERAS } from '../utils/mockData'

// Camera-specific detection generation
function generateCameraDetection(cameraIndex) {
  const cameraAnimals = {
    0: { name: 'Tiger', emoji: '🐯', danger: true, color: '#ff3333', icon: '⚠️' },
    1: { name: 'Elephant', emoji: '🐘', danger: false, color: '#ffaa00', icon: '🔔' },
    2: { name: 'Zebra', emoji: '🦓', danger: false, color: '#00aaff', icon: '✅' }
  }
  
  const animal = cameraAnimals[cameraIndex] || cameraAnimals[0]
  const camera = CAMERAS[cameraIndex] || CAMERAS[0]
  const confidence = Math.round((0.82 + Math.random() * 0.17) * 100)
  
  return {
    id: `DET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    animal: animal.name,
    emoji: animal.emoji,
    danger: animal.danger,
    color: animal.color,
    icon: animal.icon,
    confidence,
    camera: camera.id,
    cameraName: camera.name,
    location: camera.location,
    lat: camera.lat + (Math.random() - 0.5) * 0.01,
    lng: camera.lng + (Math.random() - 0.5) * 0.01,
    timestamp: new Date(),
    trackId: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
    bbox: {
      x: Math.floor(Math.random() * 400 + 50),
      y: Math.floor(Math.random() * 200 + 50),
      w: Math.floor(Math.random() * 150 + 80),
      h: Math.floor(Math.random() * 120 + 80),
    }
  }
}

// Animated camera feed with YOLO bounding box overlay
function CameraFeed({ camera, active, index }) {
  const canvasRef = useRef(null)
  const videoRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef({ detections: [], time: 0, frame: 0 })
  const [latestDet, setLatestDet] = useState(null)

  // Animal video simulation colors per camera
  const themes = [
    { bg1: '#0a1f08', bg2: '#051005', accent: '#00ff88', animals: ['🐯', '🦌', '🐘'] },
    { bg1: '#1a1005', bg2: '#0f0a03', accent: '#ffaa00', animals: ['🦁', '🐆', '🦒'] },
    { bg1: '#050a1f', bg2: '#030510', accent: '#00aaff', animals: ['🐺', '🦓', '🐻'] },
  ]
  const theme = themes[index % 3]

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = 640
    const H = canvas.height = 360

    const state = stateRef.current
    
    // For Camera 1 (index 0) - use video with tiger tracking
    if (index === 0) {
      if (!video) return
      
      // Initialize video when ready
      const initVideo = () => {
        video.muted = true
        video.loop = true
        video.playsInline = true
        
        const startWhenReady = () => {
          if (video.readyState >= 2) {
            video.play().catch(err => {
              console.log('Video autoplay failed, trying again:', err)
              setTimeout(() => video.play(), 100)
            })
            startVideoLoop()
          } else {
            setTimeout(startWhenReady, 100)
          }
        }
        
        video.addEventListener('loadeddata', startWhenReady, { once: true })
        video.load()
      }
      
      const startVideoLoop = () => {
        state.detections = []
        state.nextDet = 0
        state.tigerPos = { x: 320, y: 180, w: 120, h: 80 }
        
        let t = 0
        function drawVideo() {
          t += 0.016
          state.time = t
          
          // Ensure video is playing and has valid frame
          if (video.readyState >= 2) {
            // Restart video if it stopped
            if (video.paused || video.ended) {
              video.currentTime = 0
              video.play().catch(() => {})
            }
            try {
              ctx.drawImage(video, 0, 0, W, H)
            } catch (e) {
              // Fallback to last good frame if drawing fails
              console.log('Video draw error, continuing...')
            }
          }
          
          // Simulate tiger movement with realistic path
          const time = t * 0.3
          state.tigerPos.x = 320 + Math.sin(time) * 80 + Math.cos(time * 1.7) * 30
          state.tigerPos.y = 180 + Math.sin(time * 1.3) * 20 + Math.sin(time * 0.7) * 10
          state.tigerPos.w = 280 + Math.sin(time * 2.1) * 40
          state.tigerPos.h = 220 + Math.cos(time * 1.9) * 35
          
          // Generate tiger detections
          const now = Date.now()
          if (now > state.nextDet) {
            state.nextDet = now + 2000 + Math.random() * 3000
            const confidence = Math.round((0.85 + Math.random() * 0.14) * 100)
            
            state.detections = [{
              x: state.tigerPos.x - state.tigerPos.w / 2,
              y: state.tigerPos.y - state.tigerPos.h / 2,
              w: state.tigerPos.w,
              h: state.tigerPos.h,
              label: 'Tiger',
              confidence,
              danger: true,
              trackId: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
              alpha: 1,
              born: now,
            }, ...state.detections.slice(0, 2)]
            setLatestDet({ animal: 'Tiger', confidence, danger: true })
          }
          
          // Draw YOLO bounding boxes
          state.detections.forEach((det, i) => {
            const age = (now - det.born) / 5000
            det.alpha = Math.max(0, 1 - age)
            if (det.alpha <= 0) return
            
            const color = `rgba(255,51,51,${det.alpha})`
            
            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.strokeRect(det.x, det.y, det.w, det.h)
            
            // Corner accents
            const cLen = 18
            ctx.lineWidth = 3.5
            ;[
              [det.x, det.y, cLen, 0, 0, cLen],
              [det.x + det.w, det.y, -cLen, 0, 0, cLen],
              [det.x, det.y + det.h, cLen, 0, 0, -cLen],
              [det.x + det.w, det.y + det.h, -cLen, 0, 0, -cLen],
            ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
              ctx.beginPath()
              ctx.moveTo(cx + dx1, cy + dy1)
              ctx.lineTo(cx, cy)
              ctx.lineTo(cx + dx2, cy + dy2)
              ctx.stroke()
            })
            
            // Label background
            const labelH = 18
            ctx.fillStyle = `rgba(255,51,51,${det.alpha * 0.85})`
            ctx.fillRect(det.x, det.y - labelH, det.w, labelH)
            
            // Label text
            ctx.fillStyle = `rgba(255,255,255,${det.alpha})`
            ctx.font = 'bold 10px JetBrains Mono, monospace'
            ctx.textAlign = 'left'
            ctx.fillText(`${det.label} ${det.confidence}% | ${det.trackId}`, det.x + 4, det.y - 5)
          })
          
          // Grid overlay
          ctx.strokeStyle = 'rgba(0,255,136,0.04)'
          ctx.lineWidth = 0.5
          for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke() }
          for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke() }
          
          // Corner UI
          ctx.fillStyle = 'rgba(0,255,136,0.6)'
          ctx.font = '10px JetBrains Mono'
          ctx.textAlign = 'left'
          ctx.fillText(`[${camera.id}]`, 8, 16)
          ctx.textAlign = 'right'
          ctx.fillText(new Date().toTimeString().slice(0, 8), W - 8, 16)
          
          // YOLO watermark
          ctx.fillStyle = 'rgba(255,255,255,0.08)'
          ctx.font = 'bold 40px Rajdhani'
          ctx.textAlign = 'center'
          ctx.fillText('YOLOv8', W / 2, H / 2)
          ctx.font = '11px JetBrains Mono'
          ctx.fillText('LIVE DETECTION', W / 2, H / 2 + 24)
          
          animRef.current = requestAnimationFrame(drawVideo)
        }
        
        drawVideo()
      }
      
      initVideo()
      return () => cancelAnimationFrame(animRef.current)
    }
    
    // For Camera 2 (index 1) - use video with elephant tracking
    if (index === 1) {
      if (!video) return
      
      // Initialize video when ready
      const initVideo = () => {
        video.muted = true
        video.loop = true
        video.playsInline = true
        
        const startWhenReady = () => {
          if (video.readyState >= 2) {
            video.play().catch(err => {
              console.log('Video autoplay failed, trying again:', err)
              setTimeout(() => video.play(), 100)
            })
            startVideoLoop()
          } else {
            setTimeout(startWhenReady, 100)
          }
        }
        
        video.addEventListener('loadeddata', startWhenReady, { once: true })
        video.load()
      }
      
      const startVideoLoop = () => {
        state.detections = []
        state.nextDet = 0
        state.elephantPos = { x: 320, y: 180, w: 140, h: 100 }
        
        let t = 0
        function drawVideo() {
          t += 0.016
          state.time = t
          
          // Ensure video is playing and has valid frame
          if (video.readyState >= 2) {
            // Restart video if it stopped
            if (video.paused || video.ended) {
              video.currentTime = 0
              video.play().catch(() => {})
            }
            try {
              ctx.drawImage(video, 0, 0, W, H)
            } catch (e) {
              // Fallback to last good frame if drawing fails
              console.log('Video draw error, continuing...')
            }
          }
          
          // Simulate elephant movement with realistic path
          const time = t * 0.25
          state.elephantPos.x = 320 + Math.sin(time) * 70 + Math.cos(time * 1.5) * 25
          state.elephantPos.y = 180 + Math.sin(time * 1.2) * 15 + Math.sin(time * 0.8) * 8
          state.elephantPos.w = 300 + Math.sin(time * 1.8) * 35
          state.elephantPos.h = 240 + Math.cos(time * 2.2) * 30
          
          // Generate elephant detections
          const now = Date.now()
          if (now > state.nextDet) {
            state.nextDet = now + 2500 + Math.random() * 3500
            const confidence = Math.round((0.82 + Math.random() * 0.17) * 100)
            
            state.detections = [{
              x: state.elephantPos.x - state.elephantPos.w / 2,
              y: state.elephantPos.y - state.elephantPos.h / 2,
              w: state.elephantPos.w,
              h: state.elephantPos.h,
              label: 'Elephant',
              confidence,
              danger: false,
              trackId: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
              alpha: 1,
              born: now,
            }, ...state.detections.slice(0, 2)]
            setLatestDet({ animal: 'Elephant', confidence, danger: false })
          }
          
          // Draw YOLO bounding boxes
          state.detections.forEach((det, i) => {
            const age = (now - det.born) / 5000
            det.alpha = Math.max(0, 1 - age)
            if (det.alpha <= 0) return
            
            const color = det.danger ? `rgba(255,51,51,${det.alpha})` : `rgba(0,255,136,${det.alpha})`
            
            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.strokeRect(det.x, det.y, det.w, det.h)
            
            // Corner accents
            const cLen = 18
            ctx.lineWidth = 3.5
            ;[
              [det.x, det.y, cLen, 0, 0, cLen],
              [det.x + det.w, det.y, -cLen, 0, 0, cLen],
              [det.x, det.y + det.h, cLen, 0, 0, -cLen],
              [det.x + det.w, det.y + det.h, -cLen, 0, 0, -cLen],
            ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
              ctx.beginPath()
              ctx.moveTo(cx + dx1, cy + dy1)
              ctx.lineTo(cx, cy)
              ctx.lineTo(cx + dx2, cy + dy2)
              ctx.stroke()
            })
            
            // Label background
            const labelH = 18
            ctx.fillStyle = det.danger ? `rgba(255,51,51,${det.alpha * 0.85})` : `rgba(0,40,20,${det.alpha * 0.85})`
            ctx.fillRect(det.x, det.y - labelH, det.w, labelH)
            
            // Label text
            ctx.fillStyle = `rgba(255,255,255,${det.alpha})`
            ctx.font = 'bold 10px JetBrains Mono, monospace'
            ctx.textAlign = 'left'
            ctx.fillText(`${det.label} ${det.confidence}% | ${det.trackId}`, det.x + 4, det.y - 5)
          })
          
          // Grid overlay
          ctx.strokeStyle = 'rgba(0,255,136,0.04)'
          ctx.lineWidth = 0.5
          for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke() }
          for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke() }
          
          // Corner UI
          ctx.fillStyle = 'rgba(0,255,136,0.6)'
          ctx.font = '10px JetBrains Mono'
          ctx.textAlign = 'left'
          ctx.fillText(`[${camera.id}]`, 8, 16)
          ctx.textAlign = 'right'
          ctx.fillText(new Date().toTimeString().slice(0, 8), W - 8, 16)
          
          // YOLO watermark
          ctx.fillStyle = 'rgba(255,255,255,0.08)'
          ctx.font = 'bold 40px Rajdhani'
          ctx.textAlign = 'center'
          ctx.fillText('YOLOv8', W / 2, H / 2)
          ctx.font = '11px JetBrains Mono'
          ctx.fillText('LIVE DETECTION', W / 2, H / 2 + 24)
          
          animRef.current = requestAnimationFrame(drawVideo)
        }
        
        drawVideo()
      }
      
      initVideo()
      return () => cancelAnimationFrame(animRef.current)
    }
    
    // For Camera 3 (index 2) - use video with zebra tracking
    if (index === 2) {
      if (!video) return
      
      // Initialize video when ready
      const initVideo = () => {
        video.muted = true
        video.loop = true
        video.playsInline = true
        
        const startWhenReady = () => {
          if (video.readyState >= 2) {
            video.play().catch(err => {
              console.log('Video autoplay failed, trying again:', err)
              setTimeout(() => video.play(), 100)
            })
            startVideoLoop()
          } else {
            setTimeout(startWhenReady, 100)
          }
        }
        
        video.addEventListener('loadeddata', startWhenReady, { once: true })
        video.load()
      }
      
      const startVideoLoop = () => {
        state.detections = []
        state.nextDet = 0
        state.zebraPos = { x: 320, y: 180, w: 100, h: 70 }
        
        let t = 0
        function drawVideo() {
          t += 0.016
          state.time = t
          
          // Ensure video is playing and has valid frame
          if (video.readyState >= 2) {
            // Restart video if it stopped
            if (video.paused || video.ended) {
              video.currentTime = 0
              video.play().catch(() => {})
            }
            try {
              ctx.drawImage(video, 0, 0, W, H)
            } catch (e) {
              // Fallback to last good frame if drawing fails
              console.log('Video draw error, continuing...')
            }
          }
          
          // Simulate zebra movement with realistic path
          const time = t * 0.4
          state.zebraPos.x = 320 + Math.sin(time) * 90 + Math.cos(time * 1.8) * 40
          state.zebraPos.y = 180 + Math.sin(time * 1.4) * 25 + Math.sin(time * 0.9) * 12
          state.zebraPos.w = 250 + Math.sin(time * 2.3) * 30
          state.zebraPos.h = 200 + Math.cos(time * 2.1) * 25
          
          // Generate zebra detections
          const now = Date.now()
          if (now > state.nextDet) {
            state.nextDet = now + 1800 + Math.random() * 2800
            const confidence = Math.round((0.88 + Math.random() * 0.11) * 100)
            
            state.detections = [{
              x: state.zebraPos.x - state.zebraPos.w / 2,
              y: state.zebraPos.y - state.zebraPos.h / 2,
              w: state.zebraPos.w,
              h: state.zebraPos.h,
              label: 'Zebra',
              confidence,
              danger: false,
              trackId: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
              alpha: 1,
              born: now,
            }, ...state.detections.slice(0, 2)]
            setLatestDet({ animal: 'Zebra', confidence, danger: false })
          }
          
          // Draw YOLO bounding boxes
          state.detections.forEach((det, i) => {
            const age = (now - det.born) / 5000
            det.alpha = Math.max(0, 1 - age)
            if (det.alpha <= 0) return
            
            const color = det.danger ? `rgba(255,51,51,${det.alpha})` : `rgba(0,255,136,${det.alpha})`
            
            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.strokeRect(det.x, det.y, det.w, det.h)
            
            // Corner accents
            const cLen = 18
            ctx.lineWidth = 3.5
            ;[
              [det.x, det.y, cLen, 0, 0, cLen],
              [det.x + det.w, det.y, -cLen, 0, 0, cLen],
              [det.x, det.y + det.h, cLen, 0, 0, -cLen],
              [det.x + det.w, det.y + det.h, -cLen, 0, 0, -cLen],
            ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
              ctx.beginPath()
              ctx.moveTo(cx + dx1, cy + dy1)
              ctx.lineTo(cx, cy)
              ctx.lineTo(cx + dx2, cy + dy2)
              ctx.stroke()
            })
            
            // Label background
            const labelH = 18
            ctx.fillStyle = det.danger ? `rgba(255,51,51,${det.alpha * 0.85})` : `rgba(0,40,20,${det.alpha * 0.85})`
            ctx.fillRect(det.x, det.y - labelH, det.w, labelH)
            
            // Label text
            ctx.fillStyle = `rgba(255,255,255,${det.alpha})`
            ctx.font = 'bold 10px JetBrains Mono, monospace'
            ctx.textAlign = 'left'
            ctx.fillText(`${det.label} ${det.confidence}% | ${det.trackId}`, det.x + 4, det.y - 5)
          })
          
          // Grid overlay
          ctx.strokeStyle = 'rgba(0,255,136,0.04)'
          ctx.lineWidth = 0.5
          for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke() }
          for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke() }
          
          // Corner UI
          ctx.fillStyle = 'rgba(0,255,136,0.6)'
          ctx.font = '10px JetBrains Mono'
          ctx.textAlign = 'left'
          ctx.fillText(`[${camera.id}]`, 8, 16)
          ctx.textAlign = 'right'
          ctx.fillText(new Date().toTimeString().slice(0, 8), W - 8, 16)
          
          // YOLO watermark
          ctx.fillStyle = 'rgba(255,255,255,0.08)'
          ctx.font = 'bold 40px Rajdhani'
          ctx.textAlign = 'center'
          ctx.fillText('YOLOv8', W / 2, H / 2)
          ctx.font = '11px JetBrains Mono'
          ctx.fillText('LIVE DETECTION', W / 2, H / 2 + 24)
          
          animRef.current = requestAnimationFrame(drawVideo)
        }
        
        drawVideo()
      }
      
      initVideo()
      return () => cancelAnimationFrame(animRef.current)
    }
    
    // For other cameras - use original simulation
    state.movers = Array.from({ length: 3 }, (_, i) => ({
      emoji: theme.animals[i],
      x: Math.random() * W,
      y: H * 0.4 + Math.random() * H * 0.35,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 28 + Math.random() * 20,
      bob: Math.random() * Math.PI * 2,
    }))

    state.detections = []
    state.nextDet = 0

    let t = 0
    function draw() {
      t += 0.016
      state.time = t

      // Simulate forest scene
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, theme.bg1)
      bg.addColorStop(1, theme.bg2)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Stars/noise
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for (let i = 0; i < 60; i++) {
        ctx.fillRect((i * 137) % W, (i * 89) % H, 1, 1)
      }

      // Trees silhouettes
      for (let i = 0; i < 12; i++) {
        const tx = (i * W / 11)
        const th = 80 + (i * 37) % 80
        const sway = Math.sin(t * 0.5 + i) * 2
        ctx.fillStyle = `rgba(0,0,0,${0.6 + (i % 3) * 0.1})`
        ctx.beginPath()
        ctx.moveTo(tx - 8, H * 0.8)
        ctx.lineTo(tx + 8, H * 0.8)
        ctx.lineTo(tx + 4 + sway, H * 0.8 - th)
        ctx.lineTo(tx - 4 + sway, H * 0.8 - th)
        ctx.closePath()
        ctx.fill()

        // Foliage blob
        ctx.fillStyle = `rgba(0,${40 + (i % 5) * 10},0,0.5)`
        ctx.beginPath()
        ctx.arc(tx + sway, H * 0.8 - th, 25 + (i % 4) * 8, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ground
      ctx.fillStyle = `rgba(0,0,0,0.4)`
      ctx.fillRect(0, H * 0.78, W, H * 0.22)

      // Scan line
      const scanY = (t * 80) % H
      const scanGrad = ctx.createLinearGradient(0, scanY - 3, 0, scanY + 3)
      scanGrad.addColorStop(0, 'rgba(0,255,136,0)')
      scanGrad.addColorStop(0.5, 'rgba(0,255,136,0.15)')
      scanGrad.addColorStop(1, 'rgba(0,255,136,0)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY, W, 3)

      // Move and draw animals
      state.movers.forEach((m, mi) => {
        m.x += m.vx
        m.y += m.vy
        m.bob += 0.07
        if (m.x < 0 || m.x > W) m.vx *= -1
        if (m.y < H * 0.35 || m.y > H * 0.78) m.vy *= -1

        ctx.save()
        ctx.font = `${m.size}px serif`
        ctx.textAlign = 'center'
        ctx.fillText(m.emoji, m.x, m.y + Math.sin(m.bob) * 3)
        ctx.restore()
      })

      // Draw YOLO bounding boxes
      const now = Date.now()
      if (now > state.nextDet) {
        state.nextDet = now + 3000 + Math.random() * 5000
        const m = state.movers[Math.floor(Math.random() * state.movers.length)]
        const confidence = Math.round((0.75 + Math.random() * 0.24) * 100)
        const animalNames = { '🐯': 'Tiger', '🦌': 'Deer', '🐘': 'Elephant', '🦁': 'Lion', '🐆': 'Leopard', '🦒': 'Giraffe', '🐺': 'Wolf', '🦓': 'Zebra', '🐻': 'Bear' }
        const animal = animalNames[m.emoji] || 'Unknown'
        const danger = ['Tiger', 'Lion', 'Leopard', 'Wolf', 'Bear'].includes(animal)
        state.detections = [{
          x: m.x - m.size * 0.8,
          y: m.y - m.size * 1.2,
          w: m.size * 1.6,
          h: m.size * 1.8,
          label: animal,
          confidence,
          danger,
          trackId: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
          alpha: 1,
          born: now,
        }, ...state.detections.slice(0, 3)]
        setLatestDet({ animal, confidence, danger })
      }

      // Render bounding boxes
      state.detections.forEach((det, i) => {
        const age = (now - det.born) / 6000
        det.alpha = Math.max(0, 1 - age)
        if (det.alpha <= 0) return

        const color = det.danger ? `rgba(255,51,51,${det.alpha})` : `rgba(0,255,136,${det.alpha})`

        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(det.x, det.y, det.w, det.h)

        // Corner accents
        const cLen = 12
        ctx.lineWidth = 2.5
        ;[
          [det.x, det.y, cLen, 0, 0, cLen],
          [det.x + det.w, det.y, -cLen, 0, 0, cLen],
          [det.x, det.y + det.h, cLen, 0, 0, -cLen],
          [det.x + det.w, det.y + det.h, -cLen, 0, 0, -cLen],
        ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
          ctx.beginPath()
          ctx.moveTo(cx + dx1, cy + dy1)
          ctx.lineTo(cx, cy)
          ctx.lineTo(cx + dx2, cy + dy2)
          ctx.stroke()
        })

        // Label background
        const labelH = 18
        ctx.fillStyle = det.danger ? `rgba(255,51,51,${det.alpha * 0.85})` : `rgba(0,40,20,${det.alpha * 0.85})`
        ctx.fillRect(det.x, det.y - labelH, det.w, labelH)

        // Label text
        ctx.fillStyle = `rgba(255,255,255,${det.alpha})`
        ctx.font = 'bold 10px JetBrains Mono, monospace'
        ctx.textAlign = 'left'
        ctx.fillText(`${det.label} ${det.confidence}% | ${det.trackId}`, det.x + 4, det.y - 5)
      })

      // Grid overlay
      ctx.strokeStyle = 'rgba(0,255,136,0.04)'
      ctx.lineWidth = 0.5
      for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke() }
      for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke() }

      // Corner UI
      ctx.fillStyle = 'rgba(0,255,136,0.6)'
      ctx.font = '10px JetBrains Mono'
      ctx.textAlign = 'left'
      ctx.fillText(`[${camera.id}]`, 8, 16)
      ctx.textAlign = 'right'
      ctx.fillText(new Date().toTimeString().slice(0, 8), W - 8, 16)

      // YOLO watermark
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.font = 'bold 40px Rajdhani'
      ctx.textAlign = 'center'
      ctx.fillText('YOLOv8', W / 2, H / 2)
      ctx.font = '11px JetBrains Mono'
      ctx.fillText('LIVE DETECTION', W / 2, H / 2 + 24)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [active, index])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-lg"
        style={{ display: 'block', aspectRatio: '16/9' }}
      />
      {/* Hidden video element for Camera 1 */}
      {index === 0 && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        >
          <source src="/tiger.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Hidden video element for Camera 2 */}
      {index === 1 && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        >
          <source src="/elephant.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Hidden video element for Camera 3 */}
      {index === 2 && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        >
          <source src="/zebra.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Overlay info */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        <div className="live-indicator glass-card px-2 py-1 text-[10px]">
          <div className="live-dot" style={{ width: 5, height: 5 }} />
          <span>LIVE</span>
        </div>
        {latestDet && (
          <div className={`glass-card px-2 py-1 text-[10px] font-mono ${latestDet.danger ? 'border-red-500/40 text-red-400' : 'border-green-500/40 text-green-400'}`}>
            {latestDet.animal} {latestDet.confidence}%
          </div>
        )}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none">
        <span className="font-mono text-[10px] text-gray-400 glass-card px-2 py-1">{camera.name}</span>
        <span className="font-mono text-[10px] text-gray-500 glass-card px-2 py-1">{camera.location}</span>
      </div>
    </div>
  )
}

export default function LiveFeedPage() {
  const [activeCamera, setActiveCamera] = useState(0)
  const [detections, setDetections] = useState([])
  const [gridView, setGridView] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate detections for all three cameras to ensure variety in live detection panel
      const cameraIndex = Math.floor(Math.random() * 3)
      setDetections(prev => [generateCameraDetection(cameraIndex), ...prev.slice(0, 49)])
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 grid-bg min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-wide">LIVE CAMERA FEEDS</h2>
          <p className="text-gray-500 text-sm font-mono mt-0.5">YOLOv8 · Real-time detection overlay active</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGridView(!gridView)}
            className={`text-xs font-mono px-4 py-2 rounded-lg border transition-all ${gridView ? 'border-wild-green/50 text-wild-green bg-wild-green/10' : 'border-wild-border text-gray-500 hover:border-gray-600'}`}
          >
            {gridView ? '▣ GRID' : '⊟ SINGLE'}
          </button>
        </div>
      </div>

      {!gridView ? (
        <div className="grid grid-cols-12 gap-6">
          {/* Main feed */}
          <div className="col-span-8">
            <div className="glass-card p-3 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="live-indicator">
                    <div className="live-dot" />
                    <span className="text-xs">ACTIVE CAMERA</span>
                  </div>
                  <span className="font-display font-bold text-white">{CAMERAS[activeCamera].name}</span>
                </div>
                <div className="flex gap-2">
                  {CAMERAS.map((c, i) => (
                    <button key={c.id} onClick={() => setActiveCamera(i)}
                      className={`text-[10px] font-mono px-3 py-1.5 rounded border transition-all ${i === activeCamera ? 'border-wild-green/50 text-wild-green bg-wild-green/10' : 'border-wild-border text-gray-500 hover:text-gray-400'}`}>
                      {c.id}
                    </button>
                  ))}
                </div>
              </div>
              <CameraFeed camera={CAMERAS[activeCamera]} active={true} index={activeCamera} />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {CAMERAS.map((cam, i) => (
                <div key={cam.id}
                  onClick={() => setActiveCamera(i)}
                  className={`glass-card p-2 cursor-pointer transition-all ${i === activeCamera ? 'neon-border' : 'hover:border-gray-600'}`}>
                  <CameraFeed camera={cam} active={true} index={i} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-400">{cam.id}</span>
                    <div className="live-indicator">
                      <div className="live-dot" style={{ width: 5, height: 5 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detection log panel */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="glass-card p-4 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white text-sm tracking-wide">LIVE DETECTIONS</h3>
                <span className="confidence-high">{detections.length} TOTAL</span>
              </div>
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '600px' }}>
                {detections.length === 0 && (
                  <div className="text-center text-gray-600 py-8 font-mono text-xs">Waiting for detections...</div>
                )}
                {detections.map((det, i) => (
                  <div key={det.id} className={`rounded-lg p-3 text-xs transition-all animate-fadeUp ${det.danger ? 'alert-danger' : 'glass-card border-wild-border'}`}
                    style={{ animationDelay: `${i * 20}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{det.emoji}</span>
                        <span className={`font-display font-bold ${det.danger ? 'text-wild-red' : 'text-white'}`}>
                          {det.animal}
                        </span>
                        {det.danger && <span className="danger-badge text-[9px]">DANGER</span>}
                      </div>
                      <span className={det.confidence >= 90 ? 'confidence-high' : det.confidence >= 80 ? 'confidence-med' : 'confidence-low'}>
                        {det.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-gray-500">
                      <span>{det.camera} · {det.location}</span>
                      <span>{det.trackId}</span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-600 mt-0.5">
                      {new Date(det.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid view - all 3 cameras */
        <div className="grid grid-cols-3 gap-4">
          {CAMERAS.map((cam, i) => (
            <div key={cam.id} className="glass-card p-3">
              <CameraFeed camera={cam} active={true} index={i} />
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display font-semibold text-white text-sm">{cam.name}</span>
                <div className="live-indicator"><div className="live-dot" /><span className="text-[10px]">LIVE</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
