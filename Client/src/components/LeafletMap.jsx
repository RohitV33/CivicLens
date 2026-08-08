// components/LeafletMap.jsx
// Real interactive map using Leaflet + OpenStreetMap tiles
// Replaces the static SVG canvas across the entire app
import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix default marker icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ---- Status → color / emoji mapping ----
const statusConfig = {
  OPEN:        { color: '#EF4444', emoji: '🔴', label: 'Open'       },
  IN_PROGRESS: { color: '#F59E0B', emoji: '🟡', label: 'In Progress' },
  RESOLVED:    { color: '#22C55E', emoji: '🟢', label: 'Resolved'   },
}

const categoryEmoji = {
  Pothole:       '🕳️',
  Garbage:       '🗑️',
  Water:         '💧',
  Lights:        '💡',
  Infrastructure:'🏗️',
  Drainage:      '🌊',
  Animal:        '🐕',
  General:       '📍',
}

function makeIcon(status) {
  const cfg = statusConfig[status] || statusConfig.OPEN
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
      <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 40 15 40 C15 40 30 26 30 15 C30 6.7 23.3 0 15 0 Z"
            fill="${cfg.color}" stroke="white" stroke-width="2"/>
      <circle cx="15" cy="15" r="6" fill="white" opacity="0.9"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -42],
  })
}

export default function LeafletMap({
  issues = [],
  center = [28.6139, 77.2090], // Default: New Delhi
  zoom = 11,
  height = '100%',
  onMarkerClick,
  selectedId,
  className = '',
}) {
  const containerRef = useRef(null)
  const mapRef      = useRef(null)
  const markersRef  = useRef({})

  // ---- Initialize map once ----
  useEffect(() => {
    if (mapRef.current) return // already initialized
    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    })

    // OpenStreetMap dark-ish CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // ---- Update markers when issues change ----
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}

    issues.forEach((issue) => {
      const lat = issue.lat ?? issue.latitude
      const lng = issue.lng ?? issue.longitude
      if (!lat || !lng) return

      const cfg = statusConfig[issue.status] || statusConfig.OPEN
      const catEmoji = categoryEmoji[issue.category] || '📍'

      const marker = L.marker([lat, lng], { icon: makeIcon(issue.status) })

      const popupHtml = `
        <div style="font-family:'Inter',sans-serif;min-width:200px;max-width:240px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
            <span style="background:${cfg.color};color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;letter-spacing:.05em">${cfg.label.toUpperCase()}</span>
            <span style="font-size:11px;color:#888">${catEmoji} ${issue.category || 'General'}</span>
          </div>
          <p style="font-size:13px;font-weight:700;color:#111;margin:0 0 4px;line-height:1.3">${issue.title}</p>
          <p style="font-size:11px;color:#666;margin:0 0 10px">📍 ${issue.location || 'Unknown location'}</p>
          <a href="/complaint/${issue.id}"
             style="display:block;background:#111;color:white;text-align:center;padding:7px 0;border-radius:999px;font-size:11px;font-weight:700;text-decoration:none">
            View Report →
          </a>
        </div>`

      marker.bindPopup(L.popup({ maxWidth: 260, className: 'cl-popup' }).setContent(popupHtml))

      marker.on('click', () => {
        onMarkerClick?.(issue)
      })

      marker.addTo(map)
      markersRef.current[issue.id] = marker
    })
  }, [issues, onMarkerClick])

  // ---- Pan to selected marker ----
  useEffect(() => {
    if (!selectedId || !mapRef.current) return
    const marker = markersRef.current[selectedId]
    if (marker) {
      marker.openPopup()
      mapRef.current.setView(marker.getLatLng(), 14, { animate: true })
    }
  }, [selectedId])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: '100%' }}
    />
  )
}
