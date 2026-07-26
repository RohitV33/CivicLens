import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, MapPinned, Sparkles } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const validate = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      addToast('Welcome back! Redirecting to your dashboard…', 'success')
      navigate('/dashboard')
    }, 900)
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
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                  <f.icon size={16} className="text-neutral-900 dark:text-white" />
                </div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{f.text}</p>
              </div>
            ))}
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
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
            Log in to continue reporting and tracking civic issues.
          </p>

          <button className="w-full btn-secondary py-3 rounded-full mb-6 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"/></svg>
            Continue with Google
          </button>

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
