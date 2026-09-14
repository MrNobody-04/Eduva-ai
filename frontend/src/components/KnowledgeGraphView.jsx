import React, { useState, useEffect, useRef } from 'react'
import { Database, BookOpen, Award, FileText, Search, ExternalLink, ShieldCheck, CheckCircle2, RotateCw, ZoomIn, ZoomOut, Eye } from 'lucide-react'

export default function KnowledgeGraphView({ knowledgeGraph }) {
  const [activeSection, setActiveSection] = useState('3d_graph')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNode, setSelectedNode] = useState(null)
  const canvasRef = useRef(null)

  const { universities = [], programs = [], exams = [], scholarships = [], changes = [] } = knowledgeGraph || {}

  // Interactive 3D / 2.5D Canvas Simulation
  useEffect(() => {
    if (activeSection !== '3d_graph' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let rotation = 0

    // Set high-DPI canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Build interconnected node mesh
    const nodes = [
      ...universities.slice(0, 10).map((u, i) => ({
        id: u.id,
        label: u.acronym || u.name,
        type: 'UNIVERSITY',
        color: '#3B82F6',
        radius: 14,
        angle: (i / Math.min(10, universities.length)) * Math.PI * 2,
        dist: 160,
        z: Math.sin(i) * 60,
        data: u
      })),
      ...programs.slice(0, 12).map((p, i) => ({
        id: p.id,
        label: p.name.split(' ')[0] || 'Program',
        type: 'PROGRAM',
        color: '#10B981',
        radius: 10,
        angle: (i / 12) * Math.PI * 2 + 0.3,
        dist: 250,
        z: Math.cos(i) * 50,
        data: p
      })),
      ...exams.slice(0, 6).map((e, i) => ({
        id: e.id,
        label: e.name.split(' ')[0] || 'Entrance',
        type: 'EXAM',
        color: '#F59E0B',
        radius: 12,
        angle: (i / 6) * Math.PI * 2 + 0.6,
        dist: 110,
        z: Math.sin(i * 2) * 40,
        data: e
      }))
    ]

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const centerX = width / 2
      const centerY = height / 2

      ctx.clearRect(0, 0, width, height)
      rotation += 0.005

      // Render Central Core Node
      ctx.beginPath()
      ctx.arc(centerX, centerY, 22, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)'
      ctx.fill()
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 9px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('EDUVA AI', centerX, centerY + 3)

      // Calculate 3D projected coordinates
      const projectedNodes = nodes.map(n => {
        const curAngle = n.angle + rotation
        const x3d = Math.cos(curAngle) * n.dist
        const y3d = Math.sin(curAngle) * n.dist * 0.45 // Perspective tilt
        const z3d = n.z + Math.sin(curAngle) * 50

        // Perspective scale factor
        const scale = 350 / (350 + z3d)
        const projX = centerX + x3d * scale
        const projY = centerY + y3d * scale
        const projR = Math.max(4, n.radius * scale)

        return { ...n, projX, projY, projR, scale }
      })

      // Sort by depth (painter's algorithm)
      projectedNodes.sort((a, b) => a.scale - b.scale)

      // Draw Connection Edges
      ctx.lineWidth = 1
      projectedNodes.forEach(n => {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(n.projX, n.projY)
        ctx.strokeStyle = n.color === '#3B82F6' 
          ? 'rgba(59, 130, 246, 0.18)' 
          : (n.color === '#10B981' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.18)')
        ctx.stroke()
      })

      // Draw Projected Nodes
      projectedNodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.projX, n.projY, n.projR, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.shadowColor = n.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 9px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, n.projX, n.projY - n.projR - 4)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [activeSection, universities, programs, exams])

  if (!knowledgeGraph) {
    return <div className="text-gray-400 p-8 text-center">Loading Living Knowledge Graph...</div>
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-3xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Living EDUVA Knowledge Graph</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
            Verified Educational Universe
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Interactive multi-dimensional ontology continuously verified across Nepal accredited universities.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-1 bg-[var(--surface-2)] p-1 rounded-2xl border border-[var(--border-subtle)]">
          {[
            { id: '3d_graph', label: '3D Node Network', count: 'Live' },
            { id: 'universities', label: 'Universities', count: universities.length },
            { id: 'programs', label: 'Programs', count: programs.length },
            { id: 'exams', label: 'Entrance Exams', count: exams.length },
            { id: 'scholarships', label: 'Scholarships', count: scholarships.length }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSection === sec.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{sec.label}</span>
              <span className="text-[10px] bg-[var(--surface-1)] px-1.5 py-0.2 rounded-full font-mono">{sec.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Interactive Graph Canvas */}
      {activeSection === '3d_graph' && (
        <div className="relative w-full h-[480px] rounded-3xl border border-[var(--border-subtle)] bg-[#050810] overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Universities (Blue)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2"></span>
              <span>Degrees (Green)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-2"></span>
              <span>Exams (Amber)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Perpetual hardware-accelerated 3D knowledge topology • 24/7 Verified Loop
            </p>
          </div>
        </div>
      )}

      {/* Content Rendering based on Section */}
      {activeSection === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map(univ => (
            <div key={univ.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{univ.name}</h3>
                  <div className="text-xs text-gray-400 mt-0.5">{univ.city}, {univ.country}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.round(univ.reliability_score * 100)}% Trust
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium">
                Offering {univ.programs?.length || 0} active academic programs tracked in graph.
              </p>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Official Portal:</span>
                <a href={univ.official_website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                  {univ.official_website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => (
            <div key={prog.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{prog.degree}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{prog.name}</h3>
                  <div className="text-xs text-gray-400">{prog.faculty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-400">
                    {prog.tuition === 0 ? "Tuition Free" : `${prog.currency} ${prog.tuition.toLocaleString()}`}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{prog.duration_years} Years</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 text-xs space-y-1">
                <div className="text-gray-300"><strong className="text-gray-400">Eligibility:</strong> {prog.eligibility}</div>
                <div className="text-gray-300"><strong className="text-gray-400">Deadline:</strong> <span className="text-amber-300 font-bold">{prog.application_deadline}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map(ex => (
            <div key={ex.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-amber-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{ex.name}</h3>
                  <div className="text-xs text-gray-400">{ex.conducting_body}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Fee: {ex.currency} {ex.fee}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-900/60 p-3 rounded-lg border border-gray-800">
                <div>
                  <div className="text-[10px] text-gray-400">Registration Close:</div>
                  <div className="font-bold text-rose-300">{ex.registration_close}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">Exam Date:</div>
                  <div className="font-bold text-blue-300">{ex.exam_date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map(sch => (
            <div key={sch.id} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-3 hover:border-purple-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{sch.name}</h3>
                  <div className="text-xs text-purple-400 font-medium">{sch.provider}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                  {sch.coverage_type}
                </span>
              </div>

              <div className="text-xs text-emerald-400 font-bold">{sch.amount_description}</div>
              <div className="text-xs text-gray-300"><strong className="text-gray-400">Criteria:</strong> {sch.criteria}</div>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">Deadline: <strong className="text-white">{sch.deadline}</strong></span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
