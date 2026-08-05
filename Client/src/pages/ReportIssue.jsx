import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Sparkles, Loader2, CheckCircle2, AlertTriangle, Send, RefreshCw,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import ImageUploader from '../components/ImageUploader'
import MapCard from '../components/MapCard'
import { SeverityChip } from '../components/StatusChip'
import { useToast } from '../context/ToastContext'
import { createIssueAPI } from '../services/api'  // ← real API call

// Fake AI detection results (the actual AI feature can be added later)
const AI_RESULTS = [
  { issue: 'Pothole', category: 'Road Damage', department: 'Public Works Dept.', confidence: 96, severity: 'high' },
  { issue: 'Overflowing garbage bin', category: 'Waste Management', department: 'Sanitation Dept.', confidence: 91, severity: 'medium' },
  { issue: 'Damaged streetlight', category: 'Street Lighting', department: 'Electrical Dept.', confidence: 88, severity: 'low' },
]

export default function ReportIssue() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToast()

  // When user uploads a photo, simulate AI analysis (real AI can be added later)
  const handleFile = (f) => {
    setFile(f)
    setResult(null)
    setDescription('')
    if (!f) return
    setAnalyzing(true)
    setTimeout(() => {
      const r = AI_RESULTS[Math.floor(Math.random() * AI_RESULTS.length)]
      setResult(r)
      setDescription(
        `A ${r.issue.toLowerCase()} was detected at the reported location, classified under ${r.category} with ${r.severity} severity. Immediate attention from the ${r.department} is recommended.`
      )
      setAnalyzing(false)
    }, 1800)
  }

  // When user clicks "Submit Official Report" → call real backend API
  const submit = async () => {
    if (!result) return
    setSubmitting(true)
    try {
      const res = await createIssueAPI(
        result.issue,                  // title
        description,                   // description
        'GT Road, Sector 14, Ghaziabad' // location (hardcoded for now — GPS can be added)
      )
      addToast('Report submitted successfully — you can track it from your dashboard.', 'success')
      // Navigate to dashboard (the real issue ID from DB is res.data.id)
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message || 'Failed to submit report. Please login first.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="Report Issue">
      <div className="mb-8 pb-6 border-b border-black/5 dark:border-white/10">
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
          Report a <span className="font-serif-italic">civic issue</span>
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Upload a photo — AI detects the problem, measures severity, and drafts the municipal complaint in under 3 seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Uploader */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 shadow-soft border border-black/5 dark:border-white/10">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-4">Photo Evidence</h2>
            <ImageUploader onFileSelect={handleFile} />
          </Card>

          {file && (
            <Card className="bg-[#FAF8F5] dark:bg-[#16171A] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
              <label className="label-text mb-2 block">Additional Notes (Optional)</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any extra context that could help the department respond faster…"
                className="input-field resize-none rounded-2xl"
              />
            </Card>
          )}
        </div>

        {/* RIGHT: Location & AI analysis */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" />
                Current Location
              </h2>
              <button className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1">
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            <MapCard markers={[{ id: 'me', x: 45, y: 48, status: 'pending' }]} height="h-48" interactive={false} />
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-3">GT Road, Sector 14, Ghaziabad</p>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">28.6692° N, 77.4538° E · ±6m accuracy</p>
          </Card>

          <AnimatePresence mode="wait">
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl bg-[#D9E8FC] dark:bg-[#162538] p-8 text-center space-y-4 border border-blue-200 dark:border-blue-900"
              >
                <Loader2 size={32} className="animate-spin text-blue-700 dark:text-blue-300 mx-auto" />
                <h3 className="font-serif text-2xl text-blue-950 dark:text-blue-100">AI Computer Vision Audit in Progress...</h3>
                <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">Extracting issue severity, category, and municipal department routing rules</p>
              </motion.div>
            )}

            {result && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-[#C2ECD8] dark:bg-[#153428] p-8 space-y-5 border border-emerald-300/60 dark:border-emerald-900/40 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100 font-serif text-xl">
                    <Sparkles size={20} className="text-emerald-700 dark:text-emerald-300" />
                    AI Issue Auto-Detected
                  </div>
                  <span className="text-xs font-bold bg-white/80 dark:bg-black/40 text-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full">
                    {result.confidence}% Match
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2D24] space-y-2 text-sm text-neutral-800 dark:text-neutral-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-500">Detected Problem</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{result.issue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-500">Category</span>
                    <span className="font-bold">{result.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-500">Responsible Dept</span>
                    <span className="font-bold">{result.department}</span>
                  </div>
                </div>

                <Button onClick={submit} disabled={submitting} className="w-full justify-center shadow-craft text-base py-3">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {submitting ? 'Submitting to Department...' : 'Submit Official Report'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  )
}
