import React from 'react'
import { Home, Compass, Calendar, Bookmark, User, Bot, CheckCircle2 } from 'lucide-react'

export default function MobileBottomNav({ activeTab, setActiveTab, onOpenCopilot, onOpenProfile, theme }) {
  const tabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'entrance', label: 'Entrance', icon: Calendar },
    { id: 'copilot', label: 'EDUVA AI', icon: Bot, isAction: true },
    { id: 'applications', label: 'Tracker', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile', icon: User, isModal: true }
  ]

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 transition-all ${
      theme === 'dark' ? 'bg-[#080C14]/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600'
    }`}>
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onOpenCopilot()}
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer min-w-[50px] min-h-[50px]"
                aria-label="Ask EDUVA AI"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition-all">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-blue-400 mt-1">Ask AI</span>
              </button>
            )
          }

          if (tab.isModal) {
            return (
              <button
                key={tab.id}
                onClick={onOpenProfile}
                className="flex flex-col items-center justify-center py-1.5 px-3 text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Student Profile"
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 text-[10px] font-bold transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                isActive ? 'text-blue-500 font-black' : 'hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
