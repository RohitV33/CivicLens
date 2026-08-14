import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { registerAPI, loginAPI } from '../services/api'
import GoogleAuthButton from '../components/GoogleAuthButton'

const requirements = [
  { id: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'num', label: 'Contains a number', test: (v) => /\d/.test(v) },
  { id: 'case', label: 'Upper & lowercase letters', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
]

export default function Signup() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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
    if (form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!requirements.every((r) => r.test(form.password))) e.password = 'Password does not meet requirements'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await registerAPI(form.name, form.email, form.password)
      const res = await loginAPI(form.email, form.password)
      addToast('Account created! Welcome to CivicLens AI.', 'success')
      login(res.token, res.data)
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
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
            <UserPlus size={20} />
          </div>

          <div ref={titleRef}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-7 leading-relaxed max-w-xs mx-auto">
              Join thousands of citizens reporting civic issues.
            </p>
          </div>

          <form ref={formRef} onSubmit={submit} noValidate className="space-y-4 text-left">
            <div>
              <div className="relative group">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/60 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-neutral-800 pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all outline-none shadow-xs"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.name}</p>}
            </div>

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

              {/* Password Requirements Checkmarks */}
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

              {errors.password && <p className="text-xs text-red-500 mt-1 pl-3 font-medium">{errors.password}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] font-bold py-3.5 text-sm shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
              <span className="text-[11px] text-neutral-400 font-medium">Or sign up with</span>
              <div className="h-px flex-1 bg-neutral-200/80 dark:bg-neutral-800" />
            </div>

            <GoogleAuthButton text="Sign up with Google" />

            <p className="mt-6 text-center text-xs text-neutral-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 dark:text-white font-bold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="z-20 py-2 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} CivicLens AI Inc. All rights reserved.
      </div>
    </div>
  )
}
