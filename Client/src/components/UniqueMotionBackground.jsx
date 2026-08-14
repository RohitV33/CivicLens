import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { MapPin, Shield, Cpu, Activity, Compass } from 'lucide-react'

export default function UniqueMotionBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse spring physics for parallax depth
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const parallax1X = useTransform(springX, [-0.5, 0.5], [-25, 25])
  const parallax1Y = useTransform(springY, [-0.5, 0.5], [-25, 25])

  const parallax2X = useTransform(springX, [-0.5, 0.5], [30, -30])
  const parallax2Y = useTransform(springY, [-0.5, 0.5], [30, -30])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) - 0.5
      const y = (e.clientY / innerHeight) - 0.5
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const floatingNodes = [
    { icon: MapPin, label: 'GPS Geotag Verified', top: '18%', left: '12%', color: 'text-blue-500 bg-blue-500/10 border-blue-400/20' },
    { icon: Cpu, label: 'AI Spatial Matrix', top: '24%', right: '14%', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-400/20' },
    { icon: Activity, label: 'Real-Time Dispatch', bottom: '22%', left: '10%', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-400/20' },
    { icon: Compass, label: 'Ward 14 • 28.67° N', bottom: '18%', right: '12%', color: 'text-sky-500 bg-sky-500/10 border-sky-400/20' },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 selection:bg-blue-500/20">
      {/* 1. Liquid Aurora Canvas Background */}
      <div className="absolute inset-0 bg-[#F4F8FE] dark:bg-[#07090C] transition-colors duration-700" />

      {/* 2. Interactive Parallax Aurora Light Mesh Layer 1 */}
      <motion.div
        style={{ x: parallax1X, y: parallax1Y }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.75, 0.95, 0.75],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#CBDFFC] via-[#E2EEFE] to-[#B5D5FC] dark:from-[#0B1A30] dark:via-[#132745] dark:to-[#06101F] blur-3xl opacity-80"
      />

      {/* 3. Interactive Parallax Aurora Light Mesh Layer 2 */}
      <motion.div
        style={{ x: parallax2X, y: parallax2Y }}
        animate={{
          scale: [1.08, 0.95, 1.08],
          opacity: [0.8, 0.6, 0.8],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-40 -right-40 w-[850px] h-[850px] rounded-full bg-gradient-to-tl from-[#D8E8FC] via-[#EDF5FE] to-[#C4DDFC] dark:from-[#091526] dark:via-[#102038] dark:to-[#040912] blur-3xl opacity-80"
      />

      {/* 4. Center Glowing AI Core Aura */}
      <motion.div
        animate={{
          scale: [0.94, 1.06, 0.94],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-sky-400/20 dark:from-blue-600/15 dark:to-indigo-600/15 blur-3xl"
      />

      {/* 5. Spatial Grid Lines Pattern (High Tech & Clean) */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(37,99,235,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37,99,235,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 6. Dynamic Floating Civic AI Nodes (Unique Touch) */}
      {floatingNodes.map((node, i) => {
        const IconComponent = node.icon
        return (
          <motion.div
            key={node.label}
            style={{
              top: node.top,
              left: node.left,
              right: node.right,
              bottom: node.bottom,
              x: i % 2 === 0 ? parallax1X : parallax2X,
              y: i % 2 === 0 ? parallax1Y : parallax2Y,
            }}
            animate={{
              y: [0, i % 2 === 0 ? -12 : 12, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl border shadow-sm text-xs font-semibold ${node.color}`}
          >
            <IconComponent size={14} />
            <span>{node.label}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
