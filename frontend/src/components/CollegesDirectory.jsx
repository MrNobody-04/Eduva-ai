import React, { useState } from 'react'
import { 
  Building2, MapPin, Search, ExternalLink, GraduationCap, 
  Award, ShieldCheck, CheckCircle2, ChevronRight, X
} from 'lucide-react'

export default function CollegesDirectory({ colleges = [], theme, onAddToTracker }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUniv, setSelectedUniv] = useState('ALL')
  const [selectedCollege, setSelectedCollege] = useState(null)

  const universities = ['ALL', 'Tribhuvan University', 'Kathmandu University', 'Pokhara University', 'Purbanchal University']

  const filtered = colleges.filter(c => {
    const matchesUniv = selectedUniv === 'ALL' || c.university?.toLowerCase().includes(selectedUniv.toLowerCase())
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          anyMatch(c.programs, searchTerm)
    return matchesUniv && matchesSearch
  })

  function anyMatch(arr, term) {
    if (!arr) return false
    return arr.some(item => item.toLowerCase().includes(term.toLowerCase()))
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950/40 border-gray-800' 
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-slate-200'
      }`}>
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-black uppercase tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Nepal Constituent & Affiliated Colleges Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Explore Colleges Across Nepal
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
            Browse government constituent and verified affiliated colleges offering B.Sc. CSIT, BCA, BIT, Computer Engineering, MBBS, and BBA with authentic fee brackets.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full">
          {universities.map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUniv(u)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedUniv === u
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {u === 'ALL' ? 'All Universities' : u}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search college, program, or city..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((college) => (
          <div
            key={college.id}
            onClick={() => setSelectedCollege(college)}
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
                    {college.ownership || 'Affiliated'}
                  </span>
                  <h3 className="text-base font-black mt-2 tracking-tight">
                    {college.name}
                  </h3>
                  <span className="text-xs font-bold text-blue-400">{college.university}</span>
                </div>
                <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-blue-500 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{college.location}</span>
              </p>

              <div className="space-y-1.5 pt-2 border-t border-gray-800/40">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Offered Programs</span>
                <div className="flex flex-wrap gap-1">
                  {college.programs?.map((prog, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-semibold">
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-xs font-bold text-blue-500">
              <span>View Verified Details</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* College Detail Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-3xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between border-b pb-4 border-gray-800/60">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  {selectedCollege.ownership || 'Affiliated'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2">{selectedCollege.name}</h2>
                <p className="text-xs text-blue-400 font-semibold">{selectedCollege.university} • {selectedCollege.location}</p>
              </div>
              <button
                onClick={() => setSelectedCollege(null)}
                className="p-2 rounded-xl hover:bg-gray-800 transition-colors text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Admission Status</span>
                  <span className="font-bold text-emerald-400 block mt-0.5">{selectedCollege.admission_status || 'ADMISSION_OPEN'}</span>
                </div>
                <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Entrance Gate</span>
                  <span className="font-bold text-amber-400 block mt-0.5">{selectedCollege.entrance_exam || 'University Central Entrance'}</span>
                </div>
              </div>

              {selectedCollege.fee_structure && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1.5">Official Fee Structures</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(selectedCollege.fee_structure).map(([prog, fee]) => (
                      <div key={prog} className={`p-3 rounded-xl border flex items-center justify-between ${
                        theme === 'dark' ? 'bg-gray-800/30 border-gray-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className="font-bold">{prog}</span>
                        <span className="font-black text-emerald-400">{fee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1">Programs Offered</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCollege.programs?.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs gap-3">
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Level 1 Affiliation Verified
              </span>
              <div className="flex items-center gap-2">
                {onAddToTracker && (
                  <button
                    onClick={() => {
                      onAddToTracker({
                        institution: selectedCollege.name,
                        program: selectedCollege.programs?.[0] || 'Undergraduate Degree',
                        portal_url: selectedCollege.website || '',
                        deadline: '2026-10-15',
                        application_fee: selectedCollege.fee_structure ? Object.values(selectedCollege.fee_structure)[0] : 'NPR 2,000',
                        source: 'Colleges Directory'
                      })
                      setSelectedCollege(null)
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-bold transition-all cursor-pointer"
                  >
                    + Add to Tracker
                  </button>
                )}
                <button
                  onClick={() => setSelectedCollege(null)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
