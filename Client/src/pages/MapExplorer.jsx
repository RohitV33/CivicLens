import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, RefreshCw, AlertCircle } from 'lucide-react'
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
      const res = await getAllIssuesAPI()
      const data = res.items || res.data || []
      setIssues(data)
      // Build unique categories from fetched data
      const cats = [...new Set(data.map((r) => r.category || 'General'))]
      setCatFilter((prev) => (prev.length === 0 ? cats : prev))
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError('Could not fetch issues. Is the server running?')
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
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        (r.address || r.location || '').toLowerCase().includes(query.toLowerCase())

      return matchesStatus && matchesCat && matchesQuery
    })
  }, [issues, statusFilter, catFilter, query])

  // Map issues with valid latitude/longitude coordinates
  const mappable = useMemo(() => {
    return filtered.filter((r) => {
      const lat = parseFloat(r.latitude ?? r.lat)
      const lng = parseFloat(r.longitude ?? r.lng)
      return !isNaN(lat) && !isNaN(lng)
    })
  }, [filtered])

  return (
    <div className="h-screen flex bg-[#FAF8F5] dark:bg-[#0C0D0E] overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar with live indicator */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={
            <span className="flex items-center gap-2">
              Live Map
              <span className="flex items-center gap-1.5 text-xs font-normal">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-600 dark:text-emerald-400 hidden sm:block">
                  {loading ? 'Fetching…' : `${mappable.length} issues live`}
                </span>
              </span>
            </span>
          }
        />

        <div className="flex-1 flex min-h-0">
          {/* ---- Filter Drawer ---- */}
          <AnimatePresence initial={false}>
            {filterOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block border-r border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#141518]/90 overflow-y-auto shrink-0 shadow-sm"
              >
                <div className="w-[300px] p-6 space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                    <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">Filters</h2>
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-white/10 px-2.5 py-1 rounded-full">
                      {filtered.length} Reports
                    </span>
                  </div>

                  <SearchBar value={query} onChange={setQuery} placeholder="Search location..." className="rounded-full" />

                  {/* Refresh button */}
                  <button
                    onClick={fetchIssues}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
                  >
                    <RefreshCw size={13} />
                    Refresh Issues
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

          {/* ---- Map area ---- */}
          <div className="flex-1 relative flex flex-col min-w-0">
            {/* Toggle filter button */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setFilterOpen((f) => !f)}
                className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-[#1C1D20]/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/10 text-xs font-bold shadow-soft hover:shadow-craft"
              >
                <SlidersHorizontal size={15} />
                {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            {/* Loading overlay */}
            {!issues.length && loading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Loading live issues…</p>
                </div>
              </div>
            )}

            {/* Real Leaflet Map */}
            <LeafletMap
              issues={mappable}
              center={[28.6139, 77.2090]}
              zoom={11}
              height="100%"
              className="flex-1"
              selectedId={selected?.id}
              onMarkerClick={(issue) => setSelected(issue)}
            />

            {/* ---- Selected Issue Floating Card ---- */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-30 bg-white/95 dark:bg-[#1A1C20]/95 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-white/10 shadow-craft"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                          STATUS_META[selected.status]?.color || 'bg-gray-400'
                        }`}
                      >
                        {STATUS_META[selected.status]?.label || selected.status}
                      </span>
                      {selected.category && (
                        <span className="text-[10px] font-medium text-neutral-400">
                          {selected.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-1">
                    {selected.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-1">📍 {selected.address || selected.location || 'Unknown location'}</p>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{selected.description}</p>

                  <button
                    onClick={() => navigate(`/complaint/${selected.id}`)}
                    className="w-full btn-primary text-xs py-2.5 rounded-full"
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
