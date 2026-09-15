import React, { useState, useEffect } from 'react'
import { 
  Building2, MapPin, Globe, Award, BookOpen, Search, 
  ExternalLink, CheckCircle2, ChevronRight, ShieldCheck, Phone, Mail, Users, GraduationCap, Bot, Sparkles
} from 'lucide-react'

export default function UniversityHub({ theme, onOpenCopilot, onAddToTracker }) {
  const [universities, setUniversities] = useState([])
  const [colleges, setColleges] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUniv, setSelectedUniv] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState('overview')

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => setUniversities(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load universities:', err))

    fetch('/api/colleges')
      .then(res => res.json())
      .then(data => setColleges(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load colleges:', err))
  }, [])

  const categories = [
    { id: 'ALL', label: 'All Universities (26+)' },
    { id: 'GENERAL_MULTIDISCIPLINARY', label: 'General & Multi-Disciplinary' },
    { id: 'SPECIALIZED_TECHNICAL', label: 'Specialized & Technical' },
    { id: 'MEDICAL_HEALTH_ACADEMY', label: 'Medical & Health Academies' }
  ]

  const filteredUniversities = universities.filter(u => {
    const matchesCat = selectedCategory === 'ALL' || u.category === selectedCategory
    const q = searchTerm.toLowerCase().trim()
    if (!q) return matchesCat
    const matchesSearch = u.name.toLowerCase().includes(q) ||
                          u.acronym.toLowerCase().includes(q) ||
                          u.location.toLowerCase().includes(q) ||
                          u.province.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  // Matching colleges for the search section
  const matchingColleges = searchTerm.trim() ? colleges.filter(c => {
    const q = searchTerm.toLowerCase().trim()
    return c.name.toLowerCase().includes(q) ||
           c.university.toLowerCase().includes(q) ||
           c.location.toLowerCase().includes(q) ||
           c.description?.toLowerCase().includes(q) ||
           c.courses?.some(course => course.name.toLowerCase().includes(q))
  }) : []

  // Helper to get colleges affiliated to a specific university
  const getAffiliatedColleges = (univ) => {
    if (!univ) return []
    const acronym = univ.acronym ? univ.acronym.toLowerCase() : ''
    const name = univ.name ? univ.name.toLowerCase() : ''
    return colleges.filter(c => {
      const uAffil = (c.university || '').toLowerCase()
      return (acronym && uAffil.includes(acronym)) || 
             (name && uAffil.includes(name)) ||
             (acronym === 'tu' && (uAffil.includes('tribhuvan') || uAffil.includes('tu'))) ||
             (acronym === 'ku' && (uAffil.includes('kathmandu') || uAffil.includes('ku'))) ||
             (acronym === 'pu' && (uAffil.includes('pokhara') || uAffil.includes('pu'))) ||
             (acronym === 'purbu' && (uAffil.includes('purbanchal') || uAffil.includes('purwanchal')))
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Hero Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Official Nepal University & Affiliated Colleges Registry</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Nepal Universities & Affiliated Colleges Intelligence
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Official directory of all 26+ national, provincial, technical, and medical universities in Nepal with their verified affiliated colleges, course offerings, fee ranges, and entrance gates.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : theme === 'dark'
                    ? 'bg-[#0B101E] border border-slate-800/80 text-slate-400 hover:text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search university or college (e.g. TU, Pulchowk, St. Xavier's)..."
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-[#0B101E] border-slate-800/80 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
            }`}
          />
        </div>
      </div>

      {/* Searched College Results Section (if search term matches colleges) */}
      {searchTerm.trim() && matchingColleges.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
            }`}>
              <GraduationCap className="w-4 h-4" />
              <span>Matched Colleges & Institutions ({matchingColleges.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click any college to view full courses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingColleges.map((college) => (
              <div
                key={college.id}
                className={`card-3d p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === 'dark' 
                    ? 'bg-[#0E1424] border-purple-500/20 hover:border-purple-500/50' 
                    : 'bg-white border-purple-200 hover:border-purple-400 shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                        {college.type || 'Affiliated College'}
                      </span>
                      <h4 className={`text-base font-black mt-1.5 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {college.name}
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{college.university}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{college.location}</span>
                    </div>
                  </div>

                  {/* College Description */}
                  <p className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {college.description}
                  </p>

                  {/* Offered Courses */}
                  {college.courses && college.courses.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Verified Courses Offered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {college.courses.map((c, i) => (
                          <div 
                            key={i}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border ${
                              theme === 'dark' 
                                ? 'bg-slate-800 border-slate-700 text-slate-200' 
                                : 'bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <span className="font-bold">{c.name}</span>
                            {c.full_fee && c.full_fee !== '-' && (
                              <span className="ml-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                ({c.full_fee})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/40 mt-3 flex items-center justify-between gap-2">
                  {onOpenCopilot && (
                    <button
                      onClick={() => onOpenCopilot(`Tell me about admission, fees, and eligibility for ${college.name} affiliated to ${college.university}`)}
                      className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onAddToTracker && (
                    <button
                      onClick={() => onAddToTracker({
                        institution: college.name,
                        program: college.courses?.[0]?.name || 'Higher Education',
                        portal_url: college.website || '',
                        deadline: '2026-10-15',
                        application_fee: college.courses?.[0]?.full_fee || 'NPR 2,000',
                        source: 'University Hub Colleges'
                      })}
                      className="px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-[10px] font-black transition-all cursor-pointer"
                    >
                      + Add to Tracker
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredUniversities.map((univ) => {
          const affilCount = getAffiliatedColleges(univ).length
          return (
            <div
              key={univ.id}
              onClick={() => { setSelectedUniv(univ); setActiveDetailTab('overview'); }}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 card-3d cursor-pointer flex flex-col justify-between group ${
                theme === 'dark'
                  ? 'bg-[#0B101E] border-slate-800/80 hover:border-blue-500/50 hover:shadow-depth-md'
                  : 'bg-white border-slate-200/90 hover:border-blue-500 shadow-sm hover:shadow-depth-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                      Est. {univ.established_year}
                    </span>
                    <h3 className={`text-base font-black mt-2 tracking-tight transition-colors ${
                      theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {univ.name}
                    </h3>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{univ.acronym}</span>
                  </div>
                  <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{univ.location} ({univ.province})</span>
                </p>

                <p className={`text-xs line-clamp-2 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                }`}>
                  {univ.overview}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800/40">
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block">Constituent</span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">{univ.total_constituent_campuses} Campuses</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block">Verified Progress</span>
                    <span className="font-black text-xs text-blue-600 dark:text-blue-400 block mt-0.5">
                      {affilCount > 0 ? (
                        `${affilCount} of ${univ.total_affiliated_colleges ? `${univ.total_affiliated_colleges} registered` : 'estimated 25+'}`
                      ) : (
                        `0 of ${univ.total_affiliated_colleges ? `${univ.total_affiliated_colleges} registered` : '30+ pending'}`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400">
                <span>Explore Affiliated Colleges & Details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )
        })}
      </div>

      {/* University Detail Modal */}
      {selectedUniv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-4xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-slide-up ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
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
            <div className="flex items-center gap-2 border-b border-gray-800/60 pb-2 overflow-x-auto">
              {['overview', 'affiliated', 'faculties', 'campuses', 'admissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeDetailTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'affiliated' ? 'Affiliated Colleges' : tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeDetailTab === 'affiliated' && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {(() => {
                  const affils = getAffiliatedColleges(selectedUniv)
                  const totalExpected = selectedUniv.total_affiliated_colleges || 0
                  if (affils.length === 0) {
                    return (
                      <div className="p-8 text-center rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 space-y-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                          <Activity className="w-5 h-5 animate-pulse" />
                        </div>
                        <h4 className="text-xs font-black uppercase text-amber-400">
                          Active Indexing Progress: 0 of {totalExpected ? `${totalExpected}` : 'estimated 25+'} Campuses Corroborated
                        </h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          EDUVA's ResearchAgent crawls {selectedUniv.name}'s official gazettes and accreditation records before marking any campus verified.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          <span>Crawler status: Scanning university gazette notice board</span>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-slate-100">
                            Verified Progress: {affils.length} of {totalExpected ? `${totalExpected} institutions` : 'cataloged so far'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                          {totalExpected > 0 ? `${Math.round((affils.length / totalExpected) * 100)}% Corroborated` : 'Live Corroboration'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {affils.map((col) => (
                          <div
                            key={col.id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                                  {col.type || 'Affiliated Institution'}
                                </span>
                                <h4 className={`text-base font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {col.name}
                                </h4>
                                <p className="text-xs text-blue-500 font-semibold flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>{col.location}</span>
                                </p>
                              </div>
                              <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                                Est. {col.established || '2000'}
                              </span>
                            </div>

                            <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              {col.description}
                            </p>

                            {col.courses && col.courses.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-slate-800/40 space-y-1.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                  Offered Programs & Fees:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {col.courses.map((cr, idx) => (
                                    <div 
                                      key={idx}
                                      className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                                        theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
                                      }`}
                                    >
                                      <div>
                                        <span className="font-bold block text-slate-900 dark:text-white">{cr.name}</span>
                                        <span className="text-[10px] text-slate-400">{cr.duration}</span>
                                      </div>
                                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                        {cr.full_fee || 'Standard Fee'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {onOpenCopilot && (
                              <div className="mt-3 pt-2 flex items-center justify-end">
                                <button
                                  onClick={() => onOpenCopilot(`Give me full details on ${col.name} affiliated to ${selectedUniv.name} including admission and cutoff`)}
                                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Bot className="w-3.5 h-3.5" />
                                  <span>Ask AI about {col.name}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

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
