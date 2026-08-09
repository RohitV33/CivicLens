// components/LiveMapSection.jsx
// Landing-page live map section — fetches real issues from backend
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LeafletMap from './LeafletMap'
import { getAllIssuesAPI } from '../services/api'

const STATUS_META = {
  PENDING:     { label: 'Pending',     color: 'bg-red-500',   dot: '#EF4444' },
  ASSIGNED:    { label: 'Assigned',    color: 'bg-blue-500',  dot: '#3B82F6' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-500', dot: '#F59E0B' },
  RESOLVED:    { label: 'Resolved',    color: 'bg-green-500', dot: '#22C55E' },
}

const FILTER_OPTIONS = [
  { id: 'all',         label: 'All Issues',     color: 'bg-neutral-800 text-white' },
  { id: 'PENDING',     label: '🔴 Pending',     color: 'bg-red-500 text-white'     },
  { id: 'ASSIGNED',    label: '🔵 Assigned',    color: 'bg-blue-500 text-white'    },
  { id: 'IN_PROGRESS', label: '🟡 In Progress', color: 'bg-amber-500 text-white'   },
  { id: 'RESOLVED',    label: '🟢 Resolved',    color: 'bg-green-500 text-white'   },
]

export default function LiveMapSection() {
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)
  const [issues, setIssues]     = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchIssues = useCallback(async () => {
    try {
      const res = await getAllIssuesAPI()
      const raw = res.items || res.data || []
      const data = raw.filter((r) => {
        const lat = parseFloat(r.latitude ?? r.lat)
        const lng = parseFloat(r.longitude ?? r.lng)
        return !isNaN(lat) && !isNaN(lng)
      })
      setIssues(data)
      if (data.length > 0 && !selected) setSelected(data[0])
    } catch {
      // Silently fail in landing page context
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues()
    const id = setInterval(fetchIssues, 30_000)
    return () => clearInterval(id)
  }, [fetchIssues])

  const filtered = filter === 'all' ? issues : issues.filter((r) => r.status === filter)

  return (
    <div className="w-full max-w-7xl mx-auto rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-craft overflow-hidden">

      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Real-Time City Monitoring
          </span>
          <h2 className="font-serif text-3xl text-neutral-900 dark:text-white mt-1">
            Live City Issue Map
          </h2>
          {!loading && (
            <p className="text-xs text-neutral-400 mt-0.5">
              {issues.length} issues on map · updates every 30s
            </p>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f.id
                  ? `${f.color} shadow-sm scale-105`
                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-3 min-h-[500px]">

        {/* Real Leaflet Map */}
        <div className="lg:col-span-2 relative overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-[#15171A]">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium text-neutral-500">Loading live map…</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 dark:bg-[#15171A]">
              <div className="text-center space-y-2">
                <MapPin size={32} className="mx-auto text-neutral-300" />
                <p className="text-sm text-neutral-400">No issues for this filter</p>
              </div>
            </div>
          ) : (
            <LeafletMap
              issues={filtered}
              center={[28.6139, 77.2090]}
              zoom={10}
              height="100%"
              selectedId={selected?.id}
              onMarkerClick={setSelected}
            />
          )}
        </div>

        {/* Sidebar: list + selected details */}
        <div className="p-6 bg-white dark:bg-[#1A1C20] border-t lg:border-t-0 lg:border-l border-black/5 dark:border-white/10 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[500px]">
          <div>
            <h3 className="font-serif text-xl text-neutral-900 dark:text-white mb-4">
              Recent Reports ({filtered.length})
            </h3>

            <div className="space-y-3">
              {filtered.slice(0, 6).map((r) => {
                const cfg = STATUS_META[r.status] || STATUS_META.PENDING
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`p-4 rounded-[16px] border text-left cursor-pointer transition-all ${
                      selected?.id === r.id
                        ? 'bg-neutral-50 dark:bg-white/10 border-black dark:border-white shadow-sm'
                        : 'bg-white dark:bg-[#141517] border-black/5 dark:border-white/10 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        #{r.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug">
                      {r.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 font-medium">
                      <span>📍 {r.address || r.location || 'Location specified'}</span>
                      <span className="text-[10px] bg-neutral-100 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                        {r.category || 'General'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Link
            to="/map"
            className="w-full btn-primary text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-sm"
          >
            Explore Full Map View <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
