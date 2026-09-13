import React, { useState } from 'react'
import { Database, BookOpen, Award, FileText, Search, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function KnowledgeGraphView({ knowledgeGraph }) {
  const [activeSection, setActiveSection] = useState('universities')
  const [searchTerm, setSearchTerm] = useState('')

  if (!knowledgeGraph) {
    return <div className="text-gray-400 p-8 text-center">Loading Living Knowledge Graph...</div>
  }

  const { universities = [], programs = [], exams = [], scholarships = [], changes = [] } = knowledgeGraph

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Living EDUVA Knowledge Graph</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Verified Educational Universe
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Dynamic knowledge verified from official portals, government gazettes, and examination boards.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
          {[
            { id: 'universities', label: 'Universities', count: universities.length },
            { id: 'programs', label: 'Programs', count: programs.length },
            { id: 'exams', label: 'Entrance Exams', count: exams.length },
            { id: 'scholarships', label: 'Scholarships', count: scholarships.length }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeSection === sec.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{sec.label}</span>
              <span className="text-[10px] bg-gray-800/80 px-1.5 py-0.2 rounded-full font-mono">{sec.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering based on Section */}
      {activeSection === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map(univ => (
            <div key={univ.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{univ.name}</h3>
                  <div className="text-xs text-gray-400 mt-0.5">{univ.city}, {univ.country}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.round(univ.reliability_score * 100)}% Trust
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">
                Offering {univ.programs?.length || 0} active academic programs tracked in graph.
              </p>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Official Portal:</span>
                <a href={univ.official_website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                  {univ.official_website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => (
            <div key={prog.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{prog.degree}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{prog.name}</h3>
                  <div className="text-xs text-gray-400">{prog.faculty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-400">
                    {prog.tuition === 0 ? "Tuition Free" : `${prog.currency} ${prog.tuition.toLocaleString()}`}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{prog.duration_years} Years</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 text-xs space-y-1">
                <div className="text-gray-300"><strong className="text-gray-400">Eligibility:</strong> {prog.eligibility}</div>
                <div className="text-gray-300"><strong className="text-gray-400">Deadline:</strong> <span className="text-amber-300 font-bold">{prog.application_deadline}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map(ex => (
            <div key={ex.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-amber-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{ex.name}</h3>
                  <div className="text-xs text-gray-400">{ex.conducting_body}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Fee: {ex.currency} {ex.fee}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-900/60 p-3 rounded-lg border border-gray-800">
                <div>
                  <div className="text-[10px] text-gray-400">Registration Close:</div>
                  <div className="font-bold text-rose-300">{ex.registration_close}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">Exam Date:</div>
                  <div className="font-bold text-blue-300">{ex.exam_date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map(sch => (
            <div key={sch.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-purple-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{sch.name}</h3>
                  <div className="text-xs text-purple-400 font-medium">{sch.provider}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  {sch.coverage_type}
                </span>
              </div>

              <div className="text-xs text-emerald-400 font-bold">{sch.amount_description}</div>
              <div className="text-xs text-gray-300"><strong className="text-gray-400">Criteria:</strong> {sch.criteria}</div>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Deadline: <strong className="text-white">{sch.deadline}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
