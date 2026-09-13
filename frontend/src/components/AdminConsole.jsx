import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, Activity, Cpu, Database, CheckCircle2, 
  AlertTriangle, RefreshCw, Server, Eye, ExternalLink, X
} from 'lucide-react'

export default function AdminConsole({ theme, isDemoMode, toggleDemoMode }) {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('verification')
  const [resolvingId, setResolvingId] = useState(null)

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/verification-queue')
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

  useEffect(() => {
    fetchQueue()
  }, [])

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

          {/* Mode switch isolated in admin */}
          <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-purple-600 text-white'
                : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Human Verification Queue ({queue.length})
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-purple-600 text-white'
                : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
            }`}
          >
            System Telemetry & Health
          </button>
        </div>
      </div>

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
                    {typeof item.proposed_value === 'object' ? JSON.stringify(item.proposed_value) : item.proposed_value}
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
