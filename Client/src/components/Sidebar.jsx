import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutGrid, PlusCircle, Map, User, Trophy, Settings, LogOut, X, ShieldAlert
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const items = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutGrid },
    { to: '/report', label: t('navReport'), icon: PlusCircle },
    { to: '/map', label: t('navMap'), icon: Map },
    { to: '/profile', label: t('navProfile'), icon: User },
    ...(user?.role === 'ADMIN'
      ? [{ to: '/admin', label: t('navAdmin'), icon: ShieldAlert }]
      : []),
  ]


  const content = (
    <div className="h-full flex flex-col">
      <div className="px-5 h-16 flex items-center justify-between shrink-0 border-b border-border dark:border-border-dark">
        <Logo size={60} />



        <button onClick={onClose} className="md:hidden text-text-secondary">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary dark:text-primary-dark font-bold'
                  : 'text-text-secondary dark:text-text-dark/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-text-primary dark:hover:text-text-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span layoutId="sidebar-active" className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary dark:bg-primary-dark" />
                )}
                <item.icon size={17} strokeWidth={2} className={item.to === '/admin' ? 'text-rose-500' : ''} />
                {item.label}
                {item.to === '/admin' && (
                  <span className="ml-auto text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    Admin
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border dark:border-border-dark flex flex-col gap-1">
        <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-colors">
          <LogOut size={17} /> {t('logout')}
        </button>
      </div>

    </div>
  )

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:shrink-0 border-r border-border dark:border-border-dark bg-surface dark:bg-bg-dark sticky top-0 h-screen">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[85] md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-surface dark:bg-bg-dark shadow-lift"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  )
}
