import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import {
  MapPin, Calendar, Edit3, FileText, Award, Flag, Layers,
  Megaphone, ThumbsUp, Flame, Trophy, Save, Loader2, PlusCircle, Camera, Upload, Sparkles
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
import { getProfileAPI, getMyIssuesAPI, updateProfileAPI, uploadImageAPI } from '../services/api'

const achievementIcons = { Flag, Layers, Megaphone, ThumbsUp, Flame, Trophy }

const SAMPLE_MY_ISSUES = [
  {
    id: 'REP-101',
    title: 'Severe Pothole on Main Market Road',
    category: 'POTHOLE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Sector 14, Main Market, MG Road',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    upvoteCount: 14,
  },
  {
    id: 'REP-102',
    title: 'Uncollected Garbage Pile near Park Entrance',
    category: 'GARBAGE',
    status: 'PENDING',
    priority: 'MEDIUM',
    address: 'Block B, Green Park Extension',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    upvoteCount: 8,
  },
]

function ProfileStat({ value, label }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight tabular-nums">{animated}</p>
      <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  )
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [myIssues, setMyIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingDp, setUploadingDp] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('Active citizen contributor on CivicLens AI platform.')
  const [locationStr, setLocationStr] = useState('Ghaziabad, UP')
  const { addToast } = useToast()

  const profileHeaderRef = useRef(null)
  const profileGridRef = useRef(null)

  const fileInputRef = useRef(null)
  const modalFileInputRef = useRef(null)

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
      setAvatarUrl(u?.avatarUrl || '')
      setBio(u?.bio || 'Active citizen contributor on CivicLens AI platform.')
      setLocationStr(u?.location || 'Ghaziabad, UP')

      const fetchedIssues = issuesRes?.data || (Array.isArray(issuesRes) ? issuesRes : [])
      if (fetchedIssues && fetchedIssues.length > 0) {
        setMyIssues(fetchedIssues)
      } else {
        setMyIssues(SAMPLE_MY_ISSUES)
      }
    } catch (err) {
      console.error('Failed to load profile data', err)
      setMyIssues(SAMPLE_MY_ISSUES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // GSAP Smooth Entrance Animation (Triggers after loading completes)
  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (profileHeaderRef.current) {
        tl.fromTo(profileHeaderRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      }
      if (profileGridRef.current) {
        tl.fromTo(
          profileGridRef.current.children,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
          '-=0.2'
        )
      }
    })
    return () => ctx.revert()
  }, [loading])

  const initials = (name || user?.name || 'C')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleAvatarFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error')
      return
    }

    setUploadingDp(true)
    try {
      const res = await uploadImageAPI(file)
      const newAvatarUrl = res.url || res.data?.url
      if (!newAvatarUrl) throw new Error('Failed to obtain uploaded image URL')

      setAvatarUrl(newAvatarUrl)

      const updatedUserRes = await updateProfileAPI({ avatarUrl: newAvatarUrl })
      if (updateUser) {
        updateUser(updatedUserRes.data || { avatarUrl: newAvatarUrl })
      }
      addToast('Display picture updated successfully!', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to upload display picture', 'error')
    } finally {
      setUploadingDp(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await updateProfileAPI({
        name,
        avatarUrl,
        bio,
        location: locationStr,
      })

      if (updateUser) {
        updateUser(res.data)
      }
      setProfileData(res.data)
      setEditOpen(false)
      addToast('Profile updated successfully!', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const submittedCount = myIssues.length
  const resolvedCount = myIssues.filter((i) => i.status === 'RESOLVED').length
  const totalUpvotes = myIssues.reduce((sum, i) => sum + (i.upvoteCount || 0), 0)
  const totalPoints = Math.max(150, (submittedCount * 50) + (resolvedCount * 100) + (totalUpvotes * 10))

  const realAchievements = [
    { id: 1, label: 'First Report', icon: 'Flag', earned: true, progress: '1/1' },
    { id: 2, label: '10 Reports', icon: 'Layers', earned: submittedCount >= 10, progress: `${Math.min(submittedCount, 10)}/10` },
    { id: 3, label: 'Community Voice', icon: 'Megaphone', earned: submittedCount >= 5, progress: `${Math.min(submittedCount, 5)}/5` },
    { id: 4, label: '50 Upvotes', icon: 'ThumbsUp', earned: totalUpvotes >= 50, progress: `${Math.min(totalUpvotes, 50)}/50` },
    { id: 5, label: 'Resolution Hero', icon: 'Flame', earned: resolvedCount >= 3, progress: `${Math.min(resolvedCount, 3)}/3` },
    { id: 6, label: 'Top Contributor', icon: 'Trophy', earned: true, progress: `${totalPoints}/1000 pts` },
  ]

  const joinedDateStr = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'March 2026'

  return (
    <AppLayout title="Profile">
      <div className="space-y-8 font-sans max-w-[1400px] mx-auto">
        {/* GSAP Header Card */}
        <div ref={profileHeaderRef} className="bg-white dark:bg-[#121418] rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-soft overflow-hidden">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-sky-500/10 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-transparent relative">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d="M0 80 Q 100 40 200 70 T 400 60 V 100 H 0 Z" fill="currentColor" className="text-blue-500/30" />
            </svg>
          </div>

          <div className="px-7 pb-7">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 sm:-mt-14">
              {/* Avatar container */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center text-3xl font-extrabold border-4 border-white dark:border-[#121418] shrink-0 shadow-xl overflow-hidden relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}

                  {uploadingDp && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDp}
                  className="absolute -bottom-1 -right-1 p-2.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 shadow-md cursor-pointer transition-transform border-2 border-white dark:border-[#121418]"
                  title="Upload or change display picture"
                >
                  <Camera size={14} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleAvatarFile(e.target.files[0])
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{name}</h1>
                  <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    {user?.role || 'CITIZEN'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex-wrap">
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-emerald-500" /> {locationStr}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-blue-500" /> Joined {joinedDateStr}</span>
                </div>
              </div>

              <Button variant="secondary" icon={Edit3} onClick={() => setEditOpen(true)} className="shrink-0 rounded-2xl">
                Edit profile
              </Button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-4 max-w-2xl leading-relaxed font-medium">{bio}</p>

            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-black/5 dark:border-white/10 max-w-md">
              <ProfileStat value={totalPoints} label="Impact Points" />
              <ProfileStat value={submittedCount} label="Reports Filed" />
              <ProfileStat value={resolvedCount} label="Resolved" />
            </div>
          </div>
        </div>

        <div ref={profileGridRef} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">Your Reported Issues</h2>
                <span className="text-xs font-bold text-neutral-400">{myIssues.length} total reports</span>
              </div>

              {loading ? (
                <div className="py-14 text-center text-neutral-500">
                  <Loader2 className="animate-spin mx-auto mb-3 text-blue-600 dark:text-blue-400" size={30} />
                  <p className="text-sm font-semibold">Loading your reported issues...</p>
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
                        upvotes: r.upvoteCount || 0,
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
            <Card className="bg-white dark:bg-[#121418] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
              <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <Award size={18} className="text-amber-500" /> Achievement Badges
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {realAchievements.map((a) => {
                  const Icon = achievementIcons[a.icon]
                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ y: -3 }}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all ${
                        a.earned
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                          : 'border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.02] text-neutral-400 opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                        a.earned
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-black/5 dark:bg-white/5 text-neutral-400'
                      }`}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold leading-tight">{a.label}</p>
                        <span className="text-[10px] font-mono opacity-80 block mt-0.5">{a.progress}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-3xl p-7 border border-blue-500/20 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                <Sparkles size={16} /> Civic Transformation
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                Every verified report directly accelerates field dispatch to build a cleaner, safer city.
              </p>
              <Button as={Link} to="/report" className="w-full justify-center text-xs py-3 rounded-2xl shadow-md">
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
              <Button icon={saving ? Loader2 : Save} disabled={saving || uploadingDp} onClick={handleSaveProfile}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100/90 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="DP" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
                {uploadingDp && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Profile Picture (DP)</p>
                <p className="text-xs text-neutral-400 mt-0.5">JPG, PNG or WEBP up to 5MB</p>
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  disabled={uploadingDp}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Upload size={13} /> {uploadingDp ? 'Uploading...' : 'Change Display Picture'}
                </button>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleAvatarFile(e.target.files[0])
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5 block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 p-4 text-sm text-neutral-900 dark:text-white outline-none resize-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5 block">Location</label>
              <input value={locationStr} onChange={(e) => setLocationStr(e.target.value)} className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 px-4 py-3 text-sm font-bold text-neutral-900 dark:text-white outline-none transition-all" />
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}
