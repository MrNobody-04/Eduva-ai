import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import DailyBriefing from './components/DailyBriefing'
import CourseIntelligence from './components/CourseIntelligence'
import UniversityHub from './components/UniversityHub'
import CollegesDirectory from './components/CollegesDirectory'
import EntranceCenter from './components/EntranceCenter'
import LoksewaRadar from './components/LoksewaRadar'
import ApplicationTracker from './components/ApplicationTracker'
import SavedHub from './components/SavedHub'
import AlertsAndSafety from './components/AlertsAndSafety'
import EntranceResultsViewer from './components/EntranceResultsViewer'
import ScholarshipsPortal from './components/ScholarshipsPortal'
import ConversationalCopilot from './components/ConversationalCopilot'
import ProfileModal from './components/ProfileModal'
import MobileBottomNav from './components/MobileBottomNav'
import { Bot, Heart, Search, X, BookOpen, Building2, GraduationCap, ArrowRight } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('landing')
  const [theme, setTheme] = useState(() => localStorage.getItem('eduva_theme') || 'dark')
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('eduva_demo_mode') === 'true')
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Core Data
  const [dailyBriefing, setDailyBriefing] = useState(null)
  const [colleges, setColleges] = useState([])
  const [entranceResults, setEntranceResults] = useState([])

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('eduva_theme', next)
  }

  const toggleDemoMode = () => {
    const next = !isDemoMode
    setIsDemoMode(next)
    localStorage.setItem('eduva_demo_mode', next.toString())
  }

  const openCopilotWithPrompt = (promptText = '') => {
    setCopilotInitialQuery(promptText)
    setIsCopilotOpen(true)
  }

  // Keyboard shortcuts: Ctrl+K for universal search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Autonomous Student Geolocation Detection (Nepal Provinces)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          let detected = 'Bagmati Province (Kathmandu Valley)'
          if (longitude < 84.5 && latitude > 27.8) {
            detected = 'Gandaki Province (Pokhara)'
          } else if (longitude > 86.5) {
            detected = 'Koshi Province (Eastern Nepal)'
          } else if (latitude < 27.5 && longitude < 84.8) {
            detected = 'Lumbini Province (Butwal / Bhairahawa)'
          }
          try {
            localStorage.setItem('eduva_user_region', detected)
          } catch (e) {}
        },
        () => {},
        { timeout: 8000 }
      )
    }
  }, [])

  // Fetch core data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [briefingRes, collegesRes, resultsRes] = await Promise.all([
          fetch('/api/daily-briefing?city=Kathmandu'),
          fetch('/api/colleges'),
          fetch('/api/entrance-results')
        ])
        if (briefingRes.ok) setDailyBriefing(await briefingRes.json())
        if (collegesRes.ok) setColleges(await collegesRes.json())
        if (resultsRes.ok) setEntranceResults(await resultsRes.json())
      } catch (err) {
        console.error('Data fetch error:', err)
      }
    }
    loadData()
  }, [])

  // Universal Search Handler
  const handleUniversalSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 w-full max-w-full overflow-x-hidden ${
      theme === 'dark' ? 'bg-[#080C14] text-slate-100 theme-dark' : 'bg-slate-50 text-slate-900 theme-light'
    }`}>
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10">
        
        {activeTab === 'landing' && (
          <LandingPage
            onExplore={() => setActiveTab('universities')}
            onOpenCopilot={openCopilotWithPrompt}
            onNavigateTab={(tab) => setActiveTab(tab)}
            theme={theme}
          />
        )}

        {activeTab === 'briefing' && (
          <DailyBriefing
            data={dailyBriefing}
            theme={theme}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'courses' && (
          <CourseIntelligence
            theme={theme}
          />
        )}

        {activeTab === 'universities' && (
          <UniversityHub
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'colleges' && (
          <CollegesDirectory
            colleges={colleges}
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'entrance' && (
          <EntranceCenter
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'loksewa' && (
          <LoksewaRadar
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsAndSafety
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationTracker
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

        {activeTab === 'saved' && (
          <SavedHub
            theme={theme}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'results' && (
          <EntranceResultsViewer
            results={entranceResults}
            theme={theme}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsPortal
            theme={theme}
            onOpenCopilot={openCopilotWithPrompt}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        theme={theme}
      />

      {/* Global Universal Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-2xl w-full rounded-3xl border shadow-2xl p-6 space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUniversalSearch()}
                  placeholder="Search universities, colleges, BCA, CSIT, or 'Pulchowk'..."
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-slate-500"
                />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] opacity-60">
              <span>Press Enter to Search • Living Knowledge Engine</span>
              <span>Autonomous Discovery Enabled</span>
            </div>

            {isSearching && (
              <div className="py-8 text-center text-xs opacity-60 animate-pulse">
                EDUVA is searching verified Nepal education knowledge...
              </div>
            )}

            {searchResults && (
              <div className="max-h-96 overflow-y-auto space-y-3 pt-2">
                {searchResults.universities?.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Universities</span>
                    {searchResults.universities.map(u => (
                      <div 
                        key={u.id}
                        onClick={() => { setActiveTab('universities'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold">{u.name} ({u.acronym})</span>
                        <span className="text-[10px] text-slate-400">{u.location}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.colleges?.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Colleges</span>
                    {searchResults.colleges.map(c => (
                      <div 
                        key={c.id}
                        onClick={() => { setActiveTab('colleges'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-blue-400">{c.university}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{c.location}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.courses?.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Degrees & Courses</span>
                    {searchResults.courses.map(cr => (
                      <div 
                        key={cr.id}
                        onClick={() => { setActiveTab('courses'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold">{cr.name} ({cr.code})</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{cr.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating EDUVA AI Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="group flex items-center space-x-2.5 px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-2xl shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer border border-white/20"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">Ask EDUVA AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>

      {/* Conversational Copilot Modal */}
      <ConversationalCopilot
        isOpen={isCopilotOpen}
        onClose={() => { setIsCopilotOpen(false); setCopilotInitialQuery(''); }}
        initialQuery={copilotInitialQuery}
        theme={theme}
      />

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
      />

      {/* Modern Multi-Column Executive Footer */}
      <footer className={`border-t transition-colors w-full ${
        theme === 'dark' ? 'border-slate-800/80 bg-[#060911] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Column 1: Brand & Status (2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
                  <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#060911]' : 'bg-white'}`}>
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  EDUVA AI
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full">
                  v2.8 Live
                </span>
              </div>

              <p className={`text-xs leading-relaxed max-w-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Nepal&apos;s authoritative Higher Education &amp; Public Service Commission (लोक सेवा आयोग) Intelligence Platform. Empowering students across all 7 provinces with autonomous real-time entrance verification, syllabus analytics, and transparent fee disclosures.
              </p>

              {/* Live System Health Badge */}
              <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-500 dark:text-emerald-400">Autonomous Pipeline Online</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Supabase PG 17</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Gemini 2.5 Flash</span>
              </div>
            </div>

            {/* Column 2: University Portals */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                University Portals
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://tu.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Tribhuvan University (TU)</span>
                  </a>
                </li>
                <li>
                  <a href="https://ku.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Kathmandu University (KU)</span>
                  </a>
                </li>
                <li>
                  <a href="https://pu.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Pokhara University (PU)</span>
                  </a>
                </li>
                <li>
                  <a href="https://puexam.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Purbanchal University</span>
                  </a>
                </li>
                <li>
                  <a href="https://mwu.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Mid-West University</span>
                  </a>
                </li>
                <li>
                  <a href="https://nou.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors flex items-center justify-between">
                    <span>Nepal Open University</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: National Entrance & PSC */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                National Portals &amp; PSC
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://entrance.ioe.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    TU IOE Entrance Portal
                  </a>
                </li>
                <li>
                  <a href="https://mec.gov.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    MEC CEE (Medical Entrance)
                  </a>
                </li>
                <li>
                  <a href="https://kucat.ku.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    KUCAT CBT Entrance
                  </a>
                </li>
                <li>
                  <a href="https://psc.gov.np" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">
                    Loksewa Aayog (लोक सेवा आयोग)
                  </a>
                </li>
                <li>
                  <a href="https://psconline.psc.gov.np" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">
                    PSC Online Application System
                  </a>
                </li>
                <li>
                  <a href="https://neb.gov.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    National Examination Board (NEB)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Student Emergency & Alerts */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                Safety &amp; Emergency Hub
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://traffic.nepalpolice.gov.np" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                    Traffic Police Hotline 103
                  </a>
                </li>
                <li>
                  <a href="https://dhm.gov.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    Hydrology &amp; Weather (DHM)
                  </a>
                </li>
                <li>
                  <a href="https://bipadportal.gov.np" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors">
                    NDRRMA Disaster Portal
                  </a>
                </li>
                <li>
                  <a href="https://tuexam.edu.np" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                    TU Exam Control (Balkhu)
                  </a>
                </li>
                <li>
                  <span className="text-slate-500 dark:text-slate-500 block pt-1">
                    Police Control: Dial 100
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} EDUVA AI. All official university data is autonomously synchronized with public government gazettes.
            </div>

            <div className="flex items-center space-x-1.5 font-semibold text-slate-600 dark:text-slate-400">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>by</span>
              <span className="font-black text-blue-500 hover:text-indigo-400 transition-colors">
                SujanGC
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
