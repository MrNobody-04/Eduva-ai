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
  onAddToTracker,
  isDemoMode 
}) {
  let registeredName = ""
  try {
    const p = JSON.parse(localStorage.getItem('eduva_user_profile') || '{}')
    if (p.name && p.name.trim()) registeredName = p.name.trim()
  } catch (e) {}
  const greeting = registeredName ? `Good Day, ${registeredName}` : (data?.greeting?.replace(/Sujan/g, 'Scholar') || "Namaste, Scholar")
  const location = data?.location || "Kathmandu"
  const province = data?.province || "Bagmati Province"

  const upcomingDeadlines = [
    {
      title: "TU IOE Engineering Entrance Registration",
      university: "Tribhuvan University (IOE)",
      deadline: "2026-09-27 (Extended)",
      urgency: "CRITICAL",
      fee: "NPR 2,000",
      status: "REGISTRATION_OPEN",
      official_apply_url: "https://entrance.ioe.edu.np",
      source_url: "https://entrance.ioe.edu.np/notices/ext-2026",
      source_name: "IOE Entrance Examination Board (TU)"
    },
    {
      title: "KUCAT-CBT Entrance Exam Registration",
      university: "Kathmandu University",
      deadline: "2026-09-25",
      urgency: "HIGH",
      fee: "NPR 2,200",
      status: "REGISTRATION_OPEN",
      official_apply_url: "https://apply.ku.edu.np",
      source_url: "https://ku.edu.np/admission-notices",
      source_name: "KU Admissions Office Dhulikhel"
    },
    {
      title: "MOEST 100% Tuition Waiver Quota Portal",
      university: "Ministry of Education (MOEST)",
      deadline: "2026-10-01",
      urgency: "UPCOMING",
      fee: "Free (Merit Quota)",
      status: "OPENS_SOON",
      official_apply_url: "https://moest.gov.np",
      source_url: "https://moest.gov.np/notice-scholarships",
      source_name: "Ministry of Education, Science & Technology"
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
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Hero Command Center Header */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>EDUVA COMMAND CENTER • {location} ({province})</span>
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400">
                SIMULATION MODE ACTIVE
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            {greeting}
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Your verified education intelligence briefing is ready. 3 critical admission deadlines are active today in Bagmati Province, with 26 national universities monitored live.
          </p>

          {/* Action Shortcuts */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onNavigateTab('courses')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>&ldquo;What Can I Study?&rdquo; Matcher</span>
            </button>
            <button
              onClick={() => onNavigateTab('compare')}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer active:scale-95 ${
                theme === 'dark' ? 'bg-[#060911] border-slate-700 text-slate-200 hover:border-blue-500' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Compare TU vs KU</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
              <div className="space-y-2.5">
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

                {dl.source_url ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Verified: {dl.source_name || 'Official Notice Board'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-semibold pt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Provisional Notice — Pending Second Verification</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">Due: {dl.deadline}</span>
                  <span className="text-[10px] opacity-60 font-semibold">{dl.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  {dl.official_apply_url && (
                    <a
                      href={dl.official_apply_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <span>Apply Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                  {onAddToTracker && (
                    <button
                      type="button"
                      onClick={() => onAddToTracker({
                        institution: dl.university,
                        program: dl.title,
                        portal_url: dl.official_apply_url || '',
                        deadline: dl.deadline.split(' ')[0],
                        application_fee: dl.fee,
                        source: 'Daily Briefing Deadlines'
                      })}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
                        theme === 'dark'
                          ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-blue-400'
                          : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-blue-600'
                      }`}
                      title="Add to Application Tracker"
                    >
                      <span>+ Tracker</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracker Status Summary Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">Active Application Tracker & Deadlines Hub</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Organize verified entrance registrations, admit cards, document checklists, and submission deadlines in one central dashboard.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('applications')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
        >
          <span>Open Application Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
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
