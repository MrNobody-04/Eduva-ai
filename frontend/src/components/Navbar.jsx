import React, { useState, useRef, useEffect } from 'react'
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

  // Primary 5 Navigation Tabs
  const primaryTabs = [
    { id: 'landing', label: 'Home' },
    { id: 'briefing', label: 'Dashboard' },
    { id: 'universities', label: 'Universities' },
    { id: 'entrance', label: 'Entrance' },
    { id: 'alerts', label: 'Alerts' }
  ]

  // Secondary Features grouped under "More"
  const baseSecondaryTabs = [
    { id: 'courses', label: 'Degrees & Courses' },
    { id: 'loksewa', label: 'Loksewa Radar' },
    { id: 'applications', label: 'Application Tracker' },
    { id: 'saved', label: 'Saved Items' }
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

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl transition-all duration-300 border-b w-full border-[var(--border-subtle)] bg-[var(--bg-main)]/90 text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with Futuristic AI Core Badge */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0" 
            onClick={() => handleTabClick('landing')}
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-[var(--surface-1)]">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[var(--bg-main)] animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  EDUVA AI
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full hidden sm:inline-block">
                  Verified
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wide text-[var(--text-secondary)]">
                Nepal Higher Education Intelligence
              </p>
            </div>
          </div>

          {/* Streamlined Desktop Navigation Tabs (5 Primary + More dropdown) */}
          <nav className="hidden lg:flex items-center p-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)]">
            {primaryTabs.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}

            {/* Accessible 'More' Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  secondaryTabs.some(t => t.id === activeTab)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-2xl p-1.5 space-y-1 animate-fadeIn z-50">
                  {secondaryTabs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleTabClick(sub.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        activeTab === sub.id
                          ? 'bg-blue-600 text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {activeTab === sub.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Universal Search Quick Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:border-blue-500/40 transition-all cursor-pointer min-h-[40px]"
              title="Global Universal Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 bg-[var(--surface-2)] rounded border border-[var(--border-subtle)] font-mono text-[var(--text-muted)]">Ctrl K</kbd>
            </button>

            {/* Live Alerts Bell */}
            <button
              onClick={() => handleTabClick('alerts')}
              className={`relative p-2.5 rounded-xl border border-[var(--border-subtle)] transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                activeTab === 'alerts'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-[var(--surface-1)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="National Safety & Campus Alerts"
            >
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-[8px] text-white font-black items-center justify-center">!</span>
              </span>
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
              title="Student Academic Profile"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] text-amber-400 hover:bg-[var(--surface-2)] transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Organized by Category */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-main)] px-4 py-4 space-y-4 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)] block px-2 mb-1.5">
              Primary Directory
            </span>
            <div className="space-y-1">
              {primaryTabs.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)] block px-2 mb-1.5">
              Student Utilities & Intelligence
            </span>
            <div className="space-y-1">
              {secondaryTabs.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
