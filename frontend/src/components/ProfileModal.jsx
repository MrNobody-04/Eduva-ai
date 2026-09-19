import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Lock, ShieldCheck, CheckCircle2, 
  ArrowRight, KeyRound, Sparkles, LogIn, UserPlus, 
  LogOut, AlertCircle, RefreshCw, Send, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileModal({ isOpen, onClose, theme }) {
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register' | 'verify_email' | 'profile'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Verification State
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [manualTokenLoading, setManualTokenLoading] = useState(false)

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
    } else if (authMode !== 'verify_email') {
      setAuthMode('login')
    }
    setErrorMsg('')
    setSuccessMsg('')
    setFieldErrors({})
  }, [isOpen])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Live validation
  const validateRegister = () => {
    const errors = {}
    if (!regName.trim()) errors.name = 'Full name is required'
    if (!regEmail.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errors.email = 'Please enter a valid email address'
    }
    if (!regPassword) {
      errors.password = 'Password is required'
    } else if (regPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Login handler
  const handleLogin = async (e) => {
    e?.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
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
        }, 600)
      } else {
        setErrorMsg(data.detail || 'Login failed. Please check your email and password.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication service.')
    } finally {
      setLoading(false)
    }
  }

  // Registration handler with Email Verification Gate
  const handleRegister = async (e) => {
    e?.preventDefault()
    if (!validateRegister()) return
    setErrorMsg('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          stream: profile.stream,
          gpa: parseFloat(profile.gpa) || 3.5,
          city: profile.city
        })
      })
      const data = await res.json()
      if (res.ok && data.status === 'SUCCESS') {
        setPendingEmail(regEmail.trim())
        setAuthMode('verify_email')
        setResendCooldown(60)
        setSuccessMsg('Registration submitted! Check your email to verify your account.')
      } else {
        setErrorMsg(data.detail || 'Registration could not be completed.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to registration server.')
    } finally {
      setLoading(false)
    }
  }

  // Resend verification email
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendLoading) return
    const targetEmail = pendingEmail || regEmail || loginEmail
    if (!targetEmail) return

    setResendLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      })
      const data = await res.json()
      if (res.ok && data.status === 'SUCCESS') {
        setResendCooldown(60)
        setSuccessMsg('A new verification email has been dispatched.')
      } else {
        setErrorMsg(data.detail || 'Could not resend email right now.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to email verification service.')
    } finally {
      setResendLoading(false)
    }
  }

  // Manual token verification (helpful for dev or testing)
  const handleVerifyToken = async (e) => {
    e?.preventDefault()
    if (!manualToken.trim()) return
    setManualTokenLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(manualToken.trim())}`)
      const data = await res.json()
      if (res.ok && data.status === 'SUCCESS') {
        setSuccessMsg('Email verified successfully! You can now log in.')
        setTimeout(() => {
          setAuthMode('login')
          setLoginEmail(pendingEmail || '')
          setSuccessMsg('')
        }, 1200)
      } else {
        setErrorMsg(data.detail || 'Invalid or expired verification token.')
      }
    } catch (err) {
      setErrorMsg('Error submitting verification token.')
    } finally {
      setManualTokenLoading(false)
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
        setSuccessMsg('Academic profile updated successfully!')
        setTimeout(() => {
          setSuccessMsg('')
          onClose()
        }, 800)
      } else {
        const d = await res.json().catch(() => ({}))
        setErrorMsg(d.detail || 'Could not save profile changes.')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl border shadow-[var(--shadow-editorial)] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto transition-all ${
        theme === 'dark' 
          ? 'bg-[#2A313C] border-[#3D4654] text-[#EEEEEE]' 
          : 'bg-[#E5E1DA] border-[#D5D0C7] text-[#191B1F]'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-[var(--text-heading)]">
                {currentUser 
                  ? 'Student Account & Admissions Profile' 
                  : authMode === 'verify_email' 
                    ? 'Verify Your Email' 
                    : 'EDUVA Student Authentication'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {currentUser 
                  ? `Signed in as ${currentUser.email}` 
                  : authMode === 'verify_email'
                    ? 'Verification required for student data writing'
                    : 'Sign in or register for verified counselor memory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector (When not authenticated and not in email verification view) */}
        {!currentUser && authMode !== 'verify_email' && (
          <div className="flex rounded-xl bg-[var(--surface-2)] p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setFieldErrors({}); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(''); setFieldErrors({}); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {!currentUser && authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {!currentUser && authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={regName}
                  onChange={(e) => { setRegName(e.target.value); if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: null })); }}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    fieldErrors.name ? 'border-rose-500' : ''
                  } ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <span className="text-[11px] text-rose-500 font-semibold block mt-1">{fieldErrors.name}</span>
              )}
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-bold">Email Address (For Verification)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null })); }}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    fieldErrors.email ? 'border-rose-500' : ''
                  } ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <span className="text-[11px] text-rose-500 font-semibold block mt-1">{fieldErrors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-bold">Password (min. 6 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => { setRegPassword(e.target.value); if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null })); }}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    fieldErrors.password ? 'border-rose-500' : ''
                  } ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <span className="text-[11px] text-rose-500 font-semibold block mt-1">{fieldErrors.password}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">+2 Stream</label>
                <select
                  value={profile.stream}
                  onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
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
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">City / Location</label>
                <input
                  type="text"
                  placeholder="Kathmandu"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account & Send Verification'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. CHECK YOUR EMAIL VERIFICATION SCREEN */}
        {!currentUser && authMode === 'verify_email' && (
          <div className="space-y-5 text-center py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-500">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-[var(--text-heading)]">
                Check Your Email
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
                We sent a secure verification link to:
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] font-mono text-xs font-bold text-[var(--text-primary)]">
                {pendingEmail || regEmail}
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] pt-1">
                Please click the link in the message to activate your student account. Real email verification is required to save applications and modify student data.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || resendLoading}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                <span>
                  {resendLoading 
                    ? 'Sending...' 
                    : resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : 'Resend Verification Email'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginEmail(pendingEmail); }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] text-xs font-bold cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>

            {/* Token Paste Fallback (For Development Testing) */}
            <div className="pt-4 border-t border-[var(--border-subtle)] text-left space-y-2">
              <label className="block text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                Have a verification token?
              </label>
              <form onSubmit={handleVerifyToken} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste token or dev token"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!manualToken.trim() || manualTokenLoading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {manualTokenLoading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. ACADEMIC PROFILE (AUTHENTICATED) */}
        {currentUser && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-indigo-500 uppercase font-bold block">Authenticated Session</span>
                <span className="font-bold text-[var(--text-heading)] text-xs">{currentUser.name} ({currentUser.email})</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] hover:bg-rose-500/20 hover:text-rose-400 text-[var(--text-secondary)] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">+2 Stream</label>
                <select
                  value={profile.stream}
                  onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
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
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">+2 Aggregate GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="4.0"
                  placeholder="3.65"
                  value={profile.gpa}
                  onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">Preferred City</label>
                <input
                  type="text"
                  placeholder="Kathmandu"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">Budget Ceiling (NPR)</label>
                <input
                  type="number"
                  step="50000"
                  placeholder="600000"
                  value={profile.budget_max}
                  onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    theme === 'dark' 
                      ? 'bg-[#333B47] border-[#3D4654] text-white' 
                      : 'bg-[#FBFBFB] border-[#D5D0C7] text-[#191B1F]'
                  }`}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="button-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
