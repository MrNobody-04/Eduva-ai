import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Compass, Search, Filter, CheckCircle2, AlertCircle, 
  HelpCircle, GraduationCap, Clock, Award, ArrowRight, Sparkles, Building2, Sliders
} from 'lucide-react'

export default function CourseIntelligence({ theme }) {
  const [courses, setCourses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)

  // "What Can I Study?" Matcher State
  const [stream, setStream] = useState('SCIENCE')
  const [gpa, setGpa] = useState(3.85)
  const [location, setLocation] = useState('Kathmandu')
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Failed to load courses:', err))
  }, [])

  const handleEvaluate = async (e) => {
    e?.preventDefault()
    setIsEvaluating(true)
    try {
      const res = await fetch('/api/eligibility/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream, gpa: parseFloat(gpa), preferred_location: location })
      })
      if (res.ok) {
        const data = await res.json()
        setEvaluationResult(data)
      }
    } catch (err) {
      console.error('Eligibility check failed:', err)
    } finally {
      setIsEvaluating(false)
    }
  }

  // Run initial evaluation
  useEffect(() => {
    handleEvaluate()
  }, [])

  const categories = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'COMPUTING_AND_IT', label: 'Computing & IT' },
    { id: 'ENGINEERING', label: 'Engineering' },
    { id: 'MEDICINE_AND_HEALTH', label: 'Medicine & Health' },
    { id: 'BUSINESS_AND_MANAGEMENT', label: 'Management & BBA' },
    { id: 'AGRICULTURE_AND_FORESTRY', label: 'Agriculture & Forest' },
    { id: 'LAW_AND_LEGAL_STUDIES', label: 'Law (BALLB)' }
  ]

  const filteredCourses = courses.filter(c => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.primary_university.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nepal Higher Education Course Directory & Eligibility Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Academic Degree Intelligence & &ldquo;What Can I Study?&rdquo;
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Explore 40+ verified undergraduate degrees across Computing, Engineering, Medicine, and Management. Check your qualifying eligibility and find matching colleges with verified fee structures.
          </p>
        </div>
      </div>

      {/* "What Can I Study?" Interactive Tool */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-depth-md transition-all ${
        theme === 'dark' ? 'bg-[#0B101E] border-slate-800/80' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Personalized Study Pathway Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              What Can I Study After +2?
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Select your academic background and GPA to calculate guaranteed and potential degree pathways.
            </p>
          </div>

          {/* Quick Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">+2 Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <option value="SCIENCE">Science (+2)</option>
                <option value="MANAGEMENT">Management / Commerce</option>
                <option value="HUMANITIES">Humanities / Arts</option>
                <option value="EDUCATION">Education / Law</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Your GPA: {gpa}</label>
              <input
                type="range"
                min="2.0"
                max="4.0"
                step="0.05"
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full h-2 mt-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Preferred Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Kathmandu">Kathmandu Valley</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Biratnagar">Biratnagar</option>
                <option value="Chitwan">Chitwan</option>
                <option value="Butwal">Butwal / Bhairahawa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        {evaluationResult && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-400">
                ✓ {evaluationResult.summary.headline}
              </span>
              <span className="text-xs font-mono font-bold opacity-70">
                {evaluationResult.summary.eligible_count} Fully Eligible Programs Found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {evaluationResult.eligible_programs.slice(0, 6).map((prog, idx) => (
                <motion.div
                  key={prog.course_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-colors duration-200 hover:shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/10' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:shadow-blue-400/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ELIGIBLE
                      </span>
                      <h4 className="font-bold text-xs mt-2 text-slate-900 dark:text-white">{prog.course_name}</h4>
                      <span className="text-[11px] text-blue-400 font-bold block">{prog.degree_code}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>

                  <p className="text-[11px] opacity-70 mt-2 line-clamp-1">{prog.reasons[0]}</p>
                  
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                    <span className="opacity-60">{prog.duration}</span>
                    <span className="font-bold text-amber-400 truncate max-w-[120px]">{prog.entrance_exam}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search degrees (e.g. CSIT, MBBS)..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`p-5 sm:p-6 rounded-3xl border transition-all hover:shadow-2xl cursor-pointer flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-gray-900/80 border-gray-800 hover:border-blue-500/50'
                : 'bg-white border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    {course.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-base font-black mt-2 tracking-tight">
                    {course.name}
                  </h3>
                  <span className="text-xs font-bold text-blue-400">{course.code}</span>
                </div>
                <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                {course.overview}
              </p>

              <div className="space-y-1 text-xs pt-2 border-t border-gray-800/40">
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Primary University:</span>
                  <span className="font-bold text-xs truncate max-w-[170px]">{course.primary_university}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Duration:</span>
                  <span className="font-bold">{course.duration_years} Years ({course.semesters} Semesters)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Entrance Exam:</span>
                  <span className="font-bold text-amber-400 truncate max-w-[170px]">{course.entrance_exam}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-xs font-bold text-blue-500">
              <span>View Full Syllabus & Colleges</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-3xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  {selectedCourse.category.replace(/_/g, ' ')}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">{selectedCourse.name} ({selectedCourse.code})</h2>
                <p className="text-xs text-blue-400 font-semibold">{selectedCourse.primary_university}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-xl hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Overview</h4>
                <p className="mt-1 leading-relaxed">{selectedCourse.overview}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Eligibility Criteria</span>
                  <span className="font-semibold block mt-0.5">{selectedCourse.eligibility}</span>
                </div>
                <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Estimated Fee Range</span>
                  <span className="font-bold text-emerald-400 block mt-0.5">{selectedCourse.average_fee_range}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Career Paths & Roles</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedCourse.career_paths?.map((career, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[11px]">
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Core Foundation Subjects</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedCourse.key_subjects?.map((sub, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs">
              <span className="text-[10px] text-emerald-400 font-bold">✓ Official University Curriculum Verified (Level 1)</span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
