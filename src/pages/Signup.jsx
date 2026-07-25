import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
import { useToast } from '../context/ToastContext'

const requirements = [
  { id: 'len', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'num', label: 'Contains a number', test: (v) => /\d/.test(v) },
  { id: 'case', label: 'Upper &amp; lowercase letters', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
]

export default function Signup() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!requirements.every((r) => r.test(form.password))) e.password = 'Password does not meet requirements'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      addToast('Account created! Welcome to CivicLens AI.', 'success')
      navigate('/dashboard')
    }, 900)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg dark:bg-bg-dark">
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative order-2 lg:order-1">
        <div className="absolute top-6 right-6 lg:hidden"><ThemeToggle /></div>
        <div className="lg:hidden mb-10"><Logo /></div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm mx-auto">
          <h1 className="font-display text-2xl font-bold text-text-primary dark:text-text-dark mb-1.5">Create your account</h1>
          <p className="text-sm text-text-secondary dark:text-text-dark/60 mb-8">Start reporting civic issues and track their resolution.</p>

          <button className="btn-secondary w-full mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <span className="flex-1 h-px bg-border dark:bg-border-dark" />
            <span className="text-xs text-text-secondary dark:text-text-dark/50">or</span>
            <span className="flex-1 h-px bg-border dark:bg-border-dark" />
          </div>

          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label className="label-text mb-1.5 block">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rohit Sharma"
                  className={`input-field pl-10 ${errors.name ? '!border-danger focus:!ring-danger/10' : ''}`}
                />
              </div>
              {errors.name && <p className="text-xs text-danger mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="label-text mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? '!border-danger focus:!ring-danger/10' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-danger mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="label-text mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? '!border-danger focus:!ring-danger/10' : ''}`}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {requirements.map((r) => {
                  const ok = r.test(form.password)
                  return (
                    <div key={r.id} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 size={13} className={ok ? 'text-success' : 'text-text-secondary/30 dark:text-text-dark/20'} />
                      <span className={ok ? 'text-text-secondary dark:text-text-dark/70' : 'text-text-secondary/50 dark:text-text-dark/30'} dangerouslySetInnerHTML={{ __html: r.label }} />
                    </div>
                  )
                })}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" iconRight={!loading ? ArrowRight : undefined} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-text-secondary dark:text-text-dark/60 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary dark:text-primary-dark font-medium hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col justify-between p-12 bg-surface dark:bg-card-dark border-l border-border dark:border-border-dark relative overflow-hidden order-1 lg:order-2">
        <Link to="/"><Logo /></Link>
        <div className="relative z-10">
          <p className="label-text text-primary dark:text-primary-dark mb-4">Join the movement</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary dark:text-text-dark leading-tight mb-4">
            6,200+ citizens are already reporting smarter.
          </h2>
          <p className="text-text-secondary dark:text-text-dark/70 max-w-sm">
            Create a free account to submit reports, earn contributor points, and climb the community leaderboard.
          </p>
        </div>
        <p className="text-xs text-text-secondary dark:text-text-dark/40">© 2026 CivicLens AI</p>
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/[0.06] dark:bg-primary/[0.08]" />
      </div>
    </div>
  )
}
