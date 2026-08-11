import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, MapPinned, Sparkles, KeyRound, Loader2, ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/Button'
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
  const [resetStep, setResetStep] = useState(1) // 1 = Enter Email, 2 = Enter Token & New Pw
  const [resetEmail, setResetEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

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
              <div className="flex justify-between items-center mb-2">
                <label className="label-text block">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(form.email)
                    setForgotModalOpen(true)
                  }}
                  className="text-xs text-neutral-500 hover:text-black dark:hover:text-white font-semibold"
                >
                  Forgot password?
                </button>
              </div>
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
                    <label className="label-text mb-1 block">Account Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="input-field rounded-2xl text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={() => setForgotModalOpen(false)} variant="outline" className="flex-1 justify-center py-2.5">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={resetLoading} className="flex-1 justify-center py-2.5 shadow-craft">
                      {resetLoading ? <Loader2 size={16} className="animate-spin" /> : 'Send Code'}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-4">
                  <div>
                    <label className="label-text mb-1 block">6-Digit Verification Code</label>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="e.g. 849201"
                      className="input-field rounded-2xl text-sm font-mono tracking-widest text-center text-lg font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-text mb-1 block">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field rounded-2xl text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="button" onClick={() => setResetStep(1)} variant="outline" className="py-2.5 px-3">
                      <ArrowLeft size={16} />
                    </Button>
                    <Button type="submit" disabled={resetLoading} className="flex-1 justify-center py-2.5 shadow-craft">
                      {resetLoading ? <Loader2 size={16} className="animate-spin" /> : 'Reset Password'}
                    </Button>
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

