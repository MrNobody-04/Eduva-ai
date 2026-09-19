import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { 
  Database, BookOpen, Award, Search, ExternalLink, 
  ShieldCheck, CheckCircle2, RotateCw, ZoomIn, ZoomOut, 
  Eye, Info, Sparkles, Layers, Activity
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KnowledgeGraphView({ knowledgeGraph: initialKG, theme = 'dark' }) {
  const [activeSection, setActiveSection] = useState('3d_graph')
  const [kgData, setKgData] = useState(initialKG || null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isLoading, setIsLoading] = useState(!initialKG)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneStateRef = useRef(null)

  // Fetch live KG if not supplied via props
  useEffect(() => {
    if (initialKG) {
      setKgData(initialKG)
      setIsLoading(false)
      return
    }
    fetch('/api/knowledge-graph')
      .then(res => res.json())
      .then(data => {
        setKgData(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load knowledge graph:', err)
        setIsLoading(false)
      })
  }, [initialKG])

  const { 
    universities = [], 
    programs = [], 
    exams = [], 
    scholarships = [], 
    changes = [] 
  } = kgData || {}

  // Three.js 3D WebGL Graph Scene
  useEffect(() => {
    if (activeSection !== '3d_graph' || !canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    const isDark = theme === 'dark'
    scene.background = new THREE.Color(isDark ? 0x070b14 : 0xf4f3ef)

    const width = container.clientWidth || 800
    const height = container.clientHeight || 500
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000)
    
    // Spherical coordinates for camera orbit
    let radius = 480
    let theta = 0.8
    let phi = 1.1
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0

    const updateCameraPos = () => {
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta)
      camera.position.y = radius * Math.cos(phi)
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta)
      camera.lookAt(0, 0, 0)
    }
    updateCameraPos()

    // 2. WebGL Renderer
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } catch (e) {
      console.warn('WebGL init fallback:', e)
      return
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.4)
    scene.add(ambientLight)

    const centerLight = new THREE.PointLight(0x4f46e5, 3.5, 900)
    centerLight.position.set(0, 0, 0)
    scene.add(centerLight)

    const accentLight = new THREE.DirectionalLight(0xffffff, 1.2)
    accentLight.position.set(200, 300, 200)
    scene.add(accentLight)

    // 4. Central Core Nucleus (EDUVA AI Knowledge Core)
    const coreGroup = new THREE.Group()
    const coreGeo = new THREE.SphereGeometry(18, 32, 32)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x4338ca,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreMesh.userData = { id: 'core', label: 'EDUVA AI Core Hub', type: 'CORE', meta: 'Central Knowledge Engine' }
    coreGroup.add(coreMesh)

    // Halo pulse ring around core
    const ringGeo = new THREE.RingGeometry(24, 27, 48)
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x818cf8, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.5 
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 2
    coreGroup.add(ringMesh)
    scene.add(coreGroup)

    // 5. Interactive Nodes Group
    const interactiveMeshes = [coreMesh]
    const networkNodesGroup = new THREE.Group()
    scene.add(networkNodesGroup)

    const linePositions = []

    // University Nodes (Inner Orbit: blue)
    const univList = universities.slice(0, 14)
    univList.forEach((u, i) => {
      const angle = (i / univList.length) * Math.PI * 2
      const dist = 160 + (i % 2) * 25
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      const y = ((i % 3) - 1) * 35

      const geo = new THREE.SphereGeometry(9, 24, 24)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.4,
        roughness: 0.3
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.userData = {
        id: u.id,
        label: u.name,
        acronym: u.acronym || u.name.substring(0, 4).toUpperCase(),
        type: 'UNIVERSITY',
        color: '#3B82F6',
        trust: u.reliability_score ? Math.round(u.reliability_score * 100) : 98,
        location: u.city || 'Nepal',
        website: u.official_website,
        entity: u
      }
      networkNodesGroup.add(mesh)
      interactiveMeshes.push(mesh)

      // Connection from Core to University
      linePositions.push(0, 0, 0, x, y, z)
    })

    // Program Nodes (Outer Orbit: emerald)
    const progList = programs.slice(0, 18)
    progList.forEach((p, i) => {
      const angle = (i / progList.length) * Math.PI * 2 + 0.3
      const dist = 260 + (i % 3) * 30
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      const y = ((i % 4) - 1.5) * 50

      const geo = new THREE.SphereGeometry(6.5, 20, 20)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x047857,
        emissiveIntensity: 0.45,
        roughness: 0.3
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.userData = {
        id: p.id,
        label: p.name,
        degree: p.degree || 'Degree',
        faculty: p.faculty || 'Engineering / Sciences',
        type: 'PROGRAM',
        color: '#10B981',
        tuition: p.tuition,
        currency: p.currency || 'NPR',
        deadline: p.application_deadline,
        entity: p
      }
      networkNodesGroup.add(mesh)
      interactiveMeshes.push(mesh)

      // Connect to a university node
      const parentUniv = networkNodesGroup.children[i % Math.max(1, univList.length)]
      if (parentUniv) {
        linePositions.push(
          parentUniv.position.x, parentUniv.position.y, parentUniv.position.z,
          x, y, z
        )
      }
    })

    // Entrance Exam Nodes (Mid Orbit: amber)
    const examList = exams.slice(0, 8)
    examList.forEach((e, i) => {
      const angle = (i / examList.length) * Math.PI * 2 + 0.8
      const dist = 190 + (i % 2) * 20
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      const y = ((i % 2) ? 60 : -60)

      const geo = new THREE.SphereGeometry(7, 20, 20)
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.5,
        roughness: 0.3
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.userData = {
        id: e.id,
        label: e.name,
        type: 'EXAM',
        conducting_body: e.conducting_body,
        color: '#F59E0B',
        fee: e.fee,
        exam_date: e.exam_date,
        entity: e
      }
      networkNodesGroup.add(mesh)
      interactiveMeshes.push(mesh)

      // Connect to Core
      linePositions.push(0, 0, 0, x, y, z)
    })

    // 6. Network Edges (Lines)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x334155 : 0xc7c4bc,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45
    })
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineMesh)

    // 7. Raycasting & Hover Interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(interactiveMeshes)

      if (intersects.length > 0) {
        const topIntersect = intersects[0].object
        canvas.style.cursor = 'pointer'
        if (topIntersect.userData && topIntersect.userData.id) {
          setHoveredNode({
            ...topIntersect.userData,
            screenX: e.clientX - rect.left,
            screenY: e.clientY - rect.top
          })
        }
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab'
        setHoveredNode(null)
      }
    }

    const onPointerDown = (e) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
      canvas.style.cursor = 'grabbing'
    }

    const onPointerUp = (e) => {
      isDragging = false
      canvas.style.cursor = 'grab'

      // Check click for node selection
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(interactiveMeshes)
      if (intersects.length > 0) {
        setSelectedNode(intersects[0].object.userData)
      }
    }

    const onWindowPointerMove = (e) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      prevMouseX = e.clientX
      prevMouseY = e.clientY

      theta -= deltaX * 0.005
      phi = Math.max(0.15, Math.min(Math.PI - 0.15, phi - deltaY * 0.005))
      updateCameraPos()
    }

    const onWheel = (e) => {
      e.preventDefault()
      radius = Math.max(200, Math.min(850, radius + e.deltaY * 0.45))
      updateCameraPos()
    }

    canvas.addEventListener('mousemove', onPointerMove)
    canvas.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('mousemove', onWindowPointerMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 800
      const h = containerRef.current.clientHeight || 500
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // 8. Animation Loop
    let animId
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      // Continuous subtle core pulse
      const t = clock.getElapsedTime()
      const pulse = 1 + Math.sin(t * 2) * 0.05
      coreMesh.scale.set(pulse, pulse, pulse)
      ringMesh.rotation.z += 0.006

      // Auto rotation
      if (autoRotate && !isDragging) {
        theta += 0.003
        updateCameraPos()
      }

      renderer.render(scene, camera)
    }
    animate()

    sceneStateRef.current = {
      resetCamera: () => {
        radius = 480
        theta = 0.8
        phi = 1.1
        updateCameraPos()
      },
      zoomIn: () => {
        radius = Math.max(200, radius - 60)
        updateCameraPos()
      },
      zoomOut: () => {
        radius = Math.min(850, radius + 60)
        updateCameraPos()
      }
    }

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onPointerMove)
      canvas.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('mousemove', onWindowPointerMove)
      canvas.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)

      // Clean disposal
      coreGeo.dispose()
      coreMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [activeSection, universities, programs, exams, theme, autoRotate])

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="text-xs text-[var(--text-secondary)] font-mono">
          Mounting Living 3D Knowledge Network...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="editorial-surface rounded-2xl p-6 relative overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-glow)] border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Living EDUVA Knowledge Graph • Nepal Universe</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
              Verified Educational Universe & Ontology
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
              Continuous 3D relational topology indexing all 26+ universities, affiliated colleges, degrees, and official entrance examinations in real time.
            </p>
          </div>

          {/* Navigation Section Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] self-start lg:self-center">
            {[
              { id: '3d_graph', label: '3D Network', count: 'Live' },
              { id: 'universities', label: 'Universities', count: universities.length },
              { id: 'programs', label: 'Degrees', count: programs.length },
              { id: 'exams', label: 'Entrance', count: exams.length },
              { id: 'scholarships', label: 'Scholarships', count: scholarships.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSection === tab.id
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Network WebGL Viewport */}
      {activeSection === '3d_graph' && (
        <div 
          ref={containerRef}
          className="relative w-full h-[540px] rounded-2xl border border-[var(--border-subtle)] bg-[#070b14] overflow-hidden shadow-2xl"
        >
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

          {/* Floating HUD Legend */}
          <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white space-y-2 pointer-events-none max-w-xs sm:max-w-md shadow-lg">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Knowledge Topology</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                <span className="text-slate-200">Universities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                <span className="text-slate-200">Degrees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                <span className="text-slate-200">Entrance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></span>
                <span className="text-slate-200">Core Engine</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Drag to orbit • Scroll to zoom • Hover/Click nodes to inspect attributes
            </p>
          </div>

          {/* Viewport Control Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto-Orbit"
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                autoRotate ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline text-[11px]">{autoRotate ? 'Orbit On' : 'Paused'}</span>
            </button>
            <button
              onClick={() => sceneStateRef.current?.zoomIn()}
              title="Zoom In"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => sceneStateRef.current?.zoomOut()}
              title="Zoom Out"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => sceneStateRef.current?.resetCamera()}
              title="Reset View"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Hover Tooltip */}
          {hoveredNode && !selectedNode && (
            <div 
              className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/20 text-white shadow-2xl text-xs space-y-1 transition-all"
              style={{
                left: Math.min(hoveredNode.screenX + 16, (containerRef.current?.clientWidth || 800) - 220),
                top: Math.max(16, hoveredNode.screenY - 30)
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredNode.color || '#3B82F6' }}></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {hoveredNode.type}
                </span>
              </div>
              <div className="font-bold text-sm text-white">
                {hoveredNode.label}
              </div>
              {hoveredNode.trust && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {hoveredNode.trust}% Verified Trust
                </div>
              )}
              {hoveredNode.faculty && (
                <div className="text-[11px] text-slate-300">{hoveredNode.faculty}</div>
              )}
              {hoveredNode.conducting_body && (
                <div className="text-[11px] text-amber-300">{hoveredNode.conducting_body}</div>
              )}
            </div>
          )}

          {/* Selected Node Detailed Inspector Card */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 text-white shadow-2xl space-y-3 z-30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                      <Layers className="w-3 h-3" />
                      <span>{selectedNode.type} Node Inspection</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {selectedNode.type === 'UNIVERSITY' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-200">{selectedNode.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Verification Trust:</span>
                      <span className="font-bold text-emerald-400">{selectedNode.trust}% Authoritative</span>
                    </div>
                    {selectedNode.website && (
                      <div className="pt-1">
                        <a
                          href={selectedNode.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-semibold"
                        >
                          Visit Official Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === 'PROGRAM' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Faculty:</span>
                      <span className="font-semibold text-slate-200">{selectedNode.faculty}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Tuition:</span>
                      <span className="font-bold text-emerald-400">
                        {selectedNode.tuition ? `${selectedNode.currency} ${selectedNode.tuition.toLocaleString()}` : 'Standard Fee Structure'}
                      </span>
                    </div>
                    {selectedNode.deadline && (
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-slate-400">Deadline:</span>
                        <span className="font-bold text-amber-300">{selectedNode.deadline}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedNode.type === 'EXAM' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <span className="text-slate-400">Conducting Body:</span>
                      <span className="font-semibold text-slate-200">{selectedNode.conducting_body}</span>
                    </div>
                    {selectedNode.exam_date && (
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-slate-400">Exam Date:</span>
                        <span className="font-bold text-blue-300">{selectedNode.exam_date}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Universities Directory Grid View */}
      {activeSection === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map(univ => (
            <div 
              key={univ.id} 
              className="editorial-surface rounded-xl p-5 space-y-3 hover:border-[var(--primary)] transition-all card-3d"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{univ.name}</h3>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">{univ.city}, {univ.country}</div>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  {Math.round((univ.reliability_score || 0.98) * 100)}% Trust
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Accredited institution actively tracked in the EDUVA living ontology graph.
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Official Portal:</span>
                <a 
                  href={univ.official_website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[var(--primary)] hover:underline flex items-center gap-1 font-semibold"
                >
                  {univ.official_website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Programs Tab */}
      {activeSection === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => (
            <div 
              key={prog.id} 
              className="editorial-surface rounded-xl p-5 space-y-3 hover:border-emerald-500 transition-all card-3d"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{prog.degree}</span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">{prog.name}</h3>
                  <div className="text-xs text-[var(--text-secondary)]">{prog.faculty}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-emerald-500">
                    {prog.tuition === 0 ? "Tuition Free" : `${prog.currency || 'NPR'} ${prog.tuition?.toLocaleString()}`}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">{prog.duration_years} Years</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs space-y-1">
                <div className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Eligibility:</strong> {prog.eligibility}</div>
                <div className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Deadline:</strong> <span className="text-amber-500 font-bold">{prog.application_deadline}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exams Tab */}
      {activeSection === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map(ex => (
            <div 
              key={ex.id} 
              className="editorial-surface rounded-xl p-5 space-y-3 hover:border-amber-500 transition-all card-3d"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{ex.name}</h3>
                  <div className="text-xs text-[var(--text-secondary)]">{ex.conducting_body}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded-full shrink-0">
                  Fee: {ex.currency || 'NPR'} {ex.fee}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[var(--surface-2)] p-3 rounded-lg border border-[var(--border-subtle)]">
                <div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Registration Close:</div>
                  <div className="font-bold text-rose-500">{ex.registration_close}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Exam Date:</div>
                  <div className="font-bold text-blue-500">{ex.exam_date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scholarships Tab */}
      {activeSection === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map(sch => (
            <div 
              key={sch.id} 
              className="editorial-surface rounded-xl p-5 space-y-3 hover:border-purple-500 transition-all card-3d"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{sch.name}</h3>
                  <div className="text-xs text-purple-500 font-medium">{sch.provider}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/15 text-purple-500 border border-purple-500/30 rounded-full shrink-0">
                  {sch.coverage_type}
                </span>
              </div>

              <div className="text-xs text-emerald-500 font-bold">{sch.amount_description}</div>
              <div className="text-xs text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Criteria:</strong> {sch.criteria}</div>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Deadline: <strong className="text-[var(--text-primary)]">{sch.deadline}</strong></span>
                <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-semibold">
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
