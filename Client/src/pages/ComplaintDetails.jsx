import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Building2, MessageSquare, Send, Sparkles, Calendar, User, Loader2, CheckCircle2, ThumbsUp
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import MapCard from '../components/MapCard'
import Timeline from '../components/Timeline'
import { StatusChip, SeverityChip } from '../components/StatusChip'
import { useToast } from '../context/ToastContext'
import { getIssueByIdAPI, toggleUpvoteIssueAPI, getIssueCommentsAPI, createCommentAPI } from '../services/api'
import { getSLAStatus } from '../utils/sla'
import { useLanguage } from '../context/LanguageContext'


export default function ComplaintDetails() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [postingComment, setPostingComment] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const { addToast } = useToast()

  const loadIssue = async () => {
    setLoading(true)
    try {
      const [res, commentsRes] = await Promise.all([
        getIssueByIdAPI(id),
        getIssueCommentsAPI(id).catch(() => ({ data: [] })),
      ])
      setIssue(res.data)
      setComments(commentsRes.data || [])
      setUpvoteCount(res.data.upvoteCount || 0)
      setHasUpvoted(Boolean(res.data.hasUpvoted))
    } catch (err) {
      addToast(err.message || 'Failed to load issue details', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (upvoting || !issue) return
    setUpvoting(true)
    const nextHasUpvoted = !hasUpvoted
    const nextCount = nextHasUpvoted ? upvoteCount + 1 : Math.max(0, upvoteCount - 1)
    setHasUpvoted(nextHasUpvoted)
    setUpvoteCount(nextCount)

    try {
      const res = await toggleUpvoteIssueAPI(issue.id)
      setUpvoteCount(res.data.upvoteCount)
      setHasUpvoted(res.data.hasUpvoted)
      addToast(res.data.message || (nextHasUpvoted ? 'Upvoted report!' : 'Removed upvote'), 'success')
    } catch (err) {
      setHasUpvoted(hasUpvoted)
      setUpvoteCount(upvoteCount)
      addToast(err.message || 'Please log in to upvote reports', 'error')
    } finally {
      setUpvoting(false)
    }
  }


  useEffect(() => {
    loadIssue()
  }, [id])

  const postComment = () => {
    if (!comment.trim()) return
    setComments((prev) => [
      ...prev,
      { id: Date.now(), name: 'You', text: comment, time: 'Just now' },
    ])
    setComment('')
  }

  if (loading) {
    return (
      <AppLayout title="Complaint Details">
        <div className="py-24 text-center space-y-3">
          <Loader2 size={36} className="animate-spin mx-auto text-neutral-900 dark:text-white" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Loading live complaint audit record...</p>
        </div>
      </AppLayout>
    )
  }

  if (!issue) {
    return (
      <AppLayout title="Complaint Details">
        <div className="py-24 text-center space-y-4">
          <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">Complaint Record Not Found</h2>
          <p className="text-sm text-neutral-500">The issue ID specified does not exist in the database.</p>
          <Button as={Link} to="/dashboard">Back to Dashboard</Button>
        </div>
      </AppLayout>
    )
  }

  // Format histories array into timeline items
  const timelineItems = issue.histories?.map((h) => ({
    id: h.id,
    title: `Status: ${h.newStatus.replace('_', ' ')}`,
    description: h.comment || `Changed status to ${h.newStatus}`,
    time: new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: h.newStatus,
    by: h.changedBy?.name || 'System',
  })) || []

  return (
    <AppLayout title="Complaint Details">
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link to="/dashboard" className="hover:text-black dark:hover:text-white">Dashboard</Link>
        <span>/</span>
        <span className="font-mono font-bold text-neutral-900 dark:text-white">Issue #{issue.id}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Issue Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="!p-0 overflow-hidden bg-white dark:bg-[#1A1C20] rounded-3xl border border-black/5 dark:border-white/10 shadow-soft">
            {issue.resolvedImageUrl ? (
              <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-black/5 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} /> {t('proofTitle')}
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/20 uppercase">
                    {t('proofVerified')}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
                    <img src={issue.imageUrl} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/75 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 rounded-md backdrop-blur-md">
                      {t('beforeLabel')}
                    </span>
                  </div>
                  <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                    <img src={issue.resolvedImageUrl} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-emerald-600 text-white font-mono font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-sm">
                      {t('afterLabel')}
                    </span>
                  </div>
                </div>
                {issue.resolvedComment && (
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium italic pt-1">
                    Officer Resolution Note: "{issue.resolvedComment}"
                  </p>
                )}
              </div>
            ) : issue.imageUrl ? (
              <div className="relative h-72 sm:h-96">
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {issue.aiConfidence && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute left-4 bottom-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <Sparkles size={14} /> AI Verified {issue.aiConfidence}% Match
                  </motion.div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <StatusChip status={issue.status} />
                  <SeverityChip severity={issue.priority.toLowerCase()} />
                </div>
              </div>
            ) : null}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Issue #{issue.id}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{issue.category}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white font-bold leading-tight">
                {issue.title}
              </h1>

              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                {issue.description}
              </p>

              {issue.aiClassification && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#16171A] border border-black/5 dark:border-white/10 text-xs space-y-1">
                  <span className="font-bold text-neutral-900 dark:text-white block">AI Computer Vision Audit</span>
                  <p className="text-neutral-600 dark:text-neutral-400">{issue.aiClassification}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10 text-xs text-neutral-500 flex-wrap gap-3">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 font-medium"><User size={14} /> Reported by: {issue.createdBy?.name || 'Citizen'}</span>
                  <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <button
                  type="button"
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    hasUpvoted
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <ThumbsUp size={14} className={hasUpvoted ? 'fill-current' : ''} />
                  <span>{hasUpvoted ? t('btnUpvoted') : t('btnEndorseUpvote')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[11px]">
                    {upvoteCount}
                  </span>
                </button>
              </div>

            </div>
          </Card>

          {/* Timeline Audit Trail */}
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-6">{t('auditTimelineTitle')}</h2>
            {timelineItems.length > 0 ? (
              <Timeline items={timelineItems} />
            ) : (
              <p className="text-xs text-neutral-500">No historical status updates recorded yet.</p>
            )}
          </Card>

          {/* Comments Section */}
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <MessageSquare size={20} /> {t('discussionTitle')} ({comments.length})
            </h2>
            <div className="space-y-4 mb-5">
              {comments.length === 0 ? (
                <p className="text-xs text-neutral-500 py-2">No comments posted yet. Be the first to start the discussion!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {c.user?.avatarUrl ? (
                      <img src={c.user.avatarUrl} alt={c.user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {(c.user?.name || c.name || 'C')[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          {c.user?.name || c.name || 'Citizen'}
                          {c.user?.role === 'ADMIN' && (
                            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                              OFFICER
                            </span>
                          )}
                        </p>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(c.createdAt || c.time || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">{c.content || c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postComment()}
                placeholder={t('commentPlaceholder')}
                className="input-field rounded-2xl"
                disabled={postingComment}
              />
              <Button onClick={postComment} disabled={postingComment} icon={Send} className="shrink-0 rounded-2xl shadow-craft">
                {postingComment ? t('btnPosting') : t('btnPost')}
              </Button>
            </div>
          </Card>
        </div>



        {/* RIGHT COLUMN: Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-xl text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" /> Geographic Location
            </h2>
            <MapCard
              markers={[{
                id: issue.id,
                x: 50,
                y: 50,
                status: issue.status.toLowerCase(),
                title: issue.title
              }]}
              height="h-48"
            />
            <p className="text-sm font-bold text-neutral-900 dark:text-white mt-3 leading-snug">{issue.address || issue.location || 'Address specified'}</p>
            {issue.latitude && (
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{issue.latitude.toFixed(4)}° N, {issue.longitude.toFixed(4)}° E</p>
            )}
          </Card>

          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-xl text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" /> Department &amp; SLA Status
            </h2>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-4">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Department</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono uppercase">
                {issue.department ? issue.department.replace('_', ' ') : 'PUBLIC WORKS'}
              </span>
            </div>

            {(() => {
              const sla = getSLAStatus(issue.createdAt, issue.slaHours, issue.status)
              return (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#16171A] border border-black/5 dark:border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-700 dark:text-neutral-300">Resolution SLA</span>
                    <span className={sla.isOverdue ? 'text-rose-600 font-extrabold' : 'text-emerald-600 dark:text-emerald-400'}>
                      {sla.text}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Resolution target: {issue.slaHours || 48}h from report submission.
                  </p>
                </div>
              )
            })()}

            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
              <p className="text-xs font-bold text-neutral-900 dark:text-white">
                Assigned Officer: {issue.assignedTo ? issue.assignedTo.name : 'Unassigned (Pending Dispatch)'}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {issue.assignedTo ? issue.assignedTo.email : 'Municipal Operations Dispatch Queue'}
              </p>
            </div>
          </Card>
        </div>

      </div>
    </AppLayout>
  )
}
