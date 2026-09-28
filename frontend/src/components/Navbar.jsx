import React, { useState, useRef, useEffect } from 'react'
import LiveStatus from './LiveStatus'
import { 
  Building2, GraduationCap, FileCheck2, Award, 
  Sun, Moon, Menu, X, Cpu, Search, Sparkles, BookOpen, 
  GitCompare, Calendar, Bookmark, Flame, User, CheckCircle2, Shield, Zap, ChevronDown
} from 'lucide-react'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  onOpenSearch,
  onOpenProfile,
  userRole
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const moreRef = useRef(null)

  // Compact primary navigation: specialist tools live in the More workspace.
  const primaryTabs = [
    { id: 'landing', label: 'Home' },
    { id: 'briefing', label: 'My Briefing' },
    { id: 'universities', label: 'Discover' },
    { id: 'courses', label: 'Degrees' },
    { id: 'entrance', label: 'Entrance' }
  ]

  // Secondary Features grouped under "More"
  const baseSecondaryTabs = [
    { id: 'colleges', label: 'College Directory' },
    { id: 'compare', label: 'Comparison Studio' },
    { id: 'graph', label: '3D Knowledge Graph' },
    { id: 'results', label: 'Merit Results (Analysis)' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'loksewa', label: 'Loksewa Radar' },
    { id: 'applications', label: 'Application Tracker' },
    { id: 'saved', label: 'Saved Items' },
    { id: 'alerts', label: 'Safety & Alerts' }
  ]

  const secondaryTabs = userRole === 'admin' 
    ? [...baseSecondaryTabs, { id: 'admin', label: 'Admin Console' }]
    : baseSecondaryTabs

  const handleTabClick = (id) => {
    setActiveTab(id)
    setIsMobileMenuOpen(false)
    setIsMoreOpen(false)
  }

  // Close More dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tabButton = (item, active) =>
    `px-4 py-2 text-sm font-bold rounded-lg cursor-pointer whitespace-nowrap ${
      active ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
    }`

  return (
    <header className="sticky top-0 z-40 border-b w-full border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Row 1: brand, live status, utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-[72px]">
          <button type="button" className="flex items-center gap-3 shrink-0 cursor-pointer text-left" onClick={() => handleTabClick('landing')} aria-label="EDUVA AI home">
            <span className="relative w-10 h-10 rounded-lg bg-[var(--ink)] flex items-center justify-center text-[var(--bg-main)]">
              <span className="font-extrabold text-lg leading-none">E</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--verified)] rounded-full border-2 border-[var(--bg-main)]"></span>
            </span>
            <span>
              <span className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[var(--text-heading)]">EDUVA <span className="text-[var(--primary)]">AI</span></span>
                <span className="verified-badge px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full hidden sm:inline-block">Level 1</span>
              </span>
              <span className="block text-[11px] font-medium text-[var(--text-muted)]">Higher Education Intelligence • Nepal</span>
            </span>
          </button>

          <div className="hidden lg:block ml-auto">
            <LiveStatus />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onOpenSearch} className="flex items-center gap-2 px-3 text-sm font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] min-h-[40px] cursor-pointer" title="Search (Ctrl+K)" aria-label="Search">
              <Search className="w-4 h-4 text-[var(--primary)]" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 bg-[var(--surface-2)] rounded border border-[var(--border-subtle)] font-mono text-[var(--text-muted)]">Ctrl K</kbd>
            </button>

            <button
              onClick={() => handleTabClick('alerts')}
              className={`relative rounded-lg border min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer ${
                activeTab === 'alerts' ? 'border-rose-500/50 bg-rose-500/15' : 'border-[var(--border-subtle)] bg-[var(--surface-1)]'
              }`}
              title="Safety & Alerts" aria-label="Safety and alerts"
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <button onClick={onOpenProfile} className="px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] text-sm font-bold flex items-center gap-2 min-h-[40px] cursor-pointer" title="Profile" aria-label="Profile">
              <User className="w-4 h-4 text-[var(--primary)]" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            <button onClick={toggleTheme} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-label="Toggle colour theme">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer" aria-label="Toggle navigation menu" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: page navigation, always visible from tablet width up */}
      <div className="hidden md:block border-t border-[var(--border-subtle)] bg-[var(--surface-1)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-12" aria-label="Main">
          {primaryTabs.map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={tabButton(item, activeTab === item.id)} aria-current={activeTab === item.id ? 'page' : undefined}>
              {item.label}
            </button>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`${tabButton(null, secondaryTabs.some(t => t.id === activeTab))} flex items-center gap-1.5`}
              aria-haspopup="menu" aria-expanded={isMoreOpen}
            >
              <span>More pages</span>
              <ChevronDown className={`w-4 h-4 ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMoreOpen && (
              <div role="menu" className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] shadow-[var(--shadow-editorial)] p-1.5 z-50">
                {secondaryTabs.map((sub) => (
                  <button
                    key={sub.id}
                    role="menuitem"
                    onClick={() => handleTabClick(sub.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-md flex items-center justify-between cursor-pointer ${
                      activeTab === sub.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {activeTab === sub.id && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile drawer (phones) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-main)] px-4 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <LiveStatus compact />
          <div>
            <span className="text-[11px] uppercase font-black tracking-wider text-[var(--text-muted)] block px-1 mb-2">Main</span>
            <div className="space-y-1">
              {primaryTabs.map((item) => (
                <button key={item.id} onClick={() => handleTabClick(item.id)} className={`w-full text-left px-4 py-3 text-sm font-bold rounded-lg min-h-[44px] cursor-pointer ${activeTab === item.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] bg-[var(--surface-1)]'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <span className="text-[11px] uppercase font-black tracking-wider text-[var(--text-muted)] block px-1 mb-2">More pages</span>
            <div className="space-y-1">
              {secondaryTabs.map((item) => (
                <button key={item.id} onClick={() => handleTabClick(item.id)} className={`w-full text-left px-4 py-3 text-sm font-bold rounded-lg min-h-[44px] cursor-pointer ${activeTab === item.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] bg-[var(--surface-1)]'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
