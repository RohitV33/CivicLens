// ============================================================
// src/services/api.js — CENTRAL API SERVICE LAYER
// ============================================================

const getToken = () => localStorage.getItem('token')

const apiFetch = async (url, options = {}) => {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// ---- AUTH API CALLS ----
export const registerAPI = (name, email, password) =>
  apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

export const loginAPI = (email, password) =>
  apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const googleAuthAPI = (token) =>
  apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })

export const logoutAPI = () =>
  apiFetch('/api/auth/logout', { method: 'POST' })


// ---- USER API CALLS ----
export const getProfileAPI = () => apiFetch('/api/users/profile')

// ---- ISSUE API CALLS ----
export const getAllIssuesAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/api/issues${query ? `?${query}` : ''}`)
}

export const getMyIssuesAPI = () => apiFetch('/api/issues/my')

export const getIssueByIdAPI = (id) => apiFetch(`/api/issues/${id}`)

export const createIssueAPI = (issueData) => {
  const body =
    typeof issueData === 'string'
      ? { title: issueData, description: arguments[1], location: arguments[2] }
      : issueData

  return apiFetch('/api/issues', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// ---- NOTIFICATION API CALLS ----
export const getNotificationsAPI = () => apiFetch('/api/notifications')

export const markNotificationReadAPI = (id) =>
  apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })

export const markAllNotificationsReadAPI = () =>
  apiFetch('/api/notifications/read-all', { method: 'PATCH' })

export const deleteNotificationAPI = (id) =>
  apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })

// ---- AI & DUPLICATE DETECTION API CALLS ----
export const analyzeIssueAIAPI = ({ imageUrl, title, description }) =>
  apiFetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ imageUrl, title, description }),
  })

export const checkDuplicateAIAPI = ({ latitude, longitude, category, radiusInKm }) =>
  apiFetch('/api/ai/check-duplicate', {
    method: 'POST',
    body: JSON.stringify({ latitude, longitude, category, radiusInKm }),
  })

// ---- LOCATION & REVERSE GEOCODING API CALLS ----
export const reverseGeocodeAPI = (lat, lng) =>
  apiFetch(`/api/location/reverse?lat=${lat}&lng=${lng}`)

// ---- IMAGE UPLOAD API CALLS ----
export const uploadImageAPI = (file) => {
  const formData = new FormData()
  formData.append('image', file)

  return apiFetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
}

// ---- ADMIN API CALLS ----
export const getAdminIssuesAPI = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/api/admin/issues${query ? `?${query}` : ''}`)
}

export const updateIssueStatusAPI = (id, status, comment) =>
  apiFetch(`/api/admin/issues/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, comment }),
  })

export const updateIssuePriorityAPI = (id, priority) =>
  apiFetch(`/api/admin/issues/${id}/priority`, {
    method: 'PATCH',
    body: JSON.stringify({ priority }),
  })

export const assignIssueAPI = (id, assignedToId) =>
  apiFetch(`/api/admin/issues/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedToId }),
  })

export const getAdminAnalyticsAPI = () => apiFetch('/api/admin/analytics')
