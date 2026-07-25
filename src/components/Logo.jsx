export default function Logo({ size = 26, showWordmark = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white dark:text-black">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-extrabold text-xl tracking-tight uppercase text-black dark:text-white font-sans">
          CIVICLENS<span className="text-emerald-500 font-light ml-0.5">.AI</span>
        </span>
      )}
    </div>
  )
}
