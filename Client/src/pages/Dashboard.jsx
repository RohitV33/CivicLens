import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2, Search, SlidersHorizontal, UserCheck, Flame
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

function StatCard({ icon: Icon, label, value, bgClass = 'bg-white dark:bg-[#1A1C20]', tone = 'text-black dark:text-white', delta }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <Card hover className={`${bgClass} rounded-3xl border border-black/5 dark:border-white/10 shadow-soft`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
          <Icon size={18} strokeWidth={2} />
        </div>
        {delta && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">{delta}</span>}
      </div>
      <p ref={ref} className={`text-3xl font-bold tracking-tight tabular-nums ${tone}`}>{animated}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">{label}</p>
    </Card>
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

  const displayName = user?.name || 'Citizen'

  const loadData = async () => {
    setLoading(true)
    try {
      const [allRes, myRes] = await Promise.all([
        getAllIssuesAPI(),
        getMyIssuesAPI().catch(() => ({ data: [] })),
      ])
      setAllIssues(allRes.items || allRes.data || [])
      setMyIssues(myRes.data || [])
    } catch (err) {
      console.error('Failed to load issues', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resolvedCount = allIssues.filter((i) => i.status === 'RESOLVED').length
  const pendingCount = allIssues.filter((i) => i.status === 'PENDING' || i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS').length
  const myResolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const myImpactPoints = (myIssues.length * 50) + (myResolvedCount * 100)

  // Real-time filtered issues
  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      !searchQuery ||
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(issue.id).includes(searchQuery)

    const matchesCategory =
      selectedCategory === 'ALL' || issue.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['ALL', 'POTHOLE', 'GARBAGE', 'STREETLIGHT', 'WATER_LEAKAGE', 'DRAINAGE', 'SEWAGE', 'ROAD_DAMAGE']

  return (
    <AppLayout title={t('navDashboard')}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            {t('dashTitle')}, <span className="font-serif-italic">{displayName}</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal">
            {t('dashSubtitle')}
          </p>
        </div>
        <Button as={Link} to="/report" icon={PlusCircle} className="shadow-craft">
          {t('btnNewReport')}
        </Button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label={t('statTotal')} value={allIssues.length} bgClass="bg-[#D9E8FC] dark:bg-[#162538]" tone="text-blue-900 dark:text-blue-100" delta="Live" />
        <StatCard icon={CheckCircle2} label={t('statResolved')} value={resolvedCount} bgClass="bg-[#C2ECD8] dark:bg-[#163428]" tone="text-emerald-900 dark:text-emerald-100" />
        <StatCard icon={Clock} label={t('statActive')} value={pendingCount} bgClass="bg-[#FDE8B3] dark:bg-[#2E2416]" tone="text-amber-900 dark:text-amber-100" />
        <StatCard icon={Award} label={t('statMine')} value={myIssues.length} bgClass="bg-[#FCE5E6] dark:bg-[#2B1B1E]" tone="text-rose-900 dark:text-rose-100" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2-Cols: Recent Reports & Search/Filter */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white font-bold">{t('recentReports')}</h2>
              <Link to="/map" className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1 hover:gap-2 transition-all">
                {t('viewAllMap')} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="mb-6 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports by title, location, or ID..."
                  className="input-field pl-10 rounded-2xl text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-neutral-500">
                <Loader2 className="animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" size={28} />
                <p className="text-sm font-medium">Loading live civic reports...</p>
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
          <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl p-7 border border-emerald-500/20 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Your Civic Impact</span>
              <Award size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-neutral-900 dark:text-white">{myImpactPoints} <span className="text-xs font-normal text-neutral-500">PTS</span></p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Earned from {myIssues.length} submitted reports & {myResolvedCount} verified resolutions.</p>
            </div>
            <Button as={Link} to="/report" className="w-full justify-center shadow-craft">
              {t('btnFileComplaint')}
            </Button>
          </Card>

          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" /> City Leaderboard
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">Top Citizens</span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { rank: 1, name: 'Ananya Gupta', pts: 350, reports: 4, isMe: false },
                { rank: 2, name: displayName, pts: Math.max(150, myImpactPoints), reports: Math.max(1, myIssues.length), isMe: true },
                { rank: 3, name: 'Rohit Verma', pts: 200, reports: 2, isMe: false },
              ].map((c) => (
                <div
                  key={c.rank}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    c.isMe
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100 font-bold'
                      : 'bg-neutral-50 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      c.rank === 1 ? 'bg-amber-400 text-black' : c.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'
                    }`}>
                      #{c.rank}
                    </span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{c.name} {c.isMe && '(You)'}</p>
                      <p className="text-[10px] text-neutral-400 font-normal">{c.reports} reports submitted</p>
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

