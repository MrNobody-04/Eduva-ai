import React from 'react'
import { 
  Compass, Calendar, Clock, AlertTriangle, ArrowRight, 
  Sparkles, Building2, BookOpen, GraduationCap, CheckCircle2, ShieldCheck, Flame
} from 'lucide-react'

export default function DailyBriefing({ 
  data, 
  theme = 'dark', 
  onOpenCopilot, 
  onNavigateTab,
  isDemoMode 
}) {
  const greeting = data?.greeting || "Good Morning, Sujan"
  const location = data?.location || "Kathmandu"
  const province = data?.province || "Bagmati Province"

  const upcomingDeadlines = [
    {
      title: "TU IOE Engineering Entrance Registration",
      university: "Tribhuvan University (IOE)",
      deadline: "2026-09-27 (Extended)",
      urgency: "CRITICAL",
      fee: "NPR 2,000",
      status: "REGISTRATION_OPEN"
    },
    {
      title: "KUCAT-CBT Entrance Exam Registration",
      university: "Kathmandu University",
      deadline: "2026-09-25",
      urgency: "HIGH",
      fee: "NPR 2,200",
      status: "REGISTRATION_OPEN"
    },
    {
      title: "MOEST 100% Tuition Waiver Quota Portal",
      university: "Ministry of Education (MOEST)",
      deadline: "2026-10-01",
      urgency: "UPCOMING",
      fee: "Free (Merit Quota)",
      status: "OPENS_SOON"
    }
  ]

  const verifiedNotices = [
    {
      title: "IOE Pulchowk Extends B.E. Computer / Civil Online Form Submission",
      source: "TU IOE Entrance Examination Board",
      date: "Today",
      category: "ENTRANCE_UPDATE"
    },
    {
      title: "Kathmandu University Announces KUCAT Test Center Guidelines & Admit Card",
      source: "KU Admissions Office Dhulikhel",
      date: "Yesterday",
      category: "ADMIT_CARD"
    },
    {
      title: "Medical Education Commission (MEC) Releases CEE Medical Entrance Syllabus",
      source: "MEC Sanothimi, Bhaktapur",
      date: "Sept 11",
      category: "CURRICULUM"
    }
  ]

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Hero Command Center Header */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-[#0B1120] via-gray-900 to-[#1E1B4B]/50 border-gray-800' 
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/50 border-slate-200'
      }`}>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>EDUVA COMMAND CENTER • {location} ({province})</span>
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400">
                SIMULATION MODE ACTIVE
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {greeting} 👋
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
            Your verified education intelligence briefing is ready. 3 critical admission deadlines are active today in Bagmati Province, with 26 national universities monitored live.
          </p>

          {/* Action Shortcuts */}
          <div className="flex flex-wrap gap-2.5 pt-3">
            <button
              onClick={() => onNavigateTab('courses')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>"What Can I Study?" Matcher</span>
            </button>
            <button
              onClick={() => onNavigateTab('compare')}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-750' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Compare TU vs KU</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ask EDUVA AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deadlines Command Center Ticker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-black tracking-tight">Active Entrance & Application Deadlines</h2>
          </div>
          <span className="text-xs font-semibold opacity-60">Verified from Official Notice Boards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingDeadlines.map((dl, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border transition-all hover:shadow-xl flex flex-col justify-between ${
                theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    dl.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {dl.urgency}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">{dl.fee}</span>
                </div>

                <h3 className="font-bold text-sm tracking-tight">{dl.title}</h3>
                <p className="text-xs opacity-70">{dl.university}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Due: {dl.deadline}</span>
                <span className="text-[10px] opacity-60 font-semibold">{dl.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: "What Can I Study" Quick Card & Official Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic Pathways */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-black tracking-tight">Recommended Higher Education Pathways</h3>
            </div>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All 40+ Degrees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigateTab('courses')}
              className={`p-5 rounded-3xl border cursor-pointer hover:border-blue-500/50 transition-all ${
                theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                Computing & IT
              </span>
              <h4 className="font-bold text-base mt-2">B.Sc. CSIT & BCA</h4>
              <p className={`text-xs mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Top choices for software engineering, artificial intelligence, and full-stack development across 60+ TU constituent and affiliated colleges.
              </p>
              <div className="mt-4 pt-2 border-t border-gray-800/40 text-xs font-bold text-blue-400 flex items-center justify-between">
                <span>TU IOST / FOHSS Entrance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div 
              onClick={() => onNavigateTab('courses')}
              className={`p-5 rounded-3xl border cursor-pointer hover:border-purple-500/50 transition-all ${
                theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                Engineering (NEC)
              </span>
              <h4 className="font-bold text-base mt-2">B.E. Computer & Civil</h4>
              <p className={`text-xs mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Accredited by Nepal Engineering Council. Pulchowk, Thapathali, WRC, and premier private colleges in Kathmandu.
              </p>
              <div className="mt-4 pt-2 border-t border-gray-800/40 text-xs font-bold text-purple-400 flex items-center justify-between">
                <span>IOE Entrance Required</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Official Notices */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black tracking-tight">Verified Official Notices</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Level 1 Direct</span>
          </div>

          <div className={`p-4 rounded-3xl border space-y-3 ${
            theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
          }`}>
            {verifiedNotices.map((n, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-400 font-bold uppercase">{n.category}</span>
                  <span className="opacity-60">{n.date}</span>
                </div>
                <h5 className="font-bold text-xs">{n.title}</h5>
                <p className="text-[10px] opacity-60">{n.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
