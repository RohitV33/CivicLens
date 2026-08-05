import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Edit3, FileText, CheckCircle2, Award, Flag, Layers,
  Megaphone, ThumbsUp, Flame, Trophy, Save,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import ReportCard from '../components/ReportCard'
import { reports, achievements } from '../data/mockData'
import { useCountUp } from '../hooks/useCountUp'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'  // ← get real user
import { getProfileAPI } from '../services/api'   // ← fetch profile from backend

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
  const [editOpen, setEditOpen] = useState(false)
  const { user } = useAuth()  // get logged-in user from context

  // Use real name from database, fallback to placeholder while loading
  const [name, setName] = useState(user?.name || 'Loading...')
  const [bio, setBio] = useState('Full stack developer & civic tech enthusiast, building a better city one report at a time.')
  const { addToast } = useToast()

  // Get initials for avatar (e.g. "Rohit Sharma" → "RS")
  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const save = () => {
    setEditOpen(false)
    addToast('Profile updated successfully.', 'success')
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
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-display font-bold border-4 border-surface dark:border-card-dark shrink-0">
            {initials}
          </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="font-display text-xl font-bold text-text-primary dark:text-text-dark">{name}</h1>
              <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary dark:text-text-dark/60 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={12} /> Ghaziabad, UP</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined March 2026</span>
              </div>
            </div>
            <Button variant="secondary" icon={Edit3} onClick={() => setEditOpen(true)} className="shrink-0">
              Edit profile
            </Button>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-dark/70 mt-4 max-w-xl leading-relaxed">{bio}</p>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border dark:border-border-dark max-w-sm">
            <ProfileStat value={2870} label="Total points" />
            <ProfileStat value={27} label="Reports submitted" />
            <ProfileStat value={18} label="Reports resolved" />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4">Your reports</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {reports.slice(0, 4).map((r, i) => <ReportCard key={r.id} report={r} index={i} compact />)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-5 flex items-center gap-2">
              <Award size={16} className="text-primary dark:text-primary-dark" /> Achievement badges
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
                        ? 'border-primary/20 bg-primary/5'
                        : 'border-border dark:border-border-dark opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.earned ? 'bg-primary/15 text-primary dark:text-primary-dark' : 'bg-black/5 dark:bg-white/5 text-text-secondary'}`}>
                      <Icon size={17} />
                    </div>
                    <p className="text-[11px] font-medium text-text-primary dark:text-text-dark leading-tight">{a.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4">Contribution breakdown</h2>
            {[
              { label: 'Road damage', value: 45, color: '#2563EB' },
              { label: 'Waste management', value: 28, color: '#22C55E' },
              { label: 'Street lighting', value: 17, color: '#F59E0B' },
              { label: 'Others', value: 10, color: '#94A3B8' },
            ].map((s) => (
              <div key={s.label} className="mb-3.5 last:mb-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary dark:text-text-dark/70">{s.label}</span>
                  <span className="font-medium text-text-primary dark:text-text-dark">{s.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button icon={Save} onClick={save}>Save changes</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-text mb-1.5 block">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-text mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="label-text mb-1.5 block">Location</label>
            <input defaultValue="Ghaziabad, UP" className="input-field" />
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
