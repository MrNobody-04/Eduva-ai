import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, ShieldAlert, Thermometer, Wind, Droplets, Mountain, 
  Leaf, RefreshCw, CheckCircle2, TrendingUp, Compass, ExternalLink, Zap
} from 'lucide-react'

export default function ClimateDisasterHub({ theme }) {
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [pledges, setPledges] = useState(() => {
    const saved = localStorage.getItem('eduva_eco_pledges')
    return saved ? JSON.parse(saved) : [0, 1]
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchClimateData = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/climate-disaster')
      if (res.ok) {
        const data = await res.json()
        setClimateData(data)
      }
    } catch (err) {
      console.error('Failed to load climate data:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchClimateData()
    const interval = setInterval(fetchClimateData, 10000)
    return () => clearInterval(interval)
  }, [])

  const togglePledge = (index) => {
    const next = pledges.includes(index)
      ? pledges.filter(i => i !== index)
      : [...pledges, index]
    setPledges(next)
    localStorage.setItem('eduva_eco_pledges', JSON.stringify(next))
  }

  const hazards = climateData?.realtime_hazards || []
  const filteredHazards = filterSeverity === 'ALL'
    ? hazards
    : hazards.filter(h => h.severity === filterSeverity)

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 border-rose-500/40 text-rose-500'
      case 'HIGH':
        return 'bg-amber-500/10 border-amber-500/40 text-amber-500'
      case 'ELEVATED':
        return 'bg-orange-500/10 border-orange-500/40 text-orange-400'
      default:
        return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full max-w-full overflow-hidden pb-12">
      {/* Header Banner */}
      <div className={`p-5 sm:p-8 rounded-3xl border shadow-depth-md relative overflow-hidden transition-all ${
        theme === 'dark' 
          ? 'bg-[#0B101E] border-slate-800/80' 
          : 'bg-white border-slate-200/90'
      }`}>
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none hidden sm:block">
          <Mountain className="w-64 h-64 text-rose-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Climate & Natural Disaster Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Himalayan Hazard Early Warning & Global Warming Watch
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Live monitoring of Glacial Lake Outburst Floods (GLOF), monsoon highway landslides, Koshi basin river discharge, and Kathmandu air inversion. Understanding climate risk to drive proactive student lifestyle sustainability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={fetchClimateData}
              disabled={isRefreshing}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#060911] border-slate-700 text-slate-200 hover:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : 'text-slate-400'}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Live Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Global Summary Stats */}
        {climateData?.summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-800/40">
            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Active Alerts
              </div>
              <div className="text-lg sm:text-2xl font-black mt-1 text-rose-500">
                {climateData.summary.active_hazard_alerts} Critical
              </div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Thermometer className="w-3 h-3" /> Temp Anomaly
              </div>
              <div className="text-sm sm:text-xl font-black mt-1 text-amber-500">
                {climateData.summary.avg_nepal_temp_anomaly}
              </div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Mountain className="w-3 h-3" /> Glacier Retreat
              </div>
              <div className="text-xs sm:text-base font-bold mt-1 text-blue-400 truncate" title={climateData.summary.glacier_retreat_rate}>
                {climateData.summary.glacier_retreat_rate}
              </div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white/80 border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" /> Risk Status
              </div>
              <div className="text-xs sm:text-base font-black mt-1 text-emerald-400">
                {climateData.summary.overall_risk_level}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60 shrink-0">Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'ELEVATED', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : theme === 'dark'
                    ? 'bg-gray-800/80 text-gray-400 hover:text-white'
                    : 'bg-slate-200/80 text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className="text-xs font-semibold opacity-70">
          {filteredHazards.length} Live Watchpoints
        </div>
      </div>

      {/* Real-time Hazard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredHazards.map((hazard) => (
          <div
            key={hazard.id}
            className={`p-5 sm:p-6 rounded-3xl border transition-all hover:shadow-2xl flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSeverityStyle(hazard.severity)}`}>
                    {hazard.severity} RISK
                  </span>
                  <h3 className="text-base sm:text-lg font-black mt-2 tracking-tight">
                    {hazard.hazard_type}
                  </h3>
                  <p className="text-xs font-bold text-blue-500 flex items-center gap-1 mt-0.5">
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>{hazard.location}</span>
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              {/* Specific Metric Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {hazard.water_level && (
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-blue-400 block">Water Level</span>
                    <span className="font-bold">{hazard.water_level}</span>
                  </div>
                )}
                {hazard.rainfall_24h && (
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">24h Rainfall</span>
                    <span className="font-bold">{hazard.rainfall_24h}</span>
                  </div>
                )}
                {hazard.aqi_pm25 && (
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Air Quality</span>
                    <span className="font-bold">{hazard.aqi_pm25}</span>
                  </div>
                )}
                {hazard.water_discharge && (
                  <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block">Discharge</span>
                    <span className="font-bold">{hazard.water_discharge}</span>
                  </div>
                )}
              </div>

              {/* Cause & Impact */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold opacity-60">Global Warming Root Cause:</span>
                  <p className={`mt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{hazard.cause}</p>
                </div>
                <div>
                  <span className="font-bold opacity-60">Downstream Impact Zone:</span>
                  <p className={`mt-0.5 ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>{hazard.impact_area}</p>
                </div>
              </div>

              {/* Official Advisory */}
              <div className={`p-3 rounded-2xl border text-xs ${
                theme === 'dark' 
                  ? 'bg-amber-950/20 border-amber-900/40 text-amber-300' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <span className="font-black uppercase tracking-wider block text-[10px] mb-0.5">⚠️ Official Disaster Advisory:</span>
                {hazard.advisory}
              </div>

              {/* Provenance & Authority Tier */}
              {hazard.provenance_agency && (
                <div className="flex items-center justify-between gap-2 pt-1 text-[11px] opacity-75">
                  <span className="truncate font-medium">Source: {hazard.provenance_agency}</span>
                  {hazard.verified_source_url && (
                    <a 
                      href={hazard.verified_source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 shrink-0 font-semibold"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Status: {hazard.status}
              </span>
              <span className="opacity-50">Live Telemetry Feed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Global Warming Impact on Nepal Section */}
      <div className={`p-5 sm:p-8 rounded-3xl border transition-all ${
        theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            Documented Impacts of Global Warming on Nepal Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {climateData?.global_warming_impacts?.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 ${
                theme === 'dark' ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className="font-black text-sm text-purple-400">{item.title}</h4>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                {item.description}
              </p>
              <div className="pt-2 border-t border-gray-700/30 text-[11px] font-bold text-amber-400">
                📈 Trend: {item.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Climate Action & Sustainable Lifestyle Pledge */}
      <div className={`p-5 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-emerald-950/40 via-gray-900 to-gray-900 border-emerald-900/40' 
          : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase">
              <Leaf className="w-3.5 h-3.5" />
              <span>Student Climate Action Initiative</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Change Your Lifestyle, Safeguard Our Himalayas
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
              Commit to daily sustainable student habits to reduce collective carbon footprints across Nepal campuses.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xs sm:text-sm flex items-center gap-2 self-start sm:self-center">
            <Zap className="w-4 h-4" />
            <span>{pledges.length} / {climateData?.student_lifestyle_actions?.length || 4} Pledges Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {climateData?.student_lifestyle_actions?.map((act, idx) => {
            const isPledged = pledges.includes(idx)
            return (
              <div
                key={idx}
                onClick={() => togglePledge(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isPledged
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : theme === 'dark'
                      ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700 opacity-70'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs">{act.action}</span>
                    <CheckCircle2 className={`w-4 h-4 ${isPledged ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                    {act.impact}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-700/30 text-[10px] font-bold text-emerald-400">
                  💡 Tip: {act.tip}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
