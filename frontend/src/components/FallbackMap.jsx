import React, { useState, useEffect } from 'react'

// Simple SVG fallback map
function FallbackMap({ detections, onAnimalClick }) {
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  const animalLocations = [
    // Madhya Pradesh forests (tigers)
    { x: 280, y: 200, animal: 'Tiger', emoji: '??', danger: true, trackId: 'TRK-1234' },
    { x: 320, y: 180, animal: 'Tiger', emoji: '??', danger: true, trackId: 'TRK-1235' },
    
    // Central India elephants
    { x: 350, y: 220, animal: 'Elephant', emoji: '??', danger: false, trackId: 'TRK-2234' },
    { x: 300, y: 240, animal: 'Elephant', emoji: '??', danger: false, trackId: 'TRK-2235' },
    
    // Deer populations
    { x: 380, y: 190, animal: 'Deer', emoji: '??', danger: false, trackId: 'TRK-3234' },
    { x: 400, y: 210, animal: 'Deer', emoji: '??', danger: false, trackId: 'TRK-3235' },
    { x: 260, y: 230, animal: 'Deer', emoji: '??', danger: false, trackId: 'TRK-3236' },
    
    // Leopard territories
    { x: 420, y: 200, animal: 'Leopard', emoji: '??', danger: true, trackId: 'TRK-4234' },
    
    // Bear habitats
    { x: 340, y: 160, animal: 'Bear', emoji: '??', danger: true, trackId: 'TRK-5234' },
    
    // Zebra (in reserves)
    { x: 360, y: 250, animal: 'Zebra', emoji: '??', danger: false, trackId: 'TRK-6234' },
  ]

  const cameraLocations = [
    { x: 300, y: 180, id: 'CAM-001', name: 'Madhya Pradesh Reserve' },
    { x: 380, y: 220, id: 'CAM-002', name: 'Central Forest Zone' },
    { x: 340, y: 200, id: 'CAM-003', name: 'Wildlife Corridor' },
  ]

  return (
    <div className="w-full h-full rounded-lg relative overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Forest background with India map */}
      <img 
        src="/images/central_india_forest_map.png" 
        alt="Central India Forest Map" 
        className="w-full h-full object-cover"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      
      {/* Overlay for animal markers */}
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 500">
        
                
        {/* Camera zones */}
        {cameraLocations.map((camera, i) => (
          <g key={camera.id}>
            <circle cx={camera.x} cy={camera.y} r="70" fill="none" stroke="rgba(0,255,136,0.2)" strokeDasharray="3,6"/>
            <circle cx={camera.x} cy={camera.y} r="12" fill="rgba(0,255,136,0.15)" stroke="rgba(0,255,136,0.6)"/>
            <text x={camera.x} y={camera.y + 4} textAnchor="middle" fill="#00ff88" fontSize="11">?</text>
            <text x={camera.x} y={camera.y + 24} textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize="9">{camera.id}</text>
          </g>
        ))}
        
        {/* Animal markers */}
        {animalLocations.map((animal, i) => (
          <g key={animal.trackId} onClick={() => onAnimalClick && onAnimalClick(animal)} style={{ cursor: 'pointer' }}>
            <circle cx={animal.x} cy={animal.y} r="14" fill={animal.danger ? 'rgba(255,51,51,0.8)' : 'rgba(0,255,136,0.8)'}/>
            <circle cx={animal.x} cy={animal.y} r="12" fill={animal.danger ? 'rgba(204,0,0,0.9)' : 'rgba(0,204,102,0.9)'}/>
            <text x={animal.x} y={animal.y + 4} textAnchor="middle" fill="white" fontSize="12">{animal.emoji}</text>
            {animal.danger && (
              <circle cx={animal.x} cy={animal.y} r="20" fill="none" stroke="rgba(255,51,51,0.5)" strokeWidth="1"/>
            )}
          </g>
        ))}
        
        {/* Title */}
        <text x="400" y="30" textAnchor="middle" fill="#00ff88" fontSize="16" fontWeight="bold">CENTRAL INDIA FOREST TRACKING</text>
        <text x="400" y="50" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">Madhya Pradesh · Chhattisgarh · Jharkhand</text>
        
        {/* Legend */}
        <text x="20" y="480" fill="rgba(255,255,255,0.4)" fontSize="10">LIVE WILDLIFE MONITORING</text>
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-3">
        <div className="text-xs font-mono space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-red-400">DANGER</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-green-400">SAFE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>?</span>
            <span className="text-gray-400">CAMERA</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FallbackMap
