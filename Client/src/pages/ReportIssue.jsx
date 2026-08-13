import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Sparkles, Loader2, AlertTriangle, Send, RefreshCw, CheckCircle2
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Card from '../components/Card'
import Button from '../components/Button'
import ImageUploader from '../components/ImageUploader'
import MapCard from '../components/MapCard'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import {
  createIssueAPI,
  uploadImageAPI,
  reverseGeocodeAPI,
  analyzeIssueAIAPI,
  classifyWasteAIAPI,
  checkDuplicateAIAPI,
} from '../services/api'

import { useLanguage } from '../context/LanguageContext'

export default function ReportIssue() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signup')
    }
  }, [user, authLoading, navigate])

  const [file, setFile] = useState(null)

  const [imageUrl, setImageUrl] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)


  const [analyzing, setAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [wasteResult, setWasteResult] = useState(null)
  const [duplicateWarning, setDuplicateWarning] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Geolocation & Reverse Geocoding State
  const [locationAddress, setLocationAddress] = useState('Detecting your GPS location...')
  const [coords, setCoords] = useState({ lat: 28.6692, lng: 77.4538 }) // Default: Ghaziabad / Delhi NCR
  const [locating, setLocating] = useState(false)

  // Get current GPS position on mount

  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationAddress('GT Road, Sector 14, Ghaziabad')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords({ lat, lng })

        try {
          const res = await reverseGeocodeAPI(lat, lng)
          setLocationAddress(res.data.address)
        } catch (err) {
          setLocationAddress(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`)
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setLocationAddress('GT Road, Sector 14, Ghaziabad (Default)')
        setLocating(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    detectUserLocation()
  }, [])

  // Handle Photo Selection & Auto AI Audit + Upload
  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile)
    setAiResult(null)
    setWasteResult(null)
    setDuplicateWarning(null)
    setImageUrl(null)

    if (!selectedFile) return

    setUploadingImage(true)
    setAnalyzing(true)

    try {
      // 1. Trigger YOLOv8 Waste Classification
      const wasteRes = await classifyWasteAIAPI(selectedFile).catch(() => null)
      if (wasteRes?.data) {
        setWasteResult(wasteRes.data)
      }

      // 2. Convert selected file to base64 Data URI for Gemini Vision
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      const dataUri = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result)
      })

      // 3. Upload photo to Cloudinary
      const uploadRes = await uploadImageAPI(selectedFile)
      const uploadedUrl = uploadRes.data.url
      setImageUrl(uploadedUrl)

      // 4. Trigger Gemini Vision AI Computer Vision Classification
      const aiRes = await analyzeIssueAIAPI({
        imageUrl: dataUri || uploadedUrl,
        title: title || selectedFile.name,
        description: description || 'Citizen reported issue',
      })

      // If YOLOv8 detected waste objects, override false non-civic flags
      if (wasteRes?.data?.detections?.length > 0 && aiRes.data) {
        aiRes.data.isCivicIssue = true
        aiRes.data.warning = null
        if (aiRes.data.category === 'OTHER') {
          aiRes.data.category = wasteRes.data.summary?.issueCategory || 'GARBAGE'
        }
      }

      setAiResult(aiRes.data)

      if (wasteRes?.data?.summary?.suggestedTitle && !title) {
        setTitle(wasteRes.data.summary.suggestedTitle)
      } else if (aiRes.data.suggestedTitle && !title) {
        setTitle(aiRes.data.suggestedTitle)
      }

      if (wasteRes?.data?.summary?.suggestedDescription && !description) {
        setDescription(wasteRes.data.summary.suggestedDescription)
      } else if (aiRes.data.suggestedDescription && !description) {
        setDescription(aiRes.data.suggestedDescription)
      }

      // 5. Trigger Geo Duplicate Check
      const dupRes = await checkDuplicateAIAPI({
        latitude: coords.lat,
        longitude: coords.lng,
        category: wasteRes?.data?.summary?.issueCategory || aiRes.data.category,
      })

      if (dupRes.data.isDuplicate) {
        setDuplicateWarning(dupRes.data.message)
      }
    } catch (err) {
      addToast(err.message || 'Image upload or AI analysis failed', 'error')
    } finally {
      setUploadingImage(false)
      setAnalyzing(false)
    }
  }

  const handleAiAutoFill = () => {
    if (aiResult?.suggestedTitle) setTitle(aiResult.suggestedTitle)
    if (aiResult?.suggestedDescription) setDescription(aiResult.suggestedDescription)
    addToast('Title and Description auto-filled using AI Vision analysis!', 'success')
  }

  // Handle Official Report Submission
  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      addToast('Please enter a title and description for the report', 'error')
      return
    }

    setSubmitting(true)
    try {
      await createIssueAPI({
        title,
        description,
        category: aiResult?.category || 'OTHER',
        priority: aiResult?.priority || 'MEDIUM',
        imageUrl,
        latitude: coords.lat,
        longitude: coords.lng,
        address: locationAddress,
        aiClassification: aiResult?.aiClassification,
        aiConfidence: aiResult?.confidence,
      })

      addToast('Report submitted successfully! Municipal officer assigned.', 'success')
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message || 'Failed to submit report. Please try logging in again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title={t('navReport')}>
      <div className="mb-8 pb-6 border-b border-black/5 dark:border-white/10">
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 dark:text-white">
          {t('reportHeaderTitle')}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {t('reportHeaderSub')}
        </p>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Upload & Fields */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 shadow-soft border border-black/5 dark:border-white/10">
            <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-4">{t('step1Title')}</h2>
            <ImageUploader onFileSelect={handleFileSelect} />
          </Card>

          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">{t('step2Title')}</h2>
              {aiResult && (
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
                >
                  <Sparkles size={13} /> AI Auto-Fill
                </button>
              )}
            </div>

            <div>
              <label className="label-text mb-1.5 block font-semibold">{t('titleLabel')}</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep crater pothole near market"
                className="input-field rounded-2xl font-bold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-text font-semibold">{t('descLabel')}</label>
                <span className="text-[11px] text-neutral-400">Editable AI Generated Draft</span>
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, hazards caused, or specific location landmarks..."
                className="input-field resize-none rounded-2xl"
              />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Location, AI Analysis & Submit */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1A1C20] rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
                <MapPin size={20} className="text-emerald-600" /> {t('locationLabel')}
              </h2>
              <button
                type="button"
                onClick={detectUserLocation}
                disabled={locating}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={13} className={locating ? 'animate-spin' : ''} />
                {locating ? 'Locating...' : t('btnLocateMe')}
              </button>
            </div>
            <MapCard
              markers={[{ id: 'new', x: 50, y: 50, status: 'pending', title: title || 'New Location' }]}
              height="h-44"
            />
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-3">{locationAddress}</p>
          </Card>

          {duplicateWarning && (
            <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/40 p-5 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm mb-0.5">Potential Duplicate Detected</p>
                {duplicateWarning}
              </div>
            </div>
          )}

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
                <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">Uploading to Cloudinary CDN & analyzing issue category & severity</p>
              </motion.div>
            )}

            {wasteResult && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 shadow-soft space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-serif text-xl font-bold text-neutral-900 dark:text-white">
                    <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
                    AI Waste Classification
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
                    YOLOv8 Detected
                  </span>
                </div>

                {/* List of detected objects with confidence bars */}
                <div className="space-y-2">
                  {wasteResult.detections?.map((d, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <span className="capitalize">{d.label || d.class}</span>
                        <span>{Math.round((d.confidence <= 1 ? d.confidence * 100 : d.confidence))}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((d.confidence <= 1 ? d.confidence * 100 : d.confidence))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-black/5 dark:border-white/10">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Primary Category</span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
                      {wasteResult.summary?.primaryLabel || wasteResult.summary?.primaryCategory}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-black/5 dark:border-white/10">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">Recommended Bin</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 capitalize">
                      {wasteResult.summary?.recommendedBinColor} ({wasteResult.summary?.recommendedBin})
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {aiResult && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl p-7 space-y-4 shadow-soft border ${
                  aiResult.isCivicIssue === false
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                    : 'bg-[#C2ECD8] dark:bg-[#153428] border-emerald-300/60 dark:border-emerald-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-serif text-xl">
                    {aiResult.isCivicIssue === false ? (
                      <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Sparkles size={20} className="text-emerald-700 dark:text-emerald-300" />
                    )}
                    {aiResult.isCivicIssue === false ? 'Non-Civic Photo Detected' : 'AI Vision Verified'}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    aiResult.isCivicIssue === false
                      ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100'
                      : 'bg-white/80 dark:bg-black/40 text-emerald-900 dark:text-emerald-200'
                  }`}>
                    {aiResult.confidence}% Confidence
                  </span>
                </div>

                {aiResult.warning && (
                  <div className="p-3.5 rounded-2xl bg-rose-100/80 dark:bg-rose-900/40 border border-rose-300/60 dark:border-rose-800 text-xs font-medium text-rose-900 dark:text-rose-200 leading-relaxed">
                    {aiResult.warning}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#1C2D24] space-y-2 text-sm text-neutral-800 dark:text-neutral-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-500">{t('categoryLabel')}</span>
                    <span className="font-bold">{aiResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-500">{t('priorityLabel')}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{aiResult.priority}</span>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-300">
                    {aiResult.aiClassification}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" disabled={submitting || uploadingImage} className="w-full justify-center shadow-craft text-base py-3.5">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? t('btnSubmitting') : t('btnSubmitReport')}
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}
