import React, { useState, useEffect } from 'react'
import { 
  Briefcase, Calendar, FileText, ExternalLink, Search, 
  CheckCircle2, Clock, Building, Award, AlertCircle, 
  Phone, Mail, MapPin, ChevronRight, Download, Filter, Sparkles
} from 'lucide-react'

export default function LoksewaRadar({ theme, onOpenCopilot }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vacancies') // 'vacancies' | 'results' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState('ALL')

  useEffect(() => {
    const fetchLoksewa = async () => {
      try {
        const res = await fetch('/api/loksewa')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error('Failed to load Loksewa data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchLoksewa()
  }, [])

  const vacancies = data?.vacancies || []
  const results = data?.results || []
  const calendar = data?.calendar || []
  const portals = data?.official_portals || {}
  const helpdesk = data?.helpdesk || {}

  const filteredVacancies = vacancies.filter(v => {
    const matchesQuery = !searchQuery || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.advertisement_no.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesQuery) return false
    if (selectedService === 'ALL') return true
    if (selectedService === 'ADMIN' && v.service.includes('Administration')) return true
    if (selectedService === 'TECH' && (v.service.includes('Miscellaneous') || v.service.includes('Engineering'))) return true
    if (selectedService === 'HEALTH' && v.service.includes('Health')) return true
    return true
  })

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-red-950/30 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white via-red-50/30 to-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-black tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Public Service Commission Nepal (लोक सेवा आयोग)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Loksewa Aayog Radar & Exam Notices
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Real-time notices, official vacancies, published merit results, and examination calendars for Federal & Provincial Civil Services of Nepal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={portals.online_application || "https://psconline.psc.gov.np"}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <span>Apply Online (psconline)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            {onOpenCopilot && (
              <button
                onClick={() => onOpenCopilot('What is the syllabus and eligibility for Loksewa Section Officer and Nayab Subba?')}
                className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
                }`}
              >
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Ask AI Exam Guide</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vacancies'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Open Vacancies ({vacancies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Published Results ({results.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Annual Calendar</span>
          </button>
        </div>

        {activeTab === 'vacancies' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search post or advertisement..."
                className={`pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="ALL">All Services</option>
              <option value="ADMIN">Administration</option>
              <option value="TECH">Technical & IT</option>
              <option value="HEALTH">Health & Nursing</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Vacancies */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          {filteredVacancies.map((item) => (
            <div
              key={item.id}
              className={`p-6 sm:p-7 rounded-3xl border card-3d shadow-sm transition-all ${
                theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                      Ad No: {item.advertisement_no}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.level}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    {item.service}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="text-right mr-2 hidden sm:block">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Posts</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{item.total_seats} Seats</span>
                  </div>
                  <a
                    href={item.syllabus_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Syllabus</span>
                  </a>
                  <a
                    href={item.portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Application Deadline</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{item.application_deadline}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">First Paper Date</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{item.first_paper_date}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Exam Fee</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{item.fee}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Vacancies</span>
                  <strong className="text-red-600 dark:text-red-400 font-bold">{item.total_seats} Openings</strong>
                </div>
              </div>

              {/* Eligibility & Stages */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs">
                  <strong className="text-slate-900 dark:text-white block mb-1">Minimum Educational Qualification:</strong>
                  <p className="text-slate-600 dark:text-slate-300">{item.eligibility}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="font-bold text-slate-500">Selection Stages:</span>
                  {item.stages.map((stg, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      Stage {i + 1}: {stg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Results */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {results.map((res) => (
            <div
              key={res.id}
              className={`p-6 rounded-3xl border card-3d shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    {res.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Published: {res.publish_date}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {res.summary}
                </p>
                <div className="text-[11px] text-slate-400 font-semibold">
                  Issuing Office: {res.office} | Ad: {res.advertisement_no}
                </div>
              </div>

              <a
                href={res.download_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 shrink-0 transition-colors"
              >
                <span>View Official Notice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendar.map((cal, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl border card-3d shadow-sm space-y-2 ${
                  theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>{cal.month}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {cal.activity}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Conducting Authority: {cal.authority}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Directory & Contact Footer */}
      <div className={`p-6 rounded-3xl border ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Official Contact — Public Service Commission Central Office</span>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500" /> {helpdesk.location}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-red-500" /> {helpdesk.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-red-500" /> {helpdesk.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://psc.gov.np"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>psc.gov.np</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-400">|</span>
            <a
              href="https://psconline.psc.gov.np"
              target="_blank"
              rel="noreferrer"
              className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>psconline.psc.gov.np</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
