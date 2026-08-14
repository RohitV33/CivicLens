import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Camera, Sparkles, MapPin, Send, AlertTriangle, CheckCircle2, Clock, Globe, Heart, ArrowRight, UserCheck, Building2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'

export default function AboutUs() {
  const steps = [
    {
      num: '01',
      title: 'Snap a Photo',
      subtitle: 'See a problem? Just take a picture.',
      desc: 'No complicated forms, no phone queues, and no office visits required.',
      icon: Camera,
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      num: '02',
      title: 'AI Analyzes & Tags',
      subtitle: 'AI reads the image instantly.',
      desc: 'Our computer vision AI detects potholes, overflowing waste, or broken streetlights, calculates severity, and extracts exact GPS location.',
      icon: Sparkles,
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      num: '03',
      title: 'Instant Dispatch',
      subtitle: 'Sent to the right team in 3s.',
      desc: 'The ticket is automatically routed to the responsible municipal department and local ward officer.',
      icon: Send,
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#080809] text-neutral-900 dark:text-white font-sans selection:bg-blue-500/20 overflow-x-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Hero Header */}
        <section className="relative px-4 sm:px-6 pt-12 pb-16 max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-300/40 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-widest">
              <ShieldCheck size={14} /> Why CivicLens AI Exists
            </span>

            <h1 className="text-4xl sm:text-6xl font-serif text-neutral-900 dark:text-white tracking-tight leading-tight">
              Fixing Neighborhood Issues <br className="hidden sm:inline" />
              <span className="font-serif-italic text-neutral-700 dark:text-neutral-300">In 3 Simple Steps</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              CivicLens AI was created with a simple mission: to give every citizen a direct, 1-click voice to fix potholes, waste, and lighting hazards in their community.
            </p>
          </motion.div>
        </section>

        {/* Why We Designed It (Old vs New Comparison) */}
        <section className="px-4 sm:px-6 py-8 max-w-5xl mx-auto z-10 relative">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">The Problem We Solved</span>
            <h2 className="text-2xl sm:text-4xl font-serif text-neutral-900 dark:text-white mt-1">Why We Designed CivicLens AI</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-7 rounded-[28px] bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase">
                <AlertTriangle size={13} /> The Old Way (Broken)
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                  <span><strong>Complex Paperwork:</strong> Citizens had to fill out long municipal complaint forms.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                  <span><strong>Zero Status Updates:</strong> Reports vanished with no feedback or ticket tracking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                  <span><strong>Bounced Between Offices:</strong> Hard to find which municipal department was responsible.</span>
                </li>
              </ul>
            </motion.div>

            {/* The CivicLens Way */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-7 rounded-[28px] bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase">
                <CheckCircle2 size={13} /> The CivicLens AI Way (Instant)
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                  <span><strong>1-Click Photo Capture:</strong> Just snap a photo. AI handles classification and location.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                  <span><strong>Real-Time Ticket Status:</strong> Track every stage from report to field crew repair.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                  <span><strong>Auto Department Routing:</strong> Instant dispatch directly to the responsible ward team.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How CivicLens AI Works (The Purpose) */}
        <section className="px-4 sm:px-6 py-16 max-w-5xl mx-auto z-10 relative">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Core Purpose</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-neutral-900 dark:text-white mt-1">How It Works For You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => {
              const IconComponent = s.icon
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="p-7 rounded-[28px] bg-white dark:bg-[#14161A] border border-black/5 dark:border-white/10 shadow-soft space-y-4 text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.badgeBg}`}>
                        <IconComponent size={22} />
                      </div>
                      <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700 font-mono">
                        {s.num}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{s.title}</h3>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{s.subtitle}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Who Benefits */}
        <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto z-10 relative">
          <div className="rounded-[32px] bg-white dark:bg-[#14161A] p-8 sm:p-12 border border-black/5 dark:border-white/10 shadow-craft grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">For Every Citizen</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Empowers you to keep your neighborhood safe and clean. Upvote existing reports, track repair progress, and earn civic reputation points.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">For City Officials</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Eliminates manual triage, removes duplicate tickets automatically, and gives municipal officers high-precision GPS maps for rapid repair operations.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto text-center z-10 relative">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 dark:text-white">
              Ready to Improve Your Neighborhood?
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Join thousands of citizens reporting civic issues with AI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-semibold px-8 py-3.5 text-sm shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                Report a Civic Issue <ArrowRight size={15} />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md text-[#0F0F0F] dark:text-white font-semibold px-8 py-3.5 text-sm border border-black/10 dark:border-white/20 shadow-xs hover:bg-white dark:hover:bg-white/20 transition-all cursor-pointer"
              >
                <Globe size={15} /> Explore Live Map
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-10 max-w-6xl mx-auto border-t border-black/5 dark:border-white/10 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} CivicLens AI Inc. Building cleaner, safer cities together.</p>
        </footer>
      </div>
    </PageTransition>
  )
}
