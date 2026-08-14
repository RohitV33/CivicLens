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
    createdBy: { name: 'Priya Sharma' },
    createdAt: '2 hours ago',
    aiConfidence: 96,
    department: 'PUBLIC WORKS',
    upvoteCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-102',
    title: 'Uncollected Garbage Pile near Park Entrance',
    category: 'GARBAGE',
    status: 'PENDING',
    priority: 'MEDIUM',
    address: 'Block B, Green Park Extension',
    createdBy: { name: 'Vikram Malhotra' },
    createdAt: '5 hours ago',
    aiConfidence: 94,
    department: 'SANITATION',
    upvoteCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'REP-103',
    title: 'Water Leakage Pipeline Burst',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Civil Lines Road, Ward 7',
    createdBy: { name: 'Aarav Sharma' },
    createdAt: '1 day ago',
    aiConfidence: 95,
    department: 'WATER SUPPLY',
    upvoteCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [allIssues, setAllIssues] = useState([])
  const [myIssues, setMyIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const heroRef = useRef(null)
  const categoryCardsRef = useRef(null)
  const analyticsRef = useRef(null)
  const rightWidgetsRef = useRef(null)

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
      } else {
        setAllIssues(SAMPLE_ISSUES)
      }

      setMyIssues(fetchedMy)
    } catch (err) {
      console.error('Failed to load issues', err)
      setAllIssues(SAMPLE_ISSUES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // GSAP Smooth Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (heroRef.current) {
        tl.fromTo(heroRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      }

      if (categoryCardsRef.current) {
        tl.fromTo(
          categoryCardsRef.current.children,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3'
        )
      }

      if (analyticsRef.current) {
        tl.fromTo(
          analyticsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.2'
        )
      }

      if (rightWidgetsRef.current) {
        tl.fromTo(
          rightWidgetsRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        )
      }
    })

    return () => ctx.revert()
  }, [])

  const resolvedCount = allIssues.filter((i) => i.status === 'RESOLVED').length
  const pendingCount = allIssues.filter((i) => i.status === 'PENDING' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS').length
  const myResolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const myImpactPoints = Math.max(150, (myIssues.length * 50) + (myResolvedCount * 100))

  return (
    <AppLayout title={t('navDashboard')}>
      <div className="space-y-7 font-sans max-w-[1400px] mx-auto">
        {/* Main Grid: Left 8 Cols (Hero + Cards + Analytics) | Right 4 Cols (Widgets) */}
        <div className="grid lg:grid-cols-12 gap-7 items-start">
          {/* LEFT 8 COLUMNS */}
          <div className="lg:col-span-8 space-y-7">
            {/* 1. Hero Greeting Banner Card (Matching Top Left Reference Banner) */}
            <div ref={heroRef} className="rounded-[2.4rem] bg-gradient-to-r from-neutral-100 via-blue-50/50 to-indigo-50/40 dark:from-[#14171D] dark:via-[#161B24] dark:to-[#11141B] p-7 sm:p-9 border border-black/5 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-4 max-w-md z-10 text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  Hi {displayName}.
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                  Welcome back to CivicLens AI. We are glad you are here. Inspire field work in your community and track real-time resolution progress.
                </p>
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:scale-105 cursor-pointer"
                >
                  File New Report
                </Link>
              </div>

              {/* Vector Illustration Accent */}
              <div className="w-40 sm:w-48 h-40 sm:h-48 relative shrink-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 blur-2xl absolute" />
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-32 h-32 rounded-3xl bg-white dark:bg-[#1C2029] shadow-xl border border-black/5 dark:border-white/10 flex flex-col items-center justify-center p-4 text-center z-10"
                >
                  <Sparkles size={32} className="text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs font-extrabold text-neutral-900 dark:text-white">AI Vision 2.0</span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">98.4% Accuracy</span>
                </motion.div>
              </div>
            </div>

            {/* 2. Trending Issue Categories Cards (Matching 3 Middle Cards in Reference UI) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Active Issue Categories
                </h3>
                <Link to="/map" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View All Map <ChevronRight size={14} />
                </Link>
              </div>

              <div ref={categoryCardsRef} className="grid sm:grid-cols-3 gap-4">
                {/* Card 1: Pothole & Road Repair (Light Card) */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => navigate('/map')}
                  className="rounded-[2rem] bg-white dark:bg-[#14161C] p-6 border border-black/5 dark:border-white/10 shadow-soft cursor-pointer space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Road Damage</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold">12 Reports</span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Potholes & Cracks</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">High hazard craters detected by Gemini Vision AI</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs text-neutral-400">
                    <div className="flex -space-x-1.5">
                      <img src="https://i.pravatar.cc/60?img=1" className="w-5 h-5 rounded-full border border-white" alt="avatar" />
                      <img src="https://i.pravatar.cc/60?img=2" className="w-5 h-5 rounded-full border border-white" alt="avatar" />
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">1.2k upvotes</span>
                  </div>
                </motion.div>

                {/* Card 2: Waste Management (Dark Highlight Card matching Typography Card in Ref UI) */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => navigate('/map')}
                  className="rounded-[2rem] bg-[#0F1115] text-white p-6 border border-white/10 shadow-xl cursor-pointer space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sanitation</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E2FF38] text-black text-[10px] font-black">YOLOv8 Live</span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-[#E2FF38] transition-colors">Garbage & Waste</h4>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">Uncollected garbage piles auto-sent to municipal team</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400">
                    <div className="flex -space-x-1.5">
                      <img src="https://i.pravatar.cc/60?img=4" className="w-5 h-5 rounded-full border border-black" alt="avatar" />
                      <img src="https://i.pravatar.cc/60?img=5" className="w-5 h-5 rounded-full border border-black" alt="avatar" />
                    </div>
                    <span className="font-bold text-[#E2FF38]">1.8k upvotes</span>
                  </div>
                </motion.div>

                {/* Card 3: Water Leakage (Light Card) */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => navigate('/map')}
                  className="rounded-[2rem] bg-white dark:bg-[#14161C] p-6 border border-black/5 dark:border-white/10 shadow-soft cursor-pointer space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Water Supply</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">5 Reports</span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Water Leakage</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">Pipeline burst and drainage overflow issues</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs text-neutral-400">
                    <div className="flex -space-x-1.5">
                      <img src="https://i.pravatar.cc/60?img=7" className="w-5 h-5 rounded-full border border-white" alt="avatar" />
                      <img src="https://i.pravatar.cc/60?img=8" className="w-5 h-5 rounded-full border border-white" alt="avatar" />
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">972 upvotes</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 3. Analytics Wave Trend Line Card (Matching Analytics Card in Reference UI) */}
            <div ref={analyticsRef} className="rounded-[2.2rem] bg-white dark:bg-[#14161C] p-7 border border-black/5 dark:border-white/10 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">Civic Resolution Analytics</h3>
                  <p className="text-xs text-neutral-500 mt-0.5 font-medium">Weekly city resolution speed & citizen report trend</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Weekly
                </span>
              </div>

              {/* Smooth Spline Wave Curve SVG Chart */}
              <div className="h-32 w-full relative pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 70 C 60 90, 100 20, 170 60 C 240 100, 290 10, 370 70 C 430 110, 470 30, 500 20 L 500 100 L 0 100 Z"
                    fill="url(#waveGradient)"
                  />
                  <path
                    d="M 0 70 C 60 90, 100 20, 170 60 C 240 100, 290 10, 370 70 C 430 110, 470 30, 500 20"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="170" cy="60" r="5" fill="#2563EB" className="animate-pulse" />
                  <circle cx="370" cy="70" r="5" fill="#2563EB" />
                  <circle cx="500" cy="20" r="6" fill="#2563EB" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 pt-2 border-t border-black/5 dark:border-white/5">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Stacked Metric Rows + Top Citizens + CTA Box (Matching Right Column in Reference UI) */}
          <div ref={rightWidgetsRef} className="lg:col-span-4 space-y-6">
            {/* Widget 1: Stacked Row Metrics Card */}
            <div className="rounded-[2.2rem] bg-white dark:bg-[#14161C] p-6 border border-black/5 dark:border-white/10 shadow-soft space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-neutral-100/80 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Reports Posted</span>
                    <span className="text-base font-extrabold text-neutral-900 dark:text-white">80 Total</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-neutral-100/80 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ThumbsUp size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">City Upvotes</span>
                    <span className="text-base font-extrabold text-neutral-900 dark:text-white">1.5K Votes</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-neutral-100/80 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Impact Points</span>
                    <span className="text-base font-extrabold text-neutral-900 dark:text-white">{myImpactPoints} PTS</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Widget 2: Top Active Citizens Avatar Row (Matching Followers Widget in Reference UI) */}
            <div className="rounded-[2.2rem] bg-white dark:bg-[#14161C] p-6 border border-black/5 dark:border-white/10 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">Top Active Citizens</h4>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">View All</span>
              </div>

              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                {[
                  { name: 'Ananya', img: 'https://i.pravatar.cc/100?img=32' },
                  { name: 'Sofia', img: 'https://i.pravatar.cc/100?img=44' },
                  { name: 'Damon', img: 'https://i.pravatar.cc/100?img=68' },
                  { name: 'Rohit (You)', img: 'https://i.pravatar.cc/100?img=12' },
                ].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                    <img src={c.img} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 p-0.5" />
                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-[55px]">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Premium CTA Card (Matching Purchase Now CTA Box in Reference UI) */}
            <div className="rounded-[2.2rem] bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-7 text-center space-y-4 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-[#E2FF38]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-white">Transform Your Ward</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Report potholes, garbage, or water leaks with AI auto-audit for instant field team dispatch.
                </p>
              </div>
              <Link
                to="/report"
                className="w-full block py-3 rounded-2xl bg-[#E2FF38] hover:bg-[#d4f22e] text-black font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Report An Issue Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
