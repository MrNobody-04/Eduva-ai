import React, { useState } from 'react'
import { Sparkles, ArrowRight, ShieldAlert, BookOpen, Award, CheckCircle2 } from 'lucide-react'

export default function SimulateEventModal({ isOpen, onClose, onEventTriggered }) {
  const [loadingEvent, setLoadingEvent] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  if (!isOpen) return null

  const handleTrigger = async (eventType, payload = {}) => {
    setLoadingEvent(eventType)
    setLastResult(null)
    try {
      const res = await fetch('/api/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, ...payload })
      })
      const data = await res.json()
      setLastResult({ eventType, data })
      onEventTriggered()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingEvent(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0B0F19] border border-gray-800 rounded-2xl shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Autonomous Event Simulator</h3>
              <p className="text-xs text-gray-400">Trigger real-world events to observe EDUVA's autonomous loop</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
        </div>

        {/* Event Options */}
        <div className="space-y-3">
          
          {/* Event 1: IOE Deadline Extension */}
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 hover:border-blue-500/40 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                1. IOE Pulchowk Application Deadline Extension
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                ADMISSION_CHANGE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Simulates official IOE portal updating B.E. Computer Engineering deadline from Oct 15 to <strong>Oct 25</strong>. Triggers semantic diff, impact graph traversal & student notifications.
            </p>
            <button
              onClick={() => handleTrigger('IOE_DEADLINE_EXTENDED', { new_value: '2026-10-25' })}
              disabled={loadingEvent !== null}
              className="mt-2 w-full py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingEvent === 'IOE_DEADLINE_EXTENDED' ? 'Triggering Loop...' : 'Simulate IOE Notice Update'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Event 2: New Scholarship Discovery */}
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 hover:border-purple-500/40 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                2. New Government STEM Fellowship Announcement
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                SCHOLARSHIP_FOUND
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Simulates Research Agent discovering a new STEM Leadership Fellowship on the MOEST portal.
            </p>
            <button
              onClick={() => handleTrigger('NEW_SCHOLARSHIP_FOUND')}
              disabled={loadingEvent !== null}
              className="mt-2 w-full py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingEvent === 'NEW_SCHOLARSHIP_FOUND' ? 'Triggering Discovery...' : 'Simulate New Scholarship Discovery'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Event 3: High Risk Action Security Gate */}
          <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 hover:border-amber-500/40 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                3. High-Risk Action Gated by Security Layer
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                SECURITY_GATE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Simulates Application Agent attempting to submit official documents. Holds action in Security Inbox awaiting human consent.
            </p>
            <button
              onClick={() => handleTrigger('HIGH_RISK_ACTION_SUBMIT')}
              disabled={loadingEvent !== null}
              className="mt-2 w-full py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingEvent === 'HIGH_RISK_ACTION_SUBMIT' ? 'Gating Action...' : 'Simulate High-Risk Gated Submission'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Feedback Alert */}
        {lastResult && (
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Autonomous Event <strong>{lastResult.eventType}</strong> executed successfully! Check AI Control Center and Daily Briefing.
            </span>
          </div>
        )}

      </div>
    </div>
  )
}
