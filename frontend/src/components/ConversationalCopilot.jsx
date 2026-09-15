import React, { useState, useRef, useEffect } from 'react'
import { 
  Cpu, X, Send, Mic, MicOff, Volume2, Sparkles, Building2, 
  ExternalLink, GraduationCap, CheckCircle2, ShieldCheck, ArrowRight, Bot, Zap, Trash2, RotateCcw
} from 'lucide-react'

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
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Persist messages across turns
  useEffect(() => {
    try {
      localStorage.setItem('eduva_chat_messages', JSON.stringify(messages))
    } catch (e) {}
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      if (initialQuery && initialQuery.trim()) {
        handleSend(initialQuery.trim())
      }
    }
  }, [isOpen, initialQuery])

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

  const handleSend = async (queryText = inputQuery) => {
    const q = queryText.trim()
    if (!q) return

    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: q }
    setMessages(prev => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

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

    try {
      let token = await getOrFetchSessionToken()
      let res = await fetch('/api/copilot/chat', {
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

      // If token expired, refresh guest session once
      if (res.status === 401) {
        localStorage.removeItem('eduva_session_token')
        token = await getOrFetchSessionToken()
        res = await fetch('/api/copilot/chat', {
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
      }

      if (res.ok) {
        const data = await res.json()
        const aiMsg = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.response,
          response_type: data.response_type,
          cards: data.cards || [],
          comparison_data: data.comparison_data,
          suggested_actions: data.suggested_actions || [],
          source_citation: data.source_citation
        }
        setMessages(prev => [...prev, aiMsg])
      } else {
        const errData = await res.json().catch(() => ({}))
        const errorDetail = errData?.error?.message || errData?.detail || 'Authentication required'
        setMessages(prev => [...prev, {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: `We could not complete your request (${errorDetail}). Please try again or log in.`
        }])
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-3xl h-[88vh] rounded-3xl border shadow-depth-lg flex flex-col overflow-hidden transition-all animate-slide-up ${
        theme === 'dark' ? 'bg-[#0B101E] border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header with High-Precision Status Bar */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800/80 bg-[#0E1424]/90' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Bot className="w-5 h-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B101E]"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm tracking-tight">Eduva AI Intelligence Counselor</h3>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Level 1 Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">4-Provider Multi-Agent Routing • Zero Fabrication Policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClearHistory}
                disabled={isClearing}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-all text-xs font-semibold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                title="Delete Recent Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isClearing ? 'Clearing...' : 'Clear'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                  : theme === 'dark'
                    ? 'bg-[#0E1424] border border-slate-800/80 rounded-bl-none text-slate-200'
                    : 'bg-slate-100 border border-slate-200 rounded-bl-none text-slate-800'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Multi-Format Renderers */}
                {/* 1. Comparison Table */}
                {m.comparison_data && (
                  <div className="overflow-x-auto mt-2 pt-2 border-t border-slate-800/60">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="border-b border-slate-700">
                          {m.comparison_data.headers.map((h, i) => (
                            <th key={i} className="py-1.5 px-2 font-bold text-blue-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60">
                    {m.cards.map((card, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#060911]/80 border border-slate-800/80 space-y-1 text-xs">
                        <span className="font-bold text-white block">{card.title} ({card.code})</span>
                        <span className="text-[10px] text-emerald-400 font-bold block">{card.duration}</span>
                        <span className="text-[10px] opacity-70 block">Entrance: {card.entrance_exam}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. College Cards */}
                {m.cards && m.response_type === 'COLLEGE_CARDS' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60">
                    {m.cards.map((col, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#060911]/80 border border-slate-800/80 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-100 dark:text-white block">{col.name}</span>
                        <span className="text-[10px] text-blue-400 block">{col.university} • {col.location}</span>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-emerald-400 font-bold">{col.fee_sample}</span>
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
                              className="px-2 py-0.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[9px] font-bold border border-blue-500/30 transition-all cursor-pointer"
                            >
                              + Tracker
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Source Verification Badge */}
                {m.source_citation && (
                  <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] opacity-60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified Source: {m.source_citation.sourceName}
                    </span>
                    <span>{m.source_citation.authorityLevel}</span>
                  </div>
                )}
              </div>

              {/* Clickable Suggested Actions */}
              {m.suggested_actions && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-xl">
                  {m.suggested_actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(act)}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs opacity-60 p-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></div>
              <span>EDUVA AI is analyzing official university records...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className={`p-4 border-t flex items-center gap-2 ${
          theme === 'dark' ? 'border-slate-800/80 bg-[#0E1424]/90' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse border-rose-500'
                : theme === 'dark' ? 'bg-[#060911] border-slate-700 text-slate-300 hover:border-blue-500' : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500'
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
            className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-[#060911] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
