import React, { useState } from 'react'
import { 
  FileCheck2, Search, Download, Award, GraduationCap, 
  Printer, CheckCircle2, ShieldCheck, X, QrCode
} from 'lucide-react'

export default function EntranceResultsViewer({ results = [], theme }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  const filtered = results.filter(r => 
    r.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.program_applied.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.institution.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenScorecard = (result) => {
    setSelectedResult(result)
    setIsPdfModalOpen(true)
  }

  const handlePrintScorecard = () => {
    window.print()
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Header */}
      <div className={`p-5 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Retrieved Public Entrance Merit Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Nepal University Entrance Merit Archives & Records
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Search authentic records retrieved from public merit publications for IOE Engineering, CEE Medical, KUCAT KU, CMAT Management, and CSIT. View and print verified examination records with source provenance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, or institution..."
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              theme === 'dark' ? 'bg-[#060911] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((r) => (
          <div
            key={r.roll_number}
            className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 card-3d flex flex-col justify-between group ${
              theme === 'dark'
                ? 'bg-[#0B101E] border-slate-800/80 hover:border-blue-500/50 hover:shadow-depth-md'
                : 'bg-white border-slate-200/90 hover:border-blue-500 hover:shadow-depth-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-500">
                    Rank #{r.merit_rank}
                  </span>
                  <h3 className="text-base font-bold mt-2 tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {r.candidate_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Roll: {r.roll_number}</p>
                </div>

                <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Program:</span>
                  <span className="font-bold text-blue-500">{r.program_applied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Institution:</span>
                  <span className="font-bold truncate max-w-[160px]">{r.institution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Score:</span>
                  <span className="font-black text-emerald-400">{r.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-60">Quota Status:</span>
                  <span className="font-bold text-amber-400">{r.scholarship_quota_status}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-800/40 flex items-center justify-between">
              <button
                onClick={() => handleOpenScorecard(r)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Retrieved Examination Record</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Retrieved Examination Record Modal */}
      {isPdfModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-2xl w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 relative ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Retrieved Record Layout */}
            <div id="printable-scorecard" className="border-4 border-double border-blue-500/40 p-6 rounded-2xl space-y-4">
              <div className="text-center space-y-1 border-b pb-4 border-gray-700/50">
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 block">
                  EDUVA ENTRANCE RESULT ANALYSIS
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Eduva Entrance Result Analysis
                </h2>
                <p className="text-xs opacity-70">Academic Session 2026/27 • Verified Result Analysis</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs py-2">
                <div>
                  <span className="opacity-60 block">Candidate Full Name</span>
                  <span className="font-black text-sm text-blue-400">{selectedResult.candidate_name}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Roll Number</span>
                  <span className="font-black text-sm font-mono">{selectedResult.roll_number}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Reported Merit Rank</span>
                  <span className="font-black text-base text-emerald-400">#{selectedResult.merit_rank}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Obtained Score</span>
                  <span className="font-black text-base">{selectedResult.score}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Applied Program</span>
                  <span className="font-bold">{selectedResult.program_applied}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Allotted Institution</span>
                  <span className="font-bold">{selectedResult.institution}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between">
                <span>Quota Standing: {selectedResult.scholarship_quota_status}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>

              {/* Mandatory Official Disclaimer Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] leading-relaxed text-amber-300">
                <span className="font-bold block text-amber-400 mb-1">Disclaimer:</span>
                AI-generated analysis based on submitted/result data. Not an official examination document. For official institutional confirmation, consult the institution's primary examination portal directly.
              </div>

              <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between text-[10px] opacity-60">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 opacity-80" />
                  <span>RETRIEVED-RECORD-ID: {selectedResult.roll_number}</span>
                </div>
                <div className="text-right">
                  <span>Eduva AI Autonomous Verification Engine</span>
                  <span className="block font-bold">Public Examination Archive</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Close
              </button>
              <button
                onClick={handlePrintScorecard}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
