import { motion } from 'framer-motion'

export default function Logo({ size = 32, showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Custom Unique CivicLens AI Aperture & Pin Logo Emblem */}
      <motion.div
        whileHover={{ rotate: 15, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative flex items-center justify-center shrink-0"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Base Capsule Frame */}
          <rect width="36" height="36" rx="11" className="fill-black dark:fill-white" />
          
          {/* Geometric Aperture & Civic Lens Overlapping Rings */}
          <circle cx="18" cy="18" r="9" className="stroke-white dark:stroke-black" strokeWidth="2.2" opacity="0.4" />
          
          {/* Dynamic Lens Focus Curves */}
          <path
            d="M18 10C13.5817 10 10 13.5817 10 18C10 22.4183 13.5817 26 18 26"
            className="stroke-white dark:stroke-black"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 26C22.4183 26 26 22.4183 26 18C26 13.5817 22.4183 10 18 10"
            className="stroke-emerald-400 dark:stroke-emerald-600"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Central AI Eye Sparkle Pin */}
          <circle cx="18" cy="18" r="3.5" className="fill-emerald-400 dark:fill-emerald-600" />
          <circle cx="19.5" cy="16.5" r="1" fill="white" />
        </svg>
      </motion.div>

      {/* Styled Wordmark */}
      {showWordmark && (
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-xl tracking-tight uppercase text-neutral-900 dark:text-white font-sans">
            CIVICLENS
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
            AI
          </span>
        </div>
      )}
    </div>
  )
}
