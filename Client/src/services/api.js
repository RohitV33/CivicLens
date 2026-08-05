// ============================================================
// src/services/api.js  — CENTRAL API FILE
//
// All backend calls live here. Every page imports functions
// from this file instead of writing fetch() everywhere.
//
// HOW IT WORKS:
//   - We use the browser's built-in fetch() to call the backend
//   - The Vite proxy forwards /api/* → http://localhost:5000
//   - The token is read from localStorage and sent as a header
// ============================================================

// ---- Read the saved JWT token from browser storage ----
const getToken = () => localStorage.getItem('token')

// ---- Base fetch helper — adds auth header automatically ----
const apiFetch = async (url, options = {}) => {
  const token = getToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // If user is logged in, attach their token to every request
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  // If the server returned an error status, throw it so the caller can catch it
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// ============================================================
// AUTH API CALLS
// ============================================================

// POST /api/auth/register  — Create a new account
export const registerAPI = (name, email, password) =>
  apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

// POST /api/auth/login  — Login and get token
export const loginAPI = (email, password) =>
  apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

// POST /api/auth/logout  — Logout (also clear token on client)
export const logoutAPI = () =>
  apiFetch('/api/auth/logout', { method: 'POST' })

// ============================================================
// USER API CALLS
// ============================================================

// GET /api/users/profile  — Get the currently logged-in user's data
export const getProfileAPI = () => apiFetch('/api/users/profile')

// ============================================================
// ISSUE API CALLS
// ============================================================

// GET /api/issues  — Get all civic issues
export const getAllIssuesAPI = () => apiFetch('/api/issues')

// GET /api/issues/:id  — Get a single issue by ID
export const getIssueByIdAPI = (id) => apiFetch(`/api/issues/${id}`)

// POST /api/issues  — Submit a new civic issue report
export const createIssueAPI = (title, description, location) =>
  apiFetch('/api/issues', {
    method: 'POST',
    body: JSON.stringify({ title, description, location }),
  })
