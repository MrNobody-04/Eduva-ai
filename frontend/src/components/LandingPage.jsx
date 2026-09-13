import React, { useState, useEffect } from 'react'
import { 
  Sparkles, GraduationCap, Building2, BookOpen, Compass, 
  ArrowRight, ShieldCheck, CheckCircle2, Search, Bot, 
  Calendar, Flame, TrendingUp, Award, Layers, Zap
} from 'lucide-react'

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
    "Compare TU Pulchowk vs KU Computer Engineering",
    "TU IOE Entrance 2081 Exam Pattern & Syllabus",
    "What can I study with 3.2 GPA in Management?",
    "CEE Medical Entrance eligibility & quota rules"
  ]

  const metrics = [
    { label: "Accredited Universities", value: "27+", change: "Central & Provincial" },
    { label: "Verified Degree Programs", value: "15+", change: "BSc CSIT, BE, CEE, BCA" },
    { label: "Constituent & Affiliated Colleges", value: "1,400+", change: "All 7 Provinces" },
    { label: "Real-time Verification", value: "100%", change: "Level 1 Authoritative" }
  ]

  const featurePillars = [
    {
      icon: Compass,
      title: "Context-Aware Autonomous Counselor",
      description: "Chat with an AI that remembers your GPA, stream, and preferred location. Ask follow-up questions naturally without repeating your budget or interests.",
      badge: "Gemini 2.5 Flash",
      action: () => onOpenCopilot(),
      actionText: "Chat with Counselor"
    },
    {
      icon: Calendar,
      title: "National Entrance Exam Radar",
      description: "Live countdowns, official syllabi, negative marking notes, and registration links for TU IOE, KU KUCAT, MEC CEE, and CSIT.",
      badge: "Real-time Updates",
      action: () => onNavigateTab('entrance'),
      actionText: "Explore Entrance Exams"
    },
    {
      icon: Layers,
      title: "Side-by-Side Comparison Matrix",
      description: "Compare universities and colleges across 12+ verified criteria, with autonomous AI comparative synthesis explaining pros, cons, and ROI.",
      badge: "AI Synthesis",
      action: () => onNavigateTab('compare'),
      actionText: "Open Compare Engine"
    },
    {
      icon: Flame,
      title: "Climate & Strike Emergency Alerts",
      description: "Real-time hazard, flood, and transportation advisories tied directly to university campuses with verified advisory impact notices.",
      badge: "Safety Radar",
      action: () => onNavigateTab('alerts'),
      actionText: "View Live Alerts"
    }
  ]

  return (
    <div className="space-y-16 sm:space-y-24 animate-fadeIn pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>Nepal's #1 Autonomous Higher Education Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-balance">
          Your intelligent guide to studying in{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Nepal
          </span>
        </h1>

        <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Explore 27+ universities, 1,400+ colleges, verified tuition costs, entrance patterns, and cutoff metrics with zero fabrication.
        </p>

        {/* Interactive AI Prompt Box */}
        <div className="pt-4 max-w-2xl mx-auto">
          <form 
            onSubmit={handlePromptSubmit}
            className={`p-2 rounded-2xl border shadow-2xl flex items-center gap-2 transition-all ${
              theme === 'dark' 
                ? 'bg-[#0E1424] border-slate-700/80 focus-within:border-blue-500/80 shadow-blue-500/5' 
                : 'bg-white border-slate-300 focus-within:border-blue-500 shadow-slate-200'
            }`}
          >
            <div className="pl-3">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <input 
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Ask anything: e.g. Best colleges for BSc CSIT in Kathmandu under 7 Lakhs..."
              className="flex-1 bg-transparent py-2.5 px-2 text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Try:</span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onOpenCopilot(chip)}
                className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-slate-900'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <button
            onClick={() => onNavigateTab('universities')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Explore Universities</span>
          </button>
          <button
            onClick={() => onNavigateTab('entrance')}
            className={`px-6 py-3 rounded-xl border font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Entrance Exam Center</span>
          </button>
          <button
            onClick={() => onNavigateTab('briefing')}
            className={`px-6 py-3 rounded-xl border font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/40 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Student Dashboard</span>
          </button>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl border shadow-xl ${
        theme === 'dark' ? 'bg-[#0E1424]/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1 text-center md:text-left">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent block">
              {m.value}
            </span>
            <span className="text-xs sm:text-sm font-bold block text-slate-300">{m.label}</span>
            <span className="text-[11px] text-slate-500 font-medium block">{m.change}</span>
          </div>
        ))}
      </section>

      {/* 4 Feature Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Engineered for Nepal's Ambitious Students
          </h2>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Built from scratch to eliminate education fraud, inaccurate fees, and outdated entrance notices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featurePillars.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between group ${
                  theme === 'dark'
                    ? 'bg-[#0E1424] border-slate-800 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-200'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-100">{p.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {p.description}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={p.action}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all cursor-pointer"
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
      <section className={`p-8 rounded-3xl border text-center space-y-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-950/20 via-indigo-950/30 to-purple-950/20 border-blue-500/30'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Anti-Hallucination Policy</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black">
          Only Official Registries. Zero Commercial Bias.
        </h3>
        <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Every degree requirement, entrance deadline, and fee estimation is tied directly to published notices from Tribhuvan University, Kathmandu University, Pokhara University, and the Ministry of Education.
        </p>
      </section>
    </div>
  )
}
