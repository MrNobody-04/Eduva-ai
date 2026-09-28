import React, { useState } from 'react'
import {
  ArrowRight, Award, Bell, BookOpen, Bot, Building2, Calendar, CheckCircle2, ClipboardList,
  GitCompare, GraduationCap, Landmark, MapPin, School, ShieldCheck, Sparkles, Trophy
} from 'lucide-react'

const metrics = [
  ['27+', 'Universities', 'Central, provincial and specialist institutions'],
  ['1,400+', 'Colleges', 'Constituent and affiliated, across seven provinces'],
  ['15+', 'Degree pathways', 'Eligibility requirements mapped clearly'],
  ['Level 1', 'Source standard', 'Official notices are checked first']
]

const quickStart = [
  { icon: Sparkles, title: 'What can I study?', text: 'Enter your +2 stream and GPA to see the degrees you qualify for.', tab: 'courses' },
  { icon: GitCompare, title: 'Compare universities', text: 'Put up to four institutions side by side.', tab: 'compare' },
  { icon: Calendar, title: 'Entrance radar', text: 'Dates, fees and official links for every major exam.', tab: 'entrance' },
  { icon: Award, title: 'Scholarships', text: 'Funding options and how to apply.', tab: 'scholarships' }
]

const features = [
  { icon: Building2, title: 'University discovery', text: 'Profiles, faculties, programs and affiliated colleges for every university.', tab: 'universities' },
  { icon: School, title: 'College directory', text: 'Search colleges by name, location and program.', tab: 'colleges' },
  { icon: GraduationCap, title: 'Degree matcher', text: 'Requirements, duration and the entrance route for each degree.', tab: 'courses' },
  { icon: Calendar, title: 'Entrance exams', text: 'Registration deadlines, patterns and syllabus for IOE, KUCAT, CEE, CMAT and CSIT.', tab: 'entrance' },
  { icon: Trophy, title: 'Merit results', text: 'Search published entrance merit ranks and download a scorecard.', tab: 'results' },
  { icon: Award, title: 'Scholarships', text: 'Eligibility, coverage and deadlines in one list.', tab: 'scholarships' },
  { icon: Landmark, title: 'Loksewa radar', text: 'Public service vacancies, results and the examination calendar.', tab: 'loksewa' },
  { icon: ClipboardList, title: 'Application tracker', text: 'Follow each application from form to admission.', tab: 'applications' },
  { icon: Bell, title: 'Safety and alerts', text: 'Hazard and transport advisories tied to campuses.', tab: 'alerts' }
]

const steps = [
  { no: '01', title: 'Tell us where you are', text: 'Share your stream, GPA, location and budget once. Eduva remembers it across the app.' },
  { no: '02', title: 'See what is open to you', text: 'Programs are matched to official prerequisites and marked eligible, possible or not eligible.' },
  { no: '03', title: 'Act on verified information', text: 'Follow the official link, track your application and get notified when a notice changes.' }
]

const exams = [
  ['IOE Entrance', 'Engineering, Tribhuvan University'],
  ['CEE', 'Medical, Medical Education Commission'],
  ['KUCAT', 'Kathmandu University'],
  ['CMAT', 'Management, Tribhuvan University'],
  ['CSIT Entrance', 'Computer science, Tribhuvan University']
]

const sourceLevels = [
  ['Level 1', 'Official', 'University, ministry and commission notices. Shown as verified.'],
  ['Level 2', 'Trusted', 'Established education bodies. Shown with its source.'],
  ['Level 3', 'Discovery', 'Newly found information. Marked as requiring verification.']
]

