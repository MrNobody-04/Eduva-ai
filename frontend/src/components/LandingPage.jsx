import React, { useState } from 'react'
import { ArrowRight, Bot, Building2, Calendar, CheckCircle2, Compass, GraduationCap, MapPin, ShieldCheck, Sparkles } from 'lucide-react'

const metrics = [
  ['27+', 'Universities', 'Central, provincial & specialist'],
  ['1,400+', 'Colleges', 'Across all seven provinces'],
  ['15+', 'Degree pathways', 'Requirements mapped clearly'],
  ['Level 1', 'Source standard', 'Official notices first']
]

const pathways = [
  { no: '01', title: 'Find your direction', text: 'Match your stream, GPA, location and budget with the programs open to you.', action: 'Explore degrees', tab: 'courses' },
  { no: '02', title: 'Compare with context', text: 'Read the differences that matter: affiliation, entrance route, fees and verified details.', action: 'Compare universities', tab: 'compare' },
  { no: '03', title: 'Move with confidence', text: 'Track entrance dates, applications and official changes in one calm workspace.', action: 'Open entrance radar', tab: 'entrance' }
]

export default function LandingPage({ onOpenCopilot, onNavigateTab }) {
  const [query, setQuery] = useState('')
  const submit = (event) => { event.preventDefault(); if (query.trim()) { onOpenCopilot(query.trim()); setQuery('') } }

  return (
    <div className="pb-16 animate-fadeIn">
      <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-16 pt-8 sm:pt-16 pb-14 lg:pb-20 items-center">
        <div className="max-w-3xl">
          <div className="editorial-label flex items-center gap-2 mb-6"><Sparkles className="w-4 h-4" /> Nepal higher education intelligence</div>
          <h1 className="text-[2.7rem] sm:text-6xl lg:text-7xl font-extrabold tracking-[-.065em] leading-[.98] text-[var(--text-heading)]">
            The intelligence layer<br />for higher education<br /><span className="text-[var(--primary)]">in Nepal.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base sm:text-lg leading-8 text-[var(--text-secondary)]">
            Clear, verified information for every university decision—from choosing a degree to preparing for entrance and tracking your next move.
          </p>
          <form onSubmit={submit} className="editorial-surface mt-9 p-2 rounded-xl flex gap-2 items-center max-w-2xl focus-within:border-[var(--primary)] transition-colors">
            <Bot className="ml-3 w-5 h-5 text-[var(--primary)] shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent py-3 px-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" placeholder="Ask about a course, college, entrance or scholarship" />
            <button type="submit" className="button-primary rounded-lg px-4 sm:px-5 py-3 text-sm font-bold shrink-0 flex gap-2 items-center"><span className="hidden sm:inline">Ask Eduva</span><ArrowRight className="w-4 h-4" /></button>
          </form>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-xs font-semibold text-[var(--text-secondary)]">
            <button onClick={() => onOpenCopilot('What can I study with 3.2 GPA in Management?')} className="hover:text-[var(--primary)]">What can I study with 3.2 GPA? →</button>
            <button onClick={() => onOpenCopilot('Compare TU Pulchowk and KU Computer Engineering')} className="hover:text-[var(--primary)]">TU Pulchowk vs KU →</button>
          </div>
          <div className="flex flex-wrap gap-3 mt-9">
            <button onClick={() => onNavigateTab('universities')} className="button-primary rounded-lg px-5 py-3.5 text-sm font-bold flex gap-2 items-center"><Building2 className="w-4 h-4" /> Explore universities</button>
            <button onClick={() => onNavigateTab('entrance')} className="button-secondary rounded-lg px-5 py-3.5 text-sm font-bold flex gap-2 items-center"><Calendar className="w-4 h-4 text-[var(--verified)]" /> Entrance radar</button>
          </div>
        </div>

        <div className="relative min-h-[390px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 sm:p-8 shadow-[var(--shadow-editorial)]">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(#E4E7EC 1px, transparent 1px), linear-gradient(90deg, #E4E7EC 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start"><div><p className="editorial-label">Education network</p><h2 className="text-xl font-extrabold tracking-tight mt-1">Your next decision,<br />connected.</h2></div><div className="verified-badge rounded-full px-3 py-1.5 text-xs font-bold flex gap-1.5 items-center"><CheckCircle2 className="w-3.5 h-3.5" /> Verified data</div></div>
            <div className="relative grow my-7">
              <div className="absolute left-[12%] top-[24%] w-3 h-3 rounded-full bg-[var(--verified)] ring-8 ring-[#E7F5F1]" />
              <div className="absolute left-[42%] top-[12%] w-4 h-4 rounded-full bg-[var(--primary)] ring-8 ring-indigo-100" />
              <div className="absolute right-[14%] top-[35%] w-3 h-3 rounded-full bg-[var(--primary)] ring-8 ring-indigo-100" />
              <div className="absolute left-[34%] bottom-[7%] w-3 h-3 rounded-full bg-[#E76F51] ring-8 ring-orange-100" />
              <div className="absolute left-[14%] top-[28%] w-[30%] h-px bg-indigo-300 rotate-[-18deg] origin-left" /><div className="absolute left-[45%] top-[16%] w-[38%] h-px bg-indigo-300 rotate-[19deg] origin-left" /><div className="absolute left-[38%] top-[17%] h-[58%] w-px bg-indigo-200 rotate-[19deg] origin-top" />
              <div className="absolute left-0 bottom-0 editorial-surface rounded-xl p-4 w-48"><div className="flex items-center gap-2 text-[var(--verified)] text-xs font-bold"><ShieldCheck className="w-4 h-4" /> Official source</div><p className="text-sm font-bold mt-2">TU entrance update</p><p className="text-xs text-[var(--text-secondary)] mt-1">Checked against notice board</p></div>
              <div className="absolute right-0 top-[56%] editorial-surface rounded-xl p-4 w-48"><p className="text-xs font-bold text-[var(--primary)]">PATHWAY MATCH</p><p className="text-sm font-bold mt-2">BSc CSIT</p><p className="text-xs text-[var(--text-secondary)] mt-1">14 matching colleges</p></div>
            </div>
            <div className="grid grid-cols-3 border-t border-[var(--border-subtle)] pt-4 text-xs"><div><p className="text-[var(--text-muted)]">Universities</p><p className="text-lg font-extrabold">27</p></div><div><p className="text-[var(--text-muted)]">Sources</p><p className="text-lg font-extrabold">Level 1</p></div><div><p className="text-[var(--text-muted)]">Coverage</p><p className="text-lg font-extrabold">7 provinces</p></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-subtle)] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-subtle)] bg-[var(--surface-1)]">
        {metrics.map(([number, label, detail]) => <div key={label} className="p-5 sm:p-7"><div className="text-2xl sm:text-3xl font-extrabold tracking-[-.06em] text-[var(--text-heading)]">{number}</div><div className="text-sm font-bold mt-1">{label}</div><div className="text-xs mt-1.5 text-[var(--text-secondary)]">{detail}</div></div>)}
      </section>

      <section className="py-16 sm:py-24 grid lg:grid-cols-[.72fr_1.28fr] gap-10 lg:gap-16">
        <div><p className="editorial-label">A calmer way forward</p><h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-.05em] leading-tight mt-3">Every choice deserves better information.</h2><p className="mt-5 text-[var(--text-secondary)] leading-7">Eduva turns scattered notices, eligibility rules, and institutional details into a practical decision system built around you.</p></div>
        <div className="border-t border-[var(--border-subtle)]">{pathways.map((item) => <button key={item.no} onClick={() => onNavigateTab(item.tab)} className="group grid grid-cols-[44px_1fr_auto] text-left gap-4 sm:gap-6 w-full py-6 border-b border-[var(--border-subtle)] hover:bg-[var(--surface-1)] px-2 transition-colors"><span className="text-sm font-bold text-[var(--primary)]">{item.no}</span><span><span className="block font-bold text-lg">{item.title}</span><span className="block text-sm leading-6 text-[var(--text-secondary)] mt-1">{item.text}</span></span><ArrowRight className="w-5 h-5 mt-1 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" /></button>)}</div>
      </section>

      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] overflow-hidden grid md:grid-cols-[1fr_.85fr]">
        <div className="p-8 sm:p-12"><div className="verified-badge inline-flex gap-2 items-center rounded-full px-3 py-1.5 text-xs font-bold"><ShieldCheck className="w-4 h-4" /> Verification is a feature</div><h2 className="text-3xl font-extrabold tracking-[-.05em] mt-5">Only official sources. No commercial bias.</h2><p className="mt-4 max-w-xl text-[var(--text-secondary)] leading-7">Every important claim is designed to carry its source and confidence—so you can understand what is confirmed, what changed, and what still needs checking.</p><button onClick={() => onNavigateTab('briefing')} className="mt-7 text-sm font-bold text-[var(--primary)] flex gap-2 items-center">View your education briefing <ArrowRight className="w-4 h-4" /></button></div>
        <div className="bg-[var(--surface-2)] p-8 sm:p-12 flex flex-col justify-center gap-5"><div className="flex gap-3 items-center"><span className="w-2.5 h-2.5 rounded-full bg-[var(--verified)]" /><span className="text-sm font-bold">Verified university data</span></div><div className="flex gap-3 items-center"><MapPin className="w-4 h-4 text-[var(--primary)]" /><span className="text-sm text-[var(--text-secondary)]">National and provincial coverage</span></div><div className="flex gap-3 items-center"><GraduationCap className="w-4 h-4 text-[var(--primary)]" /><span className="text-sm text-[var(--text-secondary)]">Entrance, programs and applications</span></div></div>
      </section>
    </div>
  )
}
