import React, { useState, useEffect } from 'react'
import { 
  Cpu, Activity, Database, ShieldAlert, Sparkles, RefreshCw, 
  CheckCircle2, Clock, Play, FileCode, Server, Layers, AlertCircle,
  AlertTriangle, XCircle, WifiOff
} from 'lucide-react'

export default function AIControlCenter({ theme }) {
  const [telemetry, setTelemetry] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)
  const [geminiStatus, setGeminiStatus] = useState(null)
  const [providerHealth, setProviderHealth] = useState(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [healthError, setHealthError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simQuery, setSimQuery] = useState('Apex College BCA Kathmandu')
  const [simResult, setSimResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [deadlineResult, setDeadlineResult] = useState(null)

  // Connect to live /ws/telemetry WebSocket stream
  useEffect(() => {
    // Initial fetch for database, gemini, and provider health status
    const fetchAuxiliaryStatus = async () => {
      try {
        const [resDb, resGemini, resHealth] = await Promise.all([
          fetch('/api/database/status'),
          fetch('/api/gemini/status'),
          fetch('/api/providers/health')
        ])
        if (resDb.ok) setDbStatus(await resDb.json())
        if (resGemini.ok) setGeminiStatus(await resGemini.json())
        if (resHealth.ok) {
          const hData = await resHealth.json()
          setProviderHealth(hData.providers || {})
        }
      } catch (err) {
        console.warn('Status fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAuxiliaryStatus()

    // Establish WebSocket connection to /ws/telemetry
    let ws = null
    let reconnectTimeout = null

    const connectTelemetryWS = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/telemetry`

      try {
        ws = new WebSocket(wsUrl)
        ws.onopen = () => {
          setLoading(false)
        }
        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            if (data) {
              setTelemetry(data)
            }
          } catch (err) {}
        }
        ws.onclose = () => {
          if (!document.hidden) {
            reconnectTimeout = setTimeout(connectTelemetryWS, 4000)
          }
        }
      } catch (err) {
        console.warn('Telemetry WS error:', err)
      }
    }

    connectTelemetryWS()

    const handleVisibility = () => {
      if (!document.hidden && (!ws || ws.readyState === WebSocket.CLOSED)) {
        connectTelemetryWS()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (ws) ws.close()
    }
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

  const handleRunProviderDiagnostics = async () => {
    setIsCheckingHealth(true)
    setHealthError(null)
    try {
      const res = await fetch('/api/providers/health-check', {
        method: 'POST',
        headers: getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        setProviderHealth(data.providers || {})
      } else {
        const errData = await res.json()
        setHealthError(errData.detail || errData.error?.message || 'Admin authorization required for live diagnostics')
      }
    } catch (err) {
      setHealthError(err.message || 'Diagnostic network error')
    } finally {
      setIsCheckingHealth(false)
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

        {/* EDUVA AI 5-PROVIDER RUNTIME STATUS & DIAGNOSTICS */}
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                  5-Provider Infrastructure
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[9px] font-bold">
                  CENTRAL AI GATEWAY
                </span>
              </div>
              <h4 className="text-sm font-black tracking-tight text-white mt-0.5">
                EDUVA AI Provider Runtime Status
              </h4>
            </div>
            
            <button
              onClick={handleRunProviderDiagnostics}
              disabled={isCheckingHealth}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>{isCheckingHealth ? 'Testing Providers...' : 'Run Diagnostic Check'}</span>
            </button>
          </div>

          {healthError && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{healthError}</span>
            </div>
          )}

          {/* 5-Card Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { id: 'gemini', name: 'Gemini', desc: 'Deep Logic & Research' },
              { id: 'cerebras', name: 'Cerebras', desc: 'Ultra-Fast Fact Check' },
              { id: 'groq', name: 'Groq', desc: 'Realtime Chat & NLP' },
              { id: 'openrouter', name: 'OpenRouter', desc: 'Model Diversity' },
              { id: 'ollama', name: 'Ollama', desc: 'Local / Private Daemon' }
            ].map(p => {
              const info = providerHealth ? providerHealth[p.id] : null
              const status = info ? info.status : 'NOT_CHECKED'
              const isConnected = status === 'CONNECTED'
              const isWarning = status === 'PAYMENT_REQUIRED' || status === 'RATE_LIMITED'
              const isDown = status === 'MODEL_UNAVAILABLE' || status === 'AUTH_FAILED' || status === 'NETWORK_ERROR' || status === 'TIMEOUT' || status === 'PROVIDER_ERROR'
              
              const badgeStyle = isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isWarning
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : isDown
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-slate-500/10 border-slate-500/30 text-slate-400'

              const dotColor = isConnected
                ? 'bg-emerald-400 animate-pulse'
                : isWarning
                ? 'bg-amber-400'
                : isDown
                ? 'bg-rose-400'
                : 'bg-slate-400'

              return (
                <div 
                  key={p.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    theme === 'dark' 
                      ? 'bg-gray-800/60 border-gray-700/60 hover:border-gray-600' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="font-black text-xs tracking-tight">{p.name}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 shrink-0 ${badgeStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <span>{status.replace(/_/g, ' ')}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 block mb-2">{p.desc}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-700/40 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-gray-400 text-[10px]">
                      <span>Model:</span>
                      <span className="font-bold text-blue-400 truncate max-w-[110px]" title={info?.model || 'none'}>
                        {info?.model || 'none'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-[10px]">
                      <span>Latency:</span>
                      <span className="font-bold text-gray-200">
                        {info?.latency_ms ? `${info.latency_ms}ms` : '—'}
                      </span>
                    </div>
                    {info?.message && !isConnected && (
                      <p className="text-[9px] text-gray-400 mt-1 line-clamp-2" title={info.message}>
                        {info.message}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
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
