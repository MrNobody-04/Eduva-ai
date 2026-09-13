import React from 'react'
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function ActionInbox({ pendingApprovals, onResolveApproval }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Deterministic Security Gate</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
          Permission & High-Risk Action Inbox
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          EDUVA operates under strict permission boundaries. High-risk actions (application submission, official emails, payments) are held here for explicit human authorization.
        </p>
      </div>

      {/* Pending Items */}
      {pendingApprovals.length === 0 ? (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Pending High-Risk Approvals</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            All autonomous background research, verification, and knowledge updates are executing smoothly within safe security policies.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map(item => (
            <div key={item.id} className="bg-[#111827] border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-lg shadow-amber-500/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full uppercase tracking-wider">
                      {item.risk_level} Risk Action
                    </span>
                    <span className="text-xs text-gray-400">ID: {item.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">{item.title}</h3>
                  <p className="text-xs text-gray-300 mt-1">{item.description}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono text-gray-300">
                <span className="text-gray-400 font-semibold">Action Payload: </span>
                {JSON.stringify(item.payload)}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => onResolveApproval(item.id, false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Reject Action
                </button>
                <button
                  onClick={() => onResolveApproval(item.id, true)}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  Authorize & Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
