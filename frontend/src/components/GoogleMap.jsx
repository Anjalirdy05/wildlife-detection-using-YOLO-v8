import React, { useEffect, useRef, useState } from 'react'
import FallbackMap from './FallbackMap'

// Indian forest location (Jim Corbett National Park)
const FOREST_CENTER = { lat: 29.5300, lng: 78.7800 }
const ANIMAL_LOCATIONS = [
  // Tiger locations
  { lat: 29.5320, lng: 78.7820, animal: 'Tiger', emoji: '🐯', danger: true, trackId: 'TRK-1234' },
  { lat: 29.5280, lng: 78.7750, animal: 'Tiger', emoji: '🐯', danger: true, trackId: 'TRK-1235' },
  
  // Elephant locations
  { lat: 29.5350, lng: 78.7780, animal: 'Elephant', emoji: '🐘', danger: false, trackId: 'TRK-2234' },
  { lat: 29.5270, lng: 78.7850, animal: 'Elephant', emoji: '🐘', danger: false, trackId: 'TRK-2235' },
  
  // Deer locations
  { lat: 29.5310, lng: 78.7790, animal: 'Deer', emoji: '🦌', danger: false, trackId: 'TRK-3234' },
  { lat: 29.5290, lng: 78.7830, animal: 'Deer', emoji: '🦌', danger: false, trackId: 'TRK-3235' },
  { lat: 29.5330, lng: 78.7760, animal: 'Deer', emoji: '🦌', danger: false, trackId: 'TRK-3236' },
  
  // Leopard locations
  { lat: 29.5305, lng: 78.7815, animal: 'Leopard', emoji: '🐆', danger: true, trackId: 'TRK-4234' },
  
  // Bear locations
  { lat: 29.5260, lng: 78.7770, animal: 'Bear', emoji: '🐻', danger: true, trackId: 'TRK-5234' },
  
  // Zebra locations
  { lat: 29.5340, lng: 78.7840, animal: 'Zebra', emoji: '🦓', danger: false, trackId: 'TRK-6234' },
]

// Camera locations
const CAMERA_LOCATIONS = [
  { lat: 29.5315, lng: 78.7805, id: 'CAM-001', name: 'North Perimeter' },
  { lat: 29.5285, lng: 78.7825, id: 'CAM-002', name: 'Water Hole Alpha' },
  { lat: 29.5325, lng: 78.7775, id: 'CAM-003', name: 'South Trail Gate' },
]

