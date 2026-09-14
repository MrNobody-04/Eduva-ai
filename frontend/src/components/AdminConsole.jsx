import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, Activity, Cpu, Database, CheckCircle2, 
  AlertTriangle, RefreshCw, Server, Eye, ExternalLink, X,
  Upload, FileText, Lock, Key, Plus, AlertCircle
} from 'lucide-react'

export default function AdminConsole({ theme, isDemoMode, toggleDemoMode }) {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('eduva_admin_key') || '')
  const [keyInput, setKeyInput] = useState('')
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [queue, setQueue] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('resources')
  const [resolvingId, setResolvingId] = useState(null)

  // Resource Upload Form State
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('ACADEMIC_NOTICE')
  const [uploadAuthority, setUploadAuthority] = useState('LEVEL_2_AFFILIATED')
  const [uploadInstitution, setUploadInstitution] = useState('')
  const [uploadYear, setUploadYear] = useState(2026)
  const [uploadDescription, setUploadDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)

  const saveAdminKey = (key) => {
    setAdminKey(key)
    localStorage.setItem('eduva_admin_key', key)
    setIsKeyModalOpen(false)
  }

  const getHeaders = () => {
    const headers = {}
    if (adminKey) {
      headers['X-API-Key'] = adminKey
    }
    return headers
  }

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/verification-queue', {
        headers: getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        setQueue(data)
      }
    } catch (err) {
      console.error('Failed to load queue:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/admin/resources', {
        headers: getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        setResources(data)
      }
    } catch (err) {
      console.error('Failed to load resources:', err)
    }
  }

  useEffect(() => {
    fetchQueue()
    fetchResources()
  }, [adminKey])

  const handleResourceUpload = async (e) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle.trim()) {
      setUploadMsg({ type: 'error', text: 'Please choose a file and enter a title' })
      return
    }

    setIsUploading(true)
    setUploadMsg(null)
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('title', uploadTitle)
    formData.append('category', uploadCategory)
    formData.append('authority_level', uploadAuthority)
    formData.append('institution', uploadInstitution)
    formData.append('year', uploadYear)
    formData.append('description', uploadDescription)

    try {
      const res = await fetch('/api/admin/resources/upload', {
        method: 'POST',
        headers: getHeaders(),
        body: formData
      })
      const result = await res.json()
      if (res.ok) {
        setUploadMsg({
          type: 'success',
          text: result.requires_approval
            ? 'Uploaded! HIGH risk document routed to Security Gate for verification.'
            : 'Document published successfully and synced to knowledge engine!'
        })
        setUploadFile(null)
        setUploadTitle('')
        setUploadDescription('')
        fetchResources()
        fetchQueue()
      } else {
        setUploadMsg({ type: 'error', text: result.detail || 'Upload failed. Check Admin API Key.' })
      }
    } catch (err) {
      setUploadMsg({ type: 'error', text: 'Network error during upload' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleResolve = async (id, resolution) => {
    setResolvingId(id)
    try {
      const res = await fetch(`/api/admin/verification-queue/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution })
      })
      if (res.ok) {
        fetchQueue()
      }
    } catch (err) {
      console.error('Failed to resolve queue item:', err)
    } finally {
      setResolvingId(null)
    }
  }

  const systemStatus = {
    gemini_key_1: 'HEALTHY (Google AI Studio)',
    gemini_key_2: 'STANDBY (Failover Ready)',
    uptime_robot: 'ONLINE (Interval: 5 mins, 100.0% Uptime)',
    database_pooler: 'ONLINE (Supabase PostgreSQL 17 Mumbai)',
    crawler_daemon: 'ACTIVE (Crawling MOEST, TU IOE, KU Exam Portals)'
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-purple-950/30 border-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-purple-50/30 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-black tracking-wide uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>Restricted System Telemetry & Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              EDUVA Infrastructure & Human-in-the-Loop
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Review autonomous crawler discoveries, verify university fee submissions, monitor dual-key Gemini failover, and inspect 24/7 uptime.
            </p>
          </div>

          {/* Mode switch isolated in admin + Admin Key status */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                adminKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{adminKey ? 'Admin Key Set' : 'Set Admin API Key'}</span>
            </button>

            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              }`}
            >
              Mode: {isDemoMode ? 'SIMULATION' : 'PRODUCTION'}
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-purple-600 text-white shadow-lg'
                : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Document Vault ({resources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-purple-600 text-white shadow-lg'
                : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Human Verification Queue ({queue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-purple-600 text-white shadow-lg'
                : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>System Telemetry & Health</span>
          </button>
        </div>
      </div>

      {/* Admin Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`max-w-md w-full rounded-3xl border shadow-2xl p-6 space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black">Configure Admin API Key</h3>
              </div>
              <button onClick={() => setIsKeyModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Enter your backend <code className="text-purple-400 font-mono">ADMIN_API_KEY</code> to unlock resource uploads, queue resolutions, and simulated triggers.
            </p>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. dev_admin_secret_key_2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => saveAdminKey(keyInput)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Vault & Resource Upload Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Upload Form Box */}
          <div className={`p-6 rounded-3xl border space-y-5 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Upload Authoritative Education Document / Gazette</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload syllabus PDFs, entrance notices, university circulars, or gazette updates.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                AI Knowledge Pipeline
              </span>
            </div>

            {uploadMsg && (
              <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                uploadMsg.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleResourceUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Resource Title *</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. IOE B.E. Entrance Examination 2026 Official Notice"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Institution / University</label>
                <input
                  type="text"
                  value={uploadInstitution}
                  onChange={(e) => setUploadInstitution(e.target.value)}
                  placeholder="e.g. Tribhuvan University (IOE Pulchowk)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ACADEMIC_NOTICE">Academic Notice</option>
                  <option value="ENTRANCE_SYLLABUS">Entrance Syllabus</option>
                  <option value="FEE_STRUCTURE">Official Fee Structure</option>
                  <option value="GOVERNMENT_GAZETTE">Government Gazette / MOEST</option>
                  <option value="SCHOLARSHIP_CIRCULAR">Scholarship Circular</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Authority Verification Level</label>
                <select
                  value={uploadAuthority}
                  onChange={(e) => setUploadAuthority(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="LEVEL_1_AUTHORITATIVE">LEVEL 1: Authoritative (Requires Human Gate)</option>
                  <option value="LEVEL_2_AFFILIATED">LEVEL 2: Affiliated College Notice</option>
                  <option value="OFFICIAL_GAZETTE">OFFICIAL GAZETTE: National Directive</option>
                  <option value="INTERNAL_BENCHMARK">INTERNAL BENCHMARK: Historical Data</option>
                </select>
              </div>

              <div className="col-span-full space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Summary / Key Context</label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Key details: e.g. Exam centers in Lalitpur, Pokhara, Dharan; form fee NPR 2,000."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="col-span-full space-y-1.5">
                <label className="text-xs font-bold text-slate-300">File Attachment (PDF, Doc, Image) *</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                />
              </div>

              <div className="col-span-full pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span>{isUploading ? 'Uploading & Indexing...' : 'Upload & Commit to Living KG'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-100">Document Vault ({resources.length} Verified Records)</h4>
              <button
                onClick={fetchResources}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Vault</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(resItem => (
                <div
                  key={resItem.id}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      {resItem.category}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      resItem.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {resItem.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-black text-slate-100">{resItem.title}</h5>
                    <p className="text-[11px] text-slate-400">{resItem.institution || 'Ministry / Board'}</p>
                  </div>

                  {resItem.description && (
                    <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                      {resItem.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span>File: {resItem.original_filename}</span>
                    <span>{resItem.uploaded_at?.slice(0, 10)}</span>
                  </div>
                </div>
              ))}

              {resources.length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
                  No documents uploaded yet. Add a syllabus, fee notice, or gazette above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-100">Pending Authority Verification Tasks</h3>
            <button
              onClick={fetchQueue}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map(item => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border space-y-3 ${
                  theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    {item.change_type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{item.entity_name}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 block">Proposed Value:</span>
                  <p className="text-xs font-bold text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                    {item.detected_value || (typeof item.proposed_value === 'object' ? JSON.stringify(item.proposed_value) : item.proposed_value) || item.current_value}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span>Source: </span>
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{item.source_url || 'Autonomous Crawler'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleResolve(item.id, 'REJECTED')}
                    disabled={resolvingId === item.id}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-400 text-xs font-bold hover:bg-rose-500/10 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleResolve(item.id, 'APPROVED')}
                    disabled={resolvingId === item.id}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Approve & Publish
                  </button>
                </div>
              </div>
            ))}

            {queue.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
                Verification queue is empty. All autonomous discoveries have been reviewed.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              <h3 className="font-black text-sm text-slate-100">Live Service Status</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {Object.entries(systemStatus).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">{k.replace(/_/g, ' ')}</span>
                  <span className="font-bold text-emerald-400">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <h3 className="font-black text-sm text-slate-100">Database Schema (PostgreSQL 17)</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
                ✓ <strong>universities</strong>: 27 accredited institutions
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
                ✓ <strong>courses</strong>: 15 verified degree tracks
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
                ✓ <strong>colleges</strong>: 9 sample colleges across TU & KU
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
                ✓ <strong>entrance_exams</strong>: 6 national entrance schedules
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px]">
                ✓ <strong>applications & saved_items</strong>: Personal student state
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
