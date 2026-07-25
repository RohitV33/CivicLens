import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Camera, Sparkles, MapPinned, ShieldCheck,
  CheckCircle2, ScanSearch, Send, Users, Timer, Building2,
  BarChart3, FileText, Calendar, Edit3, Circle, Search,
  Bell, Grid, ChevronRight, Layers, Sliders, Map, Plus, Check
} from 'lucide-react'
import Navbar from '../components/Navbar'

/* ─────────────────────────────────────────────────────────
   Persona Community Cards Data (Craft.do Style)
───────────────────────────────────────────────────────── */
const personas = [
  {
    name: 'AMITY, NEIGHBORHOOD LEADER',
    quote: 'Pothole resolution tracking, neighborhood cleanup boards, quick voice reports',
    bgClass: 'bg-[#D5E6FA] text-blue-900',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    tag: 'Community',
  },
  {
    name: 'AARON, MUNICIPAL ENGINEER',
    quote: 'Work reports, project boards, infrastructure audit & field verification',
    bgClass: 'bg-[#D4EDDA] text-emerald-900',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    tag: 'Public Works',
  },
  {
    name: 'SEOYOUNG, CITY RESIDENT',
    quote: 'Course notes, project outlines, daily neighborhood issue tracking',
    bgClass: 'bg-[#FDE8B3] text-amber-900',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    tag: 'Resident',
  },
  {
    name: 'GIAN, SITE MANAGER',
    quote: 'Traffic safety, signal outages, emergency hazard alerts & priority dispatch',
    bgClass: 'bg-[#C2ECD8] text-teal-900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    tag: 'Urban Infra',
  },
  {
    name: 'STEPHEN, CIVIC ADVOCATE',
    quote: 'List of goals, progress tracker, public transparency metrics',
    bgClass: 'bg-[#EBE8E1] text-neutral-900',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    tag: 'Advocacy',
  },
]

