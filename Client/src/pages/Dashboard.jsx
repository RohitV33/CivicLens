import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle2, Clock, Award, PlusCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import ReportCard from '../components/ReportCard'
import { EmptyState } from '../components/EmptyState'
import { reports, leaderboard, activity } from '../data/mockData'
import { useCountUp } from '../hooks/useCountUp'
import { useAuth } from '../context/AuthContext'  // ← get real user data

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

function DonutChart() {
  const data = [
    { label: 'Resolved', value: 62, color: '#10B981' },
    { label: 'In review', value: 22, color: '#3B82F6' },
    { label: 'Pending', value: 11, color: '#F59E0B' },
    { label: 'Rejected', value: 5, color: '#EF4444' },
  ]
  let cumulative = 0
  const r = 60
  const c = 2 * Math.PI * r

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <svg width="150" height="150" viewBox="0 0 160 160" className="-rotate-90 shrink-0">
        <circle cx="80" cy="80" r={r} fill="none" stroke="currentColor" className="text-black/[0.04] dark:text-white/[0.06]" strokeWidth="18" />
        {data.map((d, i) => {
          const dash = (d.value / 100) * c
          const offset = (cumulative / 100) * c
          cumulative += d.value
          return (
            <motion.circle
              key={d.label}
              cx="80" cy="80" r={r} fill="none"
              stroke={d.color}
              strokeWidth="18"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
          )
        })}
      </svg>
      <div className="flex-1 w-full space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-neutral-600 dark:text-neutral-300 font-medium">{d.label}</span>
            </span>
            <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()  // get the logged-in user from context
  // Get just the first name (e.g. "Rohit Sharma" → "Rohit")
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <AppLayout title="Dashboard">
      {/* Craft Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Welcome back, <span className="font-serif-italic">{firstName}</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-normal">
            Your space for civic reports, resolution progress, and city transformation.
          </p>
        </div>
        <Button as={Link} to="/report" icon={PlusCircle} className="shadow-craft">
          New Report
        </Button>
      </div>

      {/* Stats row with Craft Pastel background highlights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Reports Submitted" value={27} bgClass="bg-[#D9E8FC] dark:bg-[#162538]" tone="text-blue-900 dark:text-blue-100" delta="+3 this week" />
        <StatCard icon={CheckCircle2} label="Resolved Issues" value={18} bgClass="bg-[#C2ECD8] dark:bg-[#163428]" tone="text-emerald-900 dark:text-emerald-100" />
        <StatCard icon={Clock} label="In Progress" value={7} bgClass="bg-[#FDE8B3] dark:bg-[#2E2416]" tone="text-amber-900 dark:text-amber-100" />
        <StatCard icon={Award} label="Contributor Points" value={2870} bgClass="bg-[#FCE5E6] dark:bg-[#2B1B1E]" tone="text-rose-900 dark:text-rose-100" delta="+120 pts" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">Recent Reports</h2>
              <Link to="/map" className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1 hover:gap-2 transition-all">
                View All Map <ArrowRight size={14} />
              </Link>
            </div>
            {reports.length ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {reports.slice(0, 4).map((r, i) => <ReportCard key={r.id} report={r} index={i} compact />)}
              </div>
            ) : (
              <Card className="text-center py-12">
                <EmptyState
                  icon={FileText}
                  title="No reports yet"
                  description="Your submitted civic reports will show up here once you file your first one."
                  action={<Button as={Link} to="/report" icon={PlusCircle}>Report an issue</Button>}
                />
              </Card>
            )}
          </div>

          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-6">Activity Feed</h2>
            <div className="space-y-4">
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-4 pb-4 border-b border-black/5 dark:border-white/10 last:border-0 last:pb-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">{a.text}</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-6">Status Breakdown</h2>
            <DonutChart />
          </Card>

          <Card className="bg-[#FAF8F5] dark:bg-[#151619] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={20} className="text-amber-500" />
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">Community Leaders</h2>
            </div>
            <div className="space-y-3">
              {leaderboard.map((l) => (
                <div key={l.rank} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E2024] border border-black/5 dark:border-white/10">
                  <span className="w-6 text-sm font-extrabold text-neutral-400 tabular-nums">{l.rank}</span>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{ background: l.avatarColor }}
                  >
                    {l.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{l.name}</p>
                    <p className="text-xs text-neutral-500">{l.reports} reports filed</p>
                  </div>
                  <span className="text-xs font-extrabold text-black dark:text-white px-2.5 py-1 bg-neutral-100 dark:bg-white/10 rounded-full tabular-nums">{l.points} pts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
