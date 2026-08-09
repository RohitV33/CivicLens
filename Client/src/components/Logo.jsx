import { motion } from 'framer-motion'
import logoImg from '../assets/logo-transparent.png?v=3'

export default function Logo({ size = 52, showWordmark = true, className = '', showTagline = false }) {
  return (
    <div className={`flex items-center group cursor-pointer select-none ${className}`}>
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center shrink-0"
      >
        <img
          src={logoImg}
          alt="CivicLens AI"
          style={{ height: `${size}px` }}
          className="w-auto max-w-full object-contain drop-shadow-sm filter dark:brightness-110 dark:contrast-125 transition-all duration-200"
          onError={(e) => {
            e.target.src = '/logo-transparent.png?v=3'
          }}
        />
      </motion.div>
    </div>
  )
}



