import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import PageTransition from './components/PageTransition'

import Landing from './pages/Landing'
import AboutUs from './pages/AboutUs'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import ComplaintDetails from './pages/ComplaintDetails'
import MapExplorer from './pages/MapExplorer'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

// ---- Route Guards ----

/**
 * Redirects unauthenticated users to /login.
 * Shows a minimal spinner while auth state is still loading.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

/**
 * Like ProtectedRoute but also enforces the ADMIN role.
 * Non-admin authenticated users are sent to /dashboard.
 */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

// ---- Scroll reset on route change ----
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={isAuthRoute ? 'auth-route' : location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Auth initialMode="login" />} />
            <Route path="/signup" element={<Auth initialMode="signup" />} />

            {/* Protected routes (auth required) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
            <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapExplorer /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin-only route */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {/* AuthProvider gives every page access to user info + login/logout */}
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
