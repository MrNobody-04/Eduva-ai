import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Lock, ShieldCheck, CheckCircle2, 
  ArrowRight, KeyRound, Sparkles, LogIn, UserPlus, LogOut
} from 'lucide-react'

export default function ProfileModal({ isOpen, onClose, theme }) {
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register' | 'profile'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  // Academic Profile fields
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('eduva_user_profile')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
      username: '',
      email: '',
      stream: 'Science (Physical)',
      gpa: '3.65',
      city: 'Kathmandu',
      budget_max: 600000,
      registered: false
    }
  })

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eduva_auth_user')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return null
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (currentUser) {
      setAuthMode('profile')
    } else {
      setAuthMode('login')
    }
    setErrorMsg('')
    setSuccessMsg('')
  }, [isOpen])

  // Login handler
  const handleLogin = async (e) => {
    e?.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()
      if (res.ok && data.status === 'SUCCESS') {
        localStorage.setItem('eduva_session_token', data.token)
        localStorage.setItem('eduva_session_id', data.session_id)
        localStorage.setItem('eduva_auth_user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        window.dispatchEvent(new Event('authChange'))

        if (data.profile) {
          const loadedProf = {
            username: data.user.name || '',
            email: data.user.email || '',
            stream: data.profile.stream || 'Science (Physical)',
            gpa: data.profile.gpa || '',
            city: data.profile.preferred_location || 'Kathmandu',
            budget_max: data.profile.budget_max_npr || 600000,
            registered: true
          }
          setProfile(loadedProf)
          localStorage.setItem('eduva_user_profile', JSON.stringify(loadedProf))
        }
        setSuccessMsg(`Welcome back, ${data.user.name}!`)
        setTimeout(() => {
          setSuccessMsg('')
          setAuthMode('profile')
        }, 800)
      } else {
        setErrorMsg(data.detail || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.')
    } finally {
      setLoading(false)
    }
  }

  // Registration handler
  const handleRegister = async (e) => {
    e?.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          stream: profile.stream,
          gpa: parseFloat(profile.gpa) || 3.5,
          city: profile.city
        })
      })
      const data = await res.json()
      if (res.ok && data.status === 'SUCCESS') {
        localStorage.setItem('eduva_session_token', data.token)
        localStorage.setItem('eduva_session_id', data.session_id)
        localStorage.setItem('eduva_auth_user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        window.dispatchEvent(new Event('authChange'))
        
        const registeredProf = {
          username: regName,
          email: regEmail,
          stream: profile.stream,
          gpa: profile.gpa,
          city: profile.city,
          budget_max: profile.budget_max,
          registered: true
        }
        setProfile(registeredProf)
        localStorage.setItem('eduva_user_profile', JSON.stringify(registeredProf))

        setSuccessMsg('Account registered successfully!')
        setTimeout(() => {
          setSuccessMsg('')
          setAuthMode('profile')
        }, 800)
      } else {
        setErrorMsg(data.detail || 'Registration failed.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.')
    } finally {
      setLoading(false)
    }
  }

  // Profile update handler
  const handleSaveProfile = async (e) => {
    e?.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const token = localStorage.getItem('eduva_session_token') || ''
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': token
        },
        body: JSON.stringify({
          name: profile.username || currentUser?.name || 'Student',
          email: profile.email || currentUser?.email || '',
          stream: profile.stream,
          gpa: parseFloat(profile.gpa) || null,
          preferred_location: profile.city,
          budget_max_npr: parseInt(profile.budget_max) || 600000
        })
      })
      if (res.ok) {
        localStorage.setItem('eduva_user_profile', JSON.stringify(profile))
        setSuccessMsg('Academic profile updated!')
        setTimeout(() => {
          setSuccessMsg('')
          onClose()
        }, 800)
      }
    } catch (err) {
      setErrorMsg('Could not save profile updates.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('eduva_auth_user')
    localStorage.removeItem('eduva_session_token')
    localStorage.removeItem('eduva_session_id')
    setCurrentUser(null)
    setAuthMode('login')
    window.dispatchEvent(new Event('authChange'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header with Navigation Tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {currentUser ? 'Student Account & Admissions Profile' : 'EDUVA Student Authentication'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser ? `Signed in as ${currentUser.email}` : 'Sign in or register for personalized autonomous counselor memory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        {!currentUser && (
          <div className="flex rounded-2xl bg-slate-900/60 p-1 border border-slate-800">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-fadeIn">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {!currentUser && authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Cryptographic Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {!currentUser && authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Sujan Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="sujan@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Password (min. 6 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">+2 Stream</label>
                <select
                  value={profile.stream}
                  onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Science (Physical)">Science (Physical Group - Maths)</option>
                  <option value="Science (Biology)">Science (Biology Group)</option>
                  <option value="Management">Management / Commerce</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="A-Levels">Cambridge GCE A-Levels</option>
                  <option value="CTEVT Diploma">CTEVT Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Preferred City</label>
                <input
                  type="text"
                  placeholder="Kathmandu"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Registering...' : 'Complete Registration & Sign In'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        )}

        {/* 3. ACADEMIC PROFILE (AUTHENTICATED) */}
        {currentUser && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 uppercase font-bold block">Authenticated Session</span>
                <span className="font-bold text-white text-xs">{currentUser.name} ({currentUser.email})</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">+2 Stream</label>
                <select
                  value={profile.stream}
                  onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Science (Physical)">Science (Physical Group - Maths)</option>
                  <option value="Science (Biology)">Science (Biology Group)</option>
                  <option value="Management">Management / Commerce</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="A-Levels">Cambridge GCE A-Levels</option>
                  <option value="CTEVT Diploma">CTEVT Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">+2 Aggregate GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  placeholder="3.65"
                  value={profile.gpa}
                  onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Preferred City</label>
                <input
                  type="text"
                  placeholder="Kathmandu"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Budget Ceiling (NPR)</label>
                <input
                  type="number"
                  step="50000"
                  placeholder="600000"
                  value={profile.budget_max}
                  onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
