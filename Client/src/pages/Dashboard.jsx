import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import {
  FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2, Search, SlidersHorizontal, UserCheck, Flame, Sparkles, Filter, ChevronRight, Eye, ThumbsUp, MapPin, ArrowUpRight
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
    amount: 'High Priority',
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
    amount: 'Medium Priority',
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
    amount: 'Critical Dispatch',
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
    amount: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
  },
]

function StatMetric({ label, value, subtext, avatars, bars }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-semibold text-neutral-400 font-sans">$</span>
        <p ref={ref} className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight tabular-nums">{animated}</p>
        <span className="text-xs text-neutral-400 font-medium ml-1">{subtext}</span>
      </div>

      {bars && (
        <div className="flex items-center gap-6 pt-2 text-[10px] font-semibold text-neutral-400">
          <div>
            <span>Sep</span>
            <div className="w-10 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
          <div>
            <span>Oct</span>
            <div className="w-6 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
          </div>
          <div>
            <span>Nov</span>
            <div className="w-10 h-1.5 bg-[#E2FF38] rounded-full mt-1" />
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
            <img key={i} src={src} alt="user" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#121418] object-cover -ml-1.5 first:ml-0" />
          ))}
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

  const displayName = user?.name || 'Citizen'

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

  // GSAP Entrance Timeline
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
        {/* Top Salesforce / Stripe Style Header Bar */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Civic Dashboard
              </h1>
              <span className="px-3 py-1 rounded-full bg-[#E2FF38] text-black text-xs font-black uppercase tracking-wider">
                Live AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-semibold">
              Welcome back, <span className="text-neutral-900 dark:text-white font-bold">{displayName}</span>. Real-time civic AI dispatch platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E2FF38] hover:bg-[#d4f22e] text-black font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle size={16} /> File New Complaint
            </Link>
          </div>
        </div>

        {/* Top 4 Salesforce-Style Metric Columns */}
        <div ref={statsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-7 rounded-[2.2rem] bg-white dark:bg-[#121418] border border-black/5 dark:border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
          <StatMetric label="Total City Reports" value={allIssues.length} subtext="issues" bars />
          <StatMetric label="Resolved Progress" value={resolvedCount} subtext="resolved" avatars />
          <StatMetric label="Active Work Units" value={pendingCount} subtext="units" />
          <StatMetric label="My Impact Points" value={myImpactPoints} subtext="pts" />
        </div>

        {/* ── Main Dark/Light Floating Sub-Panel ── */}
        <div ref={mainPanelRef} className="rounded-[2.6rem] bg-[#16181D] text-white p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Panel Category Pills Navbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Active Civic Reports</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-xs font-mono">
                {filteredIssues.length}
              </span>
            </div>

            {/* Neon Yellow Pill Tab Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const active = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E2FF38] text-black shadow-md scale-105'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2-Column Split: Issue List on Left, Interactive Detail Card on Right */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Issue Selection List (5 cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
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

            {/* Right Detailed Issue Hero Card (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selectedIssue && (
                  <motion.div
                    key={selectedIssue.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-[2.2rem] bg-gradient-to-br from-[#20252E] via-[#1A1D24] to-[#14161B] p-6 sm:p-7 border border-white/10 space-y-6 shadow-xl relative overflow-hidden"
                  >
                    {/* Top Issue Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#E2FF38] uppercase tracking-wider block">
                          Report details #{selectedIssue.id}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-white mt-1 leading-snug">
                          {selectedIssue.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase">
                          {selectedIssue.category}
                        </span>
                      </div>
                    </div>

                    {/* Image & Key Attributes Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-44 rounded-2xl overflow-hidden relative border border-white/10 group">
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Assigned Department</span>
                          <span className="text-sm font-extrabold text-white">{selectedIssue.department || 'PUBLIC WORKS'}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">AI Vision Confidence</span>
                          <span className="text-sm font-extrabold text-[#E2FF38]">{selectedIssue.aiConfidence || 95}% Verified</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Citizen Upvotes</span>
                          <span className="text-sm font-extrabold text-white flex items-center gap-1">
                            <ThumbsUp size={14} className="text-[#E2FF38]" /> {selectedIssue.upvoteCount || 14} Community Upvotes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-neutral-400 block">Reported By</span>
                        <span className="text-xs font-bold text-white">{selectedIssue.createdBy?.name || 'Citizen'}</span>
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
