import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Loader2 } from 'lucide-react'
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

  const firstName = user?.name?.split(' ')[0] || 'there'

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

  return (
    <AppLayout title={t('navDashboard')}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            {t('dashTitle')}, <span className="font-serif-italic">{firstName}</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal">
            {t('dashSubtitle')}
          </p>
        </div>
        <Button as={Link} to="/report" icon={PlusCircle} className="shadow-craft">
          {t('btnNewReport')}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label={t('statTotal')} value={allIssues.length || 3} bgClass="bg-[#D9E8FC] dark:bg-[#162538]" tone="text-blue-900 dark:text-blue-100" delta="Live" />
        <StatCard icon={CheckCircle2} label={t('statResolved')} value={resolvedCount || 1} bgClass="bg-[#C2ECD8] dark:bg-[#163428]" tone="text-emerald-900 dark:text-emerald-100" />
        <StatCard icon={Clock} label={t('statActive')} value={pendingCount || 2} bgClass="bg-[#FDE8B3] dark:bg-[#2E2416]" tone="text-amber-900 dark:text-amber-100" />
        <StatCard icon={Award} label={t('statMine')} value={myIssues.length} bgClass="bg-[#FCE5E6] dark:bg-[#2B1B1E]" tone="text-rose-900 dark:text-rose-100" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">{t('recentReports')}</h2>
              <Link to="/map" className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1 hover:gap-2 transition-all">
                {t('viewAllMap')} <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-neutral-500">
                <Loader2 className="animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" size={28} />
                <p className="text-sm font-medium">Loading live civic reports...</p>
              </div>
            ) : allIssues.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {allIssues.slice(0, 4).map((r, i) => (
                  <ReportCard
                    key={r.id}
                    report={{
                      id: r.id,
                      title: r.title,
                      category: r.category,
                      status: r.status.toLowerCase(),
                      severity: r.priority.toLowerCase(),
                      location: r.address || r.location || 'Location specified',
                      reportedBy: r.createdBy?.name || 'Citizen',
                      reportedAt: r.createdAt,
                      confidence: r.aiConfidence || 92,
                      department: 'Public Works Dept.',
                      upvotes: 12,
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
                  title={t('noReportsYet')}
                  description={t('noReportsDesc')}
                  action={<Button as={Link} to="/report" icon={PlusCircle}>{t('btnReportIssue')}</Button>}
                />
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#FAF8F5] dark:bg-[#151619] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={20} className="text-amber-500" />
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white font-bold">{t('communityImpactTitle')}</h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              {t('communityImpactDesc')}
            </p>
            <Button as={Link} to="/report" className="w-full justify-center shadow-craft">
              {t('btnFileComplaint')}
            </Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

