import React, { useState, useEffect } from 'react'
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

  const getUrgencyBadge = (days) => {
    if (days < 0) return { label: 'Concluded', class: 'bg-slate-500/10 text-slate-400 border-slate-500/30' }
    if (days <= 14) return { label: `${days} Days Left`, class: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold' }
    if (days <= 30) return { label: `${days} Days Left`, class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
    return { label: `${days} Days Left`, class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800'
          : 'bg-gradient-to-br from-white via-indigo-50/40 to-slate-50 border-slate-200'
      }`}>
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-wide uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>National Entrance Exam Command Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Entrance Exams, Syllabi & Deadlines
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Authentic registration windows, exam dates, syllabus breakdowns, negative marking penalties, and official PDF notices for TU IOE, KU KUCAT, MEC CEE, and more.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exam by title, university, or program (e.g. IOE, MBBS, BCA)..."
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-xs opacity-60 animate-pulse">
          Loading verified entrance examinations...
        </div>
      )}

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const badge = getUrgencyBadge(exam.days_remaining)
          return (
            <div
              key={exam.id}
              className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between group ${
                theme === 'dark'
                  ? 'bg-[#0E1424] border-slate-800 hover:border-blue-500/40'
                  : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.class}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{exam.exam_fee}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-100 group-hover:text-blue-400 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">{exam.university}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Registration Deadline: <strong className="text-slate-200">{exam.registration_deadline}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Exam Date: <strong className="text-slate-200">{exam.exam_date}</strong></span>
                  </div>
                </div>

                {/* Target Programs */}
                {exam.target_programs?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exam.target_programs.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedExam(exam)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Syllabus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {exam.official_notice_url && (
                  <a
                    href={exam.official_notice_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Official University Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Syllabus Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">{selectedExam.title}</h3>
                <p className="text-xs text-blue-400 font-semibold">{selectedExam.university}</p>
              </div>
              <button 
                onClick={() => setSelectedExam(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Exam Pattern & Negative Marking */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Marks</span>
                  <span className="text-base font-black text-blue-400">{selectedExam.total_marks || '140'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Exam Duration</span>
                  <span className="text-base font-black text-indigo-400">{selectedExam.exam_duration || '2 Hours'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Negative Marking</span>
                  <span className="text-xs font-black text-amber-400 block mt-1">
                    {selectedExam.negative_marking ? selectedExam.negative_marking_rate || '10% deduction' : 'None (0%)'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Registration Fee</span>
                  <span className="text-xs font-black text-emerald-400 block mt-1">{selectedExam.exam_fee}</span>
                </div>
              </div>

              {/* Subject Breakdown */}
              {selectedExam.syllabus_breakdown && (
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-slate-200">Subject Weightage & Syllabus</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedExam.syllabus_breakdown).map(([subject, marks], idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                        <span className="font-bold text-slate-300">{subject}</span>
                        <span className="font-black text-blue-400">{marks} Marks</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility & Guidelines */}
              {selectedExam.eligibility_criteria && (
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1.5">
                  <h4 className="font-black text-blue-300">Minimum Academic Eligibility</h4>
                  <p className="text-slate-300 leading-relaxed">{selectedExam.eligibility_criteria}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3">
              {selectedExam.official_notice_url && (
                <a
                  href={selectedExam.official_notice_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
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
