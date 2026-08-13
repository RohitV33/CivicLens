import { useState, useEffect } from 'react'
import { Bell, Menu, PlusCircle, LogOut, Languages, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import {
  getNotificationsAPI,
  markAllNotificationsReadAPI,
  deleteNotificationAPI,
} from '../services/api'

export default function Topbar({ onMenuClick, title }) {
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, logout } = useAuth()
  const { lang, toggleLang, t } = useLanguage()

  // Get initials from name ("Alex Morgan" → "AM")
  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  // Fetch real notifications if user is logged in
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    getNotificationsAPI()
      .then((res) => {
        const rawList = res.data || res.notifications || []
        if (Array.isArray(rawList)) {
          const list = rawList.map((n) => ({
            id: n.id,
            title: n.title ? `${n.title}${n.message ? `: ${n.message}` : ''}` : (n.message || `Notification #${n.id}`),
            time: new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            isRead: n.isRead,
          }))
          setNotifications(list)
          setUnreadCount(res.unreadCount ?? list.filter((i) => !i.isRead).length)
        }
      })
      .catch(() => {})
  }, [user])

  // Handle clicking on the Notification Bell
  const handleToggleNotif = () => {
    const nextState = !notifOpen
    setNotifOpen(nextState)

    // When opening the notification dropdown, automatically remove unread count & mark as read
    if (nextState && unreadCount > 0) {
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      if (user) {
        markAllNotificationsReadAPI().catch(() => {})
      }
    }
  }

  const handleClearAll = (e) => {
    e.stopPropagation()
    setNotifications([])
    setUnreadCount(0)
    if (user) {
      markAllNotificationsReadAPI().catch(() => {})
    }
  }

  const handleDeleteItem = (id, e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (user) {
      deleteNotificationAPI(id).catch(() => {})
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-border dark:border-border-dark bg-surface/90 dark:bg-bg-dark/90 backdrop-blur-md font-sans">
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

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleNotif}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-black dark:hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm border-2 border-white dark:border-[#18191C]">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1A1C20] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Notifications</p>
                    {notifications.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs font-semibold text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors flex items-start justify-between gap-3 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-1 font-medium">{n.time}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(n.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-500 transition-opacity"
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu Dropdown */}
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
                exit={{ opacity: 0, y: -8, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A1C20] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl p-1 overflow-hidden z-50"
              >
                <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl font-medium">
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => { setUserMenuOpen(false); logout() }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold"
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
