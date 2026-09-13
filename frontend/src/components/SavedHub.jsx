import React, { useState, useEffect } from 'react'
import { Bookmark, Building2, BookOpen, GraduationCap, Calendar, Trash2, ArrowRight, ExternalLink } from 'lucide-react'

export default function SavedHub({ theme, onNavigateTab }) {
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/saved')
      if (res.ok) {
        const data = await res.json()
        setSavedItems(data)
      }
    } catch (err) {
      console.error('Failed to load saved items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  const handleRemove = async (itemType, itemId) => {
    try {
      const res = await fetch('/api/saved/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_type: itemType, item_id: itemId })
      })
      if (res.ok) {
        fetchSaved()
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err)
    }
  }

  const filtered = savedItems.filter(item => {
    if (filterType === 'ALL') return true
    return item.item_type?.toUpperCase() === filterType
  })

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-[#0E1424] to-indigo-950/30 border-slate-800'
          : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border-slate-200'
      }`}>
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-wide uppercase">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Academic Bookmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Saved Universities, Degrees & Exams
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Quick access to your bookmarked universities, colleges, degree tracks, and entrance exams.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6">
          {['ALL', 'UNIVERSITY', 'COURSE', 'ENTRANCE'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {type === 'ALL' ? 'All Bookmarks' : `${type.charAt(0) + type.slice(1).toLowerCase()}s`}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-xs opacity-60 animate-pulse">
          Loading saved bookmarks...
        </div>
      )}

      {/* Grid of Saved Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between group transition-all ${
              theme === 'dark'
                ? 'bg-[#0E1424] border-slate-800 hover:border-blue-500/40'
                : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  {item.item_type}
                </span>
                <button
                  onClick={() => handleRemove(item.item_type, item.item_id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-black text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                  {item.title || item.item_id}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold">
                Saved {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'recently'}
              </span>
              <button
                onClick={() => {
                  if (item.item_type === 'UNIVERSITY') onNavigateTab('universities')
                  else if (item.item_type === 'COURSE') onNavigateTab('courses')
                  else if (item.item_type === 'ENTRANCE') onNavigateTab('entrance')
                  else onNavigateTab('universities')
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Open details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            No bookmarked items found in this category. Click the bookmark icon across EDUVA to save colleges, exams, and courses.
          </div>
        )}
      </div>
    </div>
  )
}