function GoogleMap({ detections, onAnimalClick }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loadError, setLoadError] = useState(true) // Set to true immediately to use fallback

  useEffect(() => {
    // Set timeout for Google Maps loading
    const timeout = setTimeout(() => {
      if (!mapLoaded) {
        setLoadError(true)
      }
    }, 10000) // 10 second timeout

    const initMap = () => {
      if (mapInstanceRef.current) return

      try {
        // Create map instance
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: FOREST_CENTER,
          zoom: 15,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{ "color": "#0a1f08" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#00ff88" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#010a01" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#003d1a" }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#0d2d0d" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#1a3d1a" }]
            }
          ],
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            style: window.google.maps.ZoomControlStyle.SMALL,
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM
          }
        })

        setMapLoaded(true)
        clearTimeout(timeout)
      } catch (error) {
        console.error('Google Maps initialization error:', error)
        setLoadError(true)
        clearTimeout(timeout)
      }
    }

    // Initialize map when Google Maps API is ready
    if (window.google && window.google.maps) {
      initMap()
    } else {
      // Wait for Google Maps to load
      window.initMaps = initMap
    }

    return () => {
      clearTimeout(timeout)
      if (window.initMaps) {
        delete window.initMaps
      }
    }
  }, [mapLoaded])

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add animal markers
    ANIMAL_LOCATIONS.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
        title: `${location.animal} - ${location.trackId}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${location.danger ? '#ff3333' : '#00ff88'}" fill-opacity="0.8"/>
              <circle cx="16" cy="16" r="12" fill="${location.danger ? '#cc0000' : '#00cc66'}" fill-opacity="0.9"/>
              <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">${location.emoji}</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      })

      marker.addListener('click', () => {
        if (onAnimalClick) {
          onAnimalClick(location)
        }
      })

      markersRef.current.push(marker)
    })

    // Add camera markers
    CAMERA_LOCATIONS.forEach(camera => {
      const marker = new window.google.maps.Marker({
        position: { lat: camera.lat, lng: camera.lng },
        map: mapInstanceRef.current,
        title: `${camera.id} - ${camera.name}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="24" height="24" rx="4" fill="#00ff88" fill-opacity="0.8"/>
              <rect x="6" y="6" width="20" height="20" rx="3" fill="#00cc66" fill-opacity="0.9"/>
              <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">?</text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      })

      markersRef.current.push(marker)
    })

    // Simulate animal movement
    const movementInterval = setInterval(() => {
      markersRef.current.slice(0, ANIMAL_LOCATIONS.length).forEach((marker, index) => {
        const location = ANIMAL_LOCATIONS[index]
        const newLat = location.lat + (Math.random() - 0.5) * 0.001
        const newLng = location.lng + (Math.random() - 0.5) * 0.001
        marker.setPosition({ lat: newLat, lng: newLng })
      })
    }, 3000)

    return () => {
      clearInterval(movementInterval)
    }
  }, [mapLoaded, onAnimalClick])

  if (loadError) {
    return (
      <div className="w-full h-full rounded-lg relative overflow-hidden" style={{ minHeight: '500px' }}>
        {/* Use uploaded Central India forest map */}
        <img 
          src="/images/central_india_forest_map.png" 
          alt="Central India Forest Map" 
          className="w-full h-full"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            objectFit: 'contain',
            backgroundColor: '#0a1f08'
          }}
          onLoad={() => console.log('Map loaded successfully')}
          onError={(e) => {
            console.log('Map image failed to load, using fallback');
            e.target.style.display = 'none';
            e.target.parentElement.style.background = '#0a1f08';
          }}
        />
        
        {/* Overlay for animal markers */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 500">
          {/* Animal markers in different locations across Central India */}
          
          {/* Tigers in Madhya Pradesh */}
          <circle cx="280" cy="200" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="280" cy="200" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="320" cy="180" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="320" cy="180" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Elephants in Chhattisgarh */}
          <circle cx="450" cy="250" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="450" cy="250" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="480" cy="270" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="480" cy="270" r="12" fill="rgba(0,204,102,0.9)"/>
          
          {/* Deer in Jharkhand */}
          <circle cx="550" cy="180" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="550" cy="180" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="580" cy="200" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="580" cy="200" r="12" fill="rgba(0,204,102,0.9)"/>
          
          {/* Leopards in Maharashtra */}
          <circle cx="200" cy="280" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="200" cy="280" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Bears in Odisha region */}
          <circle cx="650" cy="220" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="650" cy="220" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Zebras in reserves */}
          <circle cx="380" cy="150" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="380" cy="150" r="12" fill="rgba(0,204,102,0.9)"/>
          
          {/* Lions in Gujarat region */}
          <circle cx="150" cy="350" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="150" cy="350" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Rhinos in Assam region */}
          <circle cx="700" cy="150" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="700" cy="150" r="12" fill="rgba(0,204,102,0.9)"/>
          
          {/* Additional animals near cameras and across the map */}
          
          {/* Near CAM-001 - Madhya Pradesh */}
          <circle cx="250" cy="170" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="250" cy="170" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="340" cy="210" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="340" cy="210" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="270" cy="220" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="270" cy="220" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="330" cy="160" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="330" cy="160" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="290" cy="150" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="290" cy="150" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="310" cy="230" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="310" cy="230" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="260" cy="190" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="260" cy="190" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Near CAM-002 - Chhattisgarh */}
          <circle cx="430" cy="240" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="430" cy="240" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="500" cy="280" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="500" cy="280" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="440" cy="290" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="440" cy="290" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="490" cy="230" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="490" cy="230" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="470" cy="250" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="470" cy="250" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="510" cy="260" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="510" cy="260" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="450" cy="220" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="450" cy="220" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Near CAM-003 - Jharkhand */}
          <circle cx="530" cy="170" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="530" cy="170" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="600" cy="210" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="600" cy="210" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="590" cy="160" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="590" cy="160" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="540" cy="220" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="540" cy="220" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="570" cy="180" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="570" cy="180" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="610" cy="190" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="610" cy="190" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="550" cy="150" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="550" cy="150" r="12" fill="rgba(204,0,0,0.9)"/>
          
          {/* Additional animals across the map */}
          
          {/* Central region animals */}
          <circle cx="400" cy="200" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="400" cy="200" r="12" fill="rgba(0,204,102,0.9)"/>
          
          <circle cx="420" cy="180" r="14" fill="rgba(255,51,51,0.8)"/>
          <circle cx="420" cy="180" r="12" fill="rgba(204,0,0,0.9)"/>
          
          <circle cx="380" cy="220" r="14" fill="rgba(0,255,136,0.8)"/>
          <circle cx="380" cy="220" r="12" fill="rgba(0,204,102,0.9)"/>
          
                    
          {/* Camera markers in different states */}
          
          {/* CAM-001 - Madhya Pradesh */}
          <circle cx="300" cy="190" r="70" fill="none" stroke="rgba(0,100,200,0.4)" strokeDasharray="3,6"/>
          <circle cx="300" cy="190" r="12" fill="rgba(0,50,150,0.8)" stroke="rgba(0,100,200,0.9)"/>
          <text x="300" y="200" textAnchor="middle" fill="#00008B" fontSize="14" fontWeight="bold">CAMERA</text>
          <text x="300" y="218" textAnchor="middle" fill="#1E90FF" fontSize="9">CAM-001</text>
          <text x="300" y="234" textAnchor="middle" fill="rgba(65,105,225,0.9)" fontSize="8">Madhya Pradesh</text>
          
          {/* CAM-002 - Chhattisgarh */}
          <circle cx="465" cy="260" r="70" fill="none" stroke="rgba(0,100,200,0.4)" strokeDasharray="3,6"/>
          <circle cx="465" cy="260" r="12" fill="rgba(0,50,150,0.8)" stroke="rgba(0,100,200,0.9)"/>
          <text x="465" y="270" textAnchor="middle" fill="#00008B" fontSize="14" fontWeight="bold">CAMERA</text>
          <text x="465" y="288" textAnchor="middle" fill="#1E90FF" fontSize="9">CAM-002</text>
          <text x="465" y="304" textAnchor="middle" fill="rgba(65,105,225,0.9)" fontSize="8">Chhattisgarh</text>
          
          {/* CAM-003 - Jharkhand */}
          <circle cx="565" cy="190" r="70" fill="none" stroke="rgba(0,100,200,0.4)" strokeDasharray="3,6"/>
          <circle cx="565" cy="190" r="12" fill="rgba(0,50,150,0.8)" stroke="rgba(0,100,200,0.9)"/>
          <text x="565" y="200" textAnchor="middle" fill="#00008B" fontSize="14" fontWeight="bold">CAMERA</text>
          <text x="565" y="214" textAnchor="middle" fill="#1E90FF" fontSize="9">CAM-003</text>
          <text x="565" y="230" textAnchor="middle" fill="rgba(65,105,225,0.9)" fontSize="8">Jharkhand</text>
          
          {/* Title */}
          <text x="400" y="30" textAnchor="middle" fill="#00ff88" fontSize="16" fontWeight="bold">CENTRAL INDIA FOREST TRACKING</text>
          <text x="400" y="50" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12">Madhya Pradesh · Chhattisgarh · Jharkhand</text>
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
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-blue-400">CAMERA</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    />
  )
}

export default GoogleMap
