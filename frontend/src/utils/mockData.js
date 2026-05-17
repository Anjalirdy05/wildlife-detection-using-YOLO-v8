export const ANIMALS = [
  { name: 'Tiger', emoji: '🐯', danger: true, color: '#ff3333', icon: '⚠️' },
  { name: 'Elephant', emoji: '🐘', danger: false, color: '#ffaa00', icon: '🔔' },
  { name: 'Leopard', emoji: '🐆', danger: true, color: '#ff3333', icon: '⚠️' },
  { name: 'Lion', emoji: '🦁', danger: true, color: '#ff3333', icon: '⚠️' },
  { name: 'Deer', emoji: '🦌', danger: false, color: '#00ff88', icon: '✅' },
  { name: 'Zebra', emoji: '🦓', danger: false, color: '#00aaff', icon: '✅' },
  { name: 'Giraffe', emoji: '🦒', danger: false, color: '#ffaa00', icon: '🔔' },
  { name: 'Wolf', emoji: '🐺', danger: true, color: '#ff6600', icon: '⚠️' },
  { name: 'Bear', emoji: '🐻', danger: true, color: '#ff3333', icon: '⚠️' },
  { name: 'Rhinoceros', emoji: '🦏', danger: false, color: '#ffaa00', icon: '🔔' },
]

export const CAMERAS = [
  { id: 'CAM-001', name: 'North Perimeter', location: 'Sector A-1', lat: 28.6139, lng: 77.2090 },
  { id: 'CAM-002', name: 'Water Hole Alpha', location: 'Sector B-3', lat: 28.6200, lng: 77.2150 },
  { id: 'CAM-003', name: 'South Trail Gate', location: 'Sector C-2', lat: 28.6080, lng: 77.2010 },
]

let detectionId = 1000

export function generateDetection() {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const camera = CAMERAS[Math.floor(Math.random() * CAMERAS.length)]
  const confidence = Math.round((0.72 + Math.random() * 0.27) * 100)
  return {
    id: `DET-${++detectionId}`,
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

export function generateHistoricalData(count = 20) {
  const data = []
  for (let i = count; i >= 0; i--) {
    const d = new Date()
    d.setMinutes(d.getMinutes() - i * 3)
    data.push({
      ...generateDetection(),
      timestamp: d,
    })
  }
  return data
}

export const MOCK_USERS = [
  { email: 'admin@wildeye.ai', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'ranger@wildeye.ai', password: 'ranger123', role: 'ranger', name: 'Field Ranger' },
]

export function getAnimalStats(detections) {
  const counts = {}
  ANIMALS.forEach(a => counts[a.name] = 0)
  detections.forEach(d => {
    if (counts[d.animal] !== undefined) counts[d.animal]++
  })
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    emoji: ANIMALS.find(a => a.name === name)?.emoji,
  })).sort((a, b) => b.count - a.count)
}

export function getHourlyData(detections) {
  const hours = {}
  for (let h = 0; h < 24; h++) hours[h] = 0
  detections.forEach(d => {
    const hour = new Date(d.timestamp).getHours()
    hours[hour]++
  })
  return Object.entries(hours).map(([hour, count]) => ({
    hour: `${String(hour).padStart(2,'0')}:00`,
    detections: count,
    alerts: Math.floor(count * 0.3),
  }))
}
