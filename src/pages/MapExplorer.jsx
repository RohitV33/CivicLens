import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Flame, Layers, X, Menu, Search } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SearchBar from '../components/SearchBar'
import { FilterSection, CheckOption } from '../components/FilterDrawer'
import MapCard from '../components/MapCard'
import { StatusChip, SeverityChip } from '../components/StatusChip'
import IssueThumb from '../components/IssueThumb'
import { reports, statusMeta } from '../data/mockData'

const categories = [...new Set(reports.map((r) => r.category))]

export default function MapExplorer() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(true)
  const [heatmap, setHeatmap] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(Object.keys(statusMeta))
  const [catFilter, setCatFilter] = useState(categories)
  const [selected, setSelected] = useState(reports[0])
  const navigate = useNavigate()

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])

  const filtered = useMemo(() => {
    return reports.filter((r) =>
      statusFilter.includes(r.status) &&
      catFilter.includes(r.category) &&
      (query === '' || r.title.toLowerCase().includes(query.toLowerCase()) || r.location.toLowerCase().includes(query.toLowerCase()))
    )
  }, [statusFilter, catFilter, query])

  const markers = filtered.map((r, i) => ({ id: r.id, status: r.status, title: r.title, x: [20, 62, 40, 75, 30, 55][i % 6], y: [30, 22, 55, 60, 75, 40][i % 6] }))

  return (
    <div className="h-screen flex bg-[#FAF8F5] dark:bg-[#0C0D0E] overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title="Live Map" />

        <div className="flex-1 flex min-h-0">
          {/* Desktop Filter Drawer - Craft Pill Filter */}
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
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-white/10 px-2.5 py-1 rounded-full">{filtered.length} Reports</span>
                  </div>

                  <SearchBar value={query} onChange={setQuery} placeholder="Search location..." className="rounded-full" />

                  <FilterSection title="Status">
                    {Object.entries(statusMeta).map(([key, meta]) => (
                      <CheckOption
                        key={key}
                        label={meta.label}
                        checked={statusFilter.includes(key)}
                        onChange={() => toggle(statusFilter, setStatusFilter, key)}
                        count={reports.filter((r) => r.status === key).length}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Category">
                    {categories.map((c) => (
                      <CheckOption
                        key={c}
                        label={c}
                        checked={catFilter.includes(c)}
                        onChange={() => toggle(catFilter, setCatFilter, c)}
                        count={reports.filter((r) => r.category === c).length}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Display Mode">
                    <button
                      onClick={() => setHeatmap((h) => !h)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
                        heatmap ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      <span className="flex items-center gap-2"><Flame size={16} /> Heatmap Intensity</span>
                      <span className="text-xs">{heatmap ? 'ON' : 'OFF'}</span>
                    </button>
                  </FilterSection>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Map canvas */}
          <div className="flex-1 relative flex flex-col min-w-0">
            {/* Top Toolbar Floating Pill */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setFilterOpen((f) => !f)}
                className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-[#1C1D20]/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/10 text-xs font-bold shadow-soft hover:shadow-craft"
              >
                <SlidersHorizontal size={15} /> {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <MapCard markers={markers} heatmap={heatmap} height="h-full" onMarkerClick={(id) => setSelected(reports.find((r) => r.id === id))} />

            {/* Selected Card Popup (Craft.do Floating Card) */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-30 bg-white/95 dark:bg-[#1A1C20]/95 backdrop-blur-xl rounded-3xl p-5 border border-white/80 dark:border-white/10 shadow-craft"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <StatusChip status={selected.status} />
                    <button onClick={() => setSelected(null)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                      <X size={16} />
                    </button>
                  </div>
                  <IssueThumb src={selected.imageUrl} title={selected.title} aspect="aspect-[16/9]" className="mb-3 rounded-2xl" />
                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-1">{selected.title}</h3>
                  <p className="text-xs text-neutral-500 mb-4">{selected.location}</p>
                  <button
                    onClick={() => navigate(`/complaint/${selected.id}`)}
                    className="w-full btn-primary text-xs py-2.5 rounded-full"
                  >
                    View Report Details &rarr;
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
