// Lightweight flat-style SVG illustrations standing in for photo evidence.
// Keeps the app self-contained with no external image requests.

const palettes = {
  pothole: { bg: '#1E293B', road: '#334155', accent: '#F59E0B' },
  garbage: { bg: '#14532D', road: '#166534', accent: '#22C55E' },
  streetlight: { bg: '#0C1B33', road: '#132846', accent: '#F8FAFC' },
  waterlogging: { bg: '#0C2A4A', road: '#12406e', accent: '#3B82F6' },
  footpath: { bg: '#3F2E1E', road: '#57402A', accent: '#EF4444' },
  signal: { bg: '#2A1B3D', road: '#3E2A57', accent: '#EF4444' },
}

export default function IssueThumb({ type = 'pothole', className = '' }) {
  const p = palettes[type] || palettes.pothole

  return (
    <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.bg} />
          <stop offset="100%" stopColor={p.road} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#sky-${type})`} />

      {type === 'pothole' && (
        <>
          <rect x="0" y="140" width="400" height="120" fill={p.road} />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#F8FAFC" strokeOpacity="0.25" strokeWidth="6" strokeDasharray="24 18" />
          <ellipse cx="205" cy="188" rx="58" ry="24" fill="#0B1120" />
          <ellipse cx="205" cy="184" rx="48" ry="18" fill="#020617" />
          <ellipse cx="205" cy="184" rx="30" ry="10" fill="#111827" />
        </>
      )}

      {type === 'garbage' && (
        <>
          <rect x="0" y="150" width="400" height="110" fill={p.road} />
          <rect x="150" y="120" width="100" height="90" rx="10" fill="#0F2E1B" />
          <circle cx="185" cy="150" r="14" fill={p.accent} opacity="0.8" />
          <circle cx="220" cy="140" r="10" fill={p.accent} opacity="0.6" />
          <circle cx="205" cy="170" r="12" fill={p.accent} opacity="0.7" />
          <rect x="130" y="205" width="140" height="8" rx="4" fill="#052e13" />
        </>
      )}

      {type === 'streetlight' && (
        <>
          <rect x="0" y="180" width="400" height="80" fill={p.road} />
          <rect x="195" y="40" width="10" height="150" fill="#334155" />
          <circle cx="200" cy="35" r="22" fill={p.accent} opacity="0.15" />
          <circle cx="200" cy="35" r="10" fill="#475569" />
          <line x1="200" y1="188" x2="200" y2="260" stroke="#475569" strokeWidth="10" strokeDasharray="2 6" />
        </>
      )}

      {type === 'waterlogging' && (
        <>
          <rect x="0" y="170" width="400" height="90" fill="#0B3B66" opacity="0.8" />
          <path d="M0 170 Q 100 155 200 170 T 400 170 V 260 H 0 Z" fill={p.accent} opacity="0.35" />
          <path d="M0 190 Q 100 178 200 190 T 400 190 V 260 H 0 Z" fill={p.accent} opacity="0.25" />
        </>
      )}

      {type === 'footpath' && (
        <>
          <rect x="0" y="140" width="400" height="120" fill={p.road} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={40 + i * 70} y="160" width="55" height="80" rx="4" fill="#4B3620" stroke="#2C1D10" strokeWidth="2" transform={i % 2 ? 'rotate(2 60 190)' : ''} />
          ))}
        </>
      )}

      {type === 'signal' && (
        <>
          <rect x="0" y="190" width="400" height="70" fill={p.road} />
          <rect x="195" y="40" width="8" height="150" fill="#4C3B66" />
          <rect x="178" y="50" width="44" height="90" rx="10" fill="#1E1533" />
          <circle cx="200" cy="70" r="10" fill="#EF4444" opacity="0.9" />
          <circle cx="200" cy="95" r="10" fill="#F59E0B" opacity="0.3" />
          <circle cx="200" cy="120" r="10" fill="#22C55E" opacity="0.3" />
        </>
      )}
    </svg>
  )
}
