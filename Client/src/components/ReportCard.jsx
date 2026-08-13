import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ThumbsUp, MessageSquare, Clock, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import IssueThumb from './IssueThumb'
import { StatusChip, SeverityChip } from './StatusChip'
import { toggleUpvoteIssueAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { getSLAStatus } from '../utils/sla'

const CATEGORY_FALLBACK_IMAGES = {
  POTHOLE: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
  GARBAGE: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  WASTE_MANAGEMENT: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  STREETLIGHT: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
  STREET_LIGHTING: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
  WATER_LEAKAGE: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
  ROAD_DAMAGE: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  DRAINAGE: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  WATERLOGGING: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  SEWAGE: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
  OTHER: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80',
}

export default function ReportCard({ report, index = 0, compact = false }) {
  const [imgError, setImgError] = useState(false)
  const [upvotes, setUpvotes] = useState(report.upvoteCount ?? report.upvotes ?? 0)
  const [hasUpvoted, setHasUpvoted] = useState(Boolean(report.hasUpvoted))
  const [upvoting, setUpvoting] = useState(false)
  const { addToast } = useToast()

  const sla = getSLAStatus(report.createdAt || report.reportedAt, report.slaHours, report.status)

  const handleUpvote = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (upvoting) return

    setUpvoting(true)
    const nextHasUpvoted = !hasUpvoted
    const nextCount = nextHasUpvoted ? upvotes + 1 : Math.max(0, upvotes - 1)
    setHasUpvoted(nextHasUpvoted)
    setUpvotes(nextCount)

    try {
      const res = await toggleUpvoteIssueAPI(report.id)
      setUpvotes(res.data.upvoteCount)
      setHasUpvoted(res.data.hasUpvoted)
      addToast(res.data.message || (nextHasUpvoted ? 'Upvoted report!' : 'Removed upvote'), 'success')
    } catch (err) {
      setHasUpvoted(hasUpvoted)
      setUpvotes(upvotes)
      addToast(err.message || 'Please log in to upvote reports', 'error')
    } finally {
      setUpvoting(false)
    }
  }

  // Normalize category key for lookup (handles "ROAD DAMAGE", "WASTE MANAGEMENT", etc.)
  const rawCat = report.category || report.image || ''
  const catKey = rawCat.toUpperCase().trim().replace(/\s+/g, '_')

  const isActualUrl =
    report.image &&
    (report.image.startsWith('http') || report.image.startsWith('data:') || report.image.startsWith('/'))

  const fallbackUrl = CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES.OTHER
  const displaySrc = isActualUrl && !imgError ? report.image : fallbackUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/complaint/${report.id}`}
        className="group block bg-white dark:bg-[#1C1D20] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-soft transition-all duration-300 hover:shadow-craft"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {!imgError ? (
            <img
              src={displaySrc}
              alt={report.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <IssueThumb type={catKey.toLowerCase()} className="w-full h-full object-cover" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <StatusChip status={report.status} />
            {sla.isOverdue && (
              <span className="bg-rose-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Clock size={10} /> Overdue
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <SeverityChip severity={report.severity} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase mb-1 flex-wrap">
            <span>#{report.id}</span>
            <span>·</span>
            <span>{report.category}</span>
            {report.department && (
              <>
                <span>·</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{report.department.replace('_', ' ')}</span>
              </>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white leading-snug mb-2 line-clamp-2">
            {report.title}
          </h3>
          {!compact && (
            <p className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
              <MapPin size={13} className="shrink-0 text-emerald-600" />
              <span className="truncate">{report.location}</span>
            </p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUpvote}
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                  hasUpvoted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
              >
                <ThumbsUp size={13} className={hasUpvoted ? 'fill-current' : ''} /> {upvotes}
              </button>
              <span className="flex items-center gap-1 hover:text-black dark:hover:text-white"><MessageSquare size={13} /> {report.comments || 0}</span>
            </div>
            <span>
              {new Date(report.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

