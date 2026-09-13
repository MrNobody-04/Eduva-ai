import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, ShieldAlert, MapPin, Building2, Flame, 
  CheckCircle2, Clock, Calendar, ExternalLink, RefreshCw 
} from 'lucide-react'

export default function AlertsAndSafety({ theme }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [lastRefreshed, setLastRefreshed] = useState(() => new Date().toLocaleTimeString())

  const fetchAlerts = async () => {
    setLoading(true)
    setHasError(false)
    try {
      const res = await fetch(`/api/alerts?_t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setAlerts(Array.isArray(data) ? data : [])
        setLastRefreshed(new Date().toLocaleTimeString())
      } else {
        setHasError(true)
      }
    } catch (err) {
      console.error('Failed to load alerts:', err)
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const getSeverityStyle = (severity) => {
    switch (String(severity || '').toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          badge: 'bg-rose-500/15 border-rose-500/40 text-rose-500 dark:text-rose-400 font-black',
          card: 'border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/5'
        }
      case 'WARNING':
      case 'MEDIUM':
        return {
          badge: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 font-black',
          card: 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/5'
        }
      default:
        return {
          badge: 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-400 font-black',
          card: 'border-blue-500/30 hover:border-blue-500/60 shadow-blue-500/5'
        }
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-rose-950/20 border-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-rose-50/30 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-black tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>National Education Impact & Safety Radar</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Live Climate, Strike & Disaster Alerts
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Real-time monitoring of road blockages, heavy rainfall advisories, transportation disruption, and campus closure notices across Nepal.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Telemetry sync: {lastRefreshed}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
          </div>

          <button
            onClick={fetchAlerts}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 border hover:scale-105 shadow-md ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-blue-500/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Feed</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-xs font-semibold opacity-70 animate-pulse flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span>Synchronizing with national hazard registries & telemetry...</span>
        </div>
      )}

      {hasError && !loading && (
        <div className="py-8 text-center text-xs text-rose-500 dark:text-rose-400 border border-rose-500/20 rounded-2xl bg-rose-500/5">
          Temporarily unable to reach hazard registry. Please click "Refresh Live Feed" above.
        </div>
      )}

      {/* Alerts Grid with 3D Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map(alert => {
          const style = getSeverityStyle(alert.severity)
          return (
            <div
              key={alert.id || Math.random()}
              className={`card-3d p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl ${
                theme === 'dark' 
                  ? `bg-[#0E1424] ${style.card}` 
                  : `bg-white border-slate-200 shadow-md ${style.card}`
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                    {alert.severity || 'ALERT'} • {alert.hazard_type || alert.alert_type || 'ADVISORY'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{alert.region || alert.province || 'Nepal'}</span>
                  </div>
                </div>

                <div>
                  <h3 className={`text-base sm:text-lg font-black leading-snug ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {alert.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700 font-normal'
                  }`}>
                    {alert.description}
                  </p>
                </div>

                {/* Affected Institutions */}
                {Array.isArray(alert.affected_institutions) && alert.affected_institutions.length > 0 && (
                  <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Potentially Impacted Campuses:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {alert.affected_institutions.map((inst, idx) => {
                        const instName = typeof inst === 'object' && inst !== null ? (inst.name || inst.id) : String(inst)
                        const instImpact = typeof inst === 'object' && inst !== null ? inst.impact : null
                        return (
                          <div 
                            key={idx} 
                            className={`text-[11px] p-2.5 rounded-xl font-semibold flex flex-col gap-1 border ${
                              theme === 'dark' 
                                ? 'bg-slate-800/90 border-slate-700 text-slate-200' 
                                : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="font-bold">{instName}</span>
                            </div>
                            {instImpact && (
                              <span className={`text-[10px] font-normal leading-tight ${
                                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                              }`}>{instImpact}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                {alert.recommended_action && (
                  <div className={`p-3.5 rounded-2xl text-[11px] border font-medium leading-relaxed ${
                    theme === 'dark' 
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' 
                      : 'bg-amber-50/90 border-amber-300 text-amber-900'
                  }`}>
                    <strong className="font-black text-amber-600 dark:text-amber-400">Action: </strong>
                    {alert.recommended_action}
                  </div>
                )}
              </div>

              {/* Source & Official Link */}
              <div className={`pt-4 border-t mt-4 flex items-center justify-between text-[11px] ${
                theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span className="font-semibold text-slate-500">Source:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{alert.source_name || 'Verified Authority Notice'}</span>
                </div>

                {alert.source_url ? (
                  <a
                    href={alert.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 text-xs"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-semibold text-emerald-500">Active Monitoring</span>
                )}
              </div>
            </div>
          )
        })}

        {alerts.length === 0 && !loading && !hasError && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No active hazards or emergency advisories currently reported.
          </div>
        )}
      </div>
    </div>
  )
}
