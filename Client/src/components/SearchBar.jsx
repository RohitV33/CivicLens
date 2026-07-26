import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search reports, locations, IDs…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-dark/50" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary dark:hover:text-text-dark"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
