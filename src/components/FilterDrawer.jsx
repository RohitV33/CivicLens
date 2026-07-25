import { AnimatePresence, motion } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'

export function FilterSection({ title, children }) {
  return (
    <div className="mb-6">
      <p className="label-text mb-3">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export function CheckOption({ label, count, checked, onChange, color }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-1">
      <span className="flex items-center gap-2.5">
        <span
          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
            checked ? 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark' : 'border-border dark:border-border-dark group-hover:border-primary/50'
          }`}
        >
          {checked && <span className="w-1.5 h-1.5 rounded-sm bg-white" />}
        </span>
        {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
        <span className="text-sm text-text-primary dark:text-text-dark">{label}</span>
      </span>
      {count !== undefined && <span className="text-xs text-text-secondary dark:text-text-dark/50 font-mono">{count}</span>}
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    </label>
  )
}

export default function FilterDrawer({ open, onClose, children, title = 'Filters' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[80] md:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-surface dark:bg-card-dark z-[85] p-5 overflow-y-auto md:hidden shadow-lift"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold flex items-center gap-2 text-text-primary dark:text-text-dark">
                <SlidersHorizontal size={16} /> {title}
              </h3>
              <button onClick={onClose}><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
