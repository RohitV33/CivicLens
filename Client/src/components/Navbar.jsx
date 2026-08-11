import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Sparkles, Zap } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Product', sectionId: 'features' },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Live Map', sectionId: 'live-map' },
  { label: 'Analytics', sectionId: 'analytics' },
  { label: 'Community', sectionId: 'testimonials' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const navRef = useRef(null)
  const linkRefs = useRef({})
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.sectionId)
    const observers = []
    const sectionVisibility = {}

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          sectionVisibility[id] = entry.intersectionRatio
          // Pick the section with highest visibility
          const best = Object.entries(sectionVisibility).sort((a, b) => b[1] - a[1])[0]
          if (best && best[1] > 0) setActiveSection(best[0])
          else setActiveSection(null)
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1.0], rootMargin: '-80px 0px -30% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Update sliding indicator position
  useEffect(() => {
    if (!activeSection) return
    const el = linkRefs.current[activeSection]
    const nav = navRef.current
    if (el && nav) {
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      })
    }
  }, [activeSection])

  const handleNavClick = (sectionId) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToSection(sectionId), 400)
    } else {
      scrollToSection(sectionId)
    }
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="w-full z-50 sticky top-0 font-sans">
      {/* ── Floating Capsule Header ── */}
      <header className="max-w-6xl mx-auto px-4 pt-3 pb-2 transition-all duration-300">
        <div className={`w-full rounded-full transition-all duration-500 px-5 sm:px-7 py-1.5 flex items-center justify-between ${
          scrolled
            ? 'bg-white/95 dark:bg-[#18191C]/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-black/10 dark:border-white/10'
            : 'bg-white/85 dark:bg-[#18191C]/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] border border-white/70 dark:border-white/10'
        }`}>

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center group">
            <Logo size={85} />
          </Link>


          {/* Desktop Nav Links with Sliding Indicator */}
          <nav ref={navRef} className="hidden md:flex items-center gap-0.5 relative">
            {/* Sliding background pill */}
            <AnimatePresence>
              {activeSection && (
                <motion.div
                  key="indicator"
                  className="absolute top-0 bottom-0 rounded-full bg-black/[0.06] dark:bg-white/[0.1] pointer-events-none"
                  initial={false}
                  animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </AnimatePresence>

            {navLinks.map((l) => (
              <button
                key={l.label}
                ref={el => linkRefs.current[l.sectionId] = el}
                onClick={() => handleNavClick(l.sectionId)}
                className={`relative text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 z-10 ${
                  activeSection === l.sectionId
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {l.label}
                {activeSection === l.sectionId && (
                  <motion.span
                    layoutId="activeDot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-4 py-2 text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
            >
              Report Issue
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.98 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden mt-2 overflow-hidden rounded-3xl bg-white/95 dark:bg-[#18191C]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl p-5"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <motion.button
                    key={l.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(l.sectionId)}
                    className={`text-left text-base font-medium py-2 px-3 rounded-xl transition-colors ${
                      activeSection === l.sectionId
                        ? 'text-black dark:text-white bg-black/5 dark:bg-white/10 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {l.label}
                  </motion.button>
                ))}
                <div className="pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-center py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/report"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold px-5 py-2.5 text-sm shadow-sm"
                  >
                    Report Issue
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </div>
  )
}
