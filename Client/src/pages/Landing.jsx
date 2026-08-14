import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Camera, Sparkles, MapPin, ShieldCheck, CheckCircle2,
  ScanSearch, Send, Users, Timer, Building2, BarChart3, FileText,
  Calendar, Edit3, Circle, Search, Bell, Grid, ChevronRight, Layers,
  Sliders, Map, Plus, Check, ChevronDown, Github, Code, Flame, Radio,
  BellRing, WifiOff, Award, Repeat, Zap, AlertCircle, ArrowUpRight,
  Star, TrendingUp, Shield, Globe, Cpu, ChevronUp
} from 'lucide-react'
import Navbar from '../components/Navbar'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import AiDetectionDemo from '../components/AiDetectionDemo'
import LiveMapSection from '../components/LiveMapSection'
import CityAnalytics from '../components/CityAnalytics'
import { useAuth } from '../context/AuthContext'
import { getAllIssuesAPI } from '../services/api'


/* ─── Animated Reveal Wrapper ────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Scroll To Top Button ──────────────────────────────────────── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xl shadow-black/20 flex items-center justify-center hover:shadow-black/30 transition-shadow"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ─── Section Label ─────────────────────────────────────────────── */
function SectionLabel({ color = 'blue', children }) {
  const colors = {
    blue: 'from-blue-500/20 to-violet-500/20 border-blue-400/30 text-blue-700 dark:text-blue-300',
    emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/30 text-emerald-700 dark:text-emerald-300',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-400/30 text-amber-700 dark:text-amber-300',
    rose: 'from-rose-500/20 to-pink-500/20 border-rose-400/30 text-rose-700 dark:text-rose-300',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r border text-xs font-bold uppercase tracking-widest ${colors[color]}`}>
      {children}
    </span>
  )
}

/* ─── Animated Counter ──────────────────────────────────────────── */
function CountStat({ value, suffix = '', label, icon: Icon }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, scale: 1.02 }}
      className="text-center p-5 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/90 dark:border-white/10 backdrop-blur-md shadow-sm space-y-2 group"
    >
      {Icon && (
        <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
          <Icon size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
      )}
      <p className="font-extrabold text-3xl sm:text-4xl text-neutral-900 dark:text-white tabular-nums tracking-tight">
        {animated.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  )
}

/* ─── Feature Data ──────────────────────────────────────────────── */
const premiumFeatures = [
  { icon: ScanSearch, title: 'Computer Vision AI', desc: 'Neural vision models detect potholes, waste, and lighting defects in under 2 seconds.', color: 'blue' },
  { icon: MapPin, title: 'GPS Auto Geotagging', desc: 'Extracts high-precision EXIF coordinates and ward boundaries automatically.', color: 'emerald' },
  { icon: Repeat, title: 'Duplicate Report Triage', desc: 'Cluster algorithms merge duplicate citizen reports into a single actionable ticket.', color: 'violet' },
  { icon: AlertCircle, title: 'Severity Analysis', desc: 'AI calculates danger indexes (1-100) to prioritize critical public hazards first.', color: 'rose' },
  { icon: Send, title: 'Smart Department Routing', desc: 'Direct API dispatch to responsible municipal officers based on ward jurisdiction.', color: 'amber' },
  { icon: Timer, title: 'Real-Time Status Tracking', desc: 'Track every phase from report submission to officer sign-off with public timestamps.', color: 'blue' },
  { icon: Flame, title: 'City Heatmap Analytics', desc: 'Identify recurring infrastructure bottlenecks across neighborhoods.', color: 'rose' },
  { icon: Award, title: 'Citizen Reputation Badges', desc: 'Earn points and civic badges for active community contributions.', color: 'amber' },
  { icon: BellRing, title: 'Push Notification Alerts', desc: 'Get SMS and push updates when field crews repair your reported issue.', color: 'violet' },
  { icon: WifiOff, title: 'Offline Capture & Sync', desc: 'Snap photos without cellular data — automatically uploads when connection restores.', color: 'emerald' },
]

const featureColors = {
  blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  violet: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200/60 dark:border-violet-500/20 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20 text-rose-600 dark:text-rose-400',
  amber: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
}

const liveFeed = [
  { icon: '🕳️', title: 'Road Crater Pothole', time: '2 minutes ago', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', location: 'Delhi NCR', severity: 87 },
  { icon: '💡', title: 'Streetlight Luminaire Out', time: '5 hours ago', status: 'Resolved', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', location: 'Ghaziabad', severity: 42 },
  { icon: '🗑️', title: 'Market Overflowing Garbage', time: '15 minutes ago', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', location: 'Noida Sector 18', severity: 63 },
  { icon: '💧', title: 'Water Main Line Leak', time: '1 hour ago', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', location: 'Gurgaon DLF', severity: 91 },
]

const testimonials = [
  {
    name: 'AMIT VERMA', role: 'City Resident & Local Lead', stars: 5,
    quote: 'Filing a pothole report used to take weeks of bureaucratic calls. With CivicLens AI, it was detected and patched in under 18 hours.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'RAJESH KUMAR', role: 'Municipal Ward Engineer', stars: 5,
    quote: 'The AI auto-categorization and exact GPS geotagging saves our dispatch teams hours of manual triaging every single day.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'PRIYA SHARMA', role: 'NGO Civic Volunteer', stars: 5,
    quote: 'We mapped 120 dark streetlights across our neighborhood in a single afternoon. The AI confidence scores are remarkably accurate.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'ROHIT SINGH', role: 'Urban Planning Student', stars: 5,
    quote: 'The real-time status tracking timeline gives citizens true transparency into how local government works.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
]

const faqs = [
  { q: 'How does AI detect issues from photos?', a: 'CivicLens utilizes custom deep neural computer vision models trained on thousands of urban infrastructure images to detect surface anomalies, measure depth/size, and classify category.' },
  { q: 'Is location GPS required?', a: 'Yes, CivicLens automatically extracts high-accuracy EXIF GPS metadata from your photo or browser location to pin the exact ward coordinates.' },
  { q: 'Can I edit my report after submission?', a: 'You can add additional photos or contextual comments to your existing ticket at any time before it is marked resolved by field officers.' },
  { q: 'How is duplicate report detection handled?', a: 'Spatiotemporal clustering algorithms evaluate new photos within a 20-meter radius of active reports to merge duplicates into a single priority ticket.' },
  { q: 'Which cities are currently supported?', a: 'CivicLens is active across Delhi NCR (Ghaziabad, Noida, Delhi, Gurgaon) with expanding municipal API integrations.' },
]

/* ─── Animated Gradient Text ────────────────────────────────────── */
function GradientText({ children, className = '' }) {
  return (
    <span className={`text-slate-900 dark:text-white font-bold ${className}`}>
      {children}
    </span>
  )
}


/* ─── 3D Stack Card Data ─────────────────────────────────────────── */
const stackCardData = [
  {
    steps: [
      { num: '01', label: 'Take Photo', icon: '📸' },
      { num: '02', label: 'AI Detects Issue', icon: '🤖' },
    ],
    title: 'Capture & Detect',
    desc: 'Snap a photo from your phone. Neural vision AI instantly identifies the civic issue with bounding-box precision in under 2 seconds.',
    tag: 'Step 01 – 02',
    accent: '#10B981',
    cardBg: 'bg-white dark:bg-[#14161A]',
  },
  {
    steps: [
      { num: '03', label: 'Auto GPS Tag', icon: '📍' },
      { num: '04', label: 'Ticket Created', icon: '📋' },
    ],
    title: 'Tag & Generate',
    desc: 'High-accuracy EXIF GPS coordinates are extracted automatically. AI drafts an official municipal complaint ticket in seconds.',
    tag: 'Step 03 – 04',
    accent: '#6366F1',
    cardBg: 'bg-[#FAFBFF] dark:bg-[#12131C]',
  },
  {
    steps: [
      { num: '05', label: 'Dept Assigned', icon: '🏛️' },
      { num: '06', label: 'Track Fix', icon: '✅' },
    ],
    title: 'Dispatch & Resolve',
    desc: 'Routed directly to the correct municipal officer team. Real-time status tracking from assignment to verified field resolution.',
    tag: 'Step 05 – 06',
    accent: '#3B82F6',
    cardBg: 'bg-[#F8FFFE] dark:bg-[#101820]',
  },
]

// Visual position config per stack depth (0 = top card, 2 = deepest)
const STACK_CFG = [
  { x: 0,  y: 0,  scale: 1,    rotateZ:  0,   rotateX: 2, z: 30 },
  { x: 14, y: 18, scale: 0.95, rotateZ:  2.5, rotateX: 2, z: 20 },
  { x: 28, y: 36, scale: 0.90, rotateZ:  5,   rotateX: 2, z: 10 },
]

function HowItWorksSection() {
  const [dismissed, setDismissed] = useState(0) // how many top cards removed
  const [exiting, setExiting]     = useState(false)
  const cooldown = useRef(false)
  const total = stackCardData.length
  const allGone = dismissed >= total

  const triggerNext = () => {
    if (cooldown.current) return
    if (allGone) {
      // Reset the stack
      cooldown.current = true
      setDismissed(0)
      setTimeout(() => { cooldown.current = false }, 700)
      return
    }
    cooldown.current = true
    setExiting(true)
    setTimeout(() => {
      setDismissed(d => d + 1)
      setExiting(false)
      setTimeout(() => { cooldown.current = false }, 220)
    }, 520)
  }

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
      <FadeUp className="text-center mb-20">
        <SectionLabel color="emerald">
          <Zap size={12} /> Automated Workflow
        </SectionLabel>
        <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">
          How CivicLens AI Works
        </h2>
        <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md mx-auto text-sm">
          Hover the card stack to step through each phase of the workflow.
        </p>
      </FadeUp>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

        {/* ── 3D Card Stack ───────────────────────────────────────── */}
        <div
          className="relative flex-shrink-0"
          style={{ width: 360, height: 280, perspective: '900px', perspectiveOrigin: '50% 40%' }}
          onMouseEnter={triggerNext}
        >
          {stackCardData.map((card, rawIdx) => {
            if (rawIdx < dismissed) return null
            const posFromTop = rawIdx - dismissed   // 0=top, 1=mid, 2=back
            const cfg        = STACK_CFG[Math.min(posFromTop, 2)]
            const isTop      = posFromTop === 0
            const isOut      = isTop && exiting

            return (
              <motion.div
                key={card.tag}
                initial={false}
                animate={isOut
                  ? {
                      y:       -230,
                      x:       cfg.x - 10,
                      rotateX: -42,
                      rotateZ: cfg.rotateZ - 6,
                      scale:   cfg.scale * 0.85,
                      opacity: 0,
                    }
                  : {
                      y:       cfg.y,
                      x:       cfg.x,
                      scale:   cfg.scale,
                      rotateX: cfg.rotateX,
                      rotateZ: cfg.rotateZ,
                      opacity: 1,
                    }
                }
                transition={{
                  duration:     isOut ? 0.50 : 0.52,
                  ease:         isOut ? [0.55, 0, 0.45, 1] : [0.22, 1, 0.36, 1],
                }}
                style={{
                  position:       'absolute',
                  top:            0,
                  left:           0,
                  width:          '100%',
                  height:         '100%',
                  zIndex:         cfg.z,
                  transformOrigin:'50% 100%',
                  transformStyle: 'preserve-3d',
                  boxShadow:      posFromTop === 0
                    ? '0 24px 64px rgba(0,0,0,0.13)'
                    : posFromTop === 1
                    ? '0 12px 32px rgba(0,0,0,0.08)'
                    : '0 4px 16px rgba(0,0,0,0.05)',
                }}
                className={`rounded-[24px] border border-black/8 dark:border-white/8 ${card.cardBg} cursor-default overflow-hidden`}
              >
                {/* Accent top stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${card.accent}, ${card.accent}60)` }}
                />

                <div className="p-7 pt-8 h-full flex flex-col justify-between relative">
                  {/* Tag */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
                      style={{ color: card.accent }}>
                      {card.tag}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-2 font-serif leading-snug">
                      {card.title}
                    </h3>
                    {/* Mini step pills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {card.steps.map(s => (
                        <span key={s.num}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300">
                          {s.icon} {s.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Big number watermark */}
                  <span
                    className="absolute bottom-3 right-5 text-[72px] font-black leading-none select-none pointer-events-none opacity-[0.04]"
                    style={{ color: card.accent }}
                  >
                    {rawIdx + 1}
                  </span>
                </div>
              </motion.div>
            )
          })}

          {/* Empty state — all cards gone */}
          <AnimatePresence>
            {allGone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 cursor-pointer"
                onMouseEnter={triggerNext}
              >
                <div className="text-4xl mb-3">✨</div>
                <p className="font-bold text-neutral-700 dark:text-neutral-300 text-sm">Workflow Complete!</p>
                <p className="text-xs text-neutral-400 mt-1.5">Hover to replay the stack</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover hint */}
          <AnimatePresence>
            {!allGone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: exiting ? 0 : 1 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-9 left-0 right-0 text-center text-xs text-neutral-400 pointer-events-none"
              >
                hover the stack →
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Live Step Tracker ─────────────────────────────── */}
        <div className="space-y-3 w-full max-w-xs">
          {stackCardData.map((card, idx) => {
            const isDone    = idx < dismissed
            const isCurrent = idx === dismissed && !allGone
            return (
              <motion.div
                key={card.tag}
                animate={{
                  opacity: isDone ? 0.4 : 1,
                  x:       isCurrent ? 6 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-white dark:bg-[#14161A] border border-black/8 dark:border-white/8 shadow-sm'
                    : ''
                }`}
              >
                {/* Step indicator */}
                <motion.div
                  animate={{
                    background: isDone
                      ? 'linear-gradient(135deg,#10B981,#059669)'
                      : isCurrent
                      ? `linear-gradient(135deg,${card.accent},${card.accent}BB)`
                      : undefined,
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isDone || isCurrent
                      ? 'text-white'
                      : 'bg-neutral-100 dark:bg-white/8 text-neutral-400 dark:text-neutral-500'
                  }`}
                  style={isDone
                    ? { background: 'linear-gradient(135deg,#10B981,#059669)' }
                    : isCurrent
                    ? { background: `linear-gradient(135deg,${card.accent},${card.accent}BB)` }
                    : {}}
                >
                  {isDone ? '✓' : idx + 1}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm leading-snug ${
                    isDone
                      ? 'line-through text-neutral-400 dark:text-neutral-500'
                      : 'text-neutral-900 dark:text-white'
                  }`}>
                    {card.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {card.steps.map(s => (
                      <span key={s.num} className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {s.icon} {s.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current pulse indicator */}
                {isCurrent && (
                  <div className="flex-shrink-0 mt-1">
                    <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Progress bar */}
          <div className="mt-4 px-4">
            <div className="h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                animate={{ width: `${(dismissed / total) * 100}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-neutral-400 font-medium">
              <span>Progress</span>
              <span>{dismissed}/{total} phases</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0)
  const [activeTab, setActiveTab] = useState('All Docs')
  const navigate = useNavigate()
  const { user } = useAuth()

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.9, 0])


  const handleReportClick = (e) => {
    e.preventDefault()
    if (user) {
      navigate('/report')
    } else {
      navigate('/signup')
    }
  }


  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080809] text-neutral-900 dark:text-white font-sans selection:bg-blue-500/20 overflow-x-hidden">

      {/* ── Ambient Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/15 to-violet-400/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/8 blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-400/8 to-orange-400/5 blur-[60px]"
        />
      </div>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ════════════════════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative px-3 sm:px-6 pt-4 pb-20 max-w-7xl mx-auto z-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.8rem] bg-gradient-to-br from-[#C8DCFC] via-[#D8E9FC] to-[#C0D8F8] dark:from-[#0D1A2E] dark:via-[#111F35] dark:to-[#0A1525] p-6 sm:p-14 overflow-hidden border border-white/90 dark:border-transparent shadow-md dark:shadow-none text-center"
        >
          {/* Decorative Shapes & Dot Grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute top-0 right-0 w-[600px] h-[600px] text-white/70 dark:text-white/5 fill-current" viewBox="0 0 500 500">
              <path d="M0,0 Q220,160 500,0 L500,500 Q280,320 0,500 Z" />
            </svg>
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.06, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#FDE8B3]/80 to-[#FDB874]/40 dark:from-amber-500/10 dark:to-orange-500/5 blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#C2ECD8]/80 to-[#90D5B5]/40 dark:from-emerald-500/10 dark:to-teal-500/5 blur-3xl"
            />
            {/* Dot Grid Pattern (as seen in screenshot) */}
            <div
              className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #2563EB 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto">

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-2.5 mb-7"
            >
              {[
                '✓ AI Powered',
                '✓ GPS Verified',
                '✓ Real-Time Dispatch',
              ].map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-md text-xs font-bold text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-transparent shadow-xs dark:shadow-none"
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* Headline with staggered word blur-in */}
            <div className="mb-5">
              <motion.h1
                initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.06] text-neutral-900 dark:text-white"
              >
                Report Civic Problems.
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.06] text-neutral-900 dark:text-white"
              >
                <span className="font-serif-italic text-neutral-800 dark:text-neutral-200"> Let AI Handle the Rest.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              Snap a photo. AI identifies the issue, extracts GPS coordinates, and dispatches it directly to municipal officers in under <strong className="text-neutral-900 dark:text-white">3 seconds</strong>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={handleReportClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-semibold px-8 py-3.5 text-base shadow-lg shadow-black/10 dark:shadow-none hover:bg-[#242424] dark:hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Report an Issue
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/map"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md text-[#0F0F0F] dark:text-white font-semibold px-8 py-3.5 text-base border border-black/10 dark:border-transparent shadow-sm dark:shadow-none hover:bg-white dark:hover:bg-white/20 transition-all cursor-pointer"
                >
                  Explore Live Map
                </Link>
              </motion.div>
            </motion.div>

            {/* App UI Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 w-full rounded-[2.2rem] bg-white/95 dark:bg-[#14161A]/95 backdrop-blur-xl border border-white dark:border-transparent shadow-md dark:shadow-none overflow-hidden text-left"
            >
              {/* Window Bar */}
              <div className="bg-[#FAF9F6] dark:bg-[#0F1012] px-6 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-4 font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 bg-white dark:bg-[#1E2025] px-3.5 py-1 rounded-full border border-black/5 shadow-xs">
                    <Sparkles size={13} className="text-blue-500" style={{ animationDuration: '4s' }} />
                    CivicLens AI — Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                  <Search size={16} />
                  <Bell size={16} />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    CL
                  </div>
                </div>
              </div>

              {/* App Body Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white dark:bg-[#14161A]">
                {/* Left Sidebar */}
                <div className="hidden md:flex flex-col gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 border-r border-neutral-100 dark:border-neutral-800 pr-4">
                  <div className="flex items-center justify-between text-black dark:text-white font-bold py-1">
                    <span>Reports</span>
                    <Plus size={16} />
                  </div>
                  <div className="py-1 text-blue-600 font-semibold flex items-center gap-1.5">
                    <span>⚡ Live Feed</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {['All Docs', 'Tasks & Issues', 'Live Map'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-xl transition-all ${
                          activeTab === tab
                            ? 'font-bold text-black dark:text-white bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                            : 'hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 text-neutral-400 uppercase tracking-widest text-[10px] font-bold">Pinned</div>
                  <div className="space-y-1 pl-2 text-neutral-600 dark:text-neutral-400">
                    <div className="py-1 hover:text-black cursor-pointer flex items-center gap-1.5">🗺️ Ward Map</div>
                    <div className="py-1 hover:text-black cursor-pointer flex items-center gap-1.5">📊 Analytics</div>
                  </div>
                </div>

                {/* Main Cards Grid */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <motion.div whileHover={{ y: -5, shadow: '0 20px 40px rgba(0,0,0,0.1)' }} className="rounded-2xl p-5 bg-gradient-to-br from-[#EBF3FF] to-[#DCE9FF] dark:from-[#1A2540] dark:to-[#14203A] border border-blue-200/60 dark:border-blue-900/30 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Pothole AI</span>
                      <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Pending</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Major road crater on 5th Avenue requiring asphalt patch.</p>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      <div className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" />AI Severity: 87/100</div>
                      <div className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" />Geotag: 28.67°N, 77.43°E</div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} className="rounded-2xl p-5 bg-gradient-to-br from-[#FEF3E2] to-[#FDE8C8] dark:from-[#2A1E0A] dark:to-[#221805] border border-amber-200/60 dark:border-amber-900/30 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">Garbage</span>
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">In Progress</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Overflowing municipal bins near Sector 4 market.</p>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                      <div>Mon: <span className="underline">Reported</span></div>
                      <div>Tue: <span className="font-semibold">Truck Dispatched ✓</span></div>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} className="rounded-2xl p-5 bg-gradient-to-br from-[#E8F8EF] to-[#D4F1E1] dark:from-[#0F2A1E] dark:to-[#0A2018] border border-emerald-200/60 dark:border-emerald-900/30 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">Streetlight</span>
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">Resolved ✓</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Streetlight outage repaired on Park Avenue.</p>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Verified by Municipal Team · 16 Nov 2025</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. LIVE MAP SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="live-map" className="px-3 sm:px-6 py-12 max-w-7xl mx-auto z-10 relative">
        <FadeUp>
          <LiveMapSection />
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════════════════
          3. HOW IT WORKS — Sequential hover-disappear interaction
      ════════════════════════════════════════════════════════ */}
      <HowItWorksSection />


      {/* ════════════════════════════════════════════════════════
          4. AI DETECTION DEMO
      ════════════════════════════════════════════════════════ */}
      <section id="features" className="py-12 px-3 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <FadeUp>
          <AiDetectionDemo />
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. BEFORE & AFTER SLIDER
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto text-center z-10 relative">
        <FadeUp className="mb-12">
          <SectionLabel color="blue">Real Results</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">
            Before & After Transformation
          </h2>
        </FadeUp>
        <FadeIn delay={0.2}>
          <BeforeAfterSlider />
        </FadeIn>
      </section>



      {/* ════════════════════════════════════════════════════════
          7. CITY ANALYTICS DASHBOARD
      ════════════════════════════════════════════════════════ */}
      <section id="analytics" className="py-20 sm:py-28 px-3 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <FadeUp className="text-center mb-12">
          <SectionLabel color="emerald">Data Insights</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">City Infrastructure Analytics</h2>
        </FadeUp>
        <FadeIn delay={0.15}>
          <CityAnalytics />
        </FadeIn>
      </section>

      {/* ════════════════════════════════════════════════════════
          8. PREMIUM FEATURES GRID
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <FadeUp className="text-center mb-16">
          <SectionLabel color="amber">Built For Scale</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">Enterprise Civic Intelligence</h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">Every feature purpose-built for modern municipal reporting at city scale.</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {premiumFeatures.map((f, idx) => {
            const IconComp = f.icon
            return (
              <FadeUp key={f.title} delay={idx * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`p-6 rounded-[20px] bg-white dark:bg-[#14161A] border border-black/8 dark:border-white/8 shadow-sm text-left space-y-3 h-full group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/3 group-hover:to-violet-500/3 transition-all duration-500" />
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${featureColors[f.color]}`}>
                    <IconComp size={18} />
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">{f.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeUp>
            )
          })}
        </div>
      </section>




      {/* ════════════════════════════════════════════════════════
          10. TESTIMONIALS
      ════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <FadeUp className="text-center mb-16">
          <SectionLabel color="rose">Community</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">What Citizens & Officials Say</h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <FadeUp key={t.name} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="p-6 rounded-[20px] bg-white dark:bg-[#14161A] border border-black/8 dark:border-white/8 shadow-sm space-y-4 text-left flex flex-col justify-between h-full group"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-serif-italic text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-black/5 dark:border-white/8">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shadow-sm" />
                  <div>
                    <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase">{t.name}</h4>
                    <p className="text-[11px] text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          11. FAQ ACCORDION
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative">
        <FadeUp className="text-center mb-12">
          <SectionLabel color="blue">Support</SectionLabel>
          <h2 className="text-3xl sm:text-5xl font-serif mt-4 text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
        </FadeUp>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <FadeUp key={idx} delay={idx * 0.05}>
              <div className="rounded-[20px] bg-white dark:bg-[#14161A] border border-black/8 dark:border-white/8 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={18} className="flex-shrink-0 text-neutral-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>



      {/* ════════════════════════════════════════════════════════
          13. FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer className="px-3 sm:px-6 pb-6 max-w-7xl mx-auto z-10 relative">
        <div className="rounded-[24px] bg-[#0A0A0B] dark:bg-[#050507] text-white p-8 sm:p-14 shadow-2xl border border-neutral-800/80">
          {/* Top Brand Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-10 border-b border-neutral-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Shield size={16} className="text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">CivicLens AI</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-xs">Building smarter cities with AI computer vision and real-time civic intelligence.</p>
            </div>
            <button
              onClick={handleReportClick}
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 font-semibold px-5 py-2 text-sm hover:bg-slate-100 transition-colors"
            >
              Report Issue
            </button>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Product</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><button onClick={handleReportClick} className="hover:text-white transition-colors text-left">Report Issue</button></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Live Map</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Developer</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Open Source</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Company</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Legal</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div className="space-y-3 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Community</h4>
              <p className="text-xs text-neutral-500">Join the civic tech movement. Free for all citizens.</p>
              <div className="flex gap-2 pt-1">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 cursor-pointer transition-colors">
                  <Github size={14} className="text-neutral-300" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 cursor-pointer transition-colors">
                  <Globe size={14} className="text-neutral-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
            <div>© {new Date().getFullYear()} CivicLens AI Inc. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-neutral-300 transition-colors">GitHub</a>
              <a href="#" className="hover:text-neutral-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-300 transition-colors">Terms</a>
            </div>
          </div>

        </div>
      </footer>
      {/* ── Floating Scroll-To-Top Button ── */}
      <ScrollToTop />

    </div>
  )
}