/* ─────────────────────────────────────────────────────────
   Line Icon Strip Categories (Craft.do style)
───────────────────────────────────────────────────────── */
const iconCategories = [
  { icon: FileText, label: 'Roads & Potholes' },
  { icon: CheckCircle2, label: 'Waste Management' },
  { icon: Calendar, label: 'Water Supply' },
  { icon: Sliders, label: 'Street Lighting' },
  { icon: Edit3, label: 'AI Auto-Routing' },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState('All Docs')

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0C0D0E] text-text-primary dark:text-text-dark font-sans selection:bg-black/10 overflow-x-hidden">
      
      {/* Navbar with top ribbon */}
      <Navbar />

      {/* ══════════════════════════════════════════════════
          HERO SECTION — Craft.do Style Layered Animated Canvas
      ══════════════════════════════════════════════════ */}
      <section className="px-3 sm:px-6 pt-4 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-[2.5rem] bg-[#D9E8FC] dark:bg-[#152336] p-6 sm:p-14 overflow-hidden border border-white/70 dark:border-white/10 shadow-craft"
        >
          
          {/* Layered Floating Animated Background Graphics */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
            {/* Animated top-right torn paper wave */}
            <motion.svg
              animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-[520px] h-[520px] text-white/60 dark:text-white/5 fill-current"
              viewBox="0 0 500 500"
            >
              <path d="M0,0 Q250,150 500,0 L500,500 Q250,350 0,500 Z" />
            </motion.svg>

            {/* Floating yellow accent orb */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#FDE8B3]/60 dark:bg-amber-500/10 blur-3xl"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-4">
            
            {/* Animated Badge Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              CivicLens AI 2.0 · Real-Time Issue Dispatch
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-neutral-900 dark:text-white leading-[1.08]"
            >
              Your space for civic notes,<br />
              <span className="font-serif-italic text-neutral-800 dark:text-neutral-200">
                tasks, and big ideas
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl font-normal leading-relaxed"
            >
              AI-powered civic issue reporting platform. Snap a photo of any pothole, broken streetlight, or garbage backlog — AI categorizes, geotags, and dispatches it in under 3 seconds.
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/report" className="btn-primary text-base px-8 py-3.5 shadow-lg">
                  Try CivicLens Free
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/map" className="btn-secondary text-base px-8 py-3.5 bg-white/80 backdrop-blur-sm">
                  Explore Live Map
                </Link>
              </motion.div>
            </motion.div>

            {/* ── Craft-style Floating Interactive App UI Preview Window ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="mt-12 w-full max-w-5xl rounded-[2rem] bg-white dark:bg-[#1A1C20] border border-white/90 dark:border-white/10 shadow-craft overflow-hidden text-left"
            >
              {/* App Top Toolbar */}
              <div className="bg-[#FAF9F6] dark:bg-[#141517] px-6 py-3 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-4 font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 bg-white dark:bg-[#222] px-3.5 py-1 rounded-full border border-black/5 shadow-xs">
                    <Sparkles size={13} className="text-amber-500 animate-spin" style={{ animationDuration: '4s' }} /> {activeTab}
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

              {/* App Body Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white dark:bg-[#1A1C20]">
                {/* Left Mini Interactive Sidebar */}
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
                    <div className="py-1 hover:text-black dark:hover:text-white cursor-pointer">📔 Journal</div>
                    <div className="py-1 hover:text-black dark:hover:text-white cursor-pointer">💡 City Ideas</div>
                  </div>
                </div>

                {/* Main Cards Grid inside Mockup (Pastel Craft Cards with Tab Switching Animation) */}
                <div className="md:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {/* Card 1 Pink */}
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-2xl p-5 bg-[#FCE5E6] dark:bg-[#2B1B1E] border border-rose-200/60 dark:border-rose-900/30 space-y-3 shadow-xs"
                      >
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
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-2xl p-5 bg-[#FDE8B3] dark:bg-[#2C2415] border border-amber-200/60 dark:border-amber-900/30 space-y-3 shadow-xs"
                      >
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
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="rounded-2xl p-5 bg-[#DDF0E5] dark:bg-[#162A20] border border-emerald-200/60 dark:border-emerald-900/30 space-y-3 shadow-xs"
                      >
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
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — "Craft isn't just for one thing..."
      ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 text-center max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white leading-tight"
        >
          CivicLens isn't just for one thing,<br />
          it's for <span className="font-serif-italic">your</span> things.
        </motion.h2>

        {/* Animated Minimal Line Art Icon Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {iconCategories.map((item, idx) => {
            const IconComp = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.15, rotate: 2 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:shadow-craft group-hover:border-black/20 transition-all">
                  <IconComp size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {item.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — "How people use Craft" Persona Grid
      ══════════════════════════════════════════════════ */}
      <section id="community" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white">
            How people use CivicLens
          </h2>
        </motion.div>

        {/* 5 Vertical Portrait Persona Cards with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {personas.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center text-center space-y-4 group"
            >
              {/* Image Container with Pastel Background Graphic Cutout */}
              <div className={`w-full aspect-[4/5] rounded-[2rem] overflow-hidden relative shadow-card p-2 ${p.bgClass} transition-transform duration-300 group-hover:shadow-craft`}>
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full object-cover rounded-[1.6rem] shadow-inner transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title Header */}
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-900 dark:text-white max-w-[200px] leading-snug">
                {p.name}
              </h3>

              {/* Italicized Description */}
              <p className="text-xs sm:text-sm font-serif-italic text-neutral-600 dark:text-neutral-400 max-w-[200px] leading-normal">
                {p.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — Feature Showcase Blocks (Pastel Cards)
      ══════════════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        
        {/* Feature Block 1: Soft Blue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2.5rem] bg-[#D9E8FC] dark:bg-[#162538] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border border-white/60 dark:border-white/10 shadow-craft"
        >
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800 dark:text-blue-300">
              WRITE &amp; REPORT
            </span>
            <h3 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white leading-tight">
              From first photo to official resolution.
            </h3>
            <p className="text-base text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
              CivicLens uses computer vision to inspect civic issues, measure severity, geotag location, and draft detailed municipal tickets instantly.
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#1F2228] p-6 shadow-xl border border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <span className="text-xs font-bold uppercase text-neutral-400">AI Computer Vision Audit</span>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">99.4% Accuracy</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-sm font-medium">Issue Detected</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Pothole (Depth ~4.2 in)</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/5 flex items-center justify-between">
                <span className="text-sm font-medium">Department</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Public Works &amp; Roads</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Block 2: Soft Mint */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2.5rem] bg-[#C2ECD8] dark:bg-[#153428] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border border-white/60 dark:border-white/10 shadow-craft"
        >
          <div className="rounded-3xl bg-white dark:bg-[#1F2228] p-6 shadow-xl border border-black/5 dark:border-white/10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center">01</div>
                <div>
                  <h4 className="text-sm font-bold">Automatic Geotagging</h4>
                  <p className="text-xs text-neutral-500">Extracts exact GPS coordinates</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center">02</div>
                <div>
                  <h4 className="text-sm font-bold">Real-time Officer Dispatch</h4>
                  <p className="text-xs text-neutral-500">Sent directly to regional field teams</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 order-1 lg:order-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-300">
              DISPATCH &amp; ROUTE
            </span>
            <h3 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white leading-tight">
              Connect citizens directly with local teams.
            </h3>
            <p className="text-base text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
              No phone calls or lost paperwork. Every submission automatically reaches the exact ward officer responsible for your area.
            </p>
          </div>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — Wavy Mint CTA Banner ("Let's get started")
      ══════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[2.5rem] bg-[#C2ECD8] dark:bg-[#163628] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-craft border border-emerald-300/40"
        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white leading-tight">
              Let's get started
            </h2>
            <p className="text-base sm:text-lg font-normal text-neutral-700 dark:text-neutral-200">
              Start for free. No credit card required.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/report" className="btn-primary px-8 py-3.5 text-base shadow-lg">
              Continue on web
            </Link>
            <Link to="/map" className="btn-secondary px-8 py-3.5 text-base bg-white/80">
              Explore Live Map
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — Craft.do Dark Capsule Footer
      ══════════════════════════════════════════════════ */}
      <footer className="px-3 sm:px-6 pb-6 max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] bg-[#111111] text-white p-8 sm:p-16 shadow-2xl border border-neutral-800">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-sm">
            {/* Column 1 PRODUCT */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">PRODUCT</h4>
              <ul className="space-y-2.5 text-neutral-300 text-xs sm:text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Product Releases</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI Detection</a></li>
                <li><a href="/report" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="/map" className="hover:text-white transition-colors">Live Map</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            {/* Column 2 COMMUNITY */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">COMMUNITY</h4>
              <ul className="space-y-2.5 text-neutral-300 text-xs sm:text-sm">
                <li><a href="#community" className="hover:text-white transition-colors">Citizen Forum</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Reddit Community</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Twitter / X</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>

            {/* Column 3 SUPPORT */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">SUPPORT</h4>
              <ul className="space-y-2.5 text-neutral-300 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>

            {/* Column 4 COMPANY */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">COMPANY</h4>
              <ul className="space-y-2.5 text-neutral-300 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press &amp; Media</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms &amp; Privacy</a></li>
              </ul>
            </div>

            {/* Column 5 DOWNLOAD */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">DOWNLOAD</h4>
              <ul className="space-y-2.5 text-neutral-300 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">CivicLens for iOS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CivicLens for Android</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CivicLens Web App</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
            <div>
              &copy; {new Date().getFullYear()} CivicLens AI Inc. All rights reserved. Designed with Craft.do aesthetic.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-neutral-300">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-300">Terms of Service</a>
              <a href="#" className="hover:text-neutral-300">Cookies Settings</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
