import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react'

const scenarios = [
  {
    id: 'pothole',
    label: 'Road Pothole',
    beforeImg: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Pothole Detected (4.2 in)',
    afterTag: 'Resurfaced by Public Works',
    resolutionTime: 'Resolved in 18 hrs',
  },
  {
    id: 'waste',
    label: 'Garbage Dump',
    beforeImg: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Overflowing Waste Alert',
    afterTag: 'Cleared & Disinfected',
    resolutionTime: 'Resolved in 4 hrs',
  },
  {
    id: 'lighting',
    label: 'Street Light',
    beforeImg: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
    beforeTag: 'Dark Area / Lamp Out',
    afterTag: 'Smart LED Replaced',
    resolutionTime: 'Resolved in 12 hrs',
  },
]

export default function BeforeAfterSlider() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0])
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pos)
  }, [])

  const handleTouchMove = (e) => handleMove(e.touches[0].clientX)
  const handleMouseMove = (e) => {
    if (isDragging || e.buttons === 1) handleMove(e.clientX)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => {
              setActiveScenario(sc)
              setSliderPos(50)
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeScenario.id === sc.id
                ? 'bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] shadow-md scale-105'
                : 'bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-black/5'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[20px] overflow-hidden select-none cursor-ew-resize border border-black/10 dark:border-white/10 shadow-craft bg-neutral-900"
      >
        {/* AFTER IMAGE (Background full) */}
        <img
          src={activeScenario.afterImg}
          alt="After Repair"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* AFTER BADGE */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-emerald-500/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
          <CheckCircle2 size={14} /> {activeScenario.afterTag}
        </div>

        {/* BEFORE IMAGE (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={activeScenario.beforeImg}
            alt="Before Repair"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
          />
          {/* BEFORE BADGE */}
          <div className="absolute top-4 left-4 z-10 bg-black/75 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
            BEFORE: {activeScenario.beforeTag}
          </div>
        </div>

        {/* SLIDER DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-ew-resize pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#0F0F0F] text-black dark:text-white border-2 border-white shadow-xl flex items-center justify-center">
            <ArrowLeftRight size={18} />
          </div>
        </div>
      </div>

      {/* Slider Footer Status */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        <span>← Drag slider to compare Before &amp; After</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeScenario.resolutionTime}</span>
      </div>
    </div>
  )
}
