import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Mail, Lock, Eye, EyeOff, LogIn, KeyRound, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { loginAPI, forgotPasswordAPI, resetPasswordAPI } from '../services/api'
import GoogleAuthButton from '../components/GoogleAuthButton'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
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
  const badgeRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const bgRadarRef = useRef(null)

  const { addToast } = useToast()
  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // GSAP Smooth Entrance & Radar Rotation Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Continuous slow radar rotation
      gsap.to(bgRadarRef.current, {
        rotate: 360,
        duration: 80,
        repeat: -1,
        ease: 'none',
      })

      // 2. Smooth staggered card entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        cardRef.current,
        { y: 35, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 }
      )
        .fromTo(
          badgeRef.current,
          { scale: 0, rotate: -25 },
          { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.4'
        )
        .fromTo(
          titleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.3'
        )
        .fromTo(
          formRef.current?.children || [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          '-=0.2'
        )
    })

    return () => ctx.revert()
  }, [])

  const validate = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await loginAPI(form.email, form.password)
      addToast('Welcome back! Redirecting to your dashboard…', 'success')
      login(res.token, res.data)
    } catch (err) {
      addToast(err.message || 'Login failed', 'error')
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
    <div className="min-h-screen w-full relative flex flex-col justify-between items-center p-4 sm:p-8 bg-[#E9F2FE] dark:bg-[#07090C] font-sans overflow-hidden selection:bg-blue-500/20">
      {/* ── Dynamic Motion Background (Continuous Floating Blobs & Rotating Radar) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Top Left Cloud Blob */}
        <motion.div
          animate={{
            y: [-15, 20, -15],
            x: [-10, 15, -10],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-36 -left-36 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#C3DCFD] via-[#DEEBFE] to-[#B9D6FD] dark:from-[#0B182B] dark:via-[#12223B] dark:to-[#071222] blur-3xl opacity-90"
        />

        {/* Floating Bottom Right Sky Blob */}
        <motion.div
          animate={{
            y: [15, -20, 15],
            x: [10, -15, 10],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-36 -right-36 w-[750px] h-[750px] rounded-full bg-gradient-to-tl from-[#D4E5FD] via-[#E8F2FE] to-[#C8DFFD] dark:from-[#091527] dark:via-[#101D32] dark:to-[#050E1B] blur-3xl opacity-90"
        />

        {/* Center Glow Pulse Behind Card */}
        <motion.div
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-300/30 dark:bg-blue-600/10 blur-3xl"
        />

        {/* GSAP Animated Slow Rotating Radar Rings */}
        <div ref={bgRadarRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none">
          <svg className="w-full h-full text-blue-400/15 dark:text-white/5" viewBox="0 0 800 800">
            <circle cx="400" cy="400" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="400" cy="400" r="280" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="400" r="380" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
          </svg>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20 py-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>
        <ThemeToggle />
      </div>

      {/* Central Glassmorphism Card (GSAP Ref) */}
      <div className="w-full flex items-center justify-center my-auto py-8 z-20">
        <div
          ref={cardRef}
          className="w-full max-w-[430px] bg-white/85 dark:bg-[#121418]/90 backdrop-blur-2xl rounded-[2.6rem] p-7 sm:p-10 border border-white/90 dark:border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.09)] text-center relative"
        >
          {/* Top Floating Icon Badge */}
          <div
            ref={badgeRef}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1B1E24] shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto mb-5 text-neutral-800 dark:text-white"
          >
            <LogIn size={20} />
          </div>

          <div ref={titleRef}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Sign in with email
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-7 leading-relaxed max-w-xs mx-auto">
              Report and resolve civic issues effortlessly.
            </p>
          </div>

          <form ref={formRef} onSubmit={submit} noValidate className="space-y-4 text-left">
            <div>
              <div className="relative group">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none shadow-xs"
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
                  className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-11 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.password}</p>}
            </div>

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

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-bold py-3.5 text-sm shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Signing in...' : 'Get Started'}
            </motion.button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
              <span className="text-[11px] text-neutral-400 font-medium">Or sign in with</span>
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
            </div>

            <GoogleAuthButton text="Sign in with Google" />

            <p className="mt-6 text-center text-xs text-neutral-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-neutral-900 dark:text-white font-bold hover:underline">
                Sign up free
              </Link>
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
