import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, CheckCircle2, ShieldCheck, Flame } from 'lucide-react'

const deptPerformance = [
  { dept: 'Public Works & Roads', resolved: 96, avgHours: '3.1 hrs', count: 1240, color: 'bg-emerald-500' },
  { dept: 'Sanitation & Waste', resolved: 92, avgHours: '1.8 hrs', count: 860, color: 'bg-[#0F0F0F] dark:bg-white' },
  { dept: 'Electrical & Lighting', resolved: 94, avgHours: '2.4 hrs', count: 480, color: 'bg-amber-500' },
  { dept: 'Water Infrastructure', resolved: 89, avgHours: '4.2 hrs', count: 260, color: 'bg-blue-500' },
]

export default function CityAnalytics() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* Top 4 Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total City Reports</span>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tabular-nums">2,840</p>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">+18% this month</span>
        </div>

        <div className="p-6 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Resolution Rate</span>
          <p className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 tabular-nums">94.2%</p>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-2 block">Verified by Municipal Dept</span>
        </div>

        <div className="p-6 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-black/10 dark:border-white/10 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Avg Response Time</span>
          <p className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 tabular-nums">2.4 hrs</p>
          <span className="text-xs font-semibold text-neutral-500 mt-2 block">From photo to dispatch</span>
        </div>

        <div className="p-6 rounded-[20px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Most Common Issue</span>
          <p className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">Road Potholes</p>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-2 block">44% of total complaints</span>
        </div>
      </div>

      {/* Main Analytics Container */}
      <div className="rounded-[20px] bg-white dark:bg-[#1A1C20] p-6 sm:p-10 border border-black/10 dark:border-white/10 shadow-craft grid lg:grid-cols-2 gap-10">
        
        {/* Department Performance Bar Charts */}
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-white">Department Resolution Efficiency</h3>
            <p className="text-xs text-neutral-500 mt-1">Live municipal performance tracking across wards</p>
          </div>

          <div className="space-y-5">
            {deptPerformance.map((d) => (
              <div key={d.dept} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <span>{d.dept}</span>
                  <span>{d.resolved}% Resolved ({d.avgHours} avg)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.resolved}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${d.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Heatmap Grid */}
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-white">Weekly Incident Activity</h3>
            <p className="text-xs text-neutral-500 mt-1">Citizen reports filed per hour across the 7-day period</p>
          </div>

          {/* Heatmap Matrix Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400">{day}</span>
                {[0.4, 0.8, 0.6, 0.9, 0.3, 0.7].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-full aspect-square rounded-lg transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: `rgba(16, 185, 129, ${val})`,
                    }}
                    title={`Activity index: ${Math.round(val * 100)}%`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
