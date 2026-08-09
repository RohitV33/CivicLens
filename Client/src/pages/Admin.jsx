// ============================================================
// src/pages/Admin.jsx — MUNICIPAL ADMIN COMMAND CENTER PORTAL
// ============================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert, CheckCircle2, Clock, AlertTriangle, UserCheck,
  Filter, Search, RefreshCw, Loader2, Send, Award, FileText, ChevronRight
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import { StatusChip, SeverityChip } from '../components/StatusChip'
import { useToast } from '../context/ToastContext'
import {
  getAdminIssuesAPI,
  updateIssueStatusAPI,
  updateIssuePriorityAPI,
  assignIssueAPI,
  getAdminAnalyticsAPI,
} from '../services/api'

export default function AdminPortal() {
  const [issues, setIssues] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedIssueModal, setSelectedIssueModal] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusComment, setStatusComment] = useState('')
  const [submittingStatus, setSubmittingStatus] = useState(false)

  const { addToast } = useToast()

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (searchQuery) params.search = searchQuery

      const [issuesRes, analyticsRes] = await Promise.all([
        getAdminIssuesAPI(params),
        getAdminAnalyticsAPI(),
      ])

      setIssues(issuesRes.items || [])
      setAnalytics(analyticsRes.data || null)
    } catch (err) {
      addToast(err.message || 'Failed to load admin data. Ensure you are logged in as ADMIN.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    loadAdminData()
  }

  const handlePriorityChange = async (issueId, priority) => {
    setUpdatingId(issueId)
    try {
      await updateIssuePriorityAPI(issueId, priority)
      addToast(`Issue #${issueId} priority set to ${priority}`, 'success')
      loadAdminData()
    } catch (err) {
      addToast(err.message || 'Failed to update priority', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleStatusSubmit = async () => {
    if (!selectedIssueModal || !newStatus) return
    setSubmittingStatus(true)
    try {
      await updateIssueStatusAPI(selectedIssueModal.id, newStatus, statusComment)
      addToast(`Issue #${selectedIssueModal.id} status updated to ${newStatus}`, 'success')
      setSelectedIssueModal(null)
      setStatusComment('')
      loadAdminData()
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error')
    } finally {
      setSubmittingStatus(false)
    }
  }

  return (
    <AppLayout title="Admin Command Center">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldAlert size={12} /> Restricted Access (ADMIN)
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
            Municipal Operations <span className="font-serif-italic">Command Center</span>
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Review citizen complaints, override priorities, dispatch field officers, and resolve city infrastructure issues.
          </p>
        </div>
        <Button onClick={loadAdminData} icon={RefreshCw} className="shadow-craft">
          Refresh Live Data
        </Button>
      </div>

      {/* Analytics KPI Cards */}
      {analytics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#D9E8FC] dark:bg-[#162538] rounded-3xl p-6 border border-blue-200 dark:border-blue-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <FileText className="text-blue-700 dark:text-blue-300" size={20} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-800 dark:text-blue-200">Total</span>
            </div>
            <p className="text-3xl font-extrabold text-blue-950 dark:text-blue-100">{analytics.totalIssues}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mt-1">Total Issues Logged</p>
          </Card>

          <Card className="bg-[#FDE8B3] dark:bg-[#2E2416] rounded-3xl p-6 border border-amber-200 dark:border-amber-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-amber-700 dark:text-amber-300" size={20} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-200">Action Needed</span>
            </div>
            <p className="text-3xl font-extrabold text-amber-950 dark:text-amber-100">{analytics.statusBreakdown.pending}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 mt-1">Pending Review</p>
          </Card>

          <Card className="bg-[#C2ECD8] dark:bg-[#163428] rounded-3xl p-6 border border-emerald-200 dark:border-emerald-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="text-emerald-700 dark:text-emerald-300" size={20} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-200">{analytics.resolutionRate}</span>
            </div>
            <p className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-100">{analytics.statusBreakdown.resolved}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mt-1">Resolved Issues</p>
          </Card>

          <Card className="bg-[#FCE5E6] dark:bg-[#2B1B1E] rounded-3xl p-6 border border-rose-200 dark:border-rose-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-rose-700 dark:text-rose-300" size={20} />
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-800 dark:text-rose-200">Urgent</span>
            </div>
            <p className="text-3xl font-extrabold text-rose-950 dark:text-rose-100">{analytics.priorityBreakdown.critical + analytics.priorityBreakdown.high}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300 mt-1">High & Critical Priority</p>
          </Card>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-6 mb-8 border border-black/5 dark:border-white/10 shadow-soft">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                placeholder="Search issues, title, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs rounded-full"
              />
            </div>
            <Button type="submit" className="py-1.5 px-4 text-xs rounded-full">
              Search
            </Button>
          </form>
        </div>
      </Card>

      {/* Issues Table */}
      <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">
            Civic Issue Complaints Queue
          </h2>
          <span className="text-xs font-semibold text-neutral-500">
            Showing {issues.length} records
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-500 space-y-3">
            <Loader2 className="animate-spin mx-auto text-neutral-900 dark:text-white" size={32} />
            <p className="text-sm font-medium">Fetching real-time civic complaints database...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">No issues found matching selected filter.</p>
            <p className="text-xs text-neutral-500">Try changing the status tab or clearing search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">ID & Date</th>
                  <th className="py-3 px-4">Issue Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority Override</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 align-top font-mono">
                      <span className="font-bold text-neutral-900 dark:text-white">#{issue.id}</span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top max-w-xs">
                      <p className="font-bold text-neutral-900 dark:text-white text-sm leading-snug">{issue.title}</p>
                      <p className="text-neutral-500 truncate mt-0.5">{issue.address || issue.location || 'Location specified'}</p>
                      <p className="text-[11px] text-neutral-400 mt-1">Reported by: <span className="font-medium text-neutral-700 dark:text-neutral-300">{issue.createdBy?.name || 'Citizen'}</span></p>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <span className="inline-block bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded-md font-bold text-[11px]">
                        {issue.category}
                      </span>
                      {issue.aiConfidence && (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">AI {issue.aiConfidence}% match</p>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top">
                      <StatusChip status={issue.status} />
                    </td>

                    <td className="py-4 px-4 align-top">
                      <select
                        value={issue.priority}
                        disabled={updatingId === issue.id}
                        onChange={(e) => handlePriorityChange(issue.id, e.target.value)}
                        className="input-field py-1 px-2 text-xs rounded-lg bg-neutral-100 dark:bg-[#252830] font-bold"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 align-top text-right">
                      <Button
                        onClick={() => {
                          setSelectedIssueModal(issue)
                          setNewStatus(issue.status)
                        }}
                        className="py-1.5 px-3 text-xs shadow-sm"
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Status Update Modal */}
      <AnimatePresence>
        {selectedIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-black/10 dark:border-white/10 space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-400">Issue #{selectedIssueModal.id}</span>
                  <h3 className="font-serif text-2xl text-neutral-900 dark:text-white mt-0.5">{selectedIssueModal.title}</h3>
                </div>
                <button onClick={() => setSelectedIssueModal(null)} className="text-neutral-400 hover:text-black dark:hover:text-white text-xl font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-text mb-2 block font-semibold">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-field py-2 rounded-xl text-sm font-bold"
                  >
                    <option value="PENDING">PENDING (Awaiting Review)</option>
                    <option value="REVIEWING">REVIEWING (Under Officer Assessment)</option>
                    <option value="ASSIGNED">ASSIGNED (Dispatched Field Unit)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Technician On-Site Work)</option>
                    <option value="RESOLVED">RESOLVED (Issue Fixed & Closed)</option>
                    <option value="REJECTED">REJECTED (Invalid / Rejected Report)</option>
                  </select>
                </div>

                <div>
                  <label className="label-text mb-2 block font-semibold">Official Admin Comment / Field Notes</label>
                  <textarea
                    rows={3}
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Provide details about the action taken, dispatched team, or resolution details..."
                    className="input-field resize-none rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setSelectedIssueModal(null)} variant="outline" className="flex-1 justify-center py-2.5">
                  Cancel
                </Button>
                <Button onClick={handleStatusSubmit} disabled={submittingStatus} className="flex-1 justify-center py-2.5 shadow-craft">
                  {submittingStatus ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submittingStatus ? 'Saving Status...' : 'Save & Notify Citizen'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
