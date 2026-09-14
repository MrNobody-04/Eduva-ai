import React, { useState, useEffect } from 'react'
import { 
  Sparkles, GraduationCap, Building2, BookOpen, Compass, 
  ArrowRight, ShieldCheck, CheckCircle2, Search, Bot, 
  Calendar, Flame, TrendingUp, Award, Layers, Zap
} from 'lucide-react'

// Animated Digital Monospace Counter Component
function AnimatedDigitalNumber({ target, suffix = '', theme }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const end = parseInt(target.toString().replace(/,/g, ''), 10) || 0
    let startTime = null
    const duration = 1500

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrent(end)
      }
    }

    const reqId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(reqId)
  }, [target])

  const formatted = current >= 1000 ? current.toLocaleString() : current

  return (
    <span className="font-digital tracking-tight inline-flex items-baseline gap-0.5">
      <span className={theme === 'dark' 
        ? 'text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent digital-glow-blue'
        : 'text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 bg-clip-text text-transparent digital-glow-blue'
      }>
        {formatted}
      </span>
      <span className={theme === 'dark' ? 'text-xl sm:text-2xl font-black text-cyan-400' : 'text-xl sm:text-2xl font-black text-blue-600'}>
        {suffix}
      </span>
    </span>
  )
}

export default function LandingPage({ onExplore, onOpenCopilot, onNavigateTab, theme }) {
  const [quickQuery, setQuickQuery] = useState('')

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    if (!quickQuery.trim()) return
    onOpenCopilot(quickQuery.trim())
    setQuickQuery('')
  }

  const promptChips = [
    "Colleges for BSc CSIT in Kathmandu under 8 Lakhs",
    "TU Pulchowk vs KU Computer Engineering",
    "TU IOE Entrance 2082 Exam Pattern & Syllabus",
    "What can I study with 3.2 GPA in Management?",
    "CEE Medical Entrance eligibility & quota rules"
  ]

  const metrics = [
    { label: "Accredited Universities", num: 27, suffix: "+", change: "Central & Provincial" },
    { label: "Verified Degree Programs", num: 15, suffix: "+", change: "BSc CSIT, BE, CEE, BCA" },
    { label: "Constituent & Affiliated Colleges", num: 1400, suffix: "+", change: "All 7 Provinces" },
    { label: "Real-time Verification", num: 100, suffix: "%", change: "Level 1 Authoritative" }
  ]

  const featurePillars = [
    {
      icon: Compass,
      title: "Context-Aware Autonomous Counselor",
      description: "Chat with an AI that remembers your GPA, stream, and preferred location. Ask follow-up questions naturally without repeating your budget or interests.",
      badge: "Gemini 2.5 Flash",
      badgeColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
      action: () => onOpenCopilot(),
      actionText: "Chat with Counselor",
      iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      icon: Calendar,
      title: "National Entrance Exam Radar",
      description: "Live countdowns, official syllabi, negative marking notes, and registration links for TU IOE, KU KUCAT, MEC CEE, and CSIT.",
      badge: "Real-time Updates",
      badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      action: () => onNavigateTab('entrance'),
      actionText: "Explore Entrance Exams",
      iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: Award,
      title: "Loksewa Aayog Radar & Exam Notices",
      description: "Real-time notices, official vacancies, published merit results, and examination calendars for Federal & Provincial Public Service Commissions.",
      badge: "PSC Nepal",
      badgeColor: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
      action: () => onNavigateTab('loksewa'),
      actionText: "Explore Loksewa Radar",
      iconColor: "text-red-500 bg-red-500/10 border-red-500/20"
    },
    {
      icon: Flame,
      title: "Climate & Strike Emergency Alerts",
      description: "Real-time hazard, flood, and transportation advisories tied directly to university campuses with verified advisory impact notices.",
      badge: "Safety Radar",
      badgeColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
      action: () => onNavigateTab('alerts'),
      actionText: "View Live Alerts",
      iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    }
  ]

  return (
    <div className="space-y-16 sm:space-y-24 animate-fadeIn pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span>Nepal&apos;s #1 Autonomous Higher Education Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-balance text-slate-900 dark:text-white">
          Your intelligent guide to studying in{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            Nepal
          </span>
        </h1>

        <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Explore 27+ universities, 1,400+ colleges, verified tuition costs, entrance patterns, and cutoff metrics with zero fabrication.
        </p>

        {/* Interactive AI Prompt Box */}
        <div className="pt-4 max-w-2xl mx-auto">
          <form 
            onSubmit={handlePromptSubmit}
            className={`p-2 rounded-2xl border shadow-xl flex items-center gap-2 transition-all ${
              theme === 'dark' 
                ? 'bg-[#0E1424] border-slate-700/80 focus-within:border-blue-500 shadow-blue-500/5' 
                : 'bg-white border-slate-300 focus-within:border-blue-600 shadow-slate-200'
            }`}
          >
            <div className="pl-3">
              <Bot className="w-5 h-5 text-blue-500" />
            </div>
            <input 
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Ask anything: e.g. Best colleges for BSc CSIT in Kathmandu under 7 Lakhs..."
              className={`flex-1 bg-transparent py-2.5 px-2 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            />
            <button
              type="submit"
              className="btn-interactive px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Pills with Hover Micro-Interactions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Try:</span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onOpenCopilot(chip)}
                className={`btn-interactive text-[11px] px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white hover:bg-blue-950/40 hover:shadow-md hover:shadow-blue-500/20'
                    : 'bg-slate-100/90 border-slate-200 text-slate-800 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-500/15'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Option Action Buttons with Hover Effects */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-6">
          <button
            onClick={() => onNavigateTab('universities')}
            className="btn-interactive px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Explore Universities</span>
          </button>
          
          <button
            onClick={() => onNavigateTab('entrance')}
            className={`btn-interactive px-6 py-3.5 rounded-2xl border-2 font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 text-white hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-500/20'
                : 'bg-white border-emerald-500/50 hover:border-emerald-600 text-slate-900 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-500/20'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Entrance Exam Center</span>
          </button>

          <button
            onClick={() => onNavigateTab('briefing')}
            className={`btn-interactive px-6 py-3.5 rounded-2xl border-2 font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-purple-500/40 hover:border-purple-400 text-white hover:bg-purple-950/40 hover:shadow-lg hover:shadow-purple-500/20'
                : 'bg-white border-purple-500/50 hover:border-purple-600 text-slate-900 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-500/20'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-500" />
            <span>Student Dashboard</span>
          </button>
        </div>
      </section>

      {/* Metrics Bar with Animated Digital Format */}
      <section className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl border shadow-xl card-3d relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0E1424]/90 border-slate-800 shadow-cyan-950/20' 
          : 'bg-white border-slate-200/90 shadow-slate-200'
      }`}>
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1.5 text-center md:text-left p-3 rounded-2xl transition-all hover:bg-blue-500/5">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <AnimatedDigitalNumber target={m.num} suffix={m.suffix} theme={theme} />
            </div>
            <span className="text-xs sm:text-sm font-black block text-slate-900 dark:text-slate-100">{m.label}</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold block">{m.change}</span>
          </div>
        ))}
      </section>

      {/* 4 Feature Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Engineered for Nepal&apos;s Ambitious Students
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Built from scratch to eliminate education fraud, inaccurate fees, and outdated entrance notices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featurePillars.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={idx}
                onClick={p.action}
                className={`p-6 sm:p-8 rounded-3xl border card-3d transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#0E1424] border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10'
                    : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/15'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all ${p.iconColor || 'text-blue-500 bg-blue-500/10 border-blue-500/20'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${p.badgeColor || 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'}`}>
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    {p.description}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={(e) => { e.stopPropagation(); p.action(); }}
                    className="btn-interactive inline-flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <span>{p.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Verification Policy Banner */}
      <section className={`p-8 rounded-3xl border text-center space-y-4 card-3d ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-950/30 via-indigo-950/40 to-purple-950/30 border-blue-500/30'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-sm'
      }`}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Anti-Hallucination Policy</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Only Official Registries. Zero Commercial Bias.
        </h3>
        <p className={`text-xs sm:text-sm max-w-2xl mx-auto font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          Every degree requirement, entrance deadline, and fee estimation is tied directly to published notices from Tribhuvan University, Kathmandu University, Pokhara University, and the Ministry of Education.
        </p>
      </section>
    </div>
  )
}
