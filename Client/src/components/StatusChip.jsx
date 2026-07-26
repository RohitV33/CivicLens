import { statusMeta, severityMeta } from '../data/mockData'

export function StatusChip({ status, className = '' }) {
  const meta = statusMeta[status]
  if (!meta) return null
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.color} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export function SeverityChip({ severity, className = '' }) {
  const meta = severityMeta[severity]
  if (!meta) return null
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.color} ${className}`}>
      {meta.label} severity
    </span>
  )
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-black/[0.04] dark:bg-white/[0.06] text-text-secondary dark:text-text-dark/70',
    primary: 'bg-primary/10 text-primary dark:text-primary-dark',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
