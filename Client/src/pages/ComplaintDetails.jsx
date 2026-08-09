import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Building2, MessageSquare, Send, Sparkles, Calendar, User, Loader2, CheckCircle2
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import MapCard from '../components/MapCard'
import Timeline from '../components/Timeline'
import { StatusChip, SeverityChip } from '../components/StatusChip'
import { useToast } from '../context/ToastContext'
import { getIssueByIdAPI } from '../services/api'

export default function ComplaintDetails() {
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const { addToast } = useToast()

  const loadIssue = async () => {
    setLoading(true)
    try {
      const res = await getIssueByIdAPI(id)
      setIssue(res.data)
    } catch (err) {
      addToast(err.message || 'Failed to load issue details', 'error')
    } finally {
      setLoading(false)
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
            {issue.imageUrl && (
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
            )}

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

              <div className="flex items-center gap-6 pt-4 border-t border-black/5 dark:border-white/10 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5 font-medium"><User size={14} /> Reported by: {issue.createdBy?.name || 'Citizen'}</span>
                <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> {new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </Card>

          {/* Timeline Audit Trail */}
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-6">Resolution Audit Timeline</h2>
            {timelineItems.length > 0 ? (
              <Timeline items={timelineItems} />
            ) : (
              <p className="text-xs text-neutral-500">No historical status updates recorded yet.</p>
            )}
          </Card>

          {/* Comments Section */}
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
              <MessageSquare size={20} /> Discussion & Field Notes ({comments.length})
            </h2>
            <div className="space-y-4 mb-5">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">{c.name}</p>
                      <span className="text-xs text-neutral-400">{c.time}</span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postComment()}
                placeholder="Add a comment or inquiry for municipal officers…"
                className="input-field rounded-2xl"
              />
              <Button onClick={postComment} icon={Send} className="shrink-0 rounded-2xl shadow-craft">
                Post
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
              <Building2 size={18} className="text-blue-600" /> Assigned Officer
            </h2>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {issue.assignedTo ? issue.assignedTo.name : 'Unassigned (Pending Dispatch)'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {issue.assignedTo ? issue.assignedTo.email : 'Public Works Department Dispatch Queue'}
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
