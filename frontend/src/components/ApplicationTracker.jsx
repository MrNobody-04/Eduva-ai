import React, { useState, useEffect } from 'react'
import { 
  CheckCircle2, Clock, Plus, AlertCircle, FileText, 
  ExternalLink, Trash2, Calendar, ShieldCheck, ArrowRight, 
  CheckSquare, Square, Bot, Sparkles, GraduationCap, Building2, ChevronRight
} from 'lucide-react'

export default function ApplicationTracker({ theme, onOpenCopilot }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  
  // Document checklist persisted in localStorage
  const [docChecklist, setDocChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('eduva_docs_checklist')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      see_marksheet: true,
      see_character: true,
      plus2_transcript: true,
      plus2_character: false,
      citizenship: true,
      photos: true,
      payment_voucher: false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('eduva_docs_checklist', JSON.stringify(docChecklist))
    } catch (e) {}
  }, [docChecklist])

  const toggleDoc = (key) => {
    setDocChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const [newApp, setNewApp] = useState({
    institution: '',
    program: '',
    portal_url: '',
    application_fee: '',
    deadline: '',
    status: 'IN_PROGRESS',
    notes: ''
  })

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data)
        } else {
          // Provide clean guided starting templates for Nepal admissions
          setApplications([
            {
              id: 'app_tu_ioe',
              institution: 'Pulchowk Campus (IOE TU)',
              program: 'B.E. Computer Engineering',
              portal_url: 'https://entrance.ioe.edu.np',
              application_fee: 'NPR 2,000',
              deadline: '2026-09-27',
              status: 'ENTRANCE_APPLIED',
              current_step: 2,
              notes: 'Downloaded registration form. Need to print admit card 3 days prior to exam.'
            },
            {
              id: 'app_ku_eng',
              institution: 'Kathmandu University (KU)',
              program: 'B.Tech in Artificial Intelligence',
              portal_url: 'https://kucat.ku.edu.np',
              application_fee: 'NPR 2,200',
              deadline: '2026-09-25',
              status: 'DOCUMENTS_READY',
              current_step: 1,
              notes: 'Verified +2 Science marks. Preparing for KUCAT Computer-Based Test.'
            }
          ])
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleCreateApplication = async (e) => {
    e.preventDefault()
    if (!newApp.institution || !newApp.program) return
    const appItem = {
      id: 'app_' + Date.now(),
      ...newApp,
      current_step: 1
    }
    setApplications(prev => [appItem, ...prev])
    setIsNewModalOpen(false)
    setNewApp({
      institution: '',
      program: '',
      portal_url: '',
      application_fee: '',
      deadline: '',
      status: 'IN_PROGRESS',
      notes: ''
    })
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appItem)
      })
    } catch (err) {}
  }

  const handleDeleteApplication = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  const handleNextStep = (id) => {
    setApplications(prev => prev.map(a => {
      if (a.id === id) {
        const nextStep = Math.min(5, (a.current_step || 1) + 1)
        return { ...a, current_step: nextStep }
      }
      return a
    }))
  }

  // Calculate doc readiness percentage
  const docKeys = Object.keys(docChecklist)
  // Calculate doc readiness percentage
  const docList = [
    { id: 'see_marksheet', label: 'Class 10 (SEE) Grade-sheet / Marksheet', required: true },
    { id: 'see_character', label: 'SEE Character / Transfer Certificate', required: true },
    { id: 'plus2_transcript', label: '+2 / Intermediate Official Transcript', required: true },
    { id: 'plus2_character', label: '+2 Character / Migration Certificate', required: true },
    { id: 'citizenship', label: 'Nepali Citizenship or National ID (NID) Card', required: true },
    { id: 'photos', label: 'Recent Passport Size Photographs (PP, 35x45mm)', required: true },
    { id: 'payment_voucher', label: 'Bank Deposit / ConnectIPS / eSewa Voucher Slip', required: false }
  ]
  const completedDocsCount = docList.filter(d => docChecklist[d.id]).length
  const docPercent = Math.round((completedDocsCount / docList.length) * 100)

  const MILESTONE_STEPS = [
    { step: 1, name: 'Eligibility & Docs', desc: 'Transcript, NID & Marksheets verified' },
    { step: 2, name: 'Entrance Form', desc: 'Online portal submitted & fee paid' },
    { step: 3, name: 'Admit Card & Exam', desc: 'Admit card printed & entrance test taken' },
    { step: 4, name: 'Merit & Quota', desc: 'Rank published & campus priority selected' },
    { step: 5, name: 'Admission & Seat', desc: 'Seat secured & fees deposited' }
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with clear purpose explanation */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-blue-950/40 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wide uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Step-by-Step Admission Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              My University Admission Journey
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Keep track of your university application deadlines, entrance examination admit cards, and mandatory Nepal education documents in one simple, clear dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add College / Program</span>
            </button>
            {onOpenCopilot && (
              <button
                onClick={() => onOpenCopilot('What documents and deadlines are needed for my college admission in Nepal?')}
                className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
                }`}
              >
                <Bot className="w-4 h-4 text-blue-500" />
                <span>Ask AI Advisor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Document Readiness Checklist + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Readiness Checklist (Left 2 cols) */}
        <div className={`lg:col-span-2 p-6 sm:p-7 rounded-3xl border shadow-sm ${
          theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Mandatory Nepal Admission Documents Checklist
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check off documents as you gather them. All universities (TU, KU, PU, PokU) require these.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Readiness</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">{docPercent}%</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                {completedDocsCount}/{docList.length}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {docList.map(doc => {
              const isChecked = !!docChecklist[doc.id]
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? (theme === 'dark' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200')
                      : (theme === 'dark' ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs sm:text-sm font-semibold block ${
                        isChecked 
                          ? (theme === 'dark' ? 'text-slate-200 line-through decoration-emerald-500/60' : 'text-slate-700 line-through decoration-emerald-600/60') 
                          : (theme === 'dark' ? 'text-slate-200' : 'text-slate-900')
                      }`}>
                        {doc.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {doc.required ? 'Mandatory for all admissions' : 'Applicable when fee voucher is paid'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    isChecked 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isChecked ? 'Ready' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Admission Advice & Quota Card (Right 1 col) */}
        <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Admission Rules in Nepal
              </h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Quota Reservation</span>
                Tribhuvan University (IOE) and MEC reserve seats for Government School graduates, Women, Indigenous (Janajati), and Underprivileged Districts (Pichhadiyeko Kshetra). Ensure recommendation letters from your Rural Municipality (Gaunpalika).
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Admit Card Policy</span>
                Must print color admit cards on A4 paper with original signature and carry the original citizenship/NID or SEE admit card inside the CBT exam hall.
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">Priority Counseling</span>
                After merit results are published, submit college and program preference orders within 48 to 72 hours online.
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onOpenCopilot && onOpenCopilot('Guide me through the step-by-step admission process in Nepal universities.')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Open Admission Guide with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Roadmap Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              My College Applications & 5-Step Milestones
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click &quot;Next Stage&quot; as you pass entrance milestones to monitor your exact progress towards campus enrollment.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            {applications.length} Active Targets
          </span>
        </div>

        {applications.length === 0 ? (
          <div className={`text-center py-16 px-4 rounded-3xl border border-dashed ${
            theme === 'dark' ? 'bg-[#0E1424]/40 border-slate-800' : 'bg-white border-slate-300'
          }`}>
            <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No college applications tracked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add the universities or colleges you intend to apply for to track deadlines and entrance stages.
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Add Your First Application
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const currentStep = app.current_step || 1
              return (
                <div
                  key={app.id}
                  className={`p-6 rounded-3xl border shadow-sm transition-all ${
                    theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {app.institution}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
                        {app.program}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {app.deadline && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Deadline: <strong className="text-slate-900 dark:text-white">{app.deadline}</strong></span>
                        </div>
                      )}

                      {app.application_fee && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          Fee: {app.application_fee}
                        </span>
                      )}

                      {app.portal_url && (
                        <a
                          href={app.portal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 5-Step Milestone Roadmap */}
                  <div className="pt-6 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {MILESTONE_STEPS.map((m) => {
                        const isDone = currentStep > m.step
                        const isCurrent = currentStep === m.step
                        return (
                          <div
                            key={m.step}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                                : isDone
                                ? (theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700')
                                : (theme === 'dark' ? 'bg-slate-900/30 border-slate-800/60 text-slate-600' : 'bg-slate-50 border-slate-200/60 text-slate-400')
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isCurrent ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                              }`}>
                                Step {m.step}
                              </span>
                              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <div className="font-bold text-xs leading-snug">{m.name}</div>
                            <div className={`text-[10px] mt-1 line-clamp-2 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                              {m.desc}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bottom Action Footer for Card */}
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {app.notes ? (
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        &ldquo;{app.notes}&rdquo;
                      </p>
                    ) : (
                      <span className="text-slate-400">Current Phase: {MILESTONE_STEPS[currentStep - 1]?.name}</span>
                    )}

                    <div className="flex items-center gap-2">
                      {currentStep < 5 && (
                        <button
                          onClick={() => handleNextStep(app.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Advance to Step {currentStep + 1}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {currentStep === 5 && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Admission Completed!</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base sm:text-lg font-black">Add College / Program to Tracker</h3>
            <form onSubmit={handleCreateApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Institution / University</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pulchowk Campus, Kathmandu University, Pokhara University"
                  value={newApp.institution}
                  onChange={(e) => setNewApp({ ...newApp, institution: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Program / Degree</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.E. Computer Engineering, BSc CSIT, BBA, MBBS"
                  value={newApp.program}
                  onChange={(e) => setNewApp({ ...newApp, program: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Application Deadline</label>
                  <input
                    type="date"
                    value={newApp.deadline}
                    onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Application Fee</label>
                  <input
                    type="text"
                    placeholder="e.g. NPR 2,000"
                    value={newApp.application_fee}
                    onChange={(e) => setNewApp({ ...newApp, application_fee: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Official Portal URL</label>
                <input
                  type="url"
                  placeholder="https://entrance.ioe.edu.np"
                  value={newApp.portal_url}
                  onChange={(e) => setNewApp({ ...newApp, portal_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Personal Notes / Reminders</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Need to collect character certificate from +2 college or recommendation letter..."
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

