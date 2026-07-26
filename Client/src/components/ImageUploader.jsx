import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Camera, X, ImageIcon } from 'lucide-react'

export default function ImageUploader({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const inputRef = useRef(null)
  const cameraRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const file = files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setFileName(file.name)
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
    onFileSelect?.(null)
  }

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
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border dark:border-border-dark bg-black/[0.015] dark:bg-white/[0.02]'}
        ${preview ? 'aspect-[4/3]' : 'aspect-[4/3] flex flex-col items-center justify-center gap-3 px-6 text-center'}`}
      >
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
          onChange={(e) => handleFiles(e.target.files)}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button
                onClick={clear}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs">
                <ImageIcon size={14} />
                <span className="truncate">{fileName}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UploadCloud size={24} className="text-primary dark:text-primary-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-text-dark">Drag &amp; drop a photo, or click to browse</p>
                <p className="text-xs text-text-secondary dark:text-text-dark/60 mt-1">PNG or JPG, up to 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!preview && (
        <button
          onClick={() => cameraRef.current?.click()}
          className="btn-secondary w-full mt-3"
        >
          <Camera size={16} />
          Use camera
        </button>
      )}
    </div>
  )
}
