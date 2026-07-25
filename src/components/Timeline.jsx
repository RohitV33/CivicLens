import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Timeline({ items }) {
  return (
    <div className="relative pl-2">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="relative flex gap-4 pb-8 last:pb-0"
        >
          {i < items.length - 1 && (
            <span
              className={`absolute left-[11px] top-6 bottom-0 w-px ${
                item.status === 'done' ? 'bg-success/40' : 'bg-border dark:bg-border-dark'
              }`}
            />
          )}
          <span
            className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full shrink-0 border-2 ${
              item.status === 'done'
                ? 'bg-success border-success text-white'
                : item.status === 'active'
                ? 'bg-primary/10 border-primary dark:border-primary-dark animate-pulseSoft'
                : 'bg-surface dark:bg-card-dark border-border dark:border-border-dark'
            }`}
          >
            {item.status === 'done' && <Check size={13} strokeWidth={3} />}
            {item.status === 'active' && <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark" />}
          </span>
          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-text-primary dark:text-text-dark">{item.title}</h4>
              <span className="text-[11px] text-text-secondary dark:text-text-dark/50 font-mono">{item.time}</span>
            </div>
            <p className="text-sm text-text-secondary dark:text-text-dark/70 mt-0.5">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
