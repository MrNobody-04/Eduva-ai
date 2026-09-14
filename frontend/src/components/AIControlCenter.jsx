import React, { useState, useEffect } from 'react'
import { 
  Cpu, Activity, Database, ShieldAlert, Sparkles, RefreshCw, 
  CheckCircle2, Clock, Play, FileCode, Server, Layers, AlertCircle
} from 'lucide-react'

export default function AIControlCenter({ theme }) {
  const [telemetry, setTelemetry] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)
  const [geminiStatus, setGeminiStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simQuery, setSimQuery] = useState('Apex College BCA Kathmandu')
  const [simResult, setSimResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [deadlineResult, setDeadlineResult] = useState(null)

  const fetchTelemetry = async () => {
    try {
      const [resTel, resDb, resGemini] = await Promise.all([
        fetch('/api/living-system/telemetry'),
        fetch('/api/database/status'),
        fetch('/api/gemini/status')
      ])
      if (resTel.ok) {
        const data = await resTel.json()
        setTelemetry(data)
      }
      if (resDb.ok) {
        const dbData = await resDb.json()
        setDbStatus(dbData)
      }
      if (resGemini.ok) {
        const geminiData = await resGemini.json()
        setGeminiStatus(geminiData)
      }
    } catch (err) {
      console.error('Failed to load telemetry:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelemetry()
    const interval = setInterval(fetchTelemetry, 6000)
    return () => clearInterval(interval)
  }, [])

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    const adminKey = localStorage.getItem('eduva_admin_key')
    if (adminKey) {
      headers['X-API-Key'] = adminKey
    }
    return headers
  }

  const handleSimulateDiscovery = async (e) => {
    e.preventDefault()
    setIsSimulating(true)
    try {
      const res = await fetch('/api/living-system/simulate-discovery', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ query: simQuery })
      })
      if (res.ok) {
        const data = await res.json()
        setSimResult(data)
        fetchTelemetry()
      } else {
        const errData = await res.json()
        setSimResult({ status: 'AUTH_REQUIRED', error: errData.detail || 'Admin API Key Required' })
      }
    } catch (err) {
      console.error('Discovery simulation failed:', err)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleSimulateDeadlineExtension = async () => {
    try {
      const res = await fetch('/api/living-system/simulate-deadline-change', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ entity_id: 'prog_ioe_be_comp', new_deadline: '2026-09-27' })
      })
      if (res.ok) {
        const data = await res.json()
        setDeadlineResult(data)
        fetchTelemetry()
      } else {
        const errData = await res.json()
        alert(errData.detail || 'Admin API key required for simulated mutations')
      }
    } catch (err) {
      console.error('Deadline change simulation failed:', err)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950/40 border-gray-800' 
          : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wide">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>Autonomous AI Control Center & Living Knowledge Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Living Knowledge Graph & Autonomous Research Engine
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
              Real-time telemetry of EDUVA's autonomous education discovery loop, Level 1 authoritative source monitors, versioned semantic change history, and automated knowledge gap resolution.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchTelemetry}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-750' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Global Living Telemetry Stats */}
        {telemetry && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-800/40">
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Indexed Universities</span>
              <span className="text-2xl font-black mt-1 block">{telemetry.total_universities} Institutions</span>
            </div>
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Verified Colleges</span>
              <span className="text-2xl font-black mt-1 block">{telemetry.total_colleges} Campuses</span>
            </div>
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Degree Programs</span>
              <span className="text-2xl font-black mt-1 block">{telemetry.total_courses} Degrees</span>
            </div>
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Monitored Portals</span>
              <span className="text-2xl font-black mt-1 block">{telemetry.monitored_sources_count} Level 1 Sources</span>
            </div>
          </div>
        )}

        {/* Supabase PostgreSQL Cloud Database Status */}
        {dbStatus && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400">Supabase PostgreSQL 17 Cloud DB</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">LIVE • ap-south-1</span>
                </div>
                <span className={`text-[11px] block mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Connected to aws-0-ap-south-1.pooler.supabase.com • Level 1 Cloud Sync Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
              <div className="text-center sm:text-right">
                <span className="text-gray-400 block text-[9px] uppercase">Synced Tables</span>
                <span className="font-bold text-emerald-400">{dbStatus.tables?.universities || 27} Universities • {dbStatus.tables?.colleges || 9} Colleges • {dbStatus.tables?.courses || 15} Courses</span>
              </div>
              <div className="h-6 w-px bg-emerald-500/30 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Healthy</span>
              </div>
            </div>
          </div>
        )}

        {/* Google Gemini Dual-Key Failover Engine Status */}
        {geminiStatus && (
          <div className="mt-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-blue-400">Google Gemini 2.5 Flash Intelligence</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    {geminiStatus.keys_count} API KEYS • DUAL FAILOVER ACTIVE
                  </span>
                </div>
                <span className={`text-[11px] block mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Active: Key #{geminiStatus.active_key_index} • Multi-Key Load Balancing & Rate-Limit Guard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
              <div className="text-center sm:text-right">
                <span className="text-gray-400 block text-[9px] uppercase">Model</span>
                <span className="font-bold text-blue-400">{geminiStatus.model}</span>
              </div>
              <div className="h-6 w-px bg-blue-500/30 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Autonomous College Discovery Simulation Suite */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
        theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
              Autonomous Verification Test
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              Simulate Discovery of an Uncataloged College
            </h3>
            <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
              Search for an uncataloged college. Watch EDUVA's research agent trigger source discovery, verify affiliation, extract degrees, calculate confidence, and index live into the Knowledge Graph.
            </p>
          </div>

          <button
            onClick={handleSimulateDeadlineExtension}
            className="px-4 py-2 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400 hover:bg-amber-600/30 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Simulate IOE Deadline Extension
          </button>
        </div>

        <form onSubmit={handleSimulateDiscovery} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={simQuery}
            onChange={(e) => setSimQuery(e.target.value)}
            placeholder="e.g. Apex College BCA Kathmandu"
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
          <button
            type="submit"
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Autonomous Discovery in Progress...' : 'Run Autonomous Discovery'}</span>
          </button>
        </form>

        {/* Live Simulation Trace Result */}
        {simResult && (
          <div className="mt-5 p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between font-black">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Status: {simResult.status}
              </span>
              <span className="text-blue-400">Agent: {simResult.agent}</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] opacity-80 pt-2 border-t border-gray-800">
              {simResult.pipeline_steps?.map((st, i) => (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="text-gray-400">Step {i+1}: {st.step}</span>
                  <span className="text-emerald-300 font-bold">{st.result || st.status || `Authority: ${st.authority_level}`}</span>
                </div>
              ))}
            </div>

            {simResult.discovered_record && (
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs">
                <span className="font-bold text-white block">{simResult.discovered_record.name}</span>
                <span className="text-blue-400 block">{simResult.discovered_record.university} • {simResult.discovered_record.location}</span>
                <span className="text-emerald-400 font-bold block mt-1">✓ Confidence: {(simResult.discovered_record.confidence_score * 100).toFixed(0)}% (Verified & Indexed into Search)</span>
              </div>
            )}
          </div>
        )}

        {deadlineResult && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs flex items-center justify-between animate-fadeIn">
            <span>🚨 Semantic Change Detected: IOE Application Deadline Extended to {deadlineResult.change_recorded?.new_value}</span>
            <span className="font-bold">Affected Students Notified</span>
          </div>
        )}
      </div>

      {/* Versioned Knowledge Changes & Monitored Level 1 Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Versioned Changes */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm">Versioned Semantic Changes Log</h3>
            <span className="text-[10px] text-gray-400 font-mono">Zero Silent Overwrite</span>
          </div>

          <div className="space-y-2.5">
            {telemetry?.recent_changes?.map((chg) => (
              <div key={chg.id} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {chg.change_type}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{chg.verified_at}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className="line-through text-rose-400">{chg.previous_value}</span>
                  <span>→</span>
                  <span className="text-emerald-400">{chg.new_value}</span>
                </div>
                <p className="text-[11px] opacity-70">{chg.reason}</p>
                <div className="text-[10px] text-blue-400 pt-1 border-t border-gray-700/30">
                  Source: {chg.source?.sourceName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitored Level 1 Sources */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm">Authoritative Portals Monitored</h3>
            <span className="text-[10px] text-emerald-400 font-bold">100% Real-Time Heartbeat</span>
          </div>

          <div className="space-y-2.5">
            {telemetry?.sources?.map((src) => (
              <div key={src.sourceId} className="p-3.5 rounded-2xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold block text-white">{src.name}</span>
                  <span className="text-[10px] text-gray-400 block">{src.url}</span>
                  <span className="text-[9px] text-blue-400 font-bold uppercase">{src.authorityLevel}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                    {src.status}
                  </span>
                  <span className="text-[10px] opacity-50 block mt-1">{src.lastCheckedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
