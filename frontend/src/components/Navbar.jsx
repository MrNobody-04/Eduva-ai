import React, { useState } from 'react'
import { 
  Building2, GraduationCap, FileCheck2, Award, 
  Sun, Moon, Menu, X, Cpu, Search, Sparkles, BookOpen, GitCompare, Activity
} from 'lucide-react'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  onOpenSearch,
  isDemoMode,
  toggleDemoMode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'briefing', label: 'Command Center', icon: null },
    { id: 'courses', label: 'Degrees & Eligibility', icon: BookOpen },
    { id: 'universities', label: 'Universities (26+)', icon: Building2 },
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'results', label: 'Entrance & PDF Scorecards', icon: FileCheck2 },
    { id: 'control_center', label: 'Autonomous AI Hub', icon: Activity },
    { id: 'scholarships', label: 'Scholarships', icon: Award }
  ]

  const handleTabClick = (id) => {
    setActiveTab(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-2xl transition-all duration-300 border-b w-full ${
      theme === 'dark' 
        ? 'bg-[#080C14]/90 border-gray-800/80 shadow-2xl shadow-black/50 text-slate-100' 
        : 'bg-white/90 border-slate-200/80 shadow-md shadow-slate-200/50 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0" 
            onClick={() => handleTabClick('briefing')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${theme === 'dark' ? 'bg-[#080C14]' : 'bg-white'}`}>
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  EDUVA AI
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full hidden sm:inline-block">
                  Verified
                </span>
              </div>
              <p className={`text-[10px] font-semibold tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                Nepal Higher Education Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className={`hidden 2xl:flex items-center p-1 rounded-2xl border ${
            theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
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
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-gray-900/80 border-gray-800 text-gray-300 hover:border-blue-500/40' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400'
              }`}
              title="Global Universal Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 bg-gray-800/60 rounded border border-gray-700 font-mono text-gray-400">Ctrl K</kbd>
            </button>

            {/* Production vs Demo Mode Indicator */}
            <button
              onClick={toggleDemoMode}
              className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              }`}
              title="Click to toggle Production Mode / Simulation Mode"
            >
              {isDemoMode ? 'SIMULATION' : 'PRODUCTION'}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 text-amber-400 hover:bg-gray-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`2xl:hidden p-2.5 rounded-xl border transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`2xl:hidden border-t px-4 py-4 space-y-2 animate-fadeIn ${
          theme === 'dark' ? 'bg-[#080C14] border-gray-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800/60' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
