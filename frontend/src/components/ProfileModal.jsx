import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, MapPin, GraduationCap, DollarSign, 
  Save, CheckCircle2, ShieldCheck, Sparkles, Compass, Lock
} from 'lucide-react'

export default function ProfileModal({ isOpen, onClose, theme }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('eduva_user_profile')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return {
      username: '',
      email: '',
      stream: 'Science (Physical)',
      gpa: '',
      city: 'Kathmandu',
      budget_max: 600000,
      registered: false
    }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          if (data && data.name && data.name !== 'Student' && data.name !== 'Sujan Sharma') {
            setProfile(prev => ({
              ...prev,
              username: data.name || prev.username,
              email: data.email || prev.email,
              stream: data.stream || prev.stream,
              gpa: data.gpa || prev.gpa,
              city: data.preferred_location || prev.city,
              budget_max: data.budget_max_npr || prev.budget_max,
              registered: true
            }))
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    if (isOpen) fetchProfile()
  }, [isOpen])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!profile.username || !profile.email) {
      alert('Please enter your username and Gmail to register.')
      return
    }
    setIsSaving(true)
    try {
      const payload = {
        name: profile.username,
        email: profile.email,
        stream: profile.stream,
        gpa: parseFloat(profile.gpa) || 3.0,
        preferred_location: profile.city,
        budget_max_npr: parseInt(profile.budget_max) || 600000,
        registered: true
      }
      localStorage.setItem('eduva_user_profile', JSON.stringify({ ...profile, ...payload }))

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      console.error('Profile update failed:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Student Account Registration & Profile</h3>
              <p className="text-xs text-slate-400">Register with your username & Gmail for personal autonomous recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* User Registration: Username & Gmail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">
                Student Username / Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. rohan_shrestha"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">
                Gmail / Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rohan@gmail.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">+2 / High School Stream</label>
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
                <option value="CTEVT Diploma">CTEVT Diploma Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">+2 Aggregate GPA (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="4.0"
                placeholder="e.g. 3.45"
                value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Preferred City / Region</label>
              <input
                type="text"
                placeholder="e.g. Kathmandu, Pokhara, Chitwan"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Degree Budget Ceiling (NPR)</label>
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
              <span className="text-[10px] text-slate-500 mt-1 block">
                NPR {profile.budget_max ? Number(profile.budget_max).toLocaleString() : '0'} (~{(Number(profile.budget_max || 0) / 100000).toFixed(1)} Lakhs)
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-[11px] flex items-start gap-2.5 ${
            theme === 'dark' ? 'bg-blue-950/20 border-blue-500/30 text-slate-300' : 'bg-blue-50/70 border-blue-200 text-slate-700'
          }`}>
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your registration enables customized admission notifications, scholarship auto-eligibility, and long-term conversational memory across devices.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile Registered!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Registering...' : 'Register & Save'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
