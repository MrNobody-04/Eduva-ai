import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, CheckCircle2, ExternalLink, Search, Clock, DollarSign, Sparkles, GraduationCap } from 'lucide-react'

export default function ScholarshipsPortal({ theme = 'dark' }) {
  const [searchTerm, setSearchTerm] = useState('')

  const cardBg = theme === 'dark' ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200 shadow-sm'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-slate-500'

  const scholarships = [
    {
      id: "sch_moest",
      title: "Nepal MOEST National Engineering Quota & Merit Scholarship",
      provider: "Ministry of Education, Science and Technology (Government of Nepal)",
      amount: "100% Free Tuition + Government Monthly Stipend",
      type: "Government Merit Quota",
      criteria: "Top 100 Rank in IOE Engineering Entrance Examination + Nepali Citizenship",
      deadline: "October 25, 2026",
      target_fields: "B.E. Computer, Civil, Electrical, Mechanical",
      status: "APPLICATIONS_OPEN"
    },
    {
      id: "sch_erasmus",
      title: "European Union Erasmus Mundus Joint Master Degree (EMJMD)",
      provider: "European Commission, Brussels",
      amount: "€1,400 / month living stipend + 100% Free Tuition & Flight",
      type: "International Fellowship",
      criteria: "Graduated Bachelor degree in STEM / Computer Science with top 10% academic standing",
      deadline: "December 15, 2026",
      target_fields: "AI, Informatics, Data Science, Robotics",
      status: "APPLICATIONS_OPEN"
    },
    {
      id: "sch_pu_open",
      title: "Pokhara University 10% Open Central Scholarship Quota",
      provider: "Pokhara University Central Examination Board",
      amount: "100% Free Tuition & Exam Fee for 4 Years",
      type: "University Central Quota",
      criteria: "PU Central Scholarship Entrance Examination qualification (Top rankers allocated to NEC, Cosmos, Apex, etc.)",
      deadline: "October 05, 2026",
      target_fields: "B.E. IT, Software, Civil, Pharmacy, BBA",
      status: "APPLICATIONS_OPEN"
    },
    {
      id: "sch_ku_founders",
      title: "Kathmandu University Founders Merit Fellowship",
      provider: "Kathmandu University Board of Trustees",
      amount: "50% to 100% Tuition Fee Waiver",
      type: "University Merit Award",
      criteria: "KUCAT score >= 85th percentile + academic excellence in +2 Science",
      deadline: "October 10, 2026",
      target_fields: "B.Tech AI, B.E. Computer, Computational Mathematics",
      status: "APPLICATIONS_OPEN"
    }
  ]

  const filtered = scholarships.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.target_fields.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-blue-950/80 border border-purple-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-purple-400 uppercase tracking-widest mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
              <span>National & Global Scholarships</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Verified Scholarships & Quota Waivers 🎓
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Discover verified 100% free tuition waivers, government stipends, and international fellowships with exact eligibility criteria and deadlines.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shrink-0 shadow-xl">
            <Award className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Grants</div>
              <div className="text-xl font-black text-purple-400">100% Free Quotas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200'} flex items-center px-4`}>
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search scholarship name, provider (MOEST, KU, PU, Erasmus), or field..."
          className={`w-full bg-transparent border-none py-2 px-3 text-xs sm:text-sm outline-none ${textPrimary}`}
        />
      </div>

      {/* Scholarship Cards */}
      <div className="space-y-4">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx, 8) * 0.05, duration: 0.3, ease: 'easeOut' }}
            className={`rounded-3xl border p-6 space-y-4 card-3d ${cardBg}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="px-3 py-1 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
                <h3 className={`text-base sm:text-lg font-black mt-2 leading-snug ${textPrimary}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-purple-400 font-semibold mt-0.5">{item.provider}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-emerald-400 font-black block text-sm">{item.amount}</span>
                <span className="text-xs text-rose-400 font-bold block mt-0.5">Deadline: {item.deadline}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs">
              <div><strong className="text-gray-400">Eligibility Criteria:</strong> <span className={textSecondary}>{item.criteria}</span></div>
              <div><strong className="text-gray-400">Applicable Programs:</strong> <span className="text-blue-300 font-semibold">{item.target_fields}</span></div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Official Verified Opportunity
              </span>

              <button
                onClick={() => alert(`Direct Application Guidance for ${item.title}:\n\n1. Ensure eligibility: ${item.criteria}\n2. Deadline: ${item.deadline}\n3. Official Portal: Submit documents via Government/University office.`)}
                className="px-4 py-2 text-xs font-black bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Apply / Eligibility Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  )
}