export default function LandingPage({ onOpenCopilot, onNavigateTab }) {
  const [query, setQuery] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (query.trim()) { onOpenCopilot(query.trim()); setQuery('') }
  }

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 pt-6 sm:pt-12 pb-12 lg:pb-16 items-start">
        <div>
          <div className="editorial-label flex items-center gap-2 mb-5"><Sparkles className="w-4 h-4" /> Nepal higher education intelligence</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-[var(--text-heading)]">
            Choose the right university with <span className="text-[var(--primary)]">verified</span> information.
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-[var(--text-secondary)]">
            Degrees, colleges, entrance exams, scholarships and deadlines for Nepal, checked against official sources so you always know what is confirmed.
          </p>

          <form onSubmit={submit} className="editorial-surface mt-8 p-2 rounded-xl flex gap-2 items-center max-w-2xl">
            <Bot className="ml-3 w-5 h-5 text-[var(--primary)] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-3 px-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Ask about a course, college, entrance exam or scholarship"
              aria-label="Ask Eduva"
            />
            <button type="submit" className="button-primary rounded-lg px-4 sm:px-5 py-3 text-sm font-bold shrink-0 flex gap-2 items-center">
              <span className="hidden sm:inline">Ask Eduva</span><ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {['What can I study with 3.2 GPA in Management?', 'Compare TU Pulchowk and KU Computer Engineering', 'Best colleges for BSc CSIT in Kathmandu'].map((q) => (
              <button key={q} onClick={() => onOpenCopilot(q)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-secondary)] cursor-pointer">
                {q}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <button onClick={() => onNavigateTab('universities')} className="button-primary rounded-lg px-5 py-3.5 text-sm font-bold flex gap-2 items-center"><Building2 className="w-4 h-4" /> Explore universities</button>
            <button onClick={() => onNavigateTab('entrance')} className="button-secondary rounded-lg px-5 py-3.5 text-sm font-bold flex gap-2 items-center"><Calendar className="w-4 h-4 text-[var(--verified)]" /> Entrance radar</button>
          </div>
        </div>

        <aside className="editorial-surface rounded-2xl p-5 sm:p-6" aria-label="Quick start">
          <p className="editorial-label">Start here</p>
          <h2 className="text-xl font-extrabold tracking-tight mt-1 mb-4">Pick where you are in the journey</h2>
          <div className="space-y-3">
            {quickStart.map(({ icon: Icon, title, text, tab }) => (
              <button key={title} onClick={() => onNavigateTab(tab)} className="w-full text-left flex gap-4 items-start p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] cursor-pointer">
                <span className="w-10 h-10 rounded-lg bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-sm text-[var(--text-heading)]">{title}</span>
                  <span className="block text-xs leading-5 text-[var(--text-secondary)] mt-0.5">{text}</span>
                </span>
                <ArrowRight className="w-4 h-4 mt-1 text-[var(--text-muted)] shrink-0" />
              </button>
            ))}
          </div>
        </aside>
      </section>

      {/* Coverage */}
      <section className="border-y border-[var(--border-subtle)] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-subtle)] bg-[var(--surface-1)]" aria-label="Coverage">
        {metrics.map(([number, label, detail]) => (
          <div key={label} className="p-5 sm:p-7">
            <div className="text-3xl font-extrabold tracking-tight text-[var(--text-heading)]">{number}</div>
            <div className="text-sm font-bold mt-1">{label}</div>
            <div className="text-xs mt-1.5 leading-5 text-[var(--text-secondary)]">{detail}</div>
          </div>
        ))}
      </section>

      {/* Everything in one place */}
      <section className="pt-16 sm:pt-20">
        <p className="editorial-label">Everything in one place</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 max-w-2xl">Nine tools that cover the whole admission journey.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {features.map(({ icon: Icon, title, text, tab }) => (
            <button key={title} onClick={() => onNavigateTab(tab)} className="text-left p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] cursor-pointer flex flex-col">
              <span className="w-10 h-10 rounded-lg bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></span>
              <span className="font-bold text-base text-[var(--text-heading)]">{title}</span>
              <span className="text-sm leading-6 text-[var(--text-secondary)] mt-1.5 grow">{text}</span>
              <span className="text-xs font-bold text-[var(--primary)] mt-4 flex items-center gap-1.5">Open <ArrowRight className="w-3.5 h-3.5" /></span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pt-16 sm:pt-24 grid lg:grid-cols-[.7fr_1.3fr] gap-10 lg:gap-16">
        <div>
          <p className="editorial-label">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mt-2">From confused to confident in three steps.</h2>
          <p className="mt-4 text-[var(--text-secondary)] leading-7">Eduva turns scattered notices and eligibility rules into a decision system built around your profile.</p>
        </div>
        <ol className="border-t border-[var(--border-subtle)]">
          {steps.map((s) => (
            <li key={s.no} className="grid grid-cols-[44px_1fr] gap-4 sm:gap-6 py-6 border-b border-[var(--border-subtle)]">
              <span className="text-sm font-bold text-[var(--primary)]">{s.no}</span>
              <span>
                <span className="block font-bold text-lg text-[var(--text-heading)]">{s.title}</span>
                <span className="block text-sm leading-6 text-[var(--text-secondary)] mt-1">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Entrance exams */}
      <section className="pt-16 sm:pt-24">
        <p className="editorial-label">Entrance exams covered</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">The exams students ask about most.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {exams.map(([name, who]) => (
            <button key={name} onClick={() => onOpenCopilot(`Tell me about the ${name}: eligibility, pattern and deadlines`)} className="text-left p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] cursor-pointer">
              <BookOpen className="w-5 h-5 text-[var(--primary)] mb-3" />
              <span className="block font-bold text-[var(--text-heading)]">{name}</span>
              <span className="block text-xs leading-5 text-[var(--text-secondary)] mt-1">{who}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mt-16 sm:mt-24 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] overflow-hidden grid md:grid-cols-[1fr_1fr]">
        <div className="p-8 sm:p-12">
          <div className="verified-badge inline-flex gap-2 items-center rounded-full px-3 py-1.5 text-xs font-bold"><ShieldCheck className="w-4 h-4" /> Verification is a feature</div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-5">Every claim shows how sure we are.</h2>
          <p className="mt-4 text-[var(--text-secondary)] leading-7">Information is graded by where it came from. Nothing is labelled verified unless an official source confirms it, and unconfirmed details are clearly marked.</p>
          <button onClick={() => onNavigateTab('briefing')} className="mt-7 text-sm font-bold text-[var(--primary)] flex gap-2 items-center cursor-pointer">Open your briefing <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="bg-[var(--surface-2)] p-8 sm:p-12 space-y-5">
          {sourceLevels.map(([level, name, text]) => (
            <div key={level} className="flex gap-4 items-start">
              <span className="verified-badge rounded-md px-2.5 py-1 text-[11px] font-black shrink-0">{level}</span>
              <span>
                <span className="block text-sm font-bold text-[var(--text-heading)]">{name}</span>
                <span className="block text-sm leading-6 text-[var(--text-secondary)]">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-16 sm:mt-24 text-center max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 text-[var(--text-muted)] text-xs font-semibold items-center mb-4"><MapPin className="w-4 h-4 text-[var(--primary)]" /> Built for students across Nepal</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to find your program?</h2>
        <p className="mt-4 text-[var(--text-secondary)] leading-7">Start with the degree matcher, or ask Eduva anything about admission in Nepal.</p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <button onClick={() => onNavigateTab('courses')} className="button-primary rounded-lg px-6 py-3.5 text-sm font-bold flex gap-2 items-center"><CheckCircle2 className="w-4 h-4" /> Find my degree</button>
          <button onClick={() => onOpenCopilot()} className="button-secondary rounded-lg px-6 py-3.5 text-sm font-bold flex gap-2 items-center"><Bot className="w-4 h-4" /> Ask Eduva</button>
        </div>
      </section>
    </div>
  )
}
