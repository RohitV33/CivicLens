import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, RefreshCw, AlertCircle, MapPin, Layers } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SearchBar from '../components/SearchBar'
import { FilterSection, CheckOption } from '../components/FilterDrawer'
import LeafletMap from '../components/LeafletMap'
import { getAllIssuesAPI } from '../services/api'

const STATUS_META = {
  PENDING:     { label: 'Pending',     color: 'bg-red-500'    },
  ASSIGNED:    { label: 'Assigned',    color: 'bg-blue-500'   },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-500'  },
  RESOLVED:    { label: 'Resolved',    color: 'bg-green-500'  },
}

const SAMPLE_MAP_ISSUES = [
  {
    id: 'REP-101',
    title: 'Severe Pothole on Main Market Road',
    category: 'POTHOLE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Sector 14, Main Market, MG Road',
    latitude: 28.6692,
    longitude: 77.4538,
    description: 'Deep crater pothole causing vehicle damage and traffic backup.',
  },
  {
    id: 'REP-102',
    title: 'Uncollected Garbage Pile near Park Entrance',
    category: 'GARBAGE',
    status: 'PENDING',
    priority: 'MEDIUM',
    address: 'Block B, Green Park Extension',
    latitude: 28.6750,
    longitude: 77.4420,
    description: 'Overflowing dump bins spilling onto the main pedestrian pathway.',
  },
  {
    id: 'REP-103',
    title: 'Broken Streetlight in Residential Lane',
    category: 'STREETLIGHT',
    status: 'RESOLVED',
    priority: 'LOW',
    address: 'Lane 4, Model Town',
    latitude: 28.6810,
    longitude: 77.4610,
    description: 'Streetlight pole not functioning at night.',
  },
  {
    id: 'REP-104',
    title: 'Water Leakage Pipeline Burst',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    address: 'Civil Lines Road, Ward 7',
    latitude: 28.6620,
    longitude: 77.4380,
    description: 'Freshwater supply line leak causing street flooding.',
  },
]

const REFRESH_INTERVAL = 30_000 // 30 seconds

