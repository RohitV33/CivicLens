import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { registerAPI, loginAPI } from '../services/api'
import GoogleAuthButton from '../components/GoogleAuthButton'

import MinimalistGlowBackground from '../components/MinimalistGlowBackground'

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

  const { addToast } = useToast()
  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

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
      {/* ── Minimalist Glass & Ambient Glow Orbs Background ── */}
      <MinimalistGlowBackground />

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20 py-2">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>
        <ThemeToggle />
      </div>

      {/* Central Clean Card */}
      <div className="w-full flex items-center justify-center my-auto py-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[430px] bg-white dark:bg-[#121418] rounded-[2.6rem] p-7 sm:p-10 border border-black/5 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-center relative"
        >
          {/* Top Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-[#1B1E24] border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto mb-5 text-neutral-800 dark:text-white">
            <UserPlus size={20} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-7 leading-relaxed max-w-xs mx-auto">
            Join thousands of citizens reporting civic issues.
          </p>

          <form onSubmit={submit} noValidate className="space-y-4 text-left">
            <div>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
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
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
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
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
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
