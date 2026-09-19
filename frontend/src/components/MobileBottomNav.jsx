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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-subtle)] backdrop-blur-md px-2 py-1.5 transition-all bg-[var(--surface-1)]/95 text-[var(--text-secondary)] shadow-[0_-5px_20px_rgba(15,23,42,.04)]">
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
                <div className="w-11 h-11 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_6px_18px_rgba(79,70,229,.25)] active:scale-95 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--primary)] mt-1">Copilot</span>
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
                isActive ? 'text-[var(--primary)] font-black' : 'hover:text-[var(--text-primary)]'
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
