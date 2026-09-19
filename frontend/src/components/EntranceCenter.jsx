import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, BookOpen, AlertCircle, FileText, 
  ExternalLink, Search, CheckCircle2, ChevronRight, X, ShieldCheck
} from 'lucide-react'

export default function EntranceCenter({ theme }) {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/entrance-exams')
        if (res.ok) {
          const data = await res.json()
          setExams(data)
        }
      } catch (err) {
        console.error('Failed to load entrance exams:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [])

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.target_programs?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const calculateDaysLeft = (dateStr) => {
    if (!dateStr) return null
    const match = String(dateStr).match(/\d{4}-\d{2}-\d{2}/)
    if (!match) return null
    const target = new Date(match[0])
    if (isNaN(target.getTime())) return null
    const now = new Date()
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  }

  const getUrgencyBadge = (exam) => {
    let days = exam.days_remaining
    if (days === undefined || days === null || isNaN(days)) {
      days = calculateDaysLeft(exam.registration_deadline || exam.application_deadline || exam.exam_date)
    }
    if (days === null || isNaN(days)) {
      return { label: 'Open for Registration', class: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold' }
    }
    if (days < 0) {
      return { label: 'Concluded', class: 'bg-slate-500/15 text-slate-500 dark:text-slate-400 border-slate-500/30 font-bold' }
    }
    if (days === 0) {
      return { label: 'Closing Today', class: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40 font-black animate-pulse' }
    }
    if (days <= 14) {
      return { label: `${days} Days Left`, class: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-black' }
    }
    if (days <= 30) {
      return { label: `${days} Days Left`, class: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold' }
    }
    return { label: `${days} Days Left`, class: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold' }
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-[#0B101E] border-slate-800/80'
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>National Entrance Exam Command Hub</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Entrance Exams, Syllabi & Deadlines
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Authentic registration windows, exam dates, syllabus breakdowns, negative marking penalties, and official PDF notices for TU IOE, KU KUCAT, MEC CEE, and more.
          </p>
        </div>

        {/* Search Input */}
        <div className="pt-4 max-w-md">
          <div className={`p-2 rounded-2xl border flex items-center gap-2 ${
            theme === 'dark' ? 'bg-[#060911] border-slate-700/80' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input 
              type="text" 
              placeholder="Search exam by title, university, or program (e.g. IOE, MBBS, BCA)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent py-1 text-xs font-medium focus:outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-xs font-semibold opacity-70 animate-pulse">
          Loading verified entrance examinations...
        </div>
      )}

      {/* Exams Grid with 3D Hover Effects & High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam, idx) => {
          const badge = getUrgencyBadge(exam)
          const deadline = exam.registration_deadline || exam.application_deadline || 'Announced Soon'
          const fee = exam.exam_fee || exam.application_fee || 'Standard Quota'
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 8) * 0.05, duration: 0.32, ease: 'easeOut' }}
              className={`card-3d p-6 rounded-3xl border transition-colors duration-300 flex flex-col justify-between group ${
                theme === 'dark'
                  ? 'bg-[#0B101E] border-slate-800/80 hover:border-blue-500/50 hover:shadow-depth-md'
                  : 'bg-white border-slate-200/90 hover:border-blue-500 hover:shadow-depth-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.class}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400">{fee}</span>
                </div>

                <div>
                  <h3 className={`text-base font-black transition-colors leading-snug ${
                    theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                  }`}>
                    {exam.title}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">{exam.university}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Registration Deadline: <strong className="text-slate-900 dark:text-slate-100 font-bold">{deadline}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Exam Date: <strong className="text-slate-900 dark:text-slate-100 font-bold">{exam.exam_date || 'Scheduled'}</strong></span>
                  </div>
                </div>

                {/* Target Programs */}
                {(exam.target_programs?.length > 0 || exam.course) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exam.target_programs ? exam.target_programs.map((p, idx) => (
                      <span key={idx} className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border ${
                        theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {p}
                      </span>
                    )) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold border ${
                        theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        {exam.course}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={`pt-5 border-t mt-4 flex items-center justify-between ${
                theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                <button
                  onClick={() => setSelectedExam(exam)}
                  className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {exam.official_notice_url && (
                  <a
                    href={exam.official_notice_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-xl transition-all ${
                      theme === 'dark' 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                        : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                    title="Official University Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modern Executive Syllabus Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-slide-up ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <h3 className="font-black text-base leading-tight">{selectedExam.title}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">{selectedExam.university}</p>
              </div>
              <button 
                onClick={() => setSelectedExam(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800/20 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Exam Pattern & Negative Marking */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Total Marks</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {selectedExam.pattern_json?.total_marks || selectedExam.total_marks || '100'}
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Exam Duration</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {selectedExam.pattern_json?.duration_mins ? `${selectedExam.pattern_json.duration_mins} Mins` : (selectedExam.exam_duration || '2 Hours')}
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Negative Marking</span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 block mt-1.5">
                    {selectedExam.pattern_json?.negative_marking || (selectedExam.negative_marking ? selectedExam.negative_marking_rate || '10% deduction' : 'None (0%)')}
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Registration Fee</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mt-1.5">
                    {selectedExam.exam_fee || selectedExam.application_fee || 'NPR 1,500'}
                  </span>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-3">
                <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Subject Weightage & Syllabus Breakdown
                </h4>
                <div className="space-y-2">
                  {selectedExam.pattern_json?.subjects ? (
                    selectedExam.pattern_json.subjects.map((sub, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <span className={`font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{sub.name}</span>
                          {sub.weightage && <span className="text-[10px] text-slate-400">Weightage: {sub.weightage}</span>}
                        </div>
                        <span className="font-black text-blue-600 dark:text-blue-400">{sub.marks} Marks</span>
                      </div>
                    ))
                  ) : selectedExam.syllabus_breakdown ? (
                    Object.entries(selectedExam.syllabus_breakdown).map(([subject, marks], idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3.5 rounded-xl border ${
                        theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{subject}</span>
                        <span className="font-black text-blue-600 dark:text-blue-400">{marks} Marks</span>
                      </div>
                    ))
                  ) : (
                    <div className={`p-3.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      {selectedExam.syllabus_summary || 'Detailed syllabus includes Physics, Chemistry, Mathematics, and English MCQ sections.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Eligibility & Guidelines */}
              {selectedExam.eligibility_criteria && (
                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  theme === 'dark' ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50/80 border-blue-200'
                }`}>
                  <h4 className="font-black text-blue-600 dark:text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Minimum Academic Eligibility</span>
                  </h4>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedExam.eligibility_criteria}
                  </p>
                </div>
              )}
            </div>

            <div className={`p-4 border-t flex items-center justify-end gap-3 ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              {selectedExam.official_notice_url && (
                <a
                  href={selectedExam.official_notice_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
                >
                  <span>Official Registration Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
