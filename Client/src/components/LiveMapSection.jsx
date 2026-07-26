import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, SlidersHorizontal, ArrowRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const mapReports = [
  { id: 'CL-101', type: 'pothole', title: 'Road Crater on Main St', category: 'Pothole', color: 'bg-red-500', status: 'Pending', distance: '0.4 km', severity: 'High', location: 'GT Road, Sector 14', x: 25, y: 35 },
  { id: 'CL-102', type: 'resolved', title: 'Resurfaced Asphalt Patch', category: 'Resolved', color: 'bg-emerald-500', status: 'Resolved', distance: '1.2 km', severity: 'Low', location: 'Park Avenue, Ward 6', x: 65, y: 25 },
  { id: 'CL-103', type: 'garbage', title: 'Overflowing Bin Dump', category: 'Garbage', color: 'bg-amber-500', status: 'In Progress', distance: '0.8 km', severity: 'Medium', location: 'Market Complex, Sector 4', x: 42, y: 55 },
  { id: 'CL-104', type: 'water', title: 'Pipeline Leakage Burst', category: 'Water', color: 'bg-blue-500', status: 'Pending', distance: '1.9 km', severity: 'High', location: 'Green Park Road', x: 75, y: 68 },
  { id: 'CL-105', type: 'lights', title: 'Dark Spot Lamp Out', category: 'Lights', color: 'bg-purple-500', status: 'In Progress', distance: '2.3 km', severity: 'Low', location: 'Station Square', x: 30, y: 78 },
]

export default function LiveMapSection() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(mapReports[0])

  const filtered = filter === 'all' ? mapReports : mapReports.filter((r) => r.type === filter)

  return (
    <div className="w-full max-w-7xl mx-auto rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-craft overflow-hidden">
      
      {/* Map Header Toolbar */}
      <div className="p-6 sm:p-8 border-b border-black/5 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-Time City Monitoring
          </span>
          <h2 className="font-serif text-3xl text-neutral-900 dark:text-white mt-1">
            Live City Issue Map
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Markers', color: 'bg-neutral-800 text-white' },
            { id: 'pothole', label: 'Red: Potholes', color: 'bg-red-500 text-white' },
            { id: 'resolved', label: 'Green: Resolved', color: 'bg-emerald-500 text-white' },
            { id: 'garbage', label: 'Yellow: Garbage', color: 'bg-amber-500 text-white' },
            { id: 'water', label: 'Blue: Water', color: 'bg-blue-500 text-white' },
            { id: 'lights', label: 'Purple: Lights', color: 'bg-purple-500 text-white' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f.id
                  ? `${f.color} shadow-sm scale-105`
                  : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Body: Left Interactive Canvas + Right Sidebar */}
      <div className="grid lg:grid-cols-3 min-h-[500px]">
        
        {/* OpenStreetMap Styled Mock Viewport */}
        <div className="lg:col-span-2 relative bg-[#E5E3DF] dark:bg-[#15171A] overflow-hidden min-h-[400px]">
          {/* Subtle Grid Map Texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Map Road Vectors Graphic */}
          <svg className="absolute inset-0 w-full h-full stroke-white/40 dark:stroke-white/5 fill-none" strokeWidth="6">
            <path d="M-50,100 Q200,80 400,200 T800,300" />
            <path d="M200,-50 L200,600" />
            <path d="M500,-50 L500,600" />
            <path d="M-50,400 L900,400" />
          </svg>

          {/* Pulsing Markers */}
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              {/* Outer Pulsing Ring */}
              <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${m.color}`} />
              {/* Main Pin Circle */}
              <div className={`relative w-8 h-8 rounded-full ${m.color} text-white font-bold text-xs flex items-center justify-center shadow-lg transition-transform group-hover:scale-125`}>
                <MapPin size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Right Sidebar: Recent Reports List */}
        <div className="p-6 bg-white dark:bg-[#1A1C20] border-t lg:border-t-0 lg:border-l border-black/5 dark:border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-serif text-xl text-neutral-900 dark:text-white mb-4">
              Recent City Reports ({filtered.length})
            </h3>

            <div className="space-y-3">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`p-4 rounded-[16px] border text-left cursor-pointer transition-all ${
                    selected.id === r.id
                      ? 'bg-neutral-50 dark:bg-white/10 border-black dark:border-white shadow-sm'
                      : 'bg-white dark:bg-[#141517] border-black/5 dark:border-white/10 hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{r.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">{r.status}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-snug">{r.title}</h4>
                  <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 font-medium">
                    <span>📍 {r.location}</span>
                    <span>{r.distance}</span>
                  </div>
                </div>
              ))}
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
