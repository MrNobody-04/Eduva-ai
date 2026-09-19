import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Shield, ShieldAlert, ShieldCheck, Trash2, CheckCircle2, 
  AlertTriangle, RefreshCw, Lock, Search, FileText, Send, Sparkles, Inbox
} from 'lucide-react'

export default function EmailGuardian({ theme }) {
  const [hasPermission, setHasPermission] = useState(() => {
    return localStorage.getItem('eduva_mail_permission') === 'true'
  })
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMail, setSelectedMail] = useState(null)
  
  // Custom Scan Tool State
  const [scanSender, setScanSender] = useState('')
  const [scanSubject, setScanSubject] = useState('')
  const [scanBody, setScanBody] = useState('')
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  const fetchInbox = async () => {
    if (!hasPermission) return
    setLoading(true)
    try {
      const res = await fetch('/api/email-guardian/inbox')
      if (res.ok) {
        const data = await res.json()
        setInbox(data)
        if (data.length > 0 && !selectedMail) {
          setSelectedMail(data[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch mailbox:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasPermission) {
      fetchInbox()
    }
  }, [hasPermission])

  const grantPermission = () => {
    setHasPermission(true)
    localStorage.setItem('eduva_mail_permission', 'true')
  }

  const revokePermission = () => {
    setHasPermission(false)
    localStorage.removeItem('eduva_mail_permission')
    setSelectedMail(null)
  }

  const handleDeleteSpam = async (mailId) => {
    try {
      await fetch(`/api/email-guardian/delete/${mailId}`, { method: 'DELETE' })
      setInbox(prev => prev.filter(m => m.id !== mailId))
      if (selectedMail?.id === mailId) {
        setSelectedMail(null)
      }
    } catch (err) {
      console.error('Failed to quarantine email:', err)
    }
  }

  const handleCustomScan = async (e) => {
    e.preventDefault()
    if (!scanSender || !scanBody) return
    setIsScanning(true)
    try {
      const res = await fetch('/api/email-guardian/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: scanSender,
          subject: scanSubject,
          body: scanBody
        })
      })
      if (res.ok) {
        const data = await res.json()
        setScanResult(data)
      }
    } catch (err) {
      console.error('Scan failed:', err)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className={`p-5 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-blue-950/30 border-gray-800' 
          : 'bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/30 border-indigo-200/60'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs font-black tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Permission-Based AI Mailbox Security</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              EDUVA AI Email Guardian & Fraud Defense
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Safeguard student communication. EDUVA AI automatically scans authorized inboxes to detect fraudulent foreign scholarship schemes, advance-fee scams, and isolates genuine university entrance verification notices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {hasPermission ? (
              <button
                onClick={revokePermission}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold text-rose-500 border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer`}
              >
                Disconnect Mailbox
              </button>
            ) : (
              <button
                onClick={grantPermission}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Grant Read Permission & Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!hasPermission ? (
        <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-4 max-w-xl mx-auto ${
          theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-blue-500 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black">Mailbox Access Locked</h3>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
            EDUVA AI strictly requires user authorization before analyzing student emails. Once authorized, our local privacy-preserving model flags scam emails without exposing private credentials.
          </p>
          <button
            onClick={grantPermission}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Authorize EDUVA Email Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inbox List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-blue-500" />
                <span>Student Inbox ({inbox.length})</span>
              </span>
              <button
                onClick={fetchInbox}
                className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {inbox.map((mail, idx) => (
                <motion.div
                  key={mail.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx, 10) * 0.03, duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setSelectedMail(mail)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-colors ${
                    selectedMail?.id === mail.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : theme === 'dark' ? 'border-gray-800 hover:border-gray-700' : 'border-slate-200 hover:border-slate-300'
                  } ${
                    mail.is_spam
                      ? theme === 'dark' ? 'bg-rose-950/20' : 'bg-rose-50/50'
                      : theme === 'dark' ? 'bg-gray-900/80' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs truncate max-w-[180px] sm:max-w-[220px]">
                      {mail.sender_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      mail.is_spam
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {mail.is_spam ? 'SCAM FLAGGED' : 'OFFICIAL'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs mt-1 text-blue-400 truncate">{mail.subject}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    {mail.preview}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-gray-800/40 flex items-center justify-between text-[10px] opacity-60">
                    <span>{mail.received_at}</span>
                    <span>{mail.sender}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Mail Detail & Quarantine Action */}
          <div className="lg:col-span-7">
            {selectedMail ? (
              <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
                theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-slate-200'
              }`}>
                {/* Status Bar */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  selectedMail.is_spam
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedMail.is_spam ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    <div>
                      <span className="font-black text-xs block">
                        {selectedMail.is_spam ? 'CRITICAL SECURITY THREAT DETECTED' : 'VERIFIED OFFICIAL UNIVERSITY NOTICE'}
                      </span>
                      {selectedMail.spam_reason && (
                        <span className="text-[11px] opacity-90">{selectedMail.spam_reason}</span>
                      )}
                    </div>
                  </div>

                  {selectedMail.is_spam && (
                    <button
                      onClick={() => handleDeleteSpam(selectedMail.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Quarantine
                    </button>
                  )}
                </div>

                {/* Email Body & Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Subject</span>
                    <h2 className="text-base sm:text-lg font-black mt-0.5">{selectedMail.subject}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Sender</span>
                      <span className="font-bold">{selectedMail.sender_name}</span>
                      <span className="text-[11px] text-blue-400 block">{selectedMail.sender}</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Category</span>
                      <span className="font-bold">{selectedMail.category}</span>
                      <span className="text-[11px] text-emerald-400 block">Urgency: {selectedMail.urgency}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Message Content</span>
                    <div className={`p-4 rounded-2xl border mt-1 text-xs leading-relaxed ${
                      theme === 'dark' ? 'bg-gray-800/30 border-gray-800 text-gray-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {selectedMail.preview}
                    </div>
                  </div>

                  {selectedMail.suggested_action && (
                    <div className={`p-4 rounded-2xl border text-xs ${
                      theme === 'dark' ? 'bg-blue-950/20 border-blue-900/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                      <span className="font-black uppercase tracking-wider block text-[10px] mb-1">💡 EDUVA AI Recommendation:</span>
                      {selectedMail.suggested_action}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-12 rounded-3xl border text-center opacity-60 ${
                theme === 'dark' ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-slate-200'
              }`}>
                <Mail className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-xs font-bold">Select an email to inspect safety telemetry</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Instant Email Threat Scanner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
        theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-black tracking-tight">
            Live Email & Scholarship Scam Analyzer
          </h3>
        </div>
        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
          Paste any suspicious email or letter you received to instantly verify its authenticity against EDUVA AI's verified institutional registry.
        </p>

        <form onSubmit={handleCustomScan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Sender Email</label>
              <input
                type="text"
                value={scanSender}
                onChange={(e) => setScanSender(e.target.value)}
                placeholder="e.g. awards@global-scholarship2026.xyz"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Subject Line</label>
              <input
                type="text"
                value={scanSubject}
                onChange={(e) => setScanSubject(e.target.value)}
                placeholder="e.g. Final Notice: Grant Processing Fee Needed"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Email Body Text</label>
            <textarea
              rows={3}
              value={scanBody}
              onChange={(e) => setScanBody(e.target.value)}
              placeholder="Paste email content here..."
              className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Analyzing Threat Vectors...' : 'Analyze Email Authenticity'}</span>
            </button>
          </div>
        </form>

        {scanResult && (
          <div className={`mt-5 p-4 rounded-2xl border space-y-2 animate-fadeIn ${
            scanResult.is_spam
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between font-black text-xs">
              <span className="flex items-center gap-2">
                {scanResult.is_spam ? <ShieldAlert className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                Verdict: {scanResult.safety_verdict}
              </span>
              <span>Risk Score: {(scanResult.risk_score * 100).toFixed(0)}%</span>
            </div>

            {scanResult.reasons && scanResult.reasons.length > 0 && (
              <ul className="text-[11px] list-disc list-inside space-y-0.5 opacity-90">
                {scanResult.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
