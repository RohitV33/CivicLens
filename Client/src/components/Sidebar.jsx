import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutGrid, PlusCircle, Map, User, LogOut, X, ShieldAlert
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
    <div className="h-full flex flex-col justify-between p-5 text-white">
      {/* Top Logo Header */}
      <div className="flex items-center justify-between shrink-0 pb-6 border-b border-white/10">
        <Logo size={36} inverse={true} />
        <button onClick={onClose} className="md:hidden text-neutral-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-md font-bold'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={2.2} className={item.to === '/admin' ? 'text-rose-400' : ''} />
                <span>{item.label}</span>
                {item.to === '/admin' && (
                  <span className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    Admin
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Logout Button */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={18} /> {t('logout')}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Floating Dark Capsule Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 bg-[#0B0C0E] text-white rounded-[2.5rem] my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4 shadow-2xl border border-white/10 z-30">
        {content}
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-[85] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute left-3 top-3 bottom-3 w-72 bg-[#0B0C0E] text-white rounded-[2.2rem] shadow-2xl border border-white/10"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  )
}
