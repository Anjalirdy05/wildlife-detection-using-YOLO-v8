import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MOCK_USERS } from '../utils/mockData'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      
      const user = MOCK_USERS.find(u => u.email === form.email && u.password === form.password)
      if (user) {
        login(user)
        toast.success(`Welcome back, ${user.name}!`)
        setTimeout(() => navigate('/dashboard/live'), 500)
      } else {
        toast.error('Invalid credentials. Try admin@wildeye.ai / admin123')
        setLoading(false)
      }
    } catch(err) {
      console.error('Login error:', err)
      toast.error('Login failed')
      setLoading(false)
    }
  }

  const quickLogin = async (email, password) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      
      const user = MOCK_USERS.find(u => u.email === email && u.password === password)
      if (user) {
        login(user)
        toast.success(`Welcome back, ${user.name}!`)
        setTimeout(() => navigate('/dashboard/live'), 500)
      } else {
        toast.error('Invalid credentials')
        setLoading(false)
      }
    } catch(err) {
      console.error('Login error:', err)
      toast.error('Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
      {/* Background Video */}
      <video 
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          zIndex: 0,
          display: 'block'
        }}>
        <source src="/login-background.mp4" type="video/mp4" />
      </video>

      <div className="relative z-20 w-full max-w-md px-6">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-wild-green/10 border border-wild-green/30 flex items-center justify-center text-4xl">
              🦁
            </div>
            <h1 className="font-display font-black text-4xl tracking-widest" style={{ color: '#00ff80', textShadow: '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.3)' }}>
              WILDEYE
            </h1>
            <p className="font-mono text-xs text-gray-400 tracking-widest">WILDLIFE DETECTION SYSTEM v2.0</p>
          </Link>
        </div>

        {/* Login Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(10,35,15,0.85) 0%, rgba(15,25,35,0.8) 100%)',
          border: '1px solid rgba(0,255,136,0.25)',
          borderRadius: '16px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(0,255,136,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}>
          <h2 className="font-display font-black text-2xl mb-2 tracking-wide" style={{ color: '#00ff80', textShadow: '0 0 15px rgba(0,255,136,0.4)' }}>
            SIGN IN
          </h2>
          <p className="text-gray-400 text-sm mb-8 font-mono" style={{ letterSpacing: '0.05em' }}>
            ACCESS THE MONITORING SYSTEM
          </p>

          {/* Quick Login Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => quickLogin('admin@wildeye.ai', 'admin123')}
              className="flex-1 py-2 px-3 rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,255,136,0.4)',
                color: '#00ff88',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(0,255,136,0.1)'
                e.target.style.borderColor = '#00ff88'
                e.target.style.boxShadow = '0 0 15px rgba(0,255,136,0.2)'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent'
                e.target.style.borderColor = 'rgba(0,255,136,0.4)'
                e.target.style.boxShadow = 'none'
              }}
            >
              👑 ADMIN
            </button>
            <button
              type="button"
              onClick={() => quickLogin('ranger@wildeye.ai', 'ranger123')}
              className="flex-1 py-2 px-3 rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
              style={{
                background: 'transparent',
                border: '1px solid rgba(100,180,255,0.4)',
                color: '#64b4ff',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(100,180,255,0.1)'
                e.target.style.borderColor = '#64b4ff'
                e.target.style.boxShadow = '0 0 15px rgba(100,180,255,0.2)'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent'
                e.target.style.borderColor = 'rgba(100,180,255,0.4)'
                e.target.style.boxShadow = 'none'
              }}
            >
              🌿 RANGER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-2 tracking-widest font-bold">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="admin@wildeye.ai"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                style={{
                  width: '100%',
                  background: 'rgba(13,21,32,0.9)',
                  border: '1px solid rgba(26,40,64,0.8)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  fontFamily: 'Exo 2, sans-serif',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(0,255,136,0.5)'
                  e.target.style.background = 'rgba(13,21,32,0.95)'
                  e.target.style.boxShadow = '0 0 15px rgba(0,255,136,0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(26,40,64,0.8)'
                  e.target.style.background = 'rgba(13,21,32,0.9)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-400 mb-2 tracking-widest font-bold">PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                style={{
                  width: '100%',
                  background: 'rgba(13,21,32,0.9)',
                  border: '1px solid rgba(26,40,64,0.8)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#e2e8f0',
                  fontFamily: 'Exo 2, sans-serif',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(0,255,136,0.5)'
                  e.target.style.background = 'rgba(13,21,32,0.95)'
                  e.target.style.boxShadow = '0 0 15px rgba(0,255,136,0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(26,40,64,0.8)'
                  e.target.style.background = 'rgba(13,21,32,0.9)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? 'linear-gradient(135deg, #00aa55, #007733)' : 'linear-gradient(135deg, #00ff88, #00cc44)',
                color: '#060a0f',
                boxShadow: '0 0 30px rgba(0,255,136,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                border: 'none'
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-wild-bg border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>→ ENTER SYSTEM</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-xs text-gray-400 font-mono tracking-widest mb-3">NO ACCOUNT YET?</p>
            <Link 
              to="/signup"
              className="block w-full py-2 text-center rounded-lg font-mono text-xs font-bold tracking-wider transition-all"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,255,136,0.3)',
                color: '#00ff88',
                textDecoration: 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,255,136,0.05)'
                e.currentTarget.style.borderColor = '#00ff88'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'
              }}
            >
              CREATE ACCOUNT →
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs font-mono tracking-widest" style={{ letterSpacing: '0.1em' }}>
            ● ENCRYPTED CONNECTION · SSL/TLS 256-BIT
          </p>
        </div>
      </div>
    </div>
  )
}
