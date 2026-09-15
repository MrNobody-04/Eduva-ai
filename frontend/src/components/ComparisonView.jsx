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

  const requestAiAnalysis = async (customQuestion) => {
    const currentIds = comparisonType === 'UNIVERSITIES' ? selectedUnivs : selectedCols
    if (!currentIds || !currentIds.length) return
    setIsAiAnalyzing(true)
    try {
      const q = customQuestion || 'Provide an objective comparative evaluation of these institutions covering tuition fees, quota seats, and academic reputation in Nepal.'
      const res = await fetch('/api/compare/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparison_type: comparisonType,
          entity_ids: currentIds,
          question: q
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
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Entity Educational Comparison Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Compare Institutions Side-by-Side
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Objective comparison of affiliations, faculty, entrance requirements, constituent campuses, and estimated tuition fees with autonomous AI trade-off analysis.
          </p>
        </div>

        {/* Type Selector and AI Analysis Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparisonType('UNIVERSITIES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'UNIVERSITIES'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : theme === 'dark' ? 'bg-[#060911] text-slate-400 border border-slate-800 hover:text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              Universities (TU vs KU vs PokU)
            </button>
            <button
              onClick={() => setComparisonType('COLLEGES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'COLLEGES'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : theme === 'dark' ? 'bg-[#060911] text-slate-400 border border-slate-800 hover:text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              Colleges (Pulchowk vs Thapathali vs ASCOL)
            </button>
          </div>

          {/* Ask EDUVA AI Analysis Button */}
          <button
            onClick={() => requestAiAnalysis()}
            disabled={isAiAnalyzing || !data?.entities?.length}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>{isAiAnalyzing ? 'Synthesizing with 4-Provider Gateway...' : 'Analyze Trade-offs with AI'}</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Card */}
      {aiAnalysis && (
        <div className={`p-6 rounded-3xl border animate-fadeIn space-y-3 ${
          theme === 'dark' ? 'bg-[#0E1424] border-blue-500/30 text-slate-100' : 'bg-blue-50/70 border-blue-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-500">Autonomous Comparative Synthesis</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Verified by Eduva AI Gateway
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{aiAnalysis}</p>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {data && (
        <div className={`rounded-3xl border shadow-depth-md overflow-hidden transition-all ${
          theme === 'dark' ? 'bg-[#0B101E] border-slate-800/80' : 'bg-white border-slate-200/90'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-slate-800/80 bg-[#0E1424]' : 'border-slate-200 bg-slate-50'}`}>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px] w-52">Parameter</th>
                  {data.entities?.map((ent) => (
                    <th key={ent.id} className="p-4 sm:p-5 font-bold text-sm text-blue-500 min-w-[220px]">
                      {ent.name} <span className="text-xs text-slate-400 font-mono">({ent.acronym || ent.university?.split(' ')[0]})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data.comparison_type === 'UNIVERSITIES' ? (
                  <>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Established Year</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200 font-mono">{e.established}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Institution Type</td>
                      {data.entities.map(e => (
                        <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[11px] font-bold">
                            {e.type?.replace(/_/g, ' ')}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Main Location</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200">{e.location}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Constituent Campuses</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-emerald-500 font-mono">{e.constituent_campuses}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Affiliated Colleges</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-blue-500 font-mono">{e.affiliated_colleges}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Primary Entrance Exam</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-amber-500 dark:text-amber-400">{e.primary_entrance}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Verification Level</td>
                      {data.entities.map(e => (
                        <td key={e.id} className="p-4 sm:p-5 text-emerald-500 font-bold">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" /> {e.verification}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">University Affiliation</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-bold text-blue-500">{e.university}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Ownership / Type</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200">{e.ownership}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Location</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200">{e.location}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Programs Offered</td>
                      {data.entities.map(e => <td key={e.id} className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-slate-200">{e.programs_offered}</td>)}
                    </tr>
                    <tr className="hover:bg-blue-500/5 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">Admission Status</td>
                      {data.entities.map(e => (
                        <td key={e.id} className="p-4 sm:p-5 font-bold text-emerald-500">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                            {e.admission_status}
                          </span>
                        </td>
                      ))}
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
