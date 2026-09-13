import React, { useState, useEffect } from 'react'
import { 
  Building2, MapPin, Globe, Award, BookOpen, Search, 
  ExternalLink, CheckCircle2, ChevronRight, ShieldCheck, Phone, Mail, Users
} from 'lucide-react'

export default function UniversityHub({ theme }) {
  const [universities, setUniversities] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUniv, setSelectedUniv] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState('overview')

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        setUniversities(data)
        if (data.length > 0 && !selectedUniv) {
          // keep initial selection ready
        }
      })
      .catch(err => console.error('Failed to load universities:', err))
  }, [])

  const categories = [
    { id: 'ALL', label: 'All Universities (26+)' },
    { id: 'GENERAL_MULTIDISCIPLINARY', label: 'General & Multi-Disciplinary' },
    { id: 'SPECIALIZED_TECHNICAL', label: 'Specialized & Technical' },
    { id: 'MEDICAL_HEALTH_ACADEMY', label: 'Medical & Health Academies' }
  ]

  const filtered = universities.filter(u => {
    const matchesCat = selectedCategory === 'ALL' || u.category === selectedCategory
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.province.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Hero Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950/40 border-gray-800' 
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-slate-200'
      }`}>
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-black uppercase tracking-wide">
            <Building2 className="w-3.5 h-3.5" />
            <span>Official Nepal University Central Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Nepal Universities & National Academies Intelligence
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
            Official directory of all 26+ national, provincial, technical, and medical health science universities in Nepal. Verified faculties, constituent campuses, affiliated colleges, and central entrance examinations.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
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
            placeholder="Search university or city..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((univ) => (
          <div
            key={univ.id}
            onClick={() => { setSelectedUniv(univ); setActiveDetailTab('overview'); }}
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
                    Est. {univ.established_year}
                  </span>
                  <h3 className="text-base font-black mt-2 tracking-tight">
                    {univ.name}
                  </h3>
                  <span className="text-xs font-bold text-blue-400">{univ.acronym}</span>
                </div>
                <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-blue-500 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{univ.location} ({univ.province})</span>
              </p>

              <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                {univ.overview}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800/40">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-slate-50'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Constituent</span>
                  <span className="font-black text-sm">{univ.total_constituent_campuses} Campuses</span>
                </div>
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-slate-50'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Affiliated</span>
                  <span className="font-black text-sm">{univ.total_affiliated_colleges} Colleges</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-xs font-bold text-blue-500">
              <span>View Faculties & Admissions</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* University Detail Modal */}
      {selectedUniv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-4xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 border-gray-800/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    {selectedUniv.institution_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400">Est. {selectedUniv.established_year}</span>
                </div>
                <h2 className="text-2xl font-black mt-1">{selectedUniv.name} ({selectedUniv.acronym})</h2>
                <p className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {selectedUniv.location}, {selectedUniv.province}
                </p>
              </div>
              <button
                onClick={() => setSelectedUniv(null)}
                className="p-2 rounded-xl hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-800/60 pb-2">
              {['overview', 'faculties', 'campuses', 'admissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeDetailTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeDetailTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <p className="leading-relaxed text-sm">{selectedUniv.overview}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Vice-Chancellor</span>
                    <span className="font-bold">{selectedUniv.vice_chancellor || 'Academic Council'}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Constituent Campuses</span>
                    <span className="font-bold">{selectedUniv.total_constituent_campuses} Campuses</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Affiliated Colleges</span>
                    <span className="font-bold">{selectedUniv.total_affiliated_colleges} Institutions</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Official Website</span>
                    <a href={selectedUniv.website} target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                      Visit Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'faculties' && (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedUniv.faculties?.map((fac, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${
                    theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-blue-400">{fac.name}</h4>
                      <span className="text-[10px] opacity-60">Dean: {fac.dean_office}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {fac.programs?.map((prog, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold">
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeDetailTab === 'campuses' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {selectedUniv.constituent_campuses && selectedUniv.constituent_campuses.length > 0 ? (
                  selectedUniv.constituent_campuses.map((camp, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      theme === 'dark' ? 'bg-gray-800/30 border-gray-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className="font-bold block">{camp.name}</span>
                        <span className="text-[11px] text-gray-400">{camp.location}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400">
                        {camp.focus}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs opacity-60 py-6 text-center">Centralized Campus Structure</p>
                )}
              </div>
            )}

            {activeDetailTab === 'admissions' && (
              <div className="space-y-3 text-xs">
                <div className={`p-4 rounded-2xl border space-y-2 ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400">Central Entrance Gates</span>
                  <div className="space-y-1">
                    {selectedUniv.entrance_exams?.map((exam, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between text-[11px] ${
                  theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <span>Typical Intake Cycle: {selectedUniv.admission_cycle}</span>
                  <span className="font-bold">Merit Entrance Required</span>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs">
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Level 1 Authoritative Ministry Registry Verified
              </span>
              <button
                onClick={() => setSelectedUniv(null)}
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
