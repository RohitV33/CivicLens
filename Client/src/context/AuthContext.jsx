// ============================================================
// context/AuthContext.jsx — GLOBAL AUTH STATE
//
// This context answers the question: "Is a user logged in?"
// from anywhere in the app.
//
// It stores:
//   user   → the logged-in user's data (name, email, id) or null
//   token  → the JWT token saved in localStorage
//
// It provides:
//   login()   → save token + user, called after successful API login
//   logout()  → clear token + user, redirect to /login
//   loading   → true while we're checking if user is already logged in
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfileAPI } from '../services/api'

// Step 1: Create the context
const AuthContext = createContext(null)

// Step 2: Create the Provider (wraps the whole app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // null = not logged in
  const [loading, setLoading] = useState(true) // true while checking token
  const navigate = useNavigate()

  // On first page load: check if a token already exists in localStorage
  // If yes, fetch the user's profile so they stay "logged in" across refreshes
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false) // no token, definitely not logged in
      return
    }
    // Token exists — verify it by fetching the user's profile
    getProfileAPI()
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token was invalid or expired — clear it
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  // Called after a successful login API response
  const login = (token, userData) => {
    localStorage.setItem('token', token) // save token to localStorage
    setUser(userData)
    navigate('/dashboard')
  }

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem('token') // remove token from localStorage
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook — use this in any component to access auth state
// Example: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)
