import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { loginAPI, registerAPI, forgotPasswordAPI, resetPasswordAPI } from '../services/api'
import GoogleAuthButton from '../components/GoogleAuthButton'

const requirements = [
  { id: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'num', label: 'Contains a number', test: (v) => /\d/.test(v) },
  { id: 'case', label: 'Upper & lowercase letters', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
]

export default function Auth({ initialMode = 'login' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isSignupRoute = location.pathname === '/signup' || initialMode === 'signup'
  
  const [mode, setMode] = useState(isSignupRoute ? 'signup' : 'login')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Forgot Password Modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const cardRef = useRef(null)
  const formRef = useRef(null)
  const isFirstRender = useRef(true)

  const { addToast } = useToast()
  const { user, login } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Sync mode with route changes
  useEffect(() => {
    const targetMode = location.pathname === '/signup' ? 'signup' : 'login'
    if (targetMode !== mode) {
      triggerFlipAnimation(targetMode)
    }
  }, [location.pathname])

  // 3D GSAP Card Flip Animation Function
  const triggerFlipAnimation = (newMode) => {
    if (!cardRef.current) {
      setMode(newMode)
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

    // Step 1: Flip card to 90 degrees (edge-on view)
    tl.to(cardRef.current, {
      rotateY: newMode === 'signup' ? 90 : -90,
      scale: 0.88,
      opacity: 0.3,
      duration: 0.25,
      onComplete: () => {
        setMode(newMode)
        setErrors({})
      },
    })
      // Step 2: Flip back to 0 degrees (front view)
      .to(cardRef.current, {
        rotateY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(1.2)',
      })
      // Step 3: Stagger blur-in for form inputs
      .fromTo(
        formRef.current?.children || [],
        { y: 15, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.4, stagger: 0.06, ease: 'power2.out' },
        '-=0.2'
      )
  }

  const switchMode = (targetMode) => {
    navigate(targetMode === 'signup' ? '/signup' : '/login')
  }

  const validate = () => {
    const e = {}
    if (mode === 'signup' && form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (mode === 'signup' && !requirements.every((r) => r.test(form.password))) {
      e.password = 'Password does not meet requirements'
    } else if (mode === 'login' && form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'signup') {
        await registerAPI(form.name, form.email, form.password)
        const res = await loginAPI(form.email, form.password)
        addToast('Account created! Welcome to CivicLens AI.', 'success')
        login(res.token, res.data)
      } else {
        const res = await loginAPI(form.email, form.password)
        addToast('Welcome back! Redirecting to your dashboard…', 'success')
        login(res.token, res.data)
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestResetToken = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(resetEmail)) {
      addToast('Please enter a valid email address', 'error')
      return
    }
    setResetLoading(true)
    try {
      const res = await forgotPasswordAPI(resetEmail)
      addToast(res.message || 'Reset code sent to your email!', 'success')
      setResetStep(2)
    } catch (err) {
      addToast(err.message || 'Failed to request reset token', 'error')
    } finally {
      setResetLoading(false)
    }
  }

  const handleConfirmReset = async (e) => {
    e.preventDefault()
    if (!resetToken || newPassword.length < 6) {
      addToast('Please enter code and password (min 6 chars)', 'error')
      return
    }
    setResetLoading(true)
    try {
      const res = await resetPasswordAPI(resetToken, newPassword)
      addToast(res.message || 'Password reset successfully!', 'success')
      setForgotModalOpen(false)
      setResetStep(1)
      setForm((prev) => ({ ...prev, email: resetEmail }))
    } catch (err) {
      addToast(err.message || 'Failed to reset password', 'error')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between items-center p-4 sm:p-8 font-sans overflow-hidden selection:bg-blue-500/20">
      {/* ── Vibrant Animated Motion Sky Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Base Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D0E3FC] via-[#E8F2FE] to-[#C7E0FD] dark:from-[#070D16] dark:via-[#0D182A] dark:to-[#040911] transition-colors duration-700" />

        {/* Floating Animated Cloud Blob 1 */}
        <motion.div
          animate={{
            x: [-60, 60, -60],
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
            rotate: [0, 12, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-36 -left-36 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-white/90 via-[#DCEBFF]/80 to-[#BBD8FE]/60 dark:from-[#0F223D]/70 dark:via-[#162D4E]/50 dark:to-transparent blur-3xl opacity-90"
        />

        {/* Floating Animated Cloud Blob 2 */}
        <motion.div
          animate={{
            x: [60, -60, 60],
            y: [30, -30, 30],
            scale: [1.12, 0.94, 1.12],
            rotate: [0, -14, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-36 -right-36 w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-white/90 via-[#E1EEFE]/80 to-[#C2DDFF]/60 dark:from-[#0B1A2F]/80 dark:via-[#132642]/60 dark:to-transparent blur-3xl opacity-90"
        />

        {/* Center Glowing Light Aura */}
        <motion.div
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-3xl"
        />

        {/* Continuous Slow Rotating Radar SVG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px]">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full text-blue-500/20 dark:text-white/10"
            viewBox="0 0 800 800"
          >
            <circle cx="400" cy="400" r="160" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="400" cy="400" r="260" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
          </motion.svg>
        </div>

        {/* Floating Light Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              opacity: [0, 0.8, 0],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.1,
            }}
            className="absolute w-2.5 h-2.5 rounded-full bg-white dark:bg-blue-300 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            style={{
              top: `${20 + i * 13}%`,
              left: `${15 + i * 14}%`,
            }}
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20 py-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>
        <ThemeToggle />
      </div>

      {/* ── 3D GSAP Flip Card Container ── */}
      <div className="w-full flex items-center justify-center my-auto py-8 z-20" style={{ perspective: 1200 }}>
        <div
          ref={cardRef}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full max-w-[430px] bg-white/90 dark:bg-[#121418]/90 backdrop-blur-2xl rounded-[2.6rem] p-7 sm:p-10 border border-white/90 dark:border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.11)] text-center relative"
        >
          {/* Top Floating Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1B1E24] shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto mb-5 text-neutral-800 dark:text-white transition-all">
            {mode === 'signup' ? <UserPlus size={20} /> : <LogIn size={20} />}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {mode === 'signup' ? 'Create your account' : 'Sign in with email'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-7 leading-relaxed max-w-xs mx-auto">
            {mode === 'signup'
              ? 'Join thousands of citizens reporting civic issues.'
              : 'Report and resolve civic issues effortlessly.'}
          </p>

          <form ref={formRef} onSubmit={submit} noValidate className="space-y-4 text-left">
            {mode === 'signup' && (
              <div>
                <div className="relative group">
                  <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="relative group">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-11 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="mt-2.5 space-y-1 pl-1">
                  {requirements.map((r) => {
                    const ok = r.test(form.password)
                    return (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 size={13} className={ok ? 'text-emerald-500' : 'text-neutral-300 dark:text-neutral-700'} />
                        <span className={ok ? 'text-neutral-700 dark:text-neutral-300 font-medium' : 'text-neutral-400 dark:text-neutral-500'}>
                          {r.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {errors.password && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.password}</p>}
            </div>

            {mode === 'login' && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(form.email)
                    setForgotModalOpen(true)
                  }}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-bold py-3.5 text-sm shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? mode === 'signup' ? 'Creating account...' : 'Signing in...'
                : mode === 'signup' ? 'Create Account' : 'Get Started'}
            </motion.button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
              <span className="text-[11px] text-neutral-400 font-medium">
                {mode === 'signup' ? 'Or sign up with' : 'Or sign in with'}
              </span>
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
            </div>

            <GoogleAuthButton text={mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'} />

            {/* Mode Switch Trigger with 3D Flip */}
            <p className="mt-6 text-center text-xs text-neutral-500 font-medium">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-neutral-900 dark:text-white font-bold hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-neutral-900 dark:text-white font-bold hover:underline cursor-pointer"
                  >
                    Sign up free
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="z-20 py-2 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} CivicLens AI Inc. All rights reserved.
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 max-w-md w-full shadow-2xl border border-black/10 dark:border-white/10 space-y-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-neutral-900 dark:text-white font-bold">
                      {resetStep === 1 ? 'Reset Password' : 'Verify & Set New Password'}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {resetStep === 1 ? 'Step 1 of 2: Request reset code' : 'Step 2 of 2: Enter code & new password'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setForgotModalOpen(false)} className="text-neutral-400 hover:text-black dark:hover:text-white text-xl font-bold">
                  ✕
                </button>
              </div>

              {resetStep === 1 ? (
                <form onSubmit={handleRequestResetToken} className="space-y-4">
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    Enter your registered email address below. We will send a 6-digit password verification code to your inbox.
                  </p>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 block">Account Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-white outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setForgotModalOpen(false)} className="flex-1 rounded-2xl border border-neutral-300 dark:border-neutral-700 py-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Cancel
                    </button>
                    <button type="submit" disabled={resetLoading} className="flex-1 rounded-2xl bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] py-2.5 text-xs font-bold">
                      {resetLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Send Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 block">6-Digit Verification Code</label>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm font-mono tracking-widest text-center text-lg font-bold text-neutral-900 dark:text-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 block">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-white outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setResetStep(1)} className="rounded-2xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5">
                      <ArrowLeft size={16} />
                    </button>
                    <button type="submit" disabled={resetLoading} className="flex-1 rounded-2xl bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] py-2.5 text-xs font-bold">
                      {resetLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
