import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Logo({ size = 42, showText = true, className = '', to = '/' }) {
  // Scale vector icon proportionally based on size prop
  const iconSize = Math.max(28, Math.min(size, 64))

  const logoContent = (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      className={`inline-flex items-center gap-3 group cursor-pointer select-none ${className}`}
    >
      {/* ── Vector Mark ── */}
      <motion.div
        variants={{
          initial: { scale: 1, rotate: 0 },
          hover: { scale: 1.04, rotate: 3 },
          tap: { scale: 0.96 },
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative flex items-center justify-center shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Ambient background glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/10 dark:border-white/15 transition-all duration-300 group-hover:bg-black/[0.08] dark:group-hover:bg-white/[0.14] group-hover:border-black/20 dark:group-hover:border-white/30 group-hover:shadow-sm" />

        {/* SVG Aperture Lens + Location Pin Icon */}
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 relative z-10 text-neutral-900 dark:text-white"
        >
          {/* Outer precision aperture ring */}
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeOpacity="0.85"
            className="transition-colors duration-300"
          />

          {/* Quadrant optical reticle marks */}
          <line x1="22" y1="4" x2="22" y2="7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="22" y1="37" x2="22" y2="40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="4" y1="22" x2="7" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="37" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

          {/* Aperture Iris Blades */}
          <path
            d="M 22 8 A 14 14 0 0 1 34 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="2 2"
            strokeOpacity="0.4"
          />
          <path
            d="M 22 36 A 14 14 0 0 1 10 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="2 2"
            strokeOpacity="0.4"
          />

          {/* Civic Location Pin at Center */}
          <motion.g
            variants={{
              initial: { y: 0 },
              hover: { y: -1 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {/* Location Pin Shape */}
            <path
              d="M 22 13 C 18.13 13 15 16.13 15 20 C 15 24.8 20.35 30.2 21.36 31.18 C 21.72 31.52 22.28 31.52 22.64 31.18 C 23.65 30.2 29 24.8 29 20 C 29 16.13 25.87 13 22 13 Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            {/* Lens Optics Center Dot */}
            <circle cx="22" cy="19.5" r="3" className="fill-[#FAF8F5] dark:fill-[#0C0D0E]" />
            {/* Warm Focal Indicator Dot */}
            <circle cx="22" cy="19.5" r="1.4" className="fill-[#E25C05]" />
          </motion.g>
        </svg>
      </motion.div>

      {/* ── Brand Typography ── */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold tracking-tight text-neutral-900 dark:text-white text-lg sm:text-xl font-sans">
            Civic
          </span>
          <span className="font-serif italic text-neutral-700 dark:text-neutral-300 text-lg sm:text-xl font-normal">
            Lens
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 uppercase">
            AI
          </span>
        </div>
      )}
    </motion.div>
  )

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none rounded-2xl">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

