import React, { useState, useEffect } from 'react'
import { 
  CheckCircle2, Clock, Plus, AlertCircle, FileText, 
  ExternalLink, Trash2, Calendar, ShieldCheck, ArrowRight
} from 'lucide-react'

export default function ApplicationTracker({ theme, onOpenCopilot }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [newApp, setNewApp] = useState({
    institution: '',
    program: '',
    portal_url: '',
    application_fee: '',
    deadline: '',
    status: 'INTERESTED',
    notes: ''
  })

  const stages = [
    { id: 'INTERESTED', label: 'Interested', color: 'text-slate-400 border-slate-500/30' },
    { id: 'SHORTLISTED', label: 'Shortlisted', color: 'text-blue-400 border-blue-500/30' },
    { id: 'APPLIED', label: 'Applied', color: 'text-amber-400 border-amber-500/30' },
    { id: 'ENTRANCE_SCHEDULED', label: 'Entrance Scheduled', color: 'text-purple-400 border-purple-500/30' },
    { id: 'ACCEPTED', label: 'Accepted', color: 'text-emerald-400 border-emerald-500/30' },
    { id: 'ENROLLED', label: 'Enrolled', color: 'text-teal-400 border-teal-500/30' }
  ]

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleCreateApplication = async (e) => {
    e.preventDefault()
    if (!newApp.institution || !newApp.program) return
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      })
      if (res.ok) {
        setIsNewModalOpen(false)
        setNewApp({
          institution: '',
          program: '',
          portal_url: '',
          application_fee: '',
          deadline: '',
          status: 'INTERESTED',
          notes: ''
        })
        fetchApplications()
      }
    } catch (err) {
      console.error('Failed to create application:', err)
    }
  }

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (res.ok) {
        fetchApplications()
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-blue-950/30 border-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-wide uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Admission Pipeline Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Track Your University Applications
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Manage your deadlines, entrance schedules, document checklists, and application statuses in one verified personal dashboard.
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map(stage => {
          const stageApps = applications.filter(a => (a.status || 'INTERESTED').toUpperCase() === stage.id)
          return (
            <div
              key={stage.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#0E1424] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      stage.id === 'ACCEPTED' ? 'bg-emerald-400' :
                      stage.id === 'APPLIED' ? 'bg-amber-400' :
                      stage.id === 'ENTRANCE_SCHEDULED' ? 'bg-purple-400' : 'bg-blue-400'
                    }`}></span>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-200">{stage.label}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageApps.map(app => (
                    <div
                      key={app.id}
                      className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-100">{app.institution}</h4>
                          <span className="text-[11px] text-blue-400 font-semibold block">{app.program}</span>
                        </div>
                      </div>

                      {app.deadline && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Deadline: <strong className="text-slate-200">{app.deadline}</strong></span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[10px] text-slate-400 italic bg-slate-950/40 p-2 rounded-xl">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Status Flow Buttons */}
                      <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between">
                        <select
                          value={app.status || 'INTERESTED'}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                        >
                          {stages.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>

                        {app.portal_url && (
                          <a
                            href={app.portal_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white p-1"
                            title="Official Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-500 border border-dashed border-slate-800/60 rounded-2xl">
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* New Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
            theme === 'dark' ? 'bg-[#0E1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black">Add New Application</h3>
            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Institution / University</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pulchowk Campus, Kathmandu University"
                  value={newApp.institution}
                  onChange={(e) => setNewApp({ ...newApp, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Program Applied</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.E. Computer Engineering, BSc CSIT"
                  value={newApp.program}
                  onChange={(e) => setNewApp({ ...newApp, program: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Deadline</label>
                  <input
                    type="date"
                    value={newApp.deadline}
                    onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Application Fee</label>
                  <input
                    type="text"
                    placeholder="e.g. NPR 2,000"
                    value={newApp.application_fee}
                    onChange={(e) => setNewApp({ ...newApp, application_fee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Portal URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newApp.portal_url}
                  onChange={(e) => setNewApp({ ...newApp, portal_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Need to collect character certificate from +2 college..."
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-900 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
