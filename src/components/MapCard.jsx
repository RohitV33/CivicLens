import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const statusColor = {
  pending: '#F59E0B',
  in_review: '#2563EB',
  resolved: '#22C55E',
  rejected: '#EF4444',
}

// Deterministic pseudo-random layout so markers feel organic but stable across renders.
function seededPos(seed, i) {
  const x = ((seed * 97 + i * 53) % 82) + 8
  const y = ((seed * 61 + i * 41) % 72) + 12
  return { x, y }
}

export default function MapCard({
  markers = [],
  height = 'h-72',
  showLegend = false,
  interactive = true,
  className = '',
  onMarkerClick,
}) {
  return (
    <div className={`relative ${height} w-full rounded-2xl overflow-hidden border border-border dark:border-border-dark ${className}`}>
      {/* base */}
      <div className="absolute inset-0 bg-[#EEF2F7] dark:bg-[#0B1220]" />

      {/* road grid */}
      <svg className="absolute inset-0 w-full h-full opacity-70 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 400 300">
        {[40, 110, 190, 270, 340].map((x, i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x + 20} y2="300" stroke="#94A3B8" strokeWidth="2" />
        ))}
        {[30, 90, 150, 210, 260].map((y, i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="400" y2={y - 10} stroke="#94A3B8" strokeWidth="1.5" />
        ))}
        <rect x="60" y="60" width="70" height="50" fill="#CBD5E1" opacity="0.5" />
        <rect x="230" y="150" width="90" height="60" fill="#CBD5E1" opacity="0.5" />
        <rect x="150" y="200" width="55" height="40" fill="#CBD5E1" opacity="0.5" />
      </svg>

      {/* markers */}
      {markers.map((m, i) => {
        const pos = m.x !== undefined ? m : seededPos(i + 3, i)
        const color = statusColor[m.status] || '#2563EB'
        return (
          <motion.button
            key={m.id || i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 18 }}
            whileHover={interactive ? { scale: 1.25 } : {}}
            onClick={() => onMarkerClick?.(m)}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full group"
          >
            <MapPin size={26} fill={color} stroke="white" strokeWidth={1.5} className="drop-shadow-md" />
            {interactive && m.title && (
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="card-surface !p-2.5 !rounded-lg text-left">
                  <p className="text-xs font-medium text-text-primary dark:text-text-dark leading-snug">{m.title}</p>
                </div>
              </div>
            )}
          </motion.button>
        )
      })}

      {/* current-location pulse (only for single-marker mode) */}
      {markers.length === 1 && (
        <span
          style={{ left: `${(markers[0].x ?? seededPos(3, 0).x)}%`, top: `${(markers[0].y ?? seededPos(3, 0).y)}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/30 animate-pulseSoft"
        />
      )}

      {showLegend && (
        <div className="absolute bottom-3 left-3 card-surface !p-2.5 !rounded-lg flex items-center gap-3 text-[11px]">
          {Object.entries(statusColor).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-text-secondary dark:text-text-dark/70 capitalize">{k.replace('_', ' ')}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
