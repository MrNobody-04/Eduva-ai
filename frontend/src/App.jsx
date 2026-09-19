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
import ClimateDisasterHub from './components/ClimateDisasterHub'
import ComparisonView from './components/ComparisonView'
import EntranceResultsViewer from './components/EntranceResultsViewer'
import ScholarshipsPortal from './components/ScholarshipsPortal'
import KnowledgeGraphView from './components/KnowledgeGraphView'
import ConversationalCopilot from './components/ConversationalCopilot'
import ProfileModal from './components/ProfileModal'
import MobileBottomNav from './components/MobileBottomNav'
import AdminConsole from './components/AdminConsole'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Heart, Search, X, BookOpen, Building2, GraduationCap, ArrowRight, Bell, AlertTriangle, Lock, ShieldAlert } from 'lucide-react'

const PAGE_CONTEXT = {
  briefing: { eyebrow: 'Personal workspace', title: 'Your education briefing', detail: 'Priorities, verified notices and the next actions for your academic journey.' },
  universities: { eyebrow: 'National directory', title: 'Discover institutions', detail: 'Explore verified university and affiliated-college information across Nepal.' },
  colleges: { eyebrow: 'College directory', title: 'Find the right campus', detail: 'Search colleges by affiliation, location and academic pathway.' },
  courses: { eyebrow: 'Degree intelligence', title: 'Plan your pathway', detail: 'Understand eligibility, entrance requirements and program options.' },
  compare: { eyebrow: 'Comparison studio', title: 'See the differences clearly', detail: 'Compare institutions with a neutral, source-led matrix.' },
  graph: { eyebrow: 'Living ontology', title: '3D Knowledge Graph', detail: 'Explore the interconnected multi-dimensional network of universities, degrees, and entrance systems.' },
  entrance: { eyebrow: 'Entrance radar', title: 'Dates, notices and preparation', detail: 'Keep official entrance information and key deadlines in one place.' },
  results: { eyebrow: 'Merit intelligence', title: 'Entrance results', detail: 'Review published results and score information with context.' },
  scholarships: { eyebrow: 'Funding opportunities', title: 'Scholarships', detail: 'Track verified financial-support opportunities and eligibility.' },
  loksewa: { eyebrow: 'Public service radar', title: 'Loksewa notices', detail: 'Follow opportunities, examinations and official notices.' },
  applications: { eyebrow: 'Application workspace', title: 'Keep your applications moving', detail: 'Bring deadlines, documents and submission steps together.' },
  saved: { eyebrow: 'Research library', title: 'Saved for later', detail: 'Return to the institutions and opportunities that matter to you.' },
  alerts: { eyebrow: 'Safety desk', title: 'Campus and travel alerts', detail: 'Stay aware of verified conditions that affect academic life.' },
  admin: { eyebrow: 'Operations workspace', title: 'Platform intelligence', detail: 'Review data quality, agent activity and administrative controls.' }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('landing')
  const [theme, setTheme] = useState(() => localStorage.getItem('eduva_theme') || 'light')
  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('eduva_demo_mode') === 'true')
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Authenticated User & Role Management
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('eduva_auth_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const userRole = currentUser?.role || 'student'

  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem('eduva_auth_user')
        setCurrentUser(raw ? JSON.parse(raw) : null)
        setSessionToken(localStorage.getItem('eduva_session_token') || '')
      } catch (e) {
        setCurrentUser(null)
      }
    }
    window.addEventListener('authChange', syncUser)
    window.addEventListener('storage', syncUser)
    return () => {
      window.removeEventListener('authChange', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  // Real-time Push Notifications State
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('eduva_session_token') || '')
  const [toastNotification, setToastNotification] = useState(null)

  // Core Data
  const [dailyBriefing, setDailyBriefing] = useState(null)
  const [colleges, setColleges] = useState([])
  const [entranceResults, setEntranceResults] = useState([])

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  // Tracker Pre-fill State
  const [trackerPrefill, setTrackerPrefill] = useState(null)

  const handleAddToTracker = (item) => {
    setTrackerPrefill(item)
    setActiveTab('applications')
    setToastNotification({
      title: 'Added to Application Tracker',
      message: `${item.institution} - ${item.program} has been queued in your tracker.`,
      severity: 'SUCCESS'
    })
  }

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

  // Real-time Push Notification WebSocket with In-Band Authentication
  useEffect(() => {
    let ws = null
    let reconnectTimeout = null

    const connectWS = () => {
      const token = localStorage.getItem('eduva_session_token') || sessionToken
      if (!token) return

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications`

      try {
        ws = new WebSocket(wsUrl)
        ws.onopen = () => {
          // In-band authentication frame (avoids token in URL logs)
          ws.send(JSON.stringify({ type: 'auth', token }))
          console.log('Push notification channel authenticated')
        }
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data)
            if (msg.event === 'NOTIFICATION_BROADCAST' || msg.event === 'PORTAL_NOTICE_VERIFIED') {
              setToastNotification({
                id: Date.now(),
                title: msg.data?.title || 'Notice Verified',
                message: msg.data?.message || msg.data?.diff || 'New update available',
                severity: msg.data?.severity || 'MEDIUM',
                link: msg.data?.link
              })
              // Auto dismiss toast after 6 seconds
              setTimeout(() => {
                setToastNotification(prev => prev && prev.id === msg.timestamp ? null : prev)
              }, 6000)
            }
          } catch (e) {
            // Heartbeat pong or non-json message
          }
        }
        ws.onclose = () => {
          if (!document.hidden) {
            reconnectTimeout = setTimeout(connectWS, 4000)
          }
        }
      } catch (err) {
        console.warn('WebSocket connection error:', err)
      }
    }

    connectWS()

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (!ws || ws.readyState === WebSocket.CLOSED) {
          connectWS()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (ws) ws.close()
    }
  }, [sessionToken])

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
    <div className={`eduva-shell min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 w-full max-w-full overflow-x-hidden ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="app-view flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 lg:pb-10" data-page={activeTab}>
        {activeTab !== 'landing' && PAGE_CONTEXT[activeTab] && (
          <section className="workspace-intro">
            <p>{PAGE_CONTEXT[activeTab].eyebrow}</p>
            <div>
              <h1>{PAGE_CONTEXT[activeTab].title}</h1>
              <span>{PAGE_CONTEXT[activeTab].detail}</span>
            </div>
          </section>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full"
          >
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
                onAddToTracker={handleAddToTracker}
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
                onAddToTracker={handleAddToTracker}
              />
            )}

            {activeTab === 'colleges' && (
              <CollegesDirectory
                colleges={colleges}
                theme={theme}
                onOpenCopilot={openCopilotWithPrompt}
                onAddToTracker={handleAddToTracker}
              />
            )}

            {activeTab === 'compare' && (
              <ComparisonView
                theme={theme}
                onOpenCopilot={openCopilotWithPrompt}
              />
            )}

            {activeTab === 'graph' && (
              <KnowledgeGraphView
                theme={theme}
              />
            )}

            {activeTab === 'climate' && (
              <ClimateDisasterHub
                theme={theme}
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

            {activeTab === 'applications' && (
              <ApplicationTracker
                prefillItem={trackerPrefill}
                theme={theme}
                onOpenCopilot={openCopilotWithPrompt}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsAndSafety
                theme={theme}
                onNavigateTab={(tab) => setActiveTab(tab)}
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

            {activeTab === 'admin' && (
              userRole === 'admin' ? (
                <AdminConsole
                  theme={theme}
                  isDemoMode={isDemoMode}
                  toggleDemoMode={toggleDemoMode}
                />
              ) : (
                <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl text-center max-w-xl mx-auto space-y-4 my-10 ${
                  theme === 'dark' ? 'bg-[#0E1424] border-red-900/40 text-white' : 'bg-white border-red-200 text-slate-900'
                }`}>
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">Restricted Administrator Area</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    The Admin Console is strictly reserved for authenticated system administrators. Please log in with an administrator account or provide an authorized API key.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('landing')}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Return Home
                    </button>
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Sign In as Administrator
                    </button>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>

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
                          <div className="flex items-center gap-2">
                            <span className="font-bold block">{c.name}</span>
                            {c.verification_status === 'VERIFIED_LEVEL_1' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                Verified
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/15 border border-amber-500/30 text-amber-400">
                                Provisional
                              </span>
                            )}
                          </div>
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

                {/* Honest No-Match State with Real Research Dispatch */}
                {searchResults.total_matches === 0 && searchResults.research_suggestion && (
                  <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                            Uncataloged Institution
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300">
                            Zero Fake Matches
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {searchResults.research_suggestion.message}
                        </p>
                        <p className="text-[11px] text-slate-400 italic">
                          {searchResults.research_suggestion.note}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Want EDUVA to research this?</span>
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/search/queue-research', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ query: searchQuery })
                            })
                            if (res.ok) {
                              setToastNotification({
                                id: Date.now(),
                                title: 'Research Task Queued',
                                message: `ResearchAgent is now investigating official university gazettes for "${searchQuery}".`,
                                severity: 'LOW'
                              })
                              setIsSearchOpen(false)
                            }
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>Queue Agent Investigation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Push Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed bottom-24 lg:bottom-8 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slideUp">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 ${
            theme === 'dark' ? 'bg-[#0E1424]/95 border-purple-500/40 text-white' : 'bg-white/95 border-purple-300 text-slate-900'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black">{toastNotification.title}</h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                    {toastNotification.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {toastNotification.message}
                </p>
                {toastNotification.link && (
                  <a
                    href={toastNotification.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1.5 text-[11px] font-bold text-blue-400 hover:underline"
                  >
                    View Official Source &rarr;
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
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
        onAddToTracker={handleAddToTracker}
      />

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
      />

      {/* Clean Modern Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 transition-colors w-full bg-[var(--surface-1)] text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <div className={`w-full h-full rounded-[9px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#060911]' : 'bg-white'}`}>
                <Bot className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <span className="font-black tracking-wider bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent text-sm">
              EDUVA AI
            </span>
            <span className={theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}>•</span>
            <span className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              &copy; {new Date().getFullYear()} EDUVA AI. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-semibold text-xs">
            <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Developed with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>by</span>
            <span className="font-black text-blue-600 dark:text-blue-400 hover:text-indigo-500 transition-colors">
              SujanG.c.
            </span>
          </div>
        </div>
      </footer>


    </div>
  )
}
