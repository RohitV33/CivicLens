import { motion } from 'framer-motion'
import { MapPin, ThumbsUp, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import IssueThumb from './IssueThumb'
import { StatusChip, SeverityChip } from './StatusChip'

const CATEGORY_FALLBACK_IMAGES = {
  POTHOLE: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
  GARBAGE: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop',
  STREETLIGHT: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop',
  WATER_LEAKAGE: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop',
  ROAD_DAMAGE: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
  DRAINAGE: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
  SEWAGE: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=800&auto=format&fit=crop',
  OTHER: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?q=80&w=800&auto=format&fit=crop',
}

export default function ReportCard({ report, index = 0, compact = false }) {
  // Determine if report.image is an actual image URL or Data URI
  const isActualUrl =
    report.image &&
    (report.image.startsWith('http') || report.image.startsWith('data:') || report.image.startsWith('/'))

  const fallbackUrl =
    CATEGORY_FALLBACK_IMAGES[report.category?.toUpperCase()] || CATEGORY_FALLBACK_IMAGES.OTHER

  const displaySrc = isActualUrl ? report.image : fallbackUrl

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
        <div className="relative h-48 overflow-hidden bg-neutral-900">
          <img
            src={displaySrc}
            alt={report.title}
            onError={(e) => {
              e.target.src = fallbackUrl
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          <div className="absolute top-3 left-3">
            <StatusChip status={report.status} />
          </div>
          <div className="absolute top-3 right-3">
            <SeverityChip severity={report.severity} />
          </div>
        </div>

        <div className="p-5">
          <p className="text-[11px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase mb-1">
            #{report.id} · {report.category}
          </p>
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
              <span className="flex items-center gap-1 hover:text-black dark:hover:text-white"><ThumbsUp size={13} /> {report.upvotes || 12}</span>
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
