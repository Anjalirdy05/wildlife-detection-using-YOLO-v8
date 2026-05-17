'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

/* ─── Realistic SVG Animals ─────────────────────────────── */

function Tiger({ scale = 1, flip = false }) {
  return (
    <svg width={180 * scale} height={100 * scale} viewBox="0 0 180 100" style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      {/* Body */}
      <ellipse cx="90" cy="62" rx="52" ry="28" fill="#D4832A" />
      {/* Belly */}
      <ellipse cx="90" cy="70" rx="35" ry="18" fill="#F2C07A" />
      {/* Stripes */}
      <path d="M70 42 Q75 55 68 68" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M83 40 Q88 54 82 70" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M96 40 Q101 54 96 70" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M109 42 Q113 55 110 68" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="145" cy="50" rx="26" ry="22" fill="#D4832A" />
      {/* Face markings */}
      <ellipse cx="145" cy="58" rx="16" ry="10" fill="#F2C07A" />
      {/* Ears */}
      <polygon points="126,32 119,20 132,28" fill="#D4832A" />
      <polygon points="162,32 168,20 155,28" fill="#D4832A" />
      <polygon points="127,31 121,22 131,27" fill="#C0392B" />
      <polygon points="161,31 167,22 156,27" fill="#C0392B" />
      {/* Eye */}
      <ellipse cx="138" cy="46" rx="5" ry="5.5" fill="#F0E68C" />
      <ellipse cx="138" cy="46" rx="2.5" ry="3.5" fill="#111" />
      <ellipse cx="153" cy="46" rx="5" ry="5.5" fill="#F0E68C" />
      <ellipse cx="153" cy="46" rx="2.5" ry="3.5" fill="#111" />
      {/* Nose */}
      <ellipse cx="145" cy="56" rx="4" ry="2.5" fill="#C0392B" />
      {/* Whiskers */}
      <line x1="150" y1="57" x2="170" y2="53" stroke="#fff" strokeWidth="1" />
      <line x1="150" y1="59" x2="170" y2="60" stroke="#fff" strokeWidth="1" />
      <line x1="140" y1="57" x2="120" y2="53" stroke="#fff" strokeWidth="1" />
      <line x1="140" y1="59" x2="120" y2="60" stroke="#fff" strokeWidth="1" />
      {/* Legs */}
      <rect x="68" y="82" width="14" height="22" rx="6" fill="#C4721A" />
      <rect x="88" y="84" width="14" height="20" rx="6" fill="#C4721A" />
      <rect x="108" y="82" width="14" height="22" rx="6" fill="#C4721A" />
      <rect x="128" y="84" width="14" height="20" rx="6" fill="#C4721A" />
      {/* Paws */}
      <ellipse cx="75" cy="104" rx="9" ry="5" fill="#B86010" />
      <ellipse cx="95" cy="104" rx="9" ry="5" fill="#B86010" />
      <ellipse cx="115" cy="104" rx="9" ry="5" fill="#B86010" />
      <ellipse cx="135" cy="104" rx="9" ry="5" fill="#B86010" />
      {/* Tail */}
      <path d="M38 60 Q15 45 8 30 Q4 20 12 18" stroke="#D4832A" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M38 60 Q15 45 8 30 Q4 20 12 18" stroke="#1a0a00" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
    </svg>
  )
}

function Elephant({ scale = 1 }) {
  return (
    <svg width={220 * scale} height={140 * scale} viewBox="0 0 220 140" style={{ overflow: 'visible' }}>
      {/* Body */}
      <ellipse cx="100" cy="85" rx="68" ry="48" fill="#7A8B8B" />
      {/* Belly */}
      <ellipse cx="100" cy="100" rx="45" ry="30" fill="#9AABAB" />
      {/* Head */}
      <ellipse cx="175" cy="60" rx="40" ry="35" fill="#7A8B8B" />
      {/* Trunk */}
      <path d="M180 88 Q195 105 190 120 Q188 132 178 135 Q168 138 165 128 Q162 118 172 110 Q178 103 175 92" fill="#6A7B7B" stroke="#5A6B6B" strokeWidth="1" />
      {/* Ears */}
      <ellipse cx="155" cy="52" rx="22" ry="30" fill="#6A7B7B" />
      <ellipse cx="157" cy="54" rx="14" ry="21" fill="#C08060" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="172" cy="50" rx="6" ry="6" fill="#2c1a0a" />
      <ellipse cx="172" cy="48" rx="2" ry="2" fill="#fff" opacity="0.7" />
      {/* Tusks */}
      <path d="M178 82 Q195 90 205 100 Q210 106 205 110 Q200 113 196 107 Q186 96 173 88" fill="#F5F0DC" />
      {/* Legs */}
      <rect x="45" y="118" width="22" height="32" rx="9" fill="#6A7B7B" />
      <rect x="75" y="120" width="22" height="30" rx="9" fill="#6A7B7B" />
      <rect x="108" y="118" width="22" height="32" rx="9" fill="#6A7B7B" />
      <rect x="138" y="120" width="22" height="30" rx="9" fill="#6A7B7B" />
      {/* Feet */}
      <ellipse cx="56" cy="150" rx="13" ry="6" fill="#5A6B6B" />
      <ellipse cx="86" cy="150" rx="13" ry="6" fill="#5A6B6B" />
      <ellipse cx="119" cy="150" rx="13" ry="6" fill="#5A6B6B" />
      <ellipse cx="149" cy="150" rx="13" ry="6" fill="#5A6B6B" />
      {/* Tail */}
      <path d="M32 80 Q18 85 15 98 Q13 108 20 112" stroke="#6A7B7B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="114" rx="5" ry="7" fill="#5A6B6B" />
    </svg>
  )
}

