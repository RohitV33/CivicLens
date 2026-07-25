import { motion } from 'framer-motion'
import { MapPin, ThumbsUp, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import IssueThumb from './IssueThumb'
import { StatusChip, SeverityChip } from './StatusChip'

export default function ReportCard({ report, index = 0, compact = false }) {
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
        <div className="relative h-44 overflow-hidden">
          <IssueThumb type={report.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 left-3">
            <StatusChip status={report.status} />
          </div>
          <div className="absolute top-3 right-3">
            <SeverityChip severity={report.severity} />
          </div>
        </div>
        <div className="p-5">
          <p className="text-[11px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase mb-1">{report.id} · {report.category}</p>
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
              <span className="flex items-center gap-1 hover:text-black dark:hover:text-white"><ThumbsUp size={13} /> {report.upvotes}</span>
              <span className="flex items-center gap-1 hover:text-black dark:hover:text-white"><MessageSquare size={13} /> {report.comments}</span>
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
