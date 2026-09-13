import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import DailyBriefing from './components/DailyBriefing'
import CourseIntelligence from './components/CourseIntelligence'
import UniversityHub from './components/UniversityHub'
import CollegesDirectory from './components/CollegesDirectory'
import ComparisonView from './components/ComparisonView'
import EntranceResultsViewer from './components/EntranceResultsViewer'
import AIControlCenter from './components/AIControlCenter'
import ScholarshipsPortal from './components/ScholarshipsPortal'
import ClimateDisasterHub from './components/ClimateDisasterHub'
import EmailGuardian from './components/EmailGuardian'
import AiApplicationDrafter from './components/AiApplicationDrafter'
import ConversationalCopilot from './components/ConversationalCopilot'
import { Bot, Heart, Search, X, BookOpen, Building2, GraduationCap, ArrowRight } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('briefing')
  const [theme, setTheme] = useState(() => localStorage.getItem('eduva_theme') || 'dark')
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('eduva_demo_mode') === 'true')
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  // Keyboard shortcut Ctrl+K for search
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
        isDemoMode={isDemoMode}
        toggleDemoMode={toggleDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
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
          />
        )}

        {activeTab === 'colleges' && (
          <CollegesDirectory
            colleges={colleges}
            theme={theme}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            theme={theme}
          />
        )}

        {activeTab === 'results' && (
          <EntranceResultsViewer
            results={entranceResults}
            theme={theme}
          />
        )}

        {activeTab === 'control_center' && (
          <AIControlCenter
            theme={theme}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsPortal
            theme={theme}
          />
        )}

        {activeTab === 'climate' && (
          <ClimateDisasterHub
            theme={theme}
          />
        )}

        {activeTab === 'email_guardian' && (
          <EmailGuardian
            theme={theme}
          />
        )}

        {activeTab === 'sop_drafter' && (
          <AiApplicationDrafter
            theme={theme}
          />
        )}

      </main>

      {/* Global Universal Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-2xl w-full rounded-3xl border shadow-2xl p-6 space-y-4 ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-800">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUniversalSearch()}
                  placeholder="Search universities, colleges, BCA, CSIT, or 'ABC College'..."
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-lg hover:bg-gray-800 cursor-pointer">
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
                        className="p-2.5 rounded-xl hover:bg-gray-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold">{u.name} ({u.acronym})</span>
                        <span className="text-[10px] text-gray-400">{u.location}</span>
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
                        className="p-2.5 rounded-xl hover:bg-gray-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-blue-400">{c.university}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{c.location}</span>
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
                        className="p-2.5 rounded-xl hover:bg-gray-800/50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold">{cr.name} ({cr.code})</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{cr.category}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.autonomous_discovery && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                    <span className="font-black block">✓ Autonomous Agent Discovered & Indexed:</span>
                    <span>{searchResults.autonomous_discovery.discovered_record?.name} ({searchResults.autonomous_discovery.discovered_record?.university})</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating EDUVA AI Button */}
      <div className="fixed bottom-6 right-6 z-40">
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
        onClose={() => setIsCopilotOpen(false)}
        theme={theme}
      />

      {/* Footer */}
      <footer className={`border-t py-6 transition-colors w-full ${
        theme === 'dark' ? 'border-gray-800/80 bg-[#080C14]' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-black tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EDUVA AI
            </span>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}>•</span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}>
              Nepal Higher Education Intelligence Platform
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-semibold">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Crafted with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>by</span>
            <span className="font-black text-blue-500 hover:text-indigo-400 transition-colors">
              SujanGC
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
