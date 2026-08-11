import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, MapPinned, Sparkles } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'   // ← get login() function
import { loginAPI } from '../services/api'         // ← real API call

import GoogleAuthButton from '../components/GoogleAuthButton'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const { user, login } = useAuth()  // login() saves token + redirects to dashboard
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

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
      // Call the real backend API
      const res = await loginAPI(form.email, form.password)
      addToast('Welcome back! Redirecting to your dashboard…', 'success')
      // Save token + user data, then redirect to /dashboard
      login(res.token, res.data)
    } catch (err) {
      // Show the error message from the server (e.g. "Invalid email or password")
      addToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAF8F5] dark:bg-[#0C0D0E] font-sans">
      {/* Left Craft Brand Banner */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-[#D9E8FC] dark:bg-[#152336] relative overflow-hidden border-r border-white/60 dark:border-white/10">
        <Link to="/"><Logo /></Link>

        <div className="relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 dark:text-blue-200">
            Trusted by citizens &amp; leaders
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 dark:text-white leading-tight">
            Every report moves your city <span className="font-serif-italic">forward.</span>
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 max-w-sm text-base">
            Sign in to track your submissions, earn contributor badges, and see the real impact of your reports.
          </p>

          <div className="pt-4 flex flex-col gap-3">
            {[
              { icon: Sparkles, text: 'AI detects issues from a single photo' },
              { icon: MapPinned, text: 'Precise geolocation on every report' },
              { icon: ShieldCheck, text: 'Transparent, trackable resolution timeline' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={16} className="text-neutral-900 dark:text-white" />
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{f.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-medium">© 2026 CivicLens AI. Crafted for better cities.</p>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        <div className="absolute top-6 right-6 lg:hidden"><ThemeToggle /></div>
        <div className="lg:hidden mb-10"><Logo /></div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto bg-white dark:bg-[#1A1C20] rounded-[2.5rem] p-8 sm:p-10 border border-black/5 dark:border-white/10 shadow-craft"
        >
          <h1 className="font-serif text-3xl text-neutral-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Log in to continue reporting and tracking civic issues.
          </p>

          <GoogleAuthButton text="Sign in with Google" />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Or email</span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>


          <form onSubmit={submit} noValidate className="space-y-5">
            <div>
              <label className="label-text mb-2 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className="input-field rounded-full"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="label-text mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field rounded-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full justify-center py-3 text-base shadow-lg">
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black dark:text-white font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
