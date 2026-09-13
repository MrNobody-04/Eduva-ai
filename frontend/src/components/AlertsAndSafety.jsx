import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, ShieldAlert, MapPin, Building2, Flame, 
  CheckCircle2, Clock, Calendar, ExternalLink, RefreshCw 
} from 'lucide-react'

export default function AlertsAndSafety({ theme }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/alerts')
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (err) {
      console.error('Failed to load alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          card: 'border-rose-500/30'
        }
      case 'WARNING':
        return {
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          card: 'border-amber-500/30'
        }
      default:
        return {
          badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          card: 'border-blue-500/30'
        }
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
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
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 border border-slate-700"
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

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alerts.map(alert => {
          const style = getSeverityStyle(alert.severity)
          return (
            <div
              key={alert.id}
              className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                theme === 'dark' ? `bg-[#0E1424] ${style.card}` : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                    {alert.severity} • {alert.alert_type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{alert.region || 'Nepal'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-100">{alert.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {alert.description}
                  </p>
                </div>

                {/* Affected Institutions */}
                {alert.affected_institutions?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Potentially Impacted Campuses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.affected_institutions.map((inst, idx) => (
                        <span key={idx} className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 font-semibold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          <span>{inst}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Authority Notice</span>
                <span className="font-semibold text-emerald-400">Active Monitoring</span>
              </div>
            </div>
          )
        })}

        {alerts.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No active hazards or emergency advisories currently reported.
          </div>
        )}
      </div>
    </div>
  )
}
