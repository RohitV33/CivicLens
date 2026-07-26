import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/#features', label: 'Product' },
  { to: '/#how-it-works', label: 'Imagine' },
  { to: '/map', label: 'Live Map' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/#community', label: 'Community' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="w-full z-50 sticky top-0 font-sans">
      {/* ── Top Golden Amber Banner (Craft Style) ── */}
      <div className="w-full bg-gradient-to-r from-[#F99015] via-[#E25C05] to-[#EE8012] text-white py-2 px-4 relative flex items-center justify-center text-xs sm:text-sm font-medium tracking-wide shadow-sm overflow-hidden">
        {/* Decorative Glowing End Dots */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>

        <a href="#features" className="flex items-center gap-2 hover:underline transition-opacity">
          <span className="font-serif-italic text-sm sm:text-base font-normal tracking-normal text-amber-100">
            Summer Sale &rarr; Get 40% off CivicLens Pro &amp; Enterprise
          </span>
        </a>
      </div>

      {/* ── Floating Capsule Header ── */}
      <header className="max-w-6xl mx-auto px-4 pt-3 pb-2 transition-all duration-300">
        <div className={`w-full rounded-full transition-all duration-300 px-5 sm:px-7 py-2.5 flex items-center justify-between ${
          scrolled 
            ? 'bg-white/90 dark:bg-[#18191C]/90 backdrop-blur-xl shadow-craft border border-black/10 dark:border-white/10' 
            : 'bg-white/80 dark:bg-[#18191C]/80 backdrop-blur-lg shadow-lift border border-white/60 dark:border-white/10'
        }`}>
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <Logo showWordmark={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all"
              >
                {l.label}
              </a>
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
              className="btn-primary"
            >
              Try CivicLens Free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-full text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-2 overflow-hidden rounded-3xl bg-white dark:bg-[#18191C] border border-black/10 dark:border-white/10 shadow-2xl p-5"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-neutral-800 dark:text-neutral-200 py-1.5"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2.5">
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
                    className="btn-primary w-full text-center"
                  >
                    Try CivicLens Free
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
