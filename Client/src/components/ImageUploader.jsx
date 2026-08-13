import { useCallback, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Camera, X, ImageIcon, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function ImageUploader({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isLiveCameraCapture, setIsLiveCameraCapture] = useState(false)
  const inputRef = useRef(null)
  const cameraRef = useRef(null)

  // Live WebRTC Camera Modal State
  const [cameraOpen, setCameraOpen] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' (rear) or 'user' (front)
  const [cameraLoading, setCameraLoading] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const handleFiles = useCallback((files, fromLiveCamera = false) => {
    const file = files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setFileName(file.name)
    setIsLiveCameraCapture(fromLiveCamera)
    onFileSelect?.(file)
  }, [onFileSelect])

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const clear = (e) => {
    e.stopPropagation()
    setPreview(null)
    setFileName('')
    setIsLiveCameraCapture(false)
    onFileSelect?.(null)
  }

  // ---- Live WebRTC Camera Stream Handling ----
  const startCamera = async (mode = facingMode) => {
    setCameraLoading(true)
    setCameraOpen(true)
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      console.warn('⚠️ WebRTC live camera error, falling back to native file input capture:', err)
      stopCamera()
      // Fallback: Trigger native OS camera capture input
      cameraRef.current?.click()
    } finally {
      setCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }

  const captureSnapshot = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const file = new File([blob], `live_capture_${timestamp}.jpg`, { type: 'image/jpeg' })
      handleFiles([file], true)
      stopCamera()
    }, 'image/jpeg', 0.95)
  }

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    startCamera(nextMode)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        animate={{
          borderColor: isDragging ? '#2563EB' : 'var(--tw-border-opacity, 1)',
          scale: isDragging ? 1.01 : 1,
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-colors duration-200 cursor-pointer overflow-hidden
        ${isDragging ? 'border-primary bg-primary/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-white/[0.02]'}
        ${preview ? 'aspect-[4/3]' : 'aspect-[4/3] flex flex-col items-center justify-center gap-3 px-6 text-center'}`}
      >
        {/* Hidden inputs */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, true)}
        />

        <AnimatePresence>
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <button
                type="button"
                onClick={clear}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
              >
                <X size={16} />
              </button>

              {isLiveCameraCapture && (
                <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={13} /> Live Camera Capture
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs">
                <ImageIcon size={14} />
                <span className="truncate font-mono font-medium">{fileName}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <UploadCloud size={26} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Drag &amp; drop a photo, or click to browse</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">PNG or JPG, up to 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      {!preview && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={() => startCamera('environment')}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Camera size={16} />
            Capture with Live Camera
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-3 px-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <UploadCloud size={16} />
            Upload File
          </button>
        </div>
      )}

      {/* Live WebRTC Camera Overlay Modal */}
      <AnimatePresence>
        {cameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121418] rounded-3xl overflow-hidden max-w-lg w-full border border-white/10 shadow-2xl flex flex-col relative"
            >
              {/* Header */}
              <div className="p-4 bg-black/40 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Live Camera Viewfinder</span>
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Stream Container */}
              <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full object-cover"
                />
                
                {/* Viewfinder Target Reticle */}
                <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                  <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                  <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                  <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                </div>

                {cameraLoading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 text-white text-xs">
                    <RefreshCw size={24} className="animate-spin text-emerald-400" />
                    <span>Connecting to camera stream...</span>
                  </div>
                )}
              </div>

              {/* Camera Controls Footer */}
              <div className="p-6 bg-black/60 flex items-center justify-around border-t border-white/10">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Switch Front/Rear Camera"
                >
                  <RefreshCw size={20} />
                </button>

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={captureSnapshot}
                  disabled={cameraLoading}
                  className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  title="Take Photo"
                >
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-neutral-300" />
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