function Deer({ scale = 1, flip = false }) {
  return (
    <svg width={130 * scale} height={130 * scale} viewBox="0 0 130 130" style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      {/* Body */}
      <ellipse cx="60" cy="75" rx="38" ry="28" fill="#8B4513" />
      {/* Belly */}
      <ellipse cx="60" cy="85" rx="25" ry="16" fill="#C8956A" />
      {/* Neck */}
      <path d="M82 58 Q92 45 95 35" stroke="#8B4513" strokeWidth="18" fill="none" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="98" cy="28" rx="18" ry="16" fill="#8B4513" />
      {/* White muzzle */}
      <ellipse cx="108" cy="33" rx="9" ry="7" fill="#D4A574" />
      {/* Eyes */}
      <ellipse cx="95" cy="23" rx="5" ry="5" fill="#1a0800" />
      <ellipse cx="94" cy="21" rx="1.5" ry="1.5" fill="#fff" opacity="0.8" />
      {/* Nose */}
      <ellipse cx="112" cy="32" rx="3" ry="2" fill="#2a1008" />
      {/* Ears */}
      <ellipse cx="86" cy="18" rx="7" ry="12" fill="#8B4513" transform="rotate(-20,86,18)" />
      <ellipse cx="86" cy="18" rx="4" ry="8" fill="#C8956A" transform="rotate(-20,86,18)" />
      <ellipse cx="108" cy="16" rx="6" ry="11" fill="#8B4513" transform="rotate(15,108,16)" />
      <ellipse cx="108" cy="16" rx="3.5" ry="7" fill="#C8956A" transform="rotate(15,108,16)" />
      {/* Antlers */}
      <path d="M90 14 Q85 2 80 -4 M80 -4 Q76 -10 72 -8 M80 -4 Q82 -12 86 -12" stroke="#6B3410" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 12 Q108 0 112 -6 M112 -6 Q116 -12 120 -10 M112 -6 Q110 -14 106 -14" stroke="#6B3410" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Tail - white */}
      <ellipse cx="22" cy="62" rx="7" ry="9" fill="#fff" />
      {/* Legs */}
      <rect x="36" y="95" width="10" height="36" rx="4" fill="#7A3C0F" />
      <rect x="53" y="97" width="10" height="34" rx="4" fill="#7A3C0F" />
      <rect x="70" y="95" width="10" height="36" rx="4" fill="#7A3C0F" />
      <rect x="87" y="97" width="10" height="34" rx="4" fill="#7A3C0F" />
      {/* Hooves */}
      <rect x="34" y="128" width="14" height="6" rx="3" fill="#1a0800" />
      <rect x="51" y="128" width="14" height="6" rx="3" fill="#1a0800" />
      <rect x="68" y="128" width="14" height="6" rx="3" fill="#1a0800" />
      <rect x="85" y="128" width="14" height="6" rx="3" fill="#1a0800" />
      {/* Spots */}
      <circle cx="50" cy="68" r="4" fill="#A0532A" opacity="0.4" />
      <circle cx="65" cy="62" r="3" fill="#A0532A" opacity="0.4" />
      <circle cx="72" cy="72" r="4" fill="#A0532A" opacity="0.4" />
    </svg>
  )
}

