import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import {
  FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2, Search, SlidersHorizontal, UserCheck, Flame, Sparkles, Filter, ChevronRight, Eye, ThumbsUp, MapPin, ArrowUpRight, ShieldCheck, Activity
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import { useCountUp } from '../hooks/useCountUp'
import { useAuth } from '../context/AuthContext'
import { getAllIssuesAPI, getMyIssuesAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const SAMPLE_ISSUES = [
  {
    id: 'REP-404-002',
    title: 'Severe Pothole on Main Market Road',
    category: 'POTHOLE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Sector 14, Main Market, MG Road',
    location: 'Sector 14, Main Market, MG Road',
    createdBy: { name: 'Priya Sharma' },
    createdAt: 'In 2 days',
    aiConfidence: 96,
    department: 'PUBLIC WORKS',
    upvoteCount: 14,
    reporterRole: 'Resident Citizen',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-426-001',
    title: 'Uncollected Garbage Pile near Park Entrance',
    category: 'GARBAGE',
    status: 'PENDING',
    priority: 'MEDIUM',
    address: 'Block B, Green Park Extension',
    location: 'Block B, Green Park Extension',
    createdBy: { name: 'Vikram Malhotra' },
    createdAt: 'In 4 days',
    aiConfidence: 94,
    department: 'SANITATION',
    upvoteCount: 8,
    reporterRole: 'Green Club Volunteer',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-427-012',
    title: 'Water Leakage Pipeline Burst',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Civil Lines Road, Ward 7',
    location: 'Civil Lines Road, Ward 7',
    createdBy: { name: 'Aarav Sharma' },
    createdAt: 'In 5 days',
    aiConfidence: 95,
    department: 'WATER SUPPLY',
    upvoteCount: 19,
    reporterRole: 'Ward Representative',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-417-020',
    title: 'Broken Streetlight in Residential Lane',
    category: 'STREETLIGHT',
    status: 'RESOLVED',
    priority: 'LOW',
    address: 'Lane 4, Model Town',
    location: 'Lane 4, Model Town',
    createdBy: { name: 'Ananya Gupta' },
    createdAt: 'Resolved',
    aiConfidence: 98,
    department: 'ELECTRICAL',
    upvoteCount: 22,
    reporterRole: 'Community Leader',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
  },
]

function StatMetric({ label, value, subtext, avatars, bars, highlight }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div className="space-y-3 relative group">
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{label}</p>
      <div className="flex items-baseline gap-2">
        <p ref={ref} className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight tabular-nums">{animated}</p>
        {subtext && <span className="text-xs text-neutral-400 font-semibold">{subtext}</span>}
      </div>

      {bars && (
        <div className="flex items-center gap-5 pt-2 text-[10px] font-bold text-neutral-400">
          <div>
            <span>Sep</span>
            <div className="w-9 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
          <div>
            <span>Oct</span>
            <div className="w-5 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
          <div>
            <span>Nov</span>
            <div className="w-9 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
          <div>
            <span>Dec</span>
            <div className="w-3 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
        </div>
      )}

      {avatars && (
        <div className="flex items-center gap-1 pt-1">
          {['https://i.pravatar.cc/80?img=12', 'https://i.pravatar.cc/80?img=33', 'https://i.pravatar.cc/80?img=47', 'https://i.pravatar.cc/80?img=68'].map((src, i) => (
            <img key={i} src={src} alt="user" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#121418] object-cover -ml-1.5 first:ml-0 shadow-xs" />
          ))}
          <span className="text-[10px] font-bold text-neutral-400 ml-1">+12 officers</span>
        </div>
      )}

      {highlight && (
        <div className="pt-2">
          <span className="px-3 py-1 rounded-full bg-[#E2FF38] text-black text-[11px] font-extrabold shadow-sm">
            Top 5% Citizen Rank
          </span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [allIssues, setAllIssues] = useState([])
  const [myIssues, setMyIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedIssue, setSelectedIssue] = useState(SAMPLE_ISSUES[0])

  const headerRef = useRef(null)
  const statsGridRef = useRef(null)
  const mainPanelRef = useRef(null)

  const displayName = user?.name || 'Rohit Verma'

  const loadData = async () => {
    setLoading(true)
    try {
      const [allRes, myRes] = await Promise.all([
        getAllIssuesAPI().catch(() => null),
        getMyIssuesAPI().catch(() => null),
      ])

      const fetchedAll = allRes?.items || allRes?.data || (Array.isArray(allRes) ? allRes : null)
      const fetchedMy = myRes?.data || (Array.isArray(myRes) ? myRes : [])

      if (fetchedAll && fetchedAll.length > 0) {
        setAllIssues(fetchedAll)
        setSelectedIssue(fetchedAll[0])
      } else {
        setAllIssues(SAMPLE_ISSUES)
        setSelectedIssue(SAMPLE_ISSUES[0])
      }

      setMyIssues(fetchedMy)
    } catch (err) {
      console.error('Failed to load issues', err)
      setAllIssues(SAMPLE_ISSUES)
      setSelectedIssue(SAMPLE_ISSUES[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // GSAP Smooth Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (headerRef.current) {
        tl.fromTo(headerRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      }
      if (statsGridRef.current) {
        tl.fromTo(
          statsGridRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        )
      }
      if (mainPanelRef.current) {
        tl.fromTo(
          mainPanelRef.current,
          { y: 25, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          '-=0.2'
        )
      }
    })
    return () => ctx.revert()
  }, [])

  const resolvedCount = allIssues.filter((i) => i.status === 'RESOLVED').length
  const pendingCount = allIssues.filter((i) => i.status === 'PENDING' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS').length
  const myResolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const myImpactPoints = Math.max(150, (myIssues.length * 50) + (myResolvedCount * 100))

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      !searchQuery ||
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'ALL' || issue.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['ALL', 'POTHOLE', 'GARBAGE', 'STREETLIGHT', 'WATER_LEAKAGE']

  return (
    <AppLayout title={t('navDashboard')}>
      <div className="space-y-8 font-sans max-w-[1400px] mx-auto">
        {/* ── Top Header Section (Matching Salesforce Reference UI) ── */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Reports
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Real-time civic intelligence & automated field dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E2FF38] hover:bg-[#d4f22e] text-black font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle size={16} /> Create Report
            </Link>
          </div>
        </div>

        {/* ── 4 Stat Metric Columns (Matching Reference UI Metric Row) ── */}
        <div ref={statsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-7 sm:p-8 rounded-[2.5rem] bg-white dark:bg-[#121418] border border-black/5 dark:border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
          <StatMetric label="Total City Reports" value={allIssues.length} subtext="live issues" bars />
          <StatMetric label="Resolved Progress" value={resolvedCount} subtext="completed" avatars />
          <StatMetric label="Active Work Units" value={pendingCount} subtext="in field" />
          <StatMetric label="My Impact Points" value={myImpactPoints} subtext="pts" highlight />
        </div>

        {/* ── Floating Dark Curved Panel (Exact Copy of Reference Panel UI) ── */}
        <div ref={mainPanelRef} className="rounded-[2.6rem] bg-[#16181D] text-white p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Top Notch Tab Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Public Reports</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-xs font-mono font-bold">
                {filteredIssues.length}
              </span>
            </div>

            {/* Neon Yellow Pill Tab Header (Matching Reference Image) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-black/30 p-1.5 rounded-full border border-white/5">
              {categories.map((cat) => {
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E2FF38] text-black shadow-md scale-105'
                        : 'text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Reports' : cat.replace('_', ' ')}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Split-View: Left Issue List + Right Detailed Slate Glass Inspector Card */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Selection List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[540px] overflow-y-auto pr-1 no-scrollbar">
              {filteredIssues.map((issue) => {
                const isSelected = selectedIssue?.id === issue.id
                return (
                  <motion.div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    whileHover={{ x: 2 }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#E2FF38]/15 border-[#E2FF38] text-white shadow-lg'
                        : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={issue.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=120'}
                        alt="thumb"
                        className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-neutral-400 font-bold">#{issue.id}</p>
                        <h4 className="text-sm font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">{issue.title}</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{issue.createdAt || 'Recent'}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        issue.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Right Inspector Card (Matching Blue/Slate Card in Reference UI) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selectedIssue && (
                  <motion.div
                    key={selectedIssue.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-[2.2rem] bg-gradient-to-br from-[#1E2532] via-[#1A202C] to-[#141822] p-6 sm:p-7 border border-white/10 space-y-6 shadow-xl relative overflow-hidden"
                  >
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#E2FF38] uppercase tracking-wider block">
                            Report Details #{selectedIssue.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
                            {selectedIssue.status}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white mt-1 leading-snug">
                          {selectedIssue.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#E2FF38]/20 text-[#E2FF38] text-xs font-extrabold uppercase border border-[#E2FF38]/30">
                          {selectedIssue.category}
                        </span>
                      </div>
                    </div>

                    {/* Image & Detail Cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-48 rounded-2xl overflow-hidden relative border border-white/10 group">
                        <img
                          src={selectedIssue.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'}
                          alt={selectedIssue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[11px] font-semibold text-white/90 flex items-center gap-1">
                            <MapPin size={12} className="text-[#E2FF38]" /> {selectedIssue.address || selectedIssue.location}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 flex flex-col justify-between">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Department</span>
                          <span className="text-sm font-extrabold text-white">{selectedIssue.department || 'PUBLIC WORKS'}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">AI Vision Confidence</span>
                          <span className="text-sm font-extrabold text-[#E2FF38] flex items-center gap-1">
                            <ShieldCheck size={14} /> {selectedIssue.aiConfidence || 95}% Verified
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Community Upvotes</span>
                          <span className="text-sm font-extrabold text-white flex items-center gap-1">
                            <ThumbsUp size={14} className="text-[#E2FF38]" /> {selectedIssue.upvoteCount || 14} Citizens
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">Reported By</span>
                        <span className="text-xs font-bold text-white">{selectedIssue.createdBy?.name || 'Citizen'} ({selectedIssue.reporterRole || 'Resident'})</span>
                      </div>

                      <Link
                        to={`/complaint/${selectedIssue.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E2FF38] text-black font-extrabold text-xs hover:bg-[#d4f22e] transition-transform hover:scale-105 cursor-pointer shadow-md"
                      >
                        View Full Details <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
