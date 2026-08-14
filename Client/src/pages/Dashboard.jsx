import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import {
  FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2, Search, SlidersHorizontal, UserCheck, Flame, Sparkles, Filter, ChevronRight, Eye, ThumbsUp, MapPin, ArrowUpRight, ShieldCheck, Activity, Bell, ChevronDown, User, TrendingUp
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import ReportCard from '../components/ReportCard'
import { useCountUp } from '../hooks/useCountUp'
import { useAuth } from '../context/AuthContext'
import { getAllIssuesAPI, getMyIssuesAPI } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const SAMPLE_ISSUES = [
  {
    id: 'REP-101',
    title: 'Severe Pothole on Main Market Road',
    category: 'POTHOLE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Sector 14, Main Market, MG Road',
    location: 'Sector 14, Main Market, MG Road',
    createdBy: { name: 'Priya Sharma' },
    createdAt: '2 hours ago',
    aiConfidence: 96,
    department: 'Public Works',
    upvoteCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-102',
    title: 'Uncollected Waste Pile near Park Entrance',
    category: 'GARBAGE',
    status: 'PENDING',
    priority: 'MEDIUM',
    address: 'Block B, Green Park Extension',
    location: 'Block B, Green Park Extension',
    createdBy: { name: 'Vikram Malhotra' },
    createdAt: '5 hours ago',
    aiConfidence: 94,
    department: 'Sanitation',
    upvoteCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-103',
    title: 'Broken Streetlight in Residential Lane',
    category: 'STREETLIGHT',
    status: 'RESOLVED',
    priority: 'LOW',
    address: 'Lane 4, Model Town',
    location: 'Lane 4, Model Town',
    createdBy: { name: 'Ananya Gupta' },
    createdAt: '1 day ago',
    aiConfidence: 98,
    department: 'Electrical',
    upvoteCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-104',
    title: 'Water Leakage Pipeline Burst',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Civil Lines Road, Ward 7',
    location: 'Civil Lines Road, Ward 7',
    createdBy: { name: 'Aarav Sharma' },
    createdAt: '3 hours ago',
    aiConfidence: 95,
    department: 'Water Supply',
    upvoteCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
  },
]

function StatBox({ label, value, subtext, tone = 'text-neutral-900 dark:text-white' }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div className="p-6 rounded-3xl bg-neutral-100/70 dark:bg-[#14161C] border border-black/5 dark:border-white/5 space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">{label}</span>
      <div className="flex items-baseline gap-2">
        <p ref={ref} className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${tone}`}>{animated}</p>
        {subtext && <span className="text-xs text-neutral-400 font-semibold">{subtext}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [allIssues, setAllIssues] = useState([])
  const [myIssues, setMyIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const headerRef = useRef(null)
  const statsGridRef = useRef(null)
  const mainContentRef = useRef(null)

  const displayName = user?.name || 'Rohit'

  const loadData = async () => {
    setLoading(true)
    try {
      const [allRes, myRes] = await Promise.all([
        getAllIssuesAPI().catch(() => null),
        getMyIssuesAPI().catch(() => null),
      ])

      const fetchedAll = allRes?.items || allRes?.data || (Array.isArray(allRes) ? allRes : null)
      const fetchedMy = myRes?.data || (Array.isArray(myRes) ? myRes : [])

      if (Array.isArray(fetchedAll)) {
        setAllIssues(fetchedAll)
      } else {
        setAllIssues(SAMPLE_ISSUES)
      }

      setMyIssues(fetchedMy)
    } catch (err) {
      console.error('Failed to load issues', err)
      setAllIssues([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // GSAP Smooth Entrance Timeline (Runs after loading completes so elements exist)
  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (headerRef.current) {
        tl.fromTo(headerRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      }

      if (statsGridRef.current) {
        tl.fromTo(
          statsGridRef.current.children,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 },
          '-=0.2'
        )
      }

      if (mainContentRef.current) {
        tl.fromTo(
          mainContentRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.2'
        )
      }
    })

    return () => ctx.revert()
  }, [loading])

  const resolvedCount = allIssues.filter((i) => i.status === 'RESOLVED').length
  const pendingCount = allIssues.filter((i) => i.status === 'PENDING' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS').length
  const myResolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const myUpvotes = myIssues.reduce((sum, i) => sum + (i.upvoteCount || 0), 0)
  const myImpactPoints = (myIssues.length * 50) + (myResolvedCount * 100) + (myUpvotes * 10)

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
      <div className="space-y-8 font-sans max-w-[1300px] mx-auto text-left">
        {/* Top Header & Greeting */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
              Here is what's happening across your city today.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle size={16} /> File New Complaint
          </Link>
        </div>

        {/* 4 Minimalist Stat Columns */}
        <div ref={statsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Total City Reports" value={allIssues.length} subtext="live" />
          <StatBox label="Resolved Issues" value={resolvedCount} subtext="completed" tone="text-emerald-600 dark:text-emerald-400" />
          <StatBox label="Active Field Units" value={pendingCount} subtext="in progress" tone="text-amber-600 dark:text-amber-400" />
          <StatBox label="Your Civic Points" value={myImpactPoints} subtext="pts" tone="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Main Content Layout */}
        <div ref={mainContentRef} className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Feed & Filters (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Recent Reports</h2>
                <Link to="/map" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View Live Map <ArrowRight size={14} />
                </Link>
              </div>

              {/* Search & Category Pills */}
              <div className="mb-6 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reports by title, location, or department..."
                    className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map((cat) => {
                    const active = selectedCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Issues' : cat.replace('_', ' ')}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Report Cards Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredIssues.map((r, i) => (
                  <ReportCard
                    key={r.id}
                    report={{
                      id: r.id,
                      title: r.title,
                      category: r.category,
                      status: r.status,
                      severity: r.priority,
                      location: r.address || r.location || 'Location specified',
                      reportedBy: r.createdBy?.name || 'Citizen',
                      reportedAt: r.createdAt,
                      confidence: r.aiConfidence || 92,
                      department: r.department || 'Public Works',
                      upvotes: r.upvoteCount || 0,
                      image: r.imageUrl || r.category,
                    }}
                    index={i}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Leaderboard & Impact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Impact Box */}
            <div className="p-7 rounded-3xl bg-neutral-900 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Your Civic Impact</span>
                <Award size={18} className="text-[#E2FF38]" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">{myImpactPoints} <span className="text-xs font-normal text-neutral-400">PTS</span></p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Earned from {myIssues.length} submitted reports & verified resolutions.</p>
              </div>
              <Link
                to="/report"
                className="w-full block text-center py-3 rounded-2xl bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                File New Complaint
              </Link>
            </div>

            {/* City Leaderboard */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#14161C] border border-black/5 dark:border-white/10 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" /> City Leaderboard
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Top Citizens
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { rank: 1, name: 'Ananya Gupta', pts: 350, reports: 4, isMe: false },
                  { rank: 2, name: `${displayName} (You)`, pts: myImpactPoints, reports: Math.max(1, myIssues.length), isMe: true },
                  { rank: 3, name: 'Aarav Sharma', pts: 200, reports: 2, isMe: false },
                ].map((c) => (
                  <div
                    key={c.rank}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      c.isMe
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100 font-bold'
                        : 'bg-neutral-50 dark:bg-white/5 border-black/5 dark:border-white/5 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        c.rank === 1 ? 'bg-amber-400 text-black' : c.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'
                      }`}>
                        #{c.rank}
                      </span>
                      <div>
                        <p className="text-xs font-bold leading-tight">{c.name}</p>
                        <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{c.reports} reports submitted</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.pts} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
