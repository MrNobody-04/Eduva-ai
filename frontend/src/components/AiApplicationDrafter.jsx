import React, { useState } from 'react'
import { 
  FileText, Sparkles, Copy, Check, Download, Send, 
  GraduationCap, Building2, User, BookOpen, Award
} from 'lucide-react'

export default function AiApplicationDrafter({ theme }) {
  const [docType, setDocType] = useState('SOP')
  const [studentName, setStudentName] = useState('Sujan Sharma')
  const [gpa, setGpa] = useState('3.85 GPA (+2 Science)')
  const [targetCollege, setTargetCollege] = useState('Pulchowk Campus (IOE TU)')
  const [targetProgram, setTargetProgram] = useState('B.E. Computer Engineering')
  const [careerGoals, setCareerGoals] = useState('advancing artificial intelligence, scalable distributed software, and sustainable tech infrastructure in Nepal')
  const [financialNeed, setFinancialNeed] = useState('family annual income is below the institutional threshold to support full self-financed tuition')
  
  const [generatedDoc, setGeneratedDoc] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const res = await fetch('/api/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: docType,
          student_name: studentName,
          gpa: gpa,
          target_college: targetCollege,
          target_program: targetProgram,
          career_goals: careerGoals,
          financial_need: financialNeed
        })
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedDoc(data)
      }
    } catch (err) {
      console.error('Draft generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!generatedDoc?.generated_text) return
    navigator.clipboard.writeText(generatedDoc.generated_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!generatedDoc?.generated_text) return
    const blob = new Blob([generatedDoc.generated_text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${docType}_${studentName.replace(/\\s+/g, '_')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className={`p-5 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-purple-950/40 to-blue-950/30 border-gray-800' 
          : 'bg-gradient-to-br from-white via-purple-50/40 to-blue-50/30 border-purple-200/60'
      }`}>
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-500 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Academic Document Drafter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Generate Verified SOPs, Admission & Scholarship Letters
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            EDUVA AI automatically drafts tailored, high-converting Statement of Purpose (SOP), formal Admission Applications, and Scholarship Appeal Letters calibrated for Nepal engineering, medical, IT, and international universities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5">
          <form onSubmit={handleGenerate} className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-xl ${
            theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1.5">
                Select Document Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'SOP', label: 'SOP Essay' },
                  { id: 'ADMISSION_APPLICATION', label: 'Admission' },
                  { id: 'SCHOLARSHIP_LETTER', label: 'Scholarship' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                      docType === item.id
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                        : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Student Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Academic Score (+2 / GPA)</label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Target Program</label>
                <input
                  type="text"
                  value={targetProgram}
                  onChange={(e) => setTargetProgram(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Target College / University</label>
              <input
                type="text"
                value={targetCollege}
                onChange={(e) => setTargetCollege(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Career Motivations & Goals</label>
              <textarea
                rows={2}
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {docType === 'SCHOLARSHIP_LETTER' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Financial Need Summary</label>
                <textarea
                  rows={2}
                  value={financialNeed}
                  onChange={(e) => setFinancialNeed(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Academic Letter...' : 'Draft Formal Document with AI'}</span>
            </button>
          </form>
        </div>

        {/* Output Document Preview */}
        <div className="lg:col-span-7">
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl flex flex-col justify-between h-full min-h-[480px] ${
            theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4 border-gray-800/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="font-black text-sm">
                      {generatedDoc ? generatedDoc.title : 'Live Document Preview'}
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {generatedDoc ? '✓ AI Certified Academic Formatting' : 'Fill details and click generate'}
                    </span>
                  </div>
                </div>

                {generatedDoc && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Download as Text file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>

              {generatedDoc ? (
                <pre className={`p-4 rounded-2xl border text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-[420px] overflow-y-auto ${
                  theme === 'dark' ? 'bg-gray-950/80 border-gray-800 text-gray-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {generatedDoc.generated_text}
                </pre>
              ) : (
                <div className="py-24 text-center opacity-50 space-y-2">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-xs font-bold">Click "Draft Formal Document with AI" to generate</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/40 text-[11px] opacity-60 flex items-center justify-between">
              <span>Standard MOEST & University Admissions Formats</span>
              <span>100% Free for Nepali Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
