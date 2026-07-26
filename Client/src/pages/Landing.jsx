import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Camera, Sparkles, MapPin, ShieldCheck, CheckCircle2,
  ScanSearch, Send, Users, Timer, Building2, BarChart3, FileText,
  Calendar, Edit3, Circle, Search, Bell, Grid, ChevronRight, Layers,
  Sliders, Map, Plus, Check, ChevronDown, Github, Code, Flame, Radio,
  BellRing, WifiOff, Award, Repeat, Zap, AlertCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import AiDetectionDemo from '../components/AiDetectionDemo'
import LiveMapSection from '../components/LiveMapSection'
import CityAnalytics from '../components/CityAnalytics'
import { useCountUp } from '../hooks/useCountUp'

/* Animated Counter Wrapper */
function CountStat({ value, suffix = '', label }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div ref={ref} className="text-center p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 backdrop-blur-sm shadow-xs">
      <p className="font-extrabold text-2xl sm:text-4xl text-neutral-900 dark:text-white tabular-nums tracking-tight">
        {animated.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   10 Premium Features Grid Data
───────────────────────────────────────────────────────── */
const premiumFeatures = [
  { icon: ScanSearch, title: 'Computer Vision AI', desc: 'Neural vision models detect potholes, waste, and lighting defects in under 2 seconds.' },
  { icon: MapPin, title: 'GPS Auto Geotagging', desc: 'Extracts high-precision EXIF coordinates and ward boundaries automatically.' },
  { icon: Repeat, title: 'Duplicate Report Triage', desc: 'Cluster algorithms merge duplicate citizen reports into a single actionable ticket.' },
  { icon: AlertCircle, title: 'Severity Analysis', desc: 'AI calculates danger indexes (1-100) to prioritize critical public hazards first.' },
  { icon: Send, title: 'Smart Department Routing', desc: 'Direct API dispatch to responsible municipal officers based on ward jurisdiction.' },
  { icon: Timer, title: 'Real-Time Status Tracking', desc: 'Track every phase from report submission to officer sign-off with public timestamps.' },
  { icon: Flame, title: 'City Heatmap Analytics', desc: 'Identify recurring infrastructure bottlenecks across neighborhoods.' },
  { icon: Award, title: 'Citizen Reputation Badges', desc: 'Earn points and civic badges for active community contributions.' },
  { icon: BellRing, title: 'Push Notification Alerts', desc: 'Get SMS and push updates when field crews repair your reported issue.' },
  { icon: WifiOff, title: 'Offline Capture & Sync', desc: 'Snap photos without cellular data — automatically uploads when connection restores.' },
]

/* ─────────────────────────────────────────────────────────
   Live Activity Feed Data
───────────────────────────────────────────────────────── */
const liveFeed = [
  { icon: '🕳️', title: 'Road Crater Pothole', time: '2 minutes ago', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', location: 'Delhi NCR' },
  { icon: '💡', title: 'Streetlight Luminaire Out', time: '5 hours ago', status: 'Resolved', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', location: 'Ghaziabad' },
  { icon: '🗑️', title: 'Market Overflowing Garbage', time: '15 minutes ago', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', location: 'Noida Sector 18' },
  { icon: '💧', title: 'Water Main Line Leak', time: '1 hour ago', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', location: 'Gurgaon DLF' },
]

/* ─────────────────────────────────────────────────────────
   Civic Testimonials Data
───────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: 'AMITY VERMA', role: 'City Resident & Local Lead',
    quote: 'Filing a pothole report used to take weeks of bureaucratic calls. With CivicLens AI, it was detected and patched in under 18 hours.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'RAJESH KUMAR', role: 'Municipal Ward Engineer',
    quote: 'The AI auto-categorization and exact GPS geotagging saves our dispatch teams hours of manual triaging every single day.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'PRIYA SHARMA', role: 'NGO Civic Volunteer',
    quote: 'We mapped 120 dark streetlights across our neighborhood in a single afternoon. The AI confidence scores are remarkably accurate.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'ROHIT SINGH', role: 'Urban Planning Student',
    quote: 'The real-time status tracking timeline gives citizens true transparency into how local government works.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
]

/* ─────────────────────────────────────────────────────────
   FAQ Accordion Data
───────────────────────────────────────────────────────── */
const faqs = [
  { q: 'How does AI detect issues from photos?', a: 'CivicLens utilizes custom deep neural computer vision models trained on thousands of urban infrastructure images to detect surface anomalies, measure depth/size, and classify category.' },
  { q: 'Is location GPS required?', a: 'Yes, CivicLens automatically extracts high-accuracy EXIF GPS metadata from your photo or browser location to pin the exact ward coordinates.' },
  { q: 'Can I edit my report after submission?', a: 'You can add additional photos or contextual comments to your existing ticket at any time before it is marked resolved by field officers.' },
  { q: 'How is duplicate report detection handled?', a: 'Spatiotemporal clustering algorithms evaluate new photos within a 20-meter radius of active reports to merge duplicates into a single priority ticket.' },
  { q: 'Which cities are currently supported?', a: 'CivicLens is active across Delhi NCR (Ghaziabad, Noida, Delhi, Gurgaon) with expanding municipal API integrations.' },
]

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0)
  const [activeTab, setActiveTab] = useState('All Docs')

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C0D0E] text-neutral-900 dark:text-white font-sans selection:bg-black/10 overflow-x-hidden">
      
      {/* Header & Navbar */}
      <Navbar />

      {/* ══════════════════════════════════════════════════
          1. HERO SECTION — Vibrant Craft.do Layered Canvas
      ══════════════════════════════════════════════════ */}
      <section className="px-3 sm:px-6 pt-4 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-[#CEE3FC] via-[#DCEBFC] to-[#C9DFFA] dark:from-[#112033] dark:via-[#16273D] dark:to-[#0F1B2B] p-6 sm:p-14 overflow-hidden border border-white/90 dark:border-white/10 shadow-[0_30px_90px_rgba(37,99,235,0.12)] text-center"
        >
          
          {/* Decorative Craft Torn-Paper & Organic Cutout Shapes (Signature Craft Aesthetic) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-Right White Torn-Paper Wave Curve */}
            <svg className="absolute top-0 right-0 w-[550px] h-[550px] text-white/70 dark:text-white/5 fill-current" viewBox="0 0 500 500">
              <path d="M0,0 Q220,160 500,0 L500,500 Q280,320 0,500 Z" />
            </svg>

            {/* Bottom-Left Warm Mustard Yellow Cutout Patch */}
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#FDE8B3]/75 dark:bg-amber-500/10 blur-2xl"
            />

            {/* Bottom-Right Leaf Green / Mint Cutout Patch */}
            <motion.div
              animate={{ y: [0, 10, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#C2ECD8]/75 dark:bg-emerald-500/10 blur-3xl"
            />

            {/* Subtle Grid Dot Matrix Overlay */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          {/* Hero Content Layer */}
          <div className="relative z-10 max-w-4xl mx-auto">
            
            {/* Glassmorphic Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
              {['✓ AI Powered', '✓ GPS Verified', '✓ Real-Time Dispatch'].map((b) => (
                <span key={b} className="px-4 py-1.5 rounded-full bg-white/85 dark:bg-white/10 backdrop-blur-md text-xs font-extrabold text-neutral-800 dark:text-neutral-200 border border-white shadow-xs">
                  {b}
                </span>
              ))}
            </div>

            {/* Product Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.06] text-neutral-900 dark:text-white">
              Report Civic Problems.<br />
              <span className="font-serif-italic text-neutral-800 dark:text-neutral-200">
                Let AI Handle the Rest.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Snap a photo. AI identifies the issue, extracts GPS coordinates, and dispatches it directly to municipal officers in under 3 seconds.
            </p>

            {/* Action CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/report" className="btn-primary text-base px-9 py-4 shadow-xl rounded-full">
                  Report an Issue
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/map" className="btn-secondary text-base px-9 py-4 bg-white/90 backdrop-blur-md rounded-full shadow-md">
                  Explore Live Map
                </Link>
              </motion.div>
            </div>

            {/* ── Craft-style Interactive App UI Preview Frame (Nested Inside Hero) ── */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 w-full rounded-[2.2rem] bg-white/95 dark:bg-[#1A1C20]/95 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden text-left"
            >
              {/* Window Bar */}
              <div className="bg-[#FAF9F6] dark:bg-[#141517] px-6 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-4 font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 bg-white dark:bg-[#222] px-3.5 py-1 rounded-full border border-black/5 shadow-xs">
                    <Sparkles size={13} className="text-amber-500 animate-spin" style={{ animationDuration: '4s' }} /> All Docs
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                  <Search size={16} />
                  <Bell size={16} />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    JD
                  </div>
                </div>
              </div>

              {/* App Body Grid (Craft Cards) */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white dark:bg-[#1A1C20]">
                {/* Left Mini Sidebar */}
                <div className="hidden md:flex flex-col gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 border-r border-neutral-100 dark:border-neutral-800 pr-4">
                  <div className="flex items-center justify-between text-black dark:text-white font-bold py-1">
                    <span>New Doc</span>
                    <Plus size={16} />
                  </div>
                  <div className="py-1 text-amber-600 font-semibold flex items-center gap-1.5">
                    <span>⚡ Joe's Space</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {['All Docs', 'Tasks & Issues', 'Live Map'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-xl transition-all ${
                          activeTab === tab
                            ? 'font-bold text-black dark:text-white bg-neutral-100 dark:bg-white/10 shadow-xs'
                            : 'hover:text-black dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 text-neutral-400 uppercase tracking-widest text-[10px] font-bold">Starred</div>
                  <div className="space-y-1 pl-2 text-neutral-600 dark:text-neutral-400">
                    <div className="py-1 hover:text-black cursor-pointer">📔 Journal</div>
                    <div className="py-1 hover:text-black cursor-pointer">💡 City Ideas</div>
                  </div>
                </div>

                {/* Main Cards Grid */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1 Pink */}
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-5 bg-[#FCE5E6] dark:bg-[#2B1B1E] border border-rose-200/60 dark:border-rose-900/30 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">Reading list</span>
                      <span className="text-[10px] font-semibold bg-rose-200/80 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200 px-2 py-0.5 rounded-full">Pothole AI</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Major road crater on 5th Avenue requiring asphalt patch.
                    </p>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      <div className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Auto-tagged by AI</div>
                      <div className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Geotag: 28.67, 77.43</div>
                    </div>
                  </motion.div>

                  {/* Card 2 Yellow */}
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-5 bg-[#FDE8B3] dark:bg-[#2C2415] border border-amber-200/60 dark:border-amber-900/30 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">Workout routine</span>
                      <span className="text-[10px] font-semibold bg-amber-200/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">Garbage</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Overflowing municipal bins near Sector 4 market.
                    </p>
                    <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                      <div>Monday: <span className="underline">Reported</span></div>
                      <div>Tuesday: <span className="font-semibold">Truck Dispatched</span></div>
                    </div>
                  </motion.div>

                  {/* Card 3 Green */}
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-5 bg-[#DDF0E5] dark:bg-[#162A20] border border-emerald-200/60 dark:border-emerald-900/30 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">Weekend Trip</span>
                      <span className="text-[10px] font-semibold bg-emerald-200/80 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">Resolved</span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Streetlight outage repaired on Park Avenue.
                    </p>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Verified by Municipal Team · 16 Nov 2025
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Tester Social Proof & Animated Counters */}
            <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10 max-w-3xl mx-auto space-y-5">
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                ★★★★★ TRUSTED BY EARLY TESTERS &amp; CITY CONTRIBUTORS
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <CountStat value={2000} suffix="+" label="Reports Submitted" />
                <CountStat value={94} suffix="%" label="Detection Accuracy" />
                <CountStat value={12} label="Cities Tested" />
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. LIVE MAP SECTION (Immediately after Hero)
      ══════════════════════════════════════════════════ */}
      <section className="px-3 sm:px-6 py-12 max-w-7xl mx-auto">
        <LiveMapSection />
      </section>

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS (Modern 6-Step Horizontal Timeline)
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">AUTOMATED WORKFLOW</span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2">How CivicLens AI Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Take Photo', desc: 'Snap photo from phone or gallery.' },
            { step: '02', title: 'AI Detects Issue', desc: 'Neural vision bounding box scan.' },
            { step: '03', title: 'Auto GPS Location', desc: 'Extracts exact ward coordinates.' },
            { step: '04', title: 'Complaint Generated', desc: 'AI drafts official ticket text.' },
            { step: '05', title: 'Assigned to Dept', desc: 'Routed to correct municipal team.' },
            { step: '06', title: 'Track Resolution', desc: 'Live status timeline updates.' },
          ].map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft text-left relative"
            >
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{s.step}</span>
              <h3 className="font-bold text-base mt-2 text-neutral-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. AI DETECTION DEMO (Interactive Scanner)
      ══════════════════════════════════════════════════ */}
      <section className="py-12 px-3 sm:px-6 max-w-7xl mx-auto">
        <AiDetectionDemo />
      </section>

      {/* ══════════════════════════════════════════════════
          5. BEFORE & AFTER COMPARISON SLIDER
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">REAL RESULTS</span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2">Before &amp; After Transformation</h2>
        </div>
        <BeforeAfterSlider />
      </section>

      {/* ══════════════════════════════════════════════════
          6. LIVE REPORTS FEED (GitHub Activity Style)
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5 dark:border-white/10">
          <div>
            <h2 className="font-serif text-3xl">Live Reports Feed</h2>
            <p className="text-xs text-neutral-500">Real-time civic activity across tested cities</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Stream
          </span>
        </div>

        <div className="space-y-3">
          {liveFeed.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/5 dark:border-white/10 shadow-soft flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{item.title}</h4>
                  <span className="text-xs text-neutral-500">📍 {item.location} · {item.time}</span>
                </div>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${item.statusColor}`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. CITY ANALYTICS DASHBOARD
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-3 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">DATA INSIGHTS</span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2">City Infrastructure Analytics</h2>
        </div>
        <CityAnalytics />
      </section>

      {/* ══════════════════════════════════════════════════
          8. PREMIUM FEATURE CARDS GRID
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">BUILT FOR SCALE</span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2">Enterprise Civic Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {premiumFeatures.map((f, idx) => {
            const IconComp = f.icon
            return (
              <motion.div
                key={f.title}
                whileHover={{ y: -6 }}
                className="p-6 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft text-left space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-900 dark:text-white">
                  <IconComp size={20} />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          9. PRODUCT TRUST & METRICS SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[20px] bg-[#D9E8FC] dark:bg-[#162538] p-8 sm:p-14 border border-white/60 dark:border-white/10 shadow-craft grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-blue-950 dark:text-blue-100">94%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">AI Detection Accuracy</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-blue-950 dark:text-blue-100">&lt; 25s</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Average Report Time</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-blue-950 dark:text-blue-100">68%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Duplicate Triage Reduction</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-blue-950 dark:text-blue-100">100%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">Auto Department Assignment</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          10. REALISTIC CIVIC TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif">What Citizens &amp; Officials Say</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -6 }}
              className="p-6 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft space-y-4 text-left flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm font-serif-italic text-neutral-700 dark:text-neutral-300 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-black/5 dark:border-white/10">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shadow-sm" />
                <div>
                  <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase">{t.name}</h4>
                  <p className="text-[11px] text-neutral-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          11. MOBILE APP SHOWCASE
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">MOBILE FIRST</span>
          <h2 className="text-3xl sm:text-5xl font-serif mt-2">CivicLens Mobile App Workflow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Camera Capture', desc: 'Point & snap image frame' },
            { step: '02', title: 'AI Detection', desc: 'Neural vision bounding box scan' },
            { step: '03', title: 'Complaint Tracking', desc: 'Real-time status updates' },
            { step: '04', title: 'Issue Resolved', desc: 'Field officer sign-off & photo' },
          ].map((m) => (
            <div key={m.step} className="p-6 rounded-[20px] bg-neutral-900 text-white shadow-xl space-y-3 text-center border border-neutral-800">
              <span className="text-xs font-extrabold text-emerald-400">SCREEN {m.step}</span>
              <h3 className="font-bold text-lg">{m.title}</h3>
              <p className="text-xs text-neutral-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          12. FAQ ACCORDION SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-serif">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-6 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 text-neutral-900 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          13. FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[20px] bg-[#C2ECD8] dark:bg-[#163628] p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-craft border border-emerald-300/40">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white leading-tight">
              Help Build Better Cities.
            </h2>
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-200">
              Join thousands of citizens reporting and resolving civic issues.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/report" className="btn-primary px-8 py-3.5 text-base shadow-lg rounded-full">
              Report an Issue
            </Link>
            <Link to="/map" className="btn-secondary px-8 py-3.5 text-base bg-white/80 rounded-full">
              Explore Live Map
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          14. FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="px-3 sm:px-6 pb-6 max-w-7xl mx-auto">
        <div className="rounded-[20px] bg-[#111111] text-white p-8 sm:p-16 shadow-2xl border border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">PRODUCT</h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li><a href="/report" className="hover:text-white">Report Issue</a></li>
                <li><a href="/map" className="hover:text-white">Live Map</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">DEVELOPER</h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Open Source</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">COMPANY</h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">LEGAL</h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div className="space-y-3 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">COMMUNITY</h4>
              <p className="text-xs text-neutral-400">Building smarter cities with AI computer vision.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
            <div>&copy; {new Date().getFullYear()} CivicLens AI Inc. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-neutral-300">GitHub</a>
              <a href="#" className="hover:text-neutral-300">Privacy</a>
              <a href="#" className="hover:text-neutral-300">Terms</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