function Leopard({ scale = 1 }) {
  return (
    <svg width={190 * scale} height={90 * scale} viewBox="0 0 190 90" style={{ overflow: 'visible' }}>
      {/* Body - sleek */}
      <ellipse cx="88" cy="55" rx="55" ry="24" fill="#C8A030" />
      {/* Belly */}
      <ellipse cx="88" cy="62" rx="36" ry="14" fill="#E8D080" />
      {/* Spots */}
      {[[55,45],[70,40],[85,38],[100,40],[115,45],[60,60],[78,58],[95,56],[110,58],[50,52],[120,52]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="none" stroke="#2a1800" strokeWidth="2.5" opacity="0.7" />
          <circle cx={x} cy={y} r="2" fill="#2a1800" opacity="0.4" />
        </g>
      ))}
      {/* Head - elongated */}
      <ellipse cx="150" cy="44" rx="28" ry="22" fill="#C8A030" />
      <ellipse cx="158" cy="52" rx="16" ry="10" fill="#E8D080" />
      {/* Ears */}
      <polygon points="132,28 126,16 140,24" fill="#C8A030" />
      <polygon points="132,27 128,18 138,23" fill="#1a0800" opacity="0.5" />
      <polygon points="166,28 172,16 160,24" fill="#C8A030" />
      <polygon points="166,27 171,18 162,23" fill="#1a0800" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="143" cy="40" rx="5" ry="5.5" fill="#90EE40" />
      <ellipse cx="143" cy="40" rx="2" ry="3.5" fill="#111" />
      <ellipse cx="157" cy="40" rx="5" ry="5.5" fill="#90EE40" />
      <ellipse cx="157" cy="40" rx="2" ry="3.5" fill="#111" />
      {/* Nose */}
      <ellipse cx="150" cy="51" rx="3.5" ry="2" fill="#1a0800" />
      {/* Whiskers */}
      <line x1="154" y1="52" x2="172" y2="48" stroke="#fff" strokeWidth="1" opacity="0.8" />
      <line x1="154" y1="54" x2="172" y2="56" stroke="#fff" strokeWidth="1" opacity="0.8" />
      {/* Legs */}
      <rect x="50" y="72" width="12" height="22" rx="5" fill="#B89020" />
      <rect x="70" y="74" width="12" height="20" rx="5" fill="#B89020" />
      <rect x="95" y="72" width="12" height="22" rx="5" fill="#B89020" />
      <rect x="115" y="74" width="12" height="20" rx="5" fill="#B89020" />
      {/* Tail - long curved */}
      <path d="M33 52 Q12 38 5 24 Q1 14 8 10 Q14 6 16 14" stroke="#C8A030" strokeWidth="7" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Wolf({ scale = 1, flip = false }) {
  return (
    <svg width={160 * scale} height={100 * scale} viewBox="0 0 160 100" style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}>
      {/* Body */}
      <ellipse cx="72" cy="62" rx="48" ry="28" fill="#8A8A7A" />
      {/* Belly */}
      <ellipse cx="72" cy="70" rx="30" ry="16" fill="#C0C0A8" />
      {/* Neck fur */}
      <path d="M100 50 Q112 40 118 32" stroke="#8A8A7A" strokeWidth="20" fill="none" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="125" cy="26" rx="26" ry="22" fill="#8A8A7A" />
      {/* Snout */}
      <path d="M135 34 Q148 36 154 30 Q158 25 154 20 Q150 16 140 20 Q136 24 135 30" fill="#6A6A5A" />
      {/* Eyes */}
      <ellipse cx="118" cy="20" rx="5" ry="5" fill="#E8C840" />
      <ellipse cx="118" cy="20" rx="2" ry="3" fill="#111" />
      <ellipse cx="132" cy="20" rx="5" ry="5" fill="#E8C840" />
      <ellipse cx="132" cy="20" rx="2" ry="3" fill="#111" />
      {/* Ears - pointed */}
      <polygon points="108,12 102,-2 116,8" fill="#8A8A7A" />
      <polygon points="108,11 104,0 113,8" fill="#8A4A4A" opacity="0.5" />
      <polygon points="136,10 140,-4 128,8" fill="#8A8A7A" />
      <polygon points="136,10 139,-2 130,8" fill="#8A4A4A" opacity="0.5" />
      {/* Nose */}
      <ellipse cx="153" cy="28" rx="4" ry="3" fill="#1a1a1a" />
      {/* Fur markings */}
      <path d="M95 45 Q105 55 98 68" stroke="#6A6A5A" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M82 42 Q90 52 85 68" stroke="#6A6A5A" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Legs */}
      <rect x="38" y="82" width="13" height="22" rx="5" fill="#7A7A6A" />
      <rect x="57" y="84" width="13" height="20" rx="5" fill="#7A7A6A" />
      <rect x="82" y="82" width="13" height="22" rx="5" fill="#7A7A6A" />
      <rect x="100" y="84" width="13" height="20" rx="5" fill="#7A7A6A" />
      {/* Tail - bushy */}
      <path d="M24 58 Q8 44 2 28" stroke="#8A8A7A" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M24 58 Q8 44 2 28" stroke="#C0C0A8" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

/* ─── Forest Layers ─────────────────────────────────────── */
function ForestBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          zIndex: 0
        }}>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

