import { motion } from 'framer-motion'

export default function MinimalistGlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-[#07090C] transition-colors duration-500" />

      {/* Top Left Subtle Ambient Glow Orb */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.55, 0.3],
          x: [-10, 15, -10],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#D2E4FC] via-[#E6F0FE] to-transparent dark:from-[#0B182B] dark:via-[#112239] dark:to-transparent blur-3xl"
      />

      {/* Bottom Right Subtle Ambient Glow Orb */}
      <motion.div
        animate={{
          scale: [1.08, 0.95, 1.08],
          opacity: [0.35, 0.6, 0.35],
          x: [10, -15, 10],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-40 -right-40 w-[750px] h-[750px] rounded-full bg-gradient-to-tl from-[#DAE9FD] via-[#EEF5FE] to-transparent dark:from-[#091527] dark:via-[#0F1E32] dark:to-transparent blur-3xl"
      />

      {/* Center Soft Pulse Glow */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-3xl"
      />
    </div>
  )
}
