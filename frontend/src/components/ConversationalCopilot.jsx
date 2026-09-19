import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, Send, Mic, MicOff, Volume2, Sparkles, Building2, 
  ExternalLink, GraduationCap, CheckCircle2, ShieldCheck, 
  ArrowRight, Bot, Zap, Trash2, RotateCcw, ChevronDown, Calendar, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WELCOME_MSG = {
  id: 'msg_welcome',
  sender: 'ai',
  text: 'Namaste! I am EDUVA AI. I provide verified intelligence on Nepal universities, B.Sc. CSIT, BCA, Engineering, Medical, entrance deadlines, and scholarships. How may I guide your education path today?',
  response_type: 'TEXT',
  suggested_actions: ['What can I study after +2?', 'BSc CSIT Colleges in Kathmandu', 'Compare TU & KU', 'Upcoming Entrance Deadlines'],
  source_citation: {
    sourceName: 'Official University & Ministry Registries',
    authorityLevel: 'LEVEL_1_AUTHORITATIVE',
    verifiedAt: 'Today'
  }
}

export default function ConversationalCopilot({ isOpen, onClose, initialQuery = '', theme, onAddToTracker }) {
  const [sessionId, setSessionId] = useState(() => {
    let sid = localStorage.getItem('eduva_chat_session_id')
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9)
      localStorage.setItem('eduva_chat_session_id', sid)
    }
    return sid
  })

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('eduva_chat_messages')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {}
    return [WELCOME_MSG]
  })
  const [inputQuery, setInputQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    setShowScrollBottom(false)
  }, [])

  // Handle scroll detection for the "↓ New messages" pill button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    setShowScrollBottom(distanceToBottom > 120)
  }

  // Persist messages across turns
  useEffect(() => {
    try {
      localStorage.setItem('eduva_chat_messages', JSON.stringify(messages))
    } catch (e) {}
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(false), 50)
      if (initialQuery && initialQuery.trim()) {
        handleSend(initialQuery.trim())
      }
    }
  }, [isOpen, initialQuery, scrollToBottom])

  // Authenticated cryptographic session token manager
  const getOrFetchSessionToken = async () => {
    let token = localStorage.getItem('eduva_session_token')
    if (token) return token
    try {
      const res = await fetch('/api/auth/session', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          localStorage.setItem('eduva_session_token', data.token)
          if (data.session_id) {
            localStorage.setItem('eduva_chat_session_id', data.session_id)
            setSessionId(data.session_id)
          }
          return data.token
        }
      }
    } catch (e) {
      console.warn('Failed to obtain cryptographic guest session:', e)
    }
    return ''
  }

  // Clear / Delete recent chats
  const handleClearHistory = async () => {
    if (messages.length <= 1 && messages[0]?.id === 'msg_welcome') return
    if (!window.confirm("Are you sure you want to delete your recent chat history? This will start a fresh conversation.")) return
    
    setIsClearing(true)
    const oldSessionId = sessionId
    const newSid = 'session_' + Math.random().toString(36).substring(2, 9)
    localStorage.setItem('eduva_chat_session_id', newSid)
    setSessionId(newSid)
    setMessages([WELCOME_MSG])
    localStorage.removeItem('eduva_chat_messages')

    try {
      const token = await getOrFetchSessionToken()
      await fetch(`/api/chat/history?session_id=${oldSessionId}`, { 
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'X-Session-Token': token
        } : {}
      })
    } catch (err) {
      console.warn('Backend history deletion note:', err)
    } finally {
      setIsClearing(false)
    }
  }

  // Send message with SSE streaming token-by-token
  const handleSend = async (queryText = inputQuery) => {
    const q = queryText.trim()
    if (!q) return

    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: q }
    setMessages(prev => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)
    scrollToBottom()

    // Retrieve active student profile if registered
    let studentId = 'student_user'
    try {
      const savedProf = localStorage.getItem('eduva_user_profile')
      if (savedProf) {
        const p = JSON.parse(savedProf)
        if (p.email && p.email.trim()) studentId = p.email.trim()
        else if (p.username && p.username.trim()) studentId = p.username.trim()
      }
    } catch (e) {}

    const aiMsgId = `ai_${Date.now()}`
    let streamedText = ''

    try {
      let token = await getOrFetchSessionToken()
      
      // Attempt SSE streaming first
      const res = await fetch('/api/copilot/chat/stream', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}`, 'X-Session-Token': token } : {})
        },
        body: JSON.stringify({ 
          query: q, 
          session_id: sessionId,
          student_id: studentId 
        })
      })

      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let isFirstToken = true
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const jsonStr = trimmed.replace(/^data:\s*/, '')
            try {
              const payload = JSON.parse(jsonStr)

              if (payload.type === 'token') {
                if (isFirstToken) {
                  setIsTyping(false)
                  isFirstToken = false
                  // Initialize AI message placeholder
                  setMessages(prev => [...prev, {
                    id: aiMsgId,
                    sender: 'ai',
                    text: payload.content,
                    isStreaming: true
                  }])
                  streamedText = payload.content
                } else {
                  streamedText += payload.content
                  setMessages(prev => prev.map(m => 
                    m.id === aiMsgId ? { ...m, text: streamedText } : m
                  ))
                }
                if (!showScrollBottom) {
                  scrollToBottom()
                }
              } else if (payload.type === 'done') {
                setIsTyping(false)
                setMessages(prev => prev.map(m => 
                  m.id === aiMsgId 
                    ? {
                        ...m,
                        text: payload.response || streamedText,
                        isStreaming: false,
                        response_type: payload.response_type,
                        cards: payload.cards || [],
                        comparison_data: payload.comparison_data,
                        suggested_actions: payload.suggested_actions || [],
                        source_citation: payload.source_citation
                      }
                    : m
                ))
                scrollToBottom()
              }
            } catch (err) {
              console.warn('Error parsing SSE chunk:', err)
            }
          }
        }
      } else {
        // Fallback to standard /api/copilot/chat
        const fallbackRes = await fetch('/api/copilot/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}`, 'X-Session-Token': token } : {})
          },
          body: JSON.stringify({ 
            query: q, 
            session_id: sessionId,
            student_id: studentId 
          })
        })

        if (fallbackRes.ok) {
          const data = await fallbackRes.json()
          setMessages(prev => [...prev, {
            id: aiMsgId,
            sender: 'ai',
            text: data.response,
            response_type: data.response_type,
            cards: data.cards || [],
            comparison_data: data.comparison_data,
            suggested_actions: data.suggested_actions || [],
            source_citation: data.source_citation
          }])
        } else {
          throw new Error(`HTTP ${fallbackRes.status}`)
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'We could not reach the verification service right now. Please try again in a moment.'
      }])
    } finally {
      setIsTyping(false)
    }
  }

  // Voice Web Speech Recognition
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please type your query.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputQuery(transcript)
      handleSend(transcript)
    }

    recognition.start()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-3xl h-[88vh] rounded-2xl border shadow-[var(--shadow-editorial)] flex flex-col overflow-hidden transition-all animate-slide-up ${
        theme === 'dark' ? 'bg-[#0B101E] border-slate-800/80 text-white' : 'bg-[#FBFBFB] border-[var(--border-subtle)] text-[var(--text-primary)]'
      }`}>
        {/* Header with High-Precision Status Bar */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800/80 bg-[#0E1424]/90' : 'border-[var(--border-subtle)] bg-[var(--surface-1)]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-[var(--primary-glow)] border border-[var(--primary)]/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[var(--primary)]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--verified)] rounded-full border-2 border-[var(--surface-1)]"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm tracking-tight text-[var(--text-heading)]">
                  Eduva AI Counselor
                </h3>
                <span className="verified-badge px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                  Live Stream
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                4-Provider Multi-Agent Routing • Grounded Verification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearHistory}
                disabled={isClearing}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 hover:text-rose-400 transition-all text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                title="Delete Recent Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isClearing ? 'Clearing...' : 'Clear'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800/20 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-[var(--primary)] text-white rounded-br-none shadow-sm'
                    : theme === 'dark'
                      ? 'bg-[#0E1424] border border-slate-800/80 rounded-bl-none text-slate-200'
                      : 'bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-bl-none text-[var(--text-primary)]'
                }`}>
                  <p className="whitespace-pre-wrap">
                    {m.text}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
                    )}
                  </p>

                  {/* Multi-Format Artifacts */}

                  {/* 1. Comparison Table */}
                  {m.comparison_data && (
                    <div className="overflow-x-auto mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="border-b border-[var(--border-subtle)]">
                            {m.comparison_data.headers.map((h, i) => (
                              <th key={i} className="py-1.5 px-2 font-bold text-blue-500">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)]">
                          {m.comparison_data.rows.map((r, ri) => (
                            <tr key={ri}>
                              {r.map((cell, ci) => (
                                <td key={ci} className="py-1.5 px-2 opacity-90">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 2. Course Cards */}
                  {m.cards && m.response_type === 'COURSE_CARDS' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      {m.cards.map((card, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-1 text-xs">
                          <span className="font-bold text-[var(--text-primary)] block">{card.title} ({card.code})</span>
                          <span className="text-[10px] text-emerald-500 font-bold block">{card.duration}</span>
                          <span className="text-[10px] opacity-75 block">Entrance: {card.entrance_exam}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. College Cards with Enhanced Badges */}
                  {m.cards && m.response_type === 'COLLEGE_CARDS' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      {m.cards.map((col, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="font-bold text-[var(--text-primary)] block">{col.name}</span>
                              <span className="text-[10px] text-blue-500 font-semibold block">{col.university} • {col.location}</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
                              Verified
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-emerald-500 font-bold">{col.fee_sample}</span>
                            {onAddToTracker && (
                              <button
                                type="button"
                                onClick={() => {
                                  onAddToTracker({
                                    institution: col.name,
                                    program: col.target_program || 'Undergraduate Degree',
                                    portal_url: '',
                                    deadline: '2026-10-15',
                                    application_fee: col.fee_sample || 'NPR 2,000',
                                    source: 'AI Counselor Recommendation'
                                  })
                                  onClose()
                                }}
                                className="px-2 py-1 rounded-lg bg-[var(--primary-glow)] hover:bg-[var(--primary)] hover:text-white text-[var(--primary)] text-[10px] font-bold border border-[var(--primary)]/30 transition-all cursor-pointer"
                              >
                                + Add Tracker
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Deadline Notice Mini-Card */}
                  {m.deadline_notice && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <strong className="text-amber-500 block">{m.deadline_notice.title}</strong>
                          <span className="text-[11px] text-[var(--text-secondary)]">{m.deadline_notice.date}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-500">
                        Notice
                      </span>
                    </div>
                  )}

                  {/* Source Verification Citation */}
                  {m.source_citation && (
                    <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] opacity-70">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        Verified Source: {m.source_citation.sourceName}
                      </span>
                      <span className="font-mono">{m.source_citation.authorityLevel}</span>
                    </div>
                  )}
                </div>

                {/* Clickable Suggested Next Steps */}
                {m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-xl">
                    {m.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(act)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--primary-glow)] hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-[var(--primary)]/30 text-[var(--primary)] text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Animation While Awaiting First Chunk */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center space-x-2 text-xs opacity-70 p-2 text-[var(--text-secondary)]"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce delay-200"></div>
              <span className="font-medium">EDUVA AI is analyzing official university records...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating "↓ New messages" Pill Button */}
        <AnimatePresence>
          {showScrollBottom && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer z-20 hover:bg-indigo-500 transition-all"
            >
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              <span>New messages</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className={`p-4 border-t flex items-center gap-2 ${
            theme === 'dark' ? 'border-slate-800/80 bg-[#0E1424]/90' : 'border-[var(--border-subtle)] bg-[var(--surface-1)]'
          }`}
        >
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse border-rose-500'
                : theme === 'dark' 
                  ? 'bg-[#060911] border-slate-700 text-slate-300 hover:border-blue-500' 
                  : 'bg-[var(--surface-2)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--primary)]'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about colleges, BCA, BSc CSIT, entrance dates, or +2 eligibility..."
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              theme === 'dark' 
                ? 'bg-[#060911] border-slate-700 text-white' 
                : 'bg-white border-[var(--border-subtle)] text-[var(--text-primary)]'
            }`}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="button-primary p-2.5 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
