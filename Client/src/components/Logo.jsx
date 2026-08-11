import { motion } from 'framer-motion'
import logoCivicImg from '../assets/logo_civic.png'

export default function Logo({ size = 38, showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center shrink-0"
      >
        <img
          src={logoCivicImg}
          alt="CivicLens AI"
          style={{ height: `${size}px` }}
          className="w-auto max-w-full object-contain filter drop-shadow-sm transition-all duration-200"
          onError={(e) => {
            e.target.src = '/logo_civic.png'
          }}
        />
      </motion.div>
      {showWordmark && (
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5 font-sans">
          <span>CivicLens</span>
          <span className="text-blue-600 dark:text-blue-400 font-black text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
        </span>
      )}
    </div>
  )
}
