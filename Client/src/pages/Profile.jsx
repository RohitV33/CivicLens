import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Edit3, FileText, CheckCircle2, Award, Flag, Layers,
  Megaphone, ThumbsUp, Flame, Trophy, Save, Loader2, PlusCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import ReportCard from '../components/ReportCard'
import { EmptyState } from '../components/EmptyState'
import { achievements } from '../data/mockData'
import { useCountUp } from '../hooks/useCountUp'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { getProfileAPI, getMyIssuesAPI } from '../services/api'

const achievementIcons = { Flag, Layers, Megaphone, ThumbsUp, Flame, Trophy }

function ProfileStat({ value, label }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl font-display font-bold text-text-primary dark:text-text-dark tabular-nums">{animated}</p>
      <p className="text-xs text-text-secondary dark:text-text-dark/60 mt-1">{label}</p>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [myIssues, setMyIssues] = useState([])
  const [loading, setLoading] = useState(true)

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('Active citizen contributor on CivicLens platform.')
  const [locationStr, setLocationStr] = useState('Ghaziabad, UP')
  const { addToast } = useToast()

  const loadData = async () => {
    setLoading(true)
    try {
      const [profileRes, issuesRes] = await Promise.all([
        getProfileAPI().catch(() => ({ data: user })),
        getMyIssuesAPI().catch(() => ({ data: [] })),
      ])

      const u = profileRes.data || user
      setProfileData(u)
      setName(u?.name || 'Citizen')
      setMyIssues(issuesRes.data || [])
    } catch (err) {
      console.error('Failed to load profile data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const initials = (name || user?.name || 'C')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const submittedCount = myIssues.length
  const resolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const totalPoints = (submittedCount * 50) + (resolvedCount * 100)

  const joinedDateStr = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'March 2026'

  const save = () => {
    setEditOpen(false)
    addToast('Profile information saved locally.', 'success')
  }

  return (
    <AppLayout title="Profile">
      <Card className="!p-0 overflow-hidden mb-6">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-primary/15 to-primary/5 dark:from-primary/20 dark:to-primary/5 relative">
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0 80 Q 100 40 200 70 T 400 60 V 100 H 0 Z" fill="currentColor" className="text-primary/20" />
          </svg>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center text-2xl font-display font-bold border-4 border-surface dark:border-card-dark shrink-0 shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-text-primary dark:text-text-dark">{name}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {user?.role || 'CITIZEN'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary dark:text-text-dark/60 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={12} /> {locationStr}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {joinedDateStr}</span>
              </div>
            </div>
            <Button variant="secondary" icon={Edit3} onClick={() => setEditOpen(true)} className="shrink-0">
              Edit profile
            </Button>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-dark/70 mt-4 max-w-xl leading-relaxed">{bio}</p>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border dark:border-border-dark max-w-sm">
            <ProfileStat value={totalPoints} label="Impact points" />
            <ProfileStat value={submittedCount} label="Reports filed" />
            <ProfileStat value={resolvedCount} label="Reports resolved" />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-text-dark">Your Reported Issues</h2>
              <span className="text-xs font-semibold text-neutral-400">{myIssues.length} total reports</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-neutral-500">
                <Loader2 className="animate-spin mx-auto mb-2" size={28} />
                <p className="text-sm font-medium">Loading your live reported issues...</p>
              </div>
            ) : myIssues.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {myIssues.map((r, i) => (
                  <ReportCard
                    key={r.id}
                    report={{
                      id: r.id,
                      title: r.title,
                      category: r.category,
                      status: r.status,
                      severity: r.priority,
                      location: r.address || r.location || 'Location specified',
                      reportedAt: r.createdAt,
                      image: r.imageUrl || r.category,
                      upvotes: 12,
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
                  title="No reports submitted yet"
                  description="You haven't filed any civic complaints yet. Submit your first report to help clean up your neighborhood!"
                  action={<Button as={Link} to="/report" icon={PlusCircle}>Report An Issue</Button>}
                />
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-5 flex items-center gap-2">
              <Award size={16} className="text-amber-500" /> Achievement Badges
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a) => {
                const Icon = achievementIcons[a.icon]
                return (
                  <motion.div
                    key={a.id}
                    whileHover={{ y: -2 }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center ${
                      a.earned
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-border dark:border-border-dark opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.earned ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-black/5 dark:bg-white/5 text-text-secondary'}`}>
                      <Icon size={17} />
                    </div>
                    <p className="text-[11px] font-medium text-text-primary dark:text-text-dark leading-tight">{a.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4">Impact Summary</h2>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4">
              Every verified civic report accelerates municipal field team dispatch, helping build a safer, cleaner community.
            </p>
            <Button as={Link} to="/report" className="w-full justify-center text-xs py-2.5">
              File New Complaint
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button icon={Save} onClick={save}>Save changes</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-text mb-1.5 block">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field font-bold" />
          </div>
          <div>
            <label className="label-text mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="label-text mb-1.5 block">Location</label>
            <input value={locationStr} onChange={(e) => setLocationStr(e.target.value)} className="input-field" />
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
