import { motion } from 'framer-motion'

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        {Icon && <Icon size={24} className="text-primary dark:text-primary-dark" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary dark:text-text-dark mb-1.5">{title}</h3>
      <p className="text-sm text-text-secondary dark:text-text-dark/60 max-w-sm mb-5">{description}</p>
      {action}
    </motion.div>
  )
}

export function Loader({ size = 20, className = '' }) {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className={`inline-block border-2 border-current border-t-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-3 ${className}`} />
}