/* ─── Walking Animals on Ground ────────────────────────── */

const ANIMAL_CONFIGS = [
  { Component: Tiger, scale: 0.75, speed: 35, y: 78, label: 'Bengal Tiger' },
  { Component: Elephant, scale: 0.55, speed: 55, y: 74, label: 'Asian Elephant' },
  { Component: Deer, scale: 0.65, speed: 28, y: 80, label: 'Spotted Deer' },
  { Component: Leopard, scale: 0.7, speed: 40, y: 79, label: 'Leopard' },
  { Component: Wolf, scale: 0.7, speed: 32, y: 80, label: 'Grey Wolf' },
  { Component: Tiger, scale: 0.6, speed: 48, y: 77, label: 'Tiger Cub' },
  { Component: Deer, scale: 0.55, speed: 25, y: 81, label: 'Fawn' },
]

function WalkingAnimal({ config, index }) {
  const flip = index % 2 === 0
  const startX = flip ? -25 : 110
  const endX = flip ? 110 : -25

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${startX}%`, top: `${config.y}%`, transform: 'translateY(-100%)' }}
      animate={{ left: [`${startX}%`, `${endX}%`] }}
      transition={{
        duration: config.speed,
        repeat: Infinity,
        delay: index * 7,
        ease: 'linear',
        repeatDelay: Math.random() * 5,
      }}
    >
      {/* Leg animation — subtle bob */}
      <motion.div
        animate={{ y: [0, -4, 0], rotate: [0, 0.5, 0, -0.5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <config.Component scale={config.scale} flip={flip} />
      </motion.div>
    </motion.div>
  )
}

/* ─── Auth Modal ────────────────────────────────────────── */
function AuthModal({ onClose }) {
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', adminCode: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    window.location.href = '/dashboard'
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'rgba(8,20,8,0.97)', border: '1px solid rgba(0,255,80,0.2)', boxShadow: '0 0 60px rgba(0,255,80,0.08)' }}
        initial={{ scale: 0.88, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22 }}>

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['signin', 'signup', 'admin']).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 rounded-lg text-sm font-mono font-medium transition-all"
                style={{
                  background: tab === t ? (t === 'admin' ? 'rgba(255,59,59,0.15)' : 'rgba(0,255,80,0.12)') : 'transparent',
                  color: tab === t ? (t === 'admin' ? '#ff5555' : '#00ff50') : '#555',
                  border: tab === t ? `1px solid ${t === 'admin' ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,80,0.25)'}` : '1px solid transparent',
                }}>
                {t === 'signin' ? 'Sign In' : t === 'signup' ? 'Sign Up' : '🔐 Admin'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold font-mono mb-1" style={{ color: tab === 'admin' ? '#ff5555' : '#00ff50' }}>
            {tab === 'signin' ? 'Welcome back, ranger' : tab === 'signup' ? 'Join WildTrack AI' : 'Admin Access'}
          </h2>
          <p className="text-xs font-mono text-gray-600 mb-6">Wildlife Detection System v2.0</p>

          <form onSubmit={submit} className="space-y-3">
            {tab === 'signup' && (
              <>
                <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,255,80,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                <input placeholder="Username" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,255,80,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </>
            )}
            <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,80,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,80,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            {tab === 'admin' && (
              <input placeholder="Admin Access Code" value={form.adminCode} onChange={e => setForm(p => ({ ...p, adminCode: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                style={{ background: 'rgba(255,59,59,0.05)', border: '1px solid rgba(255,59,59,0.2)', color: '#e0e0e0' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,59,59,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,59,59,0.2)'} />
            )}

            <motion.button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold font-mono text-sm mt-2 flex items-center justify-center gap-2 transition-all"
              style={{ background: tab === 'admin' ? 'linear-gradient(135deg,#ff3b3b,#aa1111)' : 'linear-gradient(135deg,#00cc44,#008833)', color: '#fff', boxShadow: `0 8px 30px ${tab === 'admin' ? 'rgba(255,59,59,0.25)' : 'rgba(0,200,70,0.25)'}` }}
              whileHover={{ scale: 1.02, boxShadow: `0 10px 40px ${tab === 'admin' ? 'rgba(255,59,59,0.4)' : 'rgba(0,200,70,0.4)'}` }}
              whileTap={{ scale: 0.97 }}>
              {loading
                ? <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7 }} />Authenticating...</>
                : tab === 'signin' ? '→ Enter System' : tab === 'signup' ? '→ Create Account' : '🔐 Admin Login'
              }
            </motion.button>
          </form>

          <p className="text-center text-xs font-mono text-gray-700 mt-5 pb-6">Demo: any credentials work · Admin code: WILDTRACK-ADMIN</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [counter, setCounter] = useState(2847)

  useEffect(() => {
    const t = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 3)), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden select-none" style={{ background: '#010a01' }}>
      <ForestBackground />

      {/* Scan line */}
      <div className="scan-line" style={{ opacity: 0.15 }} />

      {/* ── NAVBAR ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(0,200,60,0.12)', border: '1px solid rgba(0,200,60,0.3)' }}>🦁</div>
          <div>
            <div className="text-lg font-black font-mono tracking-widest" style={{ color: '#00ff50' }}>WILDEYE</div>
            <div className="text-xs font-mono tracking-widest" style={{ color: 'rgba(0,200,60,0.6)', fontSize: 9 }}>YOLO DETECTION SYSTEM v2.0</div>
          </div>
        </motion.div>

        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono"
            style={{ background: 'rgba(0,200,60,0.08)', border: '1px solid rgba(0,200,60,0.2)', color: '#00cc44' }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            SYSTEM ONLINE
          </div>
          <motion.button onClick={() => window.location.href = '/dashboard'}
            className="px-5 py-2 rounded-full text-sm font-mono font-bold"
            style={{ background: 'linear-gradient(135deg,#00cc44,#008833)', color: '#fff', boxShadow: '0 4px 20px rgba(0,200,68,0.3)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 28px rgba(0,200,68,0.5)' }}
            whileTap={{ scale: 0.96 }}>
            SIGN IN
          </motion.button>
                  </motion.div>
      </nav>

      {/* ── HERO TEXT ── */}
      <div className="relative z-20 text-center mt-40 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}>
          <h1 className="font-black leading-none tracking-tight" style={{ fontSize: 'clamp(24px,3.5vw,56px)' }}>
            <div className="text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,255,80,0.3)' }}>REAL-TIME</div>
            <div style={{ color: '#00ff50', textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 40px rgba(0,255,80,0.5), 0 0 60px rgba(0,255,80,0.3)' }}>WILDLIFE</div>
            <div style={{ color: '#00cc40', textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 40px rgba(0,255,80,0.4)' }}>DETECTION</div>
          </h1>
          <p className="mt-4 text-xxs md:text-xs max-w-2xl mx-auto leading-relaxed" style={{ color: '#ffffff', textShadow: '1px 1px 4px rgba(0,0,0,0.8)', fontSize: '11px' }}>
            Professional AI-powered surveillance system using <span style={{ color: '#00ff80', fontWeight: 'bold', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>YOLOv8</span> for real-time animal detection, tracking, and intelligent alerts across multi-camera networks.
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div className="flex justify-center gap-4 mt-10 flex-wrap"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          {[
            { icon: '📷', val: '12', label: 'CAMERAS ONLINE', color: '#4488ff' },
            { icon: '🎯', val: counter.toLocaleString(), label: 'DETECTIONS TODAY', color: '#00ff80' },
            { icon: '🚨', val: '143', label: 'ACTIVE ALERTS', color: '#ff4444' },
          ].map(s => (
            <div key={s.label} className="px-5 py-2 rounded-2xl text-center"
              style={{ background: 'rgba(0,15,0,0.04)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', minWidth: 120 }}>
              <div className="text-lg mb-1" style={{ fontSize: '18px' }}>{s.icon}</div>
              <div className="text-lg font-black font-mono" style={{ color: s.color, textShadow: '1px 1px 4px rgba(0,0,0,0.9)', fontSize: '18px' }}>{s.val}</div>
              <div className="text-xxs font-mono mt-1 tracking-widest" style={{ color: '#ffffff', textShadow: '1px 1px 3px rgba(0,0,0,0.9)', fontWeight: 500, fontSize: '9px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    <motion.button onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 rounded-2xl font-mono text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', backdropFilter: 'blur(10px)' }}
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.5)' }}
            whileTap={{ scale: 0.97 }}>
            View Demo
          </motion.button>
        </motion.div>
      </div>

      {/* ── AUTH MODAL ── */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  )
}
