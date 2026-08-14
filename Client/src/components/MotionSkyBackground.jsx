import { motion } from 'framer-motion'

export default function MotionSkyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D0E3FC] via-[#E8F2FE] to-[#C7E0FD] dark:from-[#070D16] dark:via-[#0D182A] dark:to-[#040911] transition-colors duration-700" />

      {/* 2. Floating Cloud Blob 1 (Top Left) */}
      <motion.div
        animate={{
          x: [-40, 40, -40],
          y: [-25, 25, -25],
          scale: [1, 1.15, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-white/90 via-[#DCEBFF]/70 to-[#BBD8FE]/50 dark:from-[#0F223D]/60 dark:via-[#162D4E]/40 dark:to-transparent blur-3xl opacity-90"
      />

      {/* 3. Floating Cloud Blob 2 (Bottom Right) */}
      <motion.div
        animate={{
          x: [40, -40, 40],
          y: [25, -25, 25],
          scale: [1.1, 0.95, 1.1],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-36 -right-36 w-[780px] h-[780px] rounded-full bg-gradient-to-tl from-white/90 via-[#E1EEFE]/80 to-[#C2DDFF]/50 dark:from-[#0B1A2F]/70 dark:via-[#132642]/50 dark:to-transparent blur-3xl opacity-90"
      />

      {/* 4. Center Radiant Aura */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-300/40 dark:bg-blue-600/15 blur-3xl"
      />

      {/* 5. Continuous Drifting Realistic Cloud SVGs */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 opacity-40 dark:opacity-10"
      >
        <svg className="w-full h-full text-white fill-current" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M0,400 Q360,300 720,400 T1440,400 L1440,900 L0,900 Z" />
          <path d="M0,500 Q360,380 720,500 T1440,500 L1440,900 L0,900 Z" opacity="0.5" />
        </svg>
      </motion.div>

      {/* 6. Concentric Expanding Radar Waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px]">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full text-blue-500/20 dark:text-white/10"
          viewBox="0 0 800 800"
        >
          <circle cx="400" cy="400" r="160" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="400" cy="400" r="460" fill="none" stroke="currentColor" strokeWidth="1" />
        </motion.svg>
      </div>

      {/* 7. Subtle Floating Light Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -120, 0],
            x: [0, i % 2 === 0 ? 40 : -40, 0],
            opacity: [0, 0.7, 0],
            scale: [0.6, 1.2, 0.6],
          }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.2,
          }}
          className="absolute w-3 h-3 rounded-full bg-white/80 dark:bg-blue-300/40 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 14}%`,
          }}
        />
      ))}
    </div>
  )
}
