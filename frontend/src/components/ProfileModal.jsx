import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Phone, MapPin, GraduationCap, DollarSign, 
  Save, CheckCircle2, ShieldCheck, Sparkles, Compass
} from 'lucide-react'

export default function ProfileModal({ isOpen, onClose, theme }) {
  const [profile, setProfile] = useState({
    name: 'Sujan G.C.',
    email: 'sujan@eduva.ai',
    stream: 'Science (Physical)',
    gpa: 3.85,
    city: 'Kathmandu',
    budget_max: 800000,
    preferred_courses: ['BSc CSIT', 'B.E. Computer', 'BCA'],
    target_universities: ['Tribhuvan University', 'Kathmandu University']
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(prev => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    if (isOpen) fetchProfile()
  }, [isOpen])

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => {
          setSavedSuccess(false)
          onClose()
        }, 1200)
      }
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
              <h3 className="text-base font-black">Student Academic Profile</h3>
              <p className="text-xs text-slate-400">Powers tailored counselor recommendations & eligibility checks</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">+2 / High School Stream</label>
              <select
                value={profile.stream}
                onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Science (Physical)">Science (Physical Group - Maths)</option>
                <option value="Science (Biology)">Science (Biology Group)</option>
                <option value="Management">Management / Commerce</option>
                <option value="Humanities">Humanities / Arts</option>
                <option value="A-Levels">Cambridge GCE A-Levels</option>
                <option value="CTEVT Diploma">CTEVT Diploma Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">+2 Aggregate GPA</label>
              <input
                type="number"
                step="0.01"
                min="1.0"
                max="4.0"
                value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Preferred City / Region</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Total Degree Budget Ceiling (NPR)</label>
            <input
              type="number"
              step="50000"
              value={profile.budget_max}
              onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              NPR {profile.budget_max?.toLocaleString()} (~{(profile.budget_max / 100000).toFixed(1)} Lakhs)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-[11px] text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your academic profile is securely stored in your personal session and only used by EDUVA AI to calculate eligibility criteria, fee affordability, and entrance probability.
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
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
