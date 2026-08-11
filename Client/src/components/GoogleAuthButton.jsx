import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { googleAuthAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function GoogleAuthButton({ text = "Continue with Google" }) {
  const { login } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return
    setLoading(true)
    try {
      const res = await googleAuthAPI(credentialResponse.credential)
      addToast(res.message || 'Authenticated with Google successfully!', 'success')
      login(res.token, res.data)
    } catch (err) {
      addToast(err.message || 'Google Sign-In failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleError = () => {
    addToast('Google Sign-In was cancelled or failed.', 'error')
  }

  const handleMissingConfig = () => {
    addToast('To enable Google Sign-In, please set VITE_GOOGLE_CLIENT_ID in Client/.env', 'warning')
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {hasClientId ? (
        <div className="w-full flex justify-center items-center py-1">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            size="large"
            width="340"
            shape="pill"
            text="continue_with"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleMissingConfig}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#25282E] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#2D3037] transition-all flex items-center justify-center gap-3 text-sm font-medium shadow-sm hover:shadow active:scale-[0.99]"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Authenticating…' : text}</span>
        </button>
      )}
    </div>
  )
}
