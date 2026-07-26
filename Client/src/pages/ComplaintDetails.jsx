import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Building2, ThumbsUp, MessageSquare, Send, Sparkles, Calendar, User,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import MapCard from '../components/MapCard'
import Timeline from '../components/Timeline'
import IssueThumb from '../components/IssueThumb'
import { StatusChip, SeverityChip } from '../components/StatusChip'
import ReportCard from '../components/ReportCard'
import { reports, timeline } from '../data/mockData'

const comments = [
  { id: 1, name: 'Ananya Gupta', text: 'Same issue near my house too. Glad this got flagged quickly.', time: '2h ago' },
  { id: 2, name: 'Municipal Officer', text: 'Inspection team has been assigned. Update expected within 48 hours.', time: '5h ago', official: true },
]

export default function ComplaintDetails() {
  const { id } = useParams()
  const report = reports.find((r) => r.id === id) || reports[0]
  const [comment, setComment] = useState('')
  const [localComments, setLocalComments] = useState(comments)
  const nearby = reports.filter((r) => r.id !== report.id).slice(0, 3)

  const postComment = () => {
    if (!comment.trim()) return
    setLocalComments((c) => [...c, { id: Date.now(), name: 'You', text: comment, time: 'Just now' }])
    setComment('')
  }

  return (
    <AppLayout title="Complaint Details">
      <div className="mb-6 flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark/60">
        <Link to="/dashboard" className="hover:text-primary dark:hover:text-primary-dark">Dashboard</Link>
        <span>/</span>
        <span className="font-mono text-text-primary dark:text-text-dark">{report.id}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* image with detection overlay */}
          <Card className="!p-0 overflow-hidden">
            <div className="relative h-72 sm:h-96">
              <IssueThumb type={report.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-20 border-2 border-success rounded-lg"
              >
                <span className="absolute -top-6 left-0 bg-success text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                  {report.confidence}% match
                </span>
              </motion.div>
              <div className="absolute top-4 left-4 flex gap-2">
                <StatusChip status={report.status} />
                <SeverityChip severity={report.severity} />
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-mono text-text-secondary dark:text-text-dark/50 mb-1.5">{report.id} · {report.category}</p>
              <h1 className="font-display text-xl font-bold text-text-primary dark:text-text-dark mb-3">{report.title}</h1>
              <p className="text-sm text-text-secondary dark:text-text-dark/70 leading-relaxed">
                AI classified this as a {report.category.toLowerCase()} issue with {report.confidence}% confidence and {report.severity} severity.
                The report has been automatically routed to the {report.department} for review and resolution.
              </p>

              <div className="flex items-center gap-5 mt-5 pt-5 border-t border-border dark:border-border-dark text-sm text-text-secondary dark:text-text-dark/60">
                <span className="flex items-center gap-1.5"><User size={14} /> {report.reportedBy}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(report.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <button className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-dark"><ThumbsUp size={14} /> {report.upvotes}</button>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-5">Resolution timeline</h2>
            <Timeline items={timeline} />
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-5 flex items-center gap-2">
              <MessageSquare size={16} /> Comments ({localComments.length})
            </h2>
            <div className="space-y-4 mb-5">
              {localComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${c.official ? 'bg-primary text-white' : 'bg-primary/10 text-primary dark:text-primary-dark'}`}>
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-primary dark:text-text-dark">{c.name}</p>
                      {c.official && <span className="text-[10px] font-medium text-primary dark:text-primary-dark bg-primary/10 px-1.5 py-0.5 rounded-full">Official</span>}
                      <span className="text-xs text-text-secondary dark:text-text-dark/40">{c.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-text-dark/70 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postComment()}
                placeholder="Add a comment…"
                className="input-field"
              />
              <Button onClick={postComment} icon={Send} className="shrink-0" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-primary dark:text-primary-dark" /> Location
            </h2>
            <MapCard markers={[{ id: report.id, x: 48, y: 45, status: report.status, title: report.title }]} height="h-48" />
            <p className="text-sm text-text-primary dark:text-text-dark mt-3">{report.location}</p>
          </Card>

          <Card>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-primary dark:text-primary-dark" /> Assigned department
            </h2>
            <p className="text-sm font-medium text-text-primary dark:text-text-dark">{report.department}</p>
            <p className="text-xs text-text-secondary dark:text-text-dark/60 mt-1">Zone 3 · Ghaziabad Municipal Corporation</p>
          </Card>

          <div>
            <h2 className="font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-primary dark:text-primary-dark" /> Similar nearby reports
            </h2>
            <div className="space-y-4">
              {nearby.map((r, i) => <ReportCard key={r.id} report={r} index={i} compact />)}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
