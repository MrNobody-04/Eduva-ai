import React, { useState, useEffect } from 'react'
import { 
  GitCompare, Building2, Check, X, ArrowRight, ExternalLink, 
  ShieldCheck, Bot, Sparkles, Plus, Trash2
} from 'lucide-react'

export default function ComparisonView({ theme }) {
  const [comparisonType, setComparisonType] = useState('UNIVERSITIES')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Default compared IDs
  const [selectedUnivs, setSelectedUnivs] = useState(['univ_tu', 'univ_ku', 'univ_pokhu'])
  const [selectedCols, setSelectedCols] = useState(['col_pulchowk', 'col_thapathali', 'col_ascol'])

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)

  const fetchComparison = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparison_type: comparisonType,
          entity_ids: comparisonType === 'UNIVERSITIES' ? selectedUnivs : selectedCols
        })
      })
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (err) {
      console.error('Comparison fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComparison()
    setAiAnalysis(null)
  }, [comparisonType])

  const requestAiAnalysis = async () => {
    if (!data?.entities?.length) return
    setIsAiAnalyzing(true)
    try {
      const res = await fetch('/api/compare/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparison_type: comparisonType,
          entities: data.entities
        })
      })
      if (res.ok) {
        const result = await res.json()
        setAiAnalysis(result.analysis)
      }
    } catch (err) {
      console.error('AI comparison failed:', err)
    } finally {
      setIsAiAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-indigo-950/40 border-slate-800' 
          : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200'
      }`}>
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-wide">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Entity Educational Comparison Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Compare Institutions Side-by-Side with AI Synthesis
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Objective comparison of affiliations, faculty, entrance requirements, constituent campuses, and estimated tuition fees with autonomous AI trade-off analysis.
          </p>
        </div>

        {/* Type Selector and AI Analysis Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparisonType('UNIVERSITIES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'UNIVERSITIES'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Compare Universities (TU vs KU vs PokU)
            </button>
            <button
              onClick={() => setComparisonType('COLLEGES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'COLLEGES'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Compare Colleges (Pulchowk vs Thapathali vs ASCOL)
            </button>
          </div>

          {/* Ask EDUVA AI Analysis Button */}
          <button
            onClick={requestAiAnalysis}
            disabled={isAiAnalyzing || !data?.entities?.length}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            <Bot className="w-4 h-4" />
            <span>{isAiAnalyzing ? 'Synthesizing Trade-offs...' : 'Ask EDUVA AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Card */}
      {aiAnalysis && (
        <div className={`p-6 rounded-3xl border animate-fadeIn space-y-3 ${
          theme === 'dark' ? 'bg-[#0E1424] border-indigo-500/40 text-slate-100' : 'bg-indigo-50/60 border-indigo-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400">Autonomous Comparison Synthesis</h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {data && (
        <div className={`rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                  <th className="p-4 sm:p-5 font-black uppercase tracking-wider text-slate-400 w-48">Parameter</th>
                  {data.entities?.map((ent) => (
                    <th key={ent.id} className="p-4 sm:p-5 font-black text-sm text-blue-400 min-w-[200px]">
                      {ent.name} ({ent.acronym || ent.university?.split(' ')[0]})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data.comparison_type === 'UNIVERSITIES' ? (
                  <>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Established Year</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.established}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Institution Type</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.type?.replace(/_/g, ' ')}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Main Location</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.location}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Constituent Campuses</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-emerald-400">{e.constituent_campuses}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Affiliated Colleges</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-blue-400">{e.affiliated_colleges}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Primary Entrance Exam</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-amber-400">{e.primary_entrance}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Verification Level</td>
                      {data.entities.map(e => (
                        <td key={e.id} className="p-4 sm:p-5 text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> {e.verification}
                        </td>
                      ))}
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">University Affiliation</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-blue-400">{e.university}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Ownership / Type</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.ownership}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Location</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.location}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Programs Offered</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold">{e.programs_offered}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-bold opacity-60">Admission Status</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-emerald-400">{e.admission_status}</td>)}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
