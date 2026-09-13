import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, ShieldAlert, MapPin, Building2, Flame, 
  CheckCircle2, Clock, Calendar, ExternalLink, RefreshCw 
} from 'lucide-react'

export default function AlertsAndSafety({ theme }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchAlerts = async () => {
    setLoading(true)
    setHasError(false)
    try {
      const res = await fetch('/api/alerts')
      if (res.ok) {
        const data = await res.json()
        setAlerts(Array.isArray(data) ? data : [])
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
          badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          card: 'border-rose-500/30 hover:border-rose-500/50'
        }
      case 'WARNING':
      case 'MEDIUM':
        return {
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          card: 'border-amber-500/30 hover:border-amber-500/50'
        }
      default:
        return {
          badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          card: 'border-blue-500/30 hover:border-blue-500/50'
        }
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full max-w-full">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-rose-950/20 border-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>National Education Impact & Safety Radar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Live Climate, Strike & Disaster Alerts
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Real-time monitoring of road blockages, heavy rainfall advisories, transportation disruption, and campus closure notices across Nepal.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 border border-slate-700 hover:scale-105"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-xs opacity-60 animate-pulse">
          Querying national hazard registries...
        </div>
      )}

      {hasError && !loading && (
        <div className="py-8 text-center text-xs text-rose-400 border border-rose-500/20 rounded-2xl bg-rose-500/5">
          Temporarily unable to reach hazard registry. Please click "Refresh Feed" above.
        </div>
      )}

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map(alert => {
          const style = getSeverityStyle(alert.severity)
          return (
            <div
              key={alert.id || Math.random()}
              className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                theme === 'dark' ? `bg-[#0E1424] ${style.card}` : `bg-white border-slate-200 shadow-sm ${style.card}`
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                    {alert.severity || 'ALERT'} • {alert.hazard_type || alert.alert_type || 'ADVISORY'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{alert.region || alert.province || 'Nepal'}</span>
                  </div>
                </div>

                <div>
                  <h3 className={`text-base sm:text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                    {alert.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {alert.description}
                  </p>
                </div>

                {/* Affected Institutions */}
                {Array.isArray(alert.affected_institutions) && alert.affected_institutions.length > 0 && (
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Potentially Impacted Campuses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.affected_institutions.map((inst, idx) => {
                        const instName = typeof inst === 'object' && inst !== null ? (inst.name || inst.id) : String(inst)
                        const instImpact = typeof inst === 'object' && inst !== null ? inst.impact : null
                        return (
                          <div 
                            key={idx} 
                            className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold flex flex-col gap-0.5 ${
                              theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-blue-400" />
                              <span>{instName}</span>
                            </div>
                            {instImpact && (
                              <span className="text-[9px] text-slate-400 font-normal">{instImpact}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                {alert.recommended_action && (
                  <div className={`p-3 rounded-xl text-[11px] border ${
                    theme === 'dark' ? 'bg-amber-950/20 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <strong>Action: </strong>{alert.recommended_action}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Source: {alert.source_name || 'Verified Authority Notice'}</span>
                <span className="font-semibold text-emerald-400">Active Monitoring</span>
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