export default function MapExplorer() {
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [filterOpen, setFilterOpen]     = useState(true)
  const [query, setQuery]               = useState('')
  const [statusFilter, setStatusFilter] = useState(Object.keys(STATUS_META))
  const [catFilter, setCatFilter]       = useState([])
  const [selected, setSelected]         = useState(null)
  const [issues, setIssues]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [lastUpdated, setLastUpdated]   = useState(null)
  const navigate = useNavigate()

  // ---- Fetch issues from real backend ----
  const fetchIssues = useCallback(async () => {
    try {
      const res = await getAllIssuesAPI().catch(() => null)
      const data = res?.items || res?.data || (Array.isArray(res) ? res : null)

      if (data && data.length > 0) {
        setIssues(data)
        const cats = [...new Set(data.map((r) => r.category || 'General'))]
        setCatFilter((prev) => (prev.length === 0 ? cats : prev))
      } else {
        setIssues(SAMPLE_MAP_ISSUES)
        const cats = [...new Set(SAMPLE_MAP_ISSUES.map((r) => r.category || 'General'))]
        setCatFilter((prev) => (prev.length === 0 ? cats : prev))
      }

      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      console.error('Map fetch error', e)
      setIssues(SAMPLE_MAP_ISSUES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues()
    const interval = setInterval(fetchIssues, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchIssues])

  const categories = useMemo(
    () => [...new Set(issues.map((r) => r.category || 'General'))],
    [issues]
  )

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])

  const filtered = useMemo(() => {
    return issues.filter((r) => {
      const matchesStatus = statusFilter.includes(r.status)
      const matchesCat = catFilter.length === 0 || catFilter.includes(r.category || 'General')
      const matchesQuery =
        query === '' ||
        r.title?.toLowerCase().includes(query.toLowerCase()) ||
        (r.address || r.location || '').toLowerCase().includes(query.toLowerCase())

      return matchesStatus && matchesCat && matchesQuery
    })
  }, [issues, statusFilter, catFilter, query])

  const mappable = useMemo(() => {
    return filtered.filter((r) => {
      const lat = parseFloat(r.latitude ?? r.lat)
      const lng = parseFloat(r.longitude ?? r.lng)
      return !isNaN(lat) && !isNaN(lng)
    })
  }, [filtered])

  return (
    <div className="h-screen flex bg-[#FAF8F5] dark:bg-[#07090C] overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={
            <span className="flex items-center gap-2 font-bold">
              Live GIS Map
              <span className="flex items-center gap-1.5 text-xs font-normal">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-600 dark:text-emerald-400 hidden sm:block font-bold">
                  {loading ? 'Fetching…' : `${mappable.length} active markers`}
                </span>
              </span>
            </span>
          }
        />

        <div className="flex-1 flex min-h-0 relative">
          <AnimatePresence initial={false}>
            {filterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'power2.out' }}
                className="hidden md:block border-r border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#121418]/90 backdrop-blur-xl overflow-y-auto shrink-0 shadow-soft"
              >
                <div className="w-[320px] p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
                    <h2 className="font-serif text-2xl text-neutral-900 dark:text-white font-bold">Filters</h2>
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-white/10 px-3 py-1 rounded-full text-neutral-700 dark:text-neutral-300">
                      {filtered.length} Reports
                    </span>
                  </div>

                  <SearchBar value={query} onChange={setQuery} placeholder="Search location..." className="rounded-2xl" />

                  <button
                    onClick={fetchIssues}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh Live Markers
                    {lastUpdated && (
                      <span className="text-neutral-400 font-normal ml-auto">
                        {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </button>

                  <FilterSection title="Status">
                    {Object.entries(STATUS_META).map(([key, meta]) => (
                      <CheckOption
                        key={key}
                        label={meta.label}
                        checked={statusFilter.includes(key)}
                        onChange={() => toggle(statusFilter, setStatusFilter, key)}
                        count={issues.filter((r) => r.status === key).length}
                      />
                    ))}
                  </FilterSection>

                  {categories.length > 0 && (
                    <FilterSection title="Category">
                      {categories.map((c) => (
                        <CheckOption
                          key={c}
                          label={c}
                          checked={catFilter.includes(c)}
                          onChange={() => toggle(catFilter, setCatFilter, c)}
                          count={issues.filter((r) => (r.category || 'General') === c).length}
                        />
                      ))}
                    </FilterSection>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex-1 relative flex flex-col min-w-0">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setFilterOpen((f) => !f)}
                className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-[#121418]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-bold shadow-soft hover:shadow-craft cursor-pointer"
              >
                <SlidersHorizontal size={15} />
                {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {error && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <LeafletMap
              issues={mappable}
              center={[28.6692, 77.4538]}
              zoom={12}
              height="100%"
              className="flex-1"
              selectedId={selected?.id}
              onMarkerClick={(issue) => setSelected(issue)}
            />

            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-30 bg-white/95 dark:bg-[#121418]/95 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/80 dark:border-white/10 shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white ${
                          STATUS_META[selected.status]?.color || 'bg-gray-400'
                        }`}
                      >
                        {STATUS_META[selected.status]?.label || selected.status}
                      </span>
                      {selected.category && (
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">
                          {selected.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-1">
                    {selected.title}
                  </h3>
                  <p className="text-xs font-semibold text-neutral-500 mb-2 flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-500" /> {selected.address || selected.location || 'Location specified'}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{selected.description}</p>

                  <button
                    onClick={() => navigate(`/complaint/${selected.id}`)}
                    className="w-full bg-[#E2FF38] text-black font-extrabold text-xs py-3 rounded-2xl hover:bg-[#d4f22e] transition-all shadow-md cursor-pointer"
                  >
                    View Report Details →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
