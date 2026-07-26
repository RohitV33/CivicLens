import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react'

const sampleImages = [
  {
    id: 'pothole',
    label: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    detected: 'Pothole (Depth ~4.2 inches)',
    confidence: 98,
    severity: 'High',
    department: 'Public Works & Roads',
    priority: '92/100',
    box: { x: '20%', y: '35%', w: '55%', h: '45%' },
    complaintText: 'Automated Complaint #CL-9842: Severe asphalt depression detected on 5th Avenue. Structural hazard to vehicular traffic. Immediate resurfacing required.',
  },
  {
    id: 'waste',
    label: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    detected: 'Overflowing Waste Dump',
    confidence: 95,
    severity: 'Medium',
    department: 'Sanitation Dept',
    priority: '78/100',
    box: { x: '25%', y: '25%', w: '50%', h: '55%' },
    complaintText: 'Automated Complaint #CL-7721: Municipal waste bin overflow near Sector 4 Market. Health risk identified. High-capacity compaction truck dispatch requested.',
  },
  {
    id: 'light',
    label: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    detected: 'Damaged LED Luminaire',
    confidence: 91,
    severity: 'Medium',
    department: 'Electrical Works',
    priority: '65/100',
    box: { x: '35%', y: '15%', w: '30%', h: '60%' },
    complaintText: 'Automated Complaint #CL-4409: Streetlight fixture power outage reported on Park Avenue. Area dark spot flagged for evening pedestrian safety.',
  },
]

export default function AiDetectionDemo() {
  const [selected, setSelected] = useState(sampleImages[0])
  const [scanning, setScanning] = useState(false)
  const [typedText, setTypedText] = useState('')

  // Simulate scanning & typing effect when switching sample image
  useEffect(() => {
    setScanning(true)
    setTypedText('')
    const scanTimer = setTimeout(() => {
      setScanning(false)
    }, 1000)

    return () => clearTimeout(scanTimer)
  }, [selected])

  // Typing effect for complaint description
  useEffect(() => {
    if (scanning) return
    let i = 0
    const fullText = selected.complaintText
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeInterval)
      }
    }, 18)

    return () => clearInterval(typeInterval)
  }, [scanning, selected])

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-craft overflow-hidden p-6 sm:p-10">
      
      {/* Sample Image Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles size={14} /> Interactive AI Vision Simulator
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
            Test AI Issue Detection
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {sampleImages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selected.id === s.id
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* LEFT: Image Viewfinder with Animated Bounding Box */}
        <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-neutral-900 border border-black/10 dark:border-white/10 shadow-md">
          <img
            src={selected.url}
            alt={selected.label}
            className="w-full h-full object-cover"
          />

          {/* Scanning Line Animation */}
          {scanning && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] z-20"
            />
          )}

          {/* Bounding Box Overlay */}
          {!scanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute border-2 border-emerald-400 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] z-10 pointer-events-none"
              style={{
                left: selected.box.x,
                top: selected.box.y,
                width: selected.box.w,
                height: selected.box.h,
              }}
            >
              {/* Corner Reticles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

              {/* Tag Label */}
              <div className="absolute -top-7 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                AI DETECTED: {selected.confidence}%
              </div>
            </motion.div>
          )}

          {/* Overlay Status Badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
            <Camera size={13} className="text-emerald-400" /> Image Vision Frame
          </div>
        </div>

        {/* RIGHT: AI Audit Results Card */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-[20px] bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <span className="text-xs font-semibold uppercase text-neutral-500">Detected Problem</span>
              <p className="text-base font-bold text-neutral-900 dark:text-white mt-1">{selected.detected}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <span className="text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-300">Confidence Score</span>
              <p className="text-base font-bold text-emerald-900 dark:text-emerald-200 mt-1">{selected.confidence}% Accuracy</p>
            </div>

            <div className="p-4 rounded-[20px] bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <span className="text-xs font-semibold uppercase text-neutral-500">Responsible Dept</span>
              <p className="text-base font-bold text-neutral-900 dark:text-white mt-1">{selected.department}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <span className="text-xs font-semibold uppercase text-amber-800 dark:text-amber-300">Repair Priority</span>
              <p className="text-base font-bold text-amber-900 dark:text-amber-200 mt-1">{selected.priority}</p>
            </div>
          </div>

          {/* AI Typing Complaint Generation Preview */}
          <div className="p-5 rounded-[20px] bg-[#FAF8F5] dark:bg-[#141517] border border-black/10 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
              <span>Auto-Generated Complaint</span>
              <span className="text-emerald-600 dark:text-emerald-400">AI Drafting...</span>
            </div>
            <p className="text-sm font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed min-h-[4rem]">
              {typedText}
              <span className="inline-block w-2 h-4 bg-emerald-500 ml-1 animate-pulse" />
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
