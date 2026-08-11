import { motion } from 'framer-motion'
import logoCivicImg from '../assets/logo_civic.png?v=5'

export default function Logo({ size = 56, className = '' }) {
  return (
    <div className={`flex items-center group cursor-pointer select-none ${className}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center shrink-0 dark:bg-white/95 dark:px-3 dark:py-1.5 dark:rounded-xl dark:shadow-md transition-all"
      >
        <img
          src={logoCivicImg}
          alt="CivicLens-AI - SEE REPORT SOLVE"
          style={{ height: `${size}px` }}
          className="w-auto max-w-full object-contain filter drop-shadow-sm transition-all duration-200"
          onError={(e) => {
            e.target.src = '/logo_civic.png?v=5'
          }}
        />
      </motion.div>
    </div>
  )
}
