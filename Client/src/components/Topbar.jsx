import { useState } from 'react'
import { Bell, Menu, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

export default function Topbar({ onMenuClick, title }) {
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-border dark:border-border-dark bg-surface/90 dark:bg-bg-dark/90 backdrop-blur-md">
      <button onClick={onMenuClick} className="md:hidden text-text-secondary dark:text-text-dark shrink-0">
        <Menu size={20} />
      </button>

      {title && <h1 className="hidden sm:block font-semibold text-text-primary dark:text-text-dark mr-2 shrink-0">{title}</h1>}

      <SearchBar value={query} onChange={setQuery} className="flex-1 max-w-md" />

      <div className="flex items-center gap-2 ml-auto">
        <Link to="/report" className="btn-primary hidden sm:inline-flex">
          <PlusCircle size={15} /> Quick Report
        </Link>

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-text-primary dark:hover:text-text-dark transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-surface dark:ring-bg-dark" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 card-surface !p-0 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border dark:border-border-dark">
                  <p className="text-sm font-semibold text-text-primary dark:text-text-dark">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { t: 'Report CL-10245 moved to In Review', time: '2h ago' },
                    { t: 'Report CL-10243 was resolved', time: '1d ago' },
                    { t: 'You earned "Community Voice" badge', time: '3d ago' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] border-b border-border dark:border-border-dark last:border-0">
                      <p className="text-sm text-text-primary dark:text-text-dark">{n.t}</p>
                      <p className="text-xs text-text-secondary dark:text-text-dark/50 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to="/profile" className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary dark:text-primary-dark flex items-center justify-center text-xs font-semibold shrink-0">
            RS
          </div>
        </Link>
      </div>
    </header>
  )
}
