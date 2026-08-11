import { useState } from 'react'
import { Bell, Menu, PlusCircle, LogOut, Languages } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Topbar({ onMenuClick, title }) {
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { lang, toggleLang, t } = useLanguage()


  // Get initials from name ("Rohit Sharma" → "RS")
  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-border dark:border-border-dark bg-surface/90 dark:bg-bg-dark/90 backdrop-blur-md">
      <button onClick={onMenuClick} className="md:hidden text-text-secondary dark:text-text-dark shrink-0">
        <Menu size={20} />
      </button>

      {title && <h1 className="hidden sm:block font-semibold text-text-primary dark:text-text-dark mr-2 shrink-0">{title}</h1>}

      <SearchBar value={query} onChange={setQuery} className="flex-1 max-w-md" />

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={toggleLang}
          title="Switch Language (English / हिंदी)"
          className="h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors border border-black/10 dark:border-white/10"
        >
          <Languages size={15} />
          <span>{lang === 'en' ? 'EN' : 'हिन्दी'}</span>
        </button>

        <Link to={user ? "/report" : "/signup"} className="btn-primary hidden sm:inline-flex">
          <PlusCircle size={15} /> {t('quickReport')}
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

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary dark:text-primary-dark flex items-center justify-center text-xs font-semibold shrink-0">
                {initials}
              </div>
            )}
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 card-surface !p-1 overflow-hidden"
              >
                <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary dark:text-text-dark hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg">
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => { setUserMenuOpen(false); logout() }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5 rounded-lg"
                >
                  <LogOut size={14} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
