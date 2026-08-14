import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import {
  FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2, Search, SlidersHorizontal, UserCheck, Flame, Sparkles, TrendingUp
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import ReportCard from '../components/ReportCard'
import { EmptyState } from '../components/EmptyState'
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
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
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
    location: 'Block B, Green Park Extension',
    createdBy: { name: 'Vikram Malhotra' },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    aiConfidence: 94,
    department: 'SANITATION',
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
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    aiConfidence: 98,
    department: 'ELECTRICAL',
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
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiConfidence: 95,
    department: 'WATER SUPPLY',
    upvoteCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
  },
]

function StatCard({ icon: Icon, label, value, bgClass = 'bg-white dark:bg-[#1A1C20]', tone = 'text-black dark:text-white', delta }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${bgClass} rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative overflow-hidden group cursor-default`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-transform">
          <Icon size={20} strokeWidth={2.2} />
        </div>
        {delta && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Sparkles size={11} /> {delta}
          </span>
        )}
      </div>
      <p ref={ref} className={`text-4xl font-extrabold tracking-tight tabular-nums ${tone}`}>{animated}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1.5">{label}</p>
    </motion.div>
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

  const headerRef = useRef(null)
  const statsGridRef = useRef(null)
  const contentGridRef = useRef(null)

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

  // GSAP Smooth Dashboard Staggered Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }
        )
      }

      if (statsGridRef.current) {
        tl.fromTo(
          statsGridRef.current.children,
          { y: 25, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.3)' },
          '-=0.3'
        )
      }

      if (contentGridRef.current) {
        tl.fromTo(
          contentGridRef.current.children,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
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

  // Real-time filtered issues
  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      !searchQuery ||
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(issue.id).includes(searchQuery)

    const matchesCategory =
      selectedCategory === 'ALL' || issue.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['ALL', 'POTHOLE', 'GARBAGE', 'STREETLIGHT', 'WATER_LEAKAGE', 'DRAINAGE', 'SEWAGE', 'ROAD_DAMAGE']

  return (
    <AppLayout title={t('navDashboard')}>
      {/* Welcome Banner Section */}
      <div ref={headerRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 dark:text-white tracking-tight">
            {t('dashTitle')}, <span className="italic font-serif text-blue-600 dark:text-blue-400">{displayName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium max-w-xl">
            {t('dashSubtitle')}
          </p>
        </div>
        <Button as={Link} to="/report" icon={PlusCircle} className="shadow-lg hover:shadow-xl transition-all">
          {t('btnNewReport')}
        </Button>
      </div>

      {/* Top GSAP Staggered Metric Cards */}
      <div ref={statsGridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label={t('statTotal')} value={allIssues.length} bgClass="bg-[#E7F1FE] dark:bg-[#0E1E33]" tone="text-blue-900 dark:text-blue-100" delta="Live Feed" />
        <StatCard icon={CheckCircle2} label={t('statResolved')} value={resolvedCount} bgClass="bg-[#E4F8EE] dark:bg-[#0F2D20]" tone="text-emerald-900 dark:text-emerald-100" />
        <StatCard icon={Clock} label={t('statActive')} value={pendingCount} bgClass="bg-[#FFF4DC] dark:bg-[#2D210F]" tone="text-amber-900 dark:text-amber-100" />
        <StatCard icon={Award} label={t('statMine')} value={myIssues.length} bgClass="bg-[#FDE8EA] dark:bg-[#2C1518]" tone="text-rose-900 dark:text-rose-100" />
      </div>

      <div ref={contentGridRef} className="grid lg:grid-cols-3 gap-8">
        {/* Left 2-Cols: Recent Reports & Search/Filter */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white font-bold">{t('recentReports')}</h2>
              <Link to="/map" className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                {t('viewAllMap')} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="mb-6 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports by title, location, or ID..."
                  className="w-full rounded-2xl bg-white dark:bg-[#15171C] border border-black/5 dark:border-white/10 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 shadow-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar relative">
                {categories.map((cat) => {
                  const active = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors z-10 cursor-pointer ${
                        active
                          ? 'text-white dark:text-neutral-900'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/5'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeDashCat"
                          className="absolute inset-0 rounded-xl bg-neutral-900 dark:bg-white -z-10 shadow-sm"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span>{cat.replace('_', ' ')}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {loading ? (
              <div className="py-14 text-center text-neutral-500">
                <Loader2 className="animate-spin mx-auto mb-3 text-blue-600 dark:text-blue-400" size={30} />
                <p className="text-sm font-semibold">Loading live civic reports...</p>
              </div>
            ) : filteredIssues.length > 0 ? (
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
                      department: r.department ? r.department.replace('_', ' ') : 'PUBLIC WORKS',
                      upvotes: r.upvoteCount || 0,
                      image: r.imageUrl || r.category,
                    }}
                    index={i}
                    compact
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <EmptyState
                  icon={FileText}
                  title="No matching reports found"
                  description="No reports match your current search query or filter selection."
                  action={<Button as={Link} to="/report" icon={PlusCircle}>{t('btnReportIssue')}</Button>}
                />
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar: Real User Impact & Community Leaderboard */}
        <div className="space-y-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent rounded-3xl p-7 border border-emerald-500/25 shadow-soft space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">Your Civic Impact</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">{myImpactPoints} <span className="text-xs font-bold text-neutral-400">PTS</span></p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-medium leading-relaxed">Earned from {myIssues.length} submitted reports & {myResolvedCount} verified resolutions.</p>
            </div>
            <Button as={Link} to="/report" className="w-full justify-center shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
              {t('btnFileComplaint')}
            </Button>
          </motion.div>

          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                <Trophy size={19} className="text-amber-500" /> City Leaderboard
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">Top Citizens</span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { rank: 1, name: 'Ananya Gupta', pts: 350, reports: 4, isMe: false },
                { rank: 2, name: displayName, pts: myImpactPoints, reports: Math.max(1, myIssues.length), isMe: true },
                { rank: 3, name: 'Aarav Sharma', pts: 200, reports: 2, isMe: false },
              ].map((c) => (
                <div
                  key={c.rank}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    c.isMe
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100 font-bold'
                      : 'bg-neutral-50 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center ${
                      c.rank === 1 ? 'bg-amber-400 text-black shadow-sm' : c.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'
                    }`}>
                      #{c.rank}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{c.name} {c.isMe && '(You)'}</p>
                      <p className="text-[10px] text-neutral-400 font-normal mt-0.5">{c.reports} reports submitted</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.pts} pts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
