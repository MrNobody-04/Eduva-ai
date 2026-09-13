import React, { useState } from 'react'
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Flame, CheckCircle2, Share2, Sparkles, AlertCircle, Clock, Image as ImageIcon 
} from 'lucide-react'

export default function NewsPortal({ newsFeed = [], onLikeNews, theme = 'dark' }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [likedPosts, setLikedPosts] = useState({})
  const [savedPosts, setSavedPosts] = useState({})
  const [copiedId, setCopiedId] = useState(null)

  const cardBg = theme === 'dark' ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200 shadow-sm'
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900'
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-slate-500'

  const categories = [
    { id: 'ALL', label: 'All RONB Posts' },
    { id: 'ENTRANCE_EXAM', label: 'IOE & Exam Notices' },
    { id: 'WEATHER_ALERT', label: 'Weather & Banda Alerts' },
    { id: 'SCHOLARSHIP', label: 'Scholarships & Grants' }
  ]

  const filteredNews = newsFeed.filter(item => {
    if (selectedCategory === 'ALL') return true
    return item.category === selectedCategory
  })

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }))
    if (onLikeNews) onLikeNews(id)
  }

  const toggleSave = (id) => {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleShare = (item) => {
    navigator.clipboard?.writeText(`${item.title}\n\n${item.content}\n\nSource: @routineofnepalbanda via EDUVA AI`)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/80 via-pink-950/70 to-indigo-950/70 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-rose-400 uppercase tracking-widest mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Live Social Radar</span>
              <span>•</span>
              <span>Instagram Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Routine of Nepal Banda (RONB) Updates 📸
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Official live student radar streaming latest posts, entrance exam breaking alerts, weather notices, and university updates directly from <span className="text-rose-300 font-bold">@routineofnepalbanda</span>.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-gray-900/90 border border-gray-800 rounded-2xl p-3.5 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center text-rose-400 font-black text-xs">
                RO
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                @routineofnepalbanda <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">1.8M Followers • Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/25 scale-105'
                : theme === 'dark' ? 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Instagram Feed Stream */}
      <div className="space-y-6">
        {filteredNews.map(item => {
          const isLiked = likedPosts[item.id]
          const isSaved = savedPosts[item.id]
          const baseLikes = item.likes_count || 1420
          const displayLikes = isLiked ? baseLikes + 1 : baseLikes

          return (
            <article
              key={item.id}
              className={`rounded-3xl border overflow-hidden shadow-xl transition-all card-hover-effect ${cardBg}`}
            >
              {/* Instagram Post Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-800/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-md">
                    <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center text-white font-extrabold text-xs">
                      {item.source_name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-xs sm:text-sm font-bold ${textPrimary}`}>
                        {item.source_name}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{item.source_handle} • Nepal</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Just now
                  </span>
                  <button className="text-gray-400 hover:text-gray-200 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instagram Post Image / Graphic */}
              {item.image_url ? (
                <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden bg-gray-950">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.is_breaking && (
                    <div className="absolute top-4 left-4 bg-rose-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3 fill-white" />
                      Breaking News
                    </div>
                  )}
                </div>
              ) : null}

              {/* Post Action Buttons (Like, Comment, Share, Save) */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="transition-transform active:scale-125 cursor-pointer"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked
                            ? 'text-rose-500 fill-rose-500 animate-bounce'
                            : theme === 'dark' ? 'text-gray-300 hover:text-rose-400' : 'text-slate-700 hover:text-rose-500'
                        }`}
                      />
                    </button>
                    <button className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSave(item.id)}
                    className="transition-transform active:scale-110 cursor-pointer"
                  >
                    <Bookmark
                      className={`w-6 h-6 ${
                        isSaved
                          ? 'text-amber-400 fill-amber-400'
                          : theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-slate-700 hover:text-amber-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Like Count */}
                <div className={`text-xs font-black ${textPrimary}`}>
                  {displayLikes.toLocaleString()} likes
                </div>

                {/* Caption & Content */}
                <div className="space-y-1 text-xs sm:text-sm">
                  <span className={`font-black mr-2 ${textPrimary}`}>
                    {item.source_handle.replace('@', '')}
                  </span>
                  <span className={`font-bold mr-1 ${textPrimary}`}>
                    {item.title}
                  </span>
                  <p className={`text-xs leading-relaxed pt-1 whitespace-pre-line ${textSecondary}`}>
                    {item.content}
                  </p>
                </div>

                {/* Tag */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="text-blue-400 font-semibold cursor-pointer">
                    #NepalEducation #IOE #RONB #StudentRadar #Nepal
                  </span>
                  {copiedId === item.id && (
                    <span className="text-emerald-400 font-bold">Link Copied!</span>
                  )}
                </div>
              </div>

            </article>
          )
        })}
      </div>

    </div>
  )
}
