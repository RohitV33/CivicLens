import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cpu, MapPin, Zap, Users, ArrowRight, Award, CheckCircle2, Globe, HeartHandshake } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'

export default function AboutUs() {
  const coreValues = [
    {
      icon: Cpu,
      title: 'AI Precision',
      desc: 'Deep neural models automatically detect potholes, waste, and lighting defects in under 2 seconds with high confidence.',
    },
    {
      icon: MapPin,
      title: 'Geospatial Accuracy',
      desc: 'High-precision EXIF metadata and GPS coordinates ensure municipal field teams are dispatched to exact coordinates.',
    },
    {
      icon: Zap,
      title: 'Rapid Dispatch',
      desc: 'Bypasses legacy administrative delays by routing issues straight to the responsible ward officer immediately.',
    },
    {
      icon: HeartHandshake,
      title: 'Citizen Empowerment',
      desc: 'Transparent status tracking gives citizens real-time visibility into civic repair progress across their community.',
    },
  ]

  const milestones = [
    { number: '94%', label: 'AI Detection Accuracy' },
    { number: '< 25s', label: 'Average Reporting Speed' },
    { number: '68%', label: 'Duplicate Ticket Reduction' },
    { number: '100%', label: 'Ward Auto-Routing' },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080809] text-neutral-900 dark:text-white font-sans selection:bg-blue-500/20 overflow-x-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Hero Header */}
        <section className="relative px-4 sm:px-6 pt-12 pb-20 max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-300/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> About CivicLens AI
            </span>

            <h1 className="text-4xl sm:text-6xl font-serif text-neutral-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Empowering Citizens to Build <span className="font-serif-italic text-neutral-700 dark:text-neutral-300">Smarter Cities</span>.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              CivicLens AI bridges the gap between citizens and local government by using computer vision, geospatial intelligence, and automated dispatch to fix public infrastructure hazards faster than ever before.
            </p>
          </motion.div>
        </section>

        {/* Mission Statement Card */}
        <section className="px-4 sm:px-6 py-8 max-w-5xl mx-auto z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] bg-white dark:bg-[#14161A] p-8 sm:p-14 border border-black/5 dark:border-white/10 shadow-craft relative overflow-hidden"
          >
            <div className="max-w-3xl space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Our Vision</span>
              <h2 className="text-2xl sm:text-4xl font-serif text-neutral-900 dark:text-white leading-snug">
                Moving from slow paperwork to instant AI civic intelligence.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Traditional civic complaint workflows often involve long queues, unclear ward boundaries, and duplicate tickets. CivicLens AI automatically analyzes uploaded photos, identifies the issue type, measures severity, and verifies location—allowing municipal teams to act immediately.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-semibold px-6 py-3 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Report an Issue <ArrowRight size={15} />
                </Link>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold px-6 py-3 text-sm border border-black/5 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/15 transition-all"
                >
                  <Globe size={15} /> Explore Live Map
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Core Pillars */}
        <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto z-10 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 dark:text-white">Why CivicLens AI</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Built for speed, accuracy, and full transparency.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => {
              const IconComp = v.icon
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-[24px] bg-white dark:bg-[#14161A] border border-black/5 dark:border-white/10 shadow-soft space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <IconComp size={20} />
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">{v.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Platform Metrics */}
        <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto z-10 relative">
          <div className="rounded-[24px] bg-neutral-900 dark:bg-[#121316] text-white p-8 sm:p-12 border border-black/10 shadow-craft grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {milestones.map((m) => (
              <div key={m.label} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{m.number}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-12 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} CivicLens AI. Empowering citizen reporting nationwide.</p>
        </footer>
      </div>
    </PageTransition>
  )
}
