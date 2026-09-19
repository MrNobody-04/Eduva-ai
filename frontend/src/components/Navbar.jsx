import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md transition-all duration-300 border-b w-full border-[var(--border-subtle)] bg-[var(--bg-main)]/95 text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with Editorial Mark */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0" 
            onClick={() => handleTabClick('landing')}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--ink)] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <span className="font-extrabold tracking-tighter text-base">E</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--verified)] rounded-full border-2 border-[var(--bg-main)]"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text-heading)]">
                  EDUVA <span className="text-[var(--primary)]">AI</span>
                </span>
                <span className="verified-badge px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full hidden sm:inline-block">
                  Level 1
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-wide text-[var(--text-muted)]">
                Higher Education Intelligence • Nepal
              </p>
            </div>
          </div>

          {/* Streamlined Desktop Navigation Tabs (5 Primary + More dropdown) */}
          <nav className="hidden lg:flex items-center p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]">
            {primaryTabs.map((item) => {
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-[var(--primary)] rounded-xl shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              )
            })}

            {/* Accessible 'More' Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  secondaryTabs.some(t => t.id === activeTab)
                    ? 'bg-[var(--primary-glow)] text-[var(--primary)] border border-[var(--primary)]/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-[var(--shadow-editorial)] p-1.5 space-y-1 animate-fadeIn z-50">
                  {secondaryTabs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleTabClick(sub.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        activeTab === sub.id
                          ? 'bg-[var(--primary)] text-white'
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
              <Search className="w-3.5 h-3.5 text-[var(--primary)]" />
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
              <User className="w-4 h-4 text-[var(--primary)]" />
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
