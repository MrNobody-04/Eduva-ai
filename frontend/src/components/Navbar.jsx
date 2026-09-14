import React, { useState } from 'react'
import { 
  Building2, GraduationCap, FileCheck2, Award, 
  Sun, Moon, Menu, X, Cpu, Search, Sparkles, BookOpen, 
  GitCompare, Calendar, Bookmark, Flame, User, CheckCircle2, Shield, Zap
} from 'lucide-react'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  onOpenSearch,
  onOpenProfile
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'briefing', label: 'Dashboard' },
    { id: 'universities', label: 'Universities' },
    { id: 'courses', label: 'Degrees' },
    { id: 'entrance', label: 'Entrance' },
    { id: 'loksewa', label: 'Loksewa' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'applications', label: 'Tracker' },
    { id: 'saved', label: 'Saved' },
    { id: 'admin', label: 'Admin', isSpecial: true }
  ]

  const handleTabClick = (id) => {
    setActiveTab(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-2xl transition-all duration-300 border-b w-full ${
      theme === 'dark' 
        ? 'bg-[#080C14]/90 border-slate-800/80 shadow-2xl shadow-black/50 text-slate-100' 
        : 'bg-white/90 border-slate-200/80 shadow-md shadow-slate-200/50 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with Futuristic AI Core Badge */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0" 
            onClick={() => handleTabClick('landing')}
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#080C14]' : 'bg-white'}`}>
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080C14] animate-ping"></span>
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
              <p className={`text-[10px] font-semibold tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Nepal Higher Education Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className={`hidden xl:flex items-center p-1 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Universal Search Quick Button */}
            <button
              onClick={onOpenSearch}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer min-h-[40px] ${
                theme === 'dark' 
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500/40' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400'
              }`}
              title="Global Universal Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-400">Ctrl K</kbd>
            </button>

            {/* Live Alerts Bell */}
            <button
              onClick={() => handleTabClick('alerts')}
              className={`relative p-2.5 rounded-xl border transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                activeTab === 'alerts'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px] ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Student Academic Profile"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-2.5 rounded-xl border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`xl:hidden border-t px-4 py-4 space-y-2 animate-fadeIn ${
          theme === 'dark' ? 'bg-[#080C14] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'text-slate-300 hover:bg-slate-800/60' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
