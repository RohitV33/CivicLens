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
  const formRef = useRef(null)

  const { addToast } = useToast()
  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // GSAP Blur-In Staggered Entrance for Form Inputs
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current.children,
          { y: 18, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, stagger: 0.08, ease: 'power2.out' }
        )
      }
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
    <div className="min-h-screen w-full relative flex flex-col justify-between items-center p-4 sm:p-8 font-sans overflow-hidden selection:bg-blue-500/20">
      {/* ── Motion Blurred Background Ambient Orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-[#07090C] transition-colors duration-500" />

        {/* Floating Motion Blur Orb 1 */}
        <motion.div
          animate={{
            x: [-35, 35, -35],
            y: [-25, 25, -25],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-36 -left-36 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-blue-300/50 via-indigo-200/40 to-sky-100/30 dark:from-blue-900/50 dark:via-indigo-900/30 dark:to-transparent blur-3xl opacity-80"
        />

        {/* Floating Motion Blur Orb 2 */}
        <motion.div
          animate={{
            x: [35, -35, 35],
            y: [25, -25, 25],
            scale: [1.1, 0.92, 1.1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-36 -right-36 w-[780px] h-[780px] rounded-full bg-gradient-to-tl from-sky-300/50 via-blue-200/40 to-indigo-100/30 dark:from-sky-900/50 dark:via-blue-900/30 dark:to-transparent blur-3xl opacity-80"
        />

        {/* Subtle Pulse Center Glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl"
        />
      </div>

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20 py-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>
        <ThemeToggle />
      </div>

      {/* 3D Perspective Card Container */}
      <div className="w-full flex items-center justify-center my-auto py-8 z-20" style={{ perspective: 1200 }}>
        <motion.div
          ref={cardRef}
          key="signup-card"
          initial={{ rotateY: 70, opacity: 0, scale: 0.92 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: -70, opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full max-w-[430px] bg-white/85 dark:bg-[#121418]/90 backdrop-blur-2xl rounded-[2.6rem] p-7 sm:p-10 border border-white/80 dark:border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.08)] text-center relative"
        >
          {/* Top Icon Badge */}
          <motion.div
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 350 }}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1B1E24] shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto mb-5 text-neutral-800 dark:text-white"
          >
            <UserPlus size={20} />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-7 leading-relaxed max-w-xs mx-auto">
            Join thousands of citizens reporting civic issues.
          </p>

          <form ref={formRef} onSubmit={submit} noValidate className="space-y-4 text-left">
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
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="z-20 py-2 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} CivicLens AI Inc. All rights reserved.
      </div>
    </div>
  )
}
