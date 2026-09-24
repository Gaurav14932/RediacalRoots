'use client'

/**
 * Leaflet Route Map Component
 * Loaded via next/dynamic with ssr:false since Leaflet requires browser APIs.
 */

import { useEffect, useRef } from 'react'
import type { DeliveryRun, DeliveryStop } from '@/lib/types'
import { CROP_LABELS } from '@/lib/constants'

interface RouteMapProps {
  run: DeliveryRun
}

function getStopColor(stop: DeliveryStop): string {
  if (stop.status === 'delivered') return '#22c55e'
  if (stop.status === 'in_transit') return '#f97316'
  if (stop.status === 'picked_up') return '#3b82f6'
  if (stop.type === 'pickup') return '#16a34a'
  return '#6366f1'
}

export default function RouteMap({ run }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet only on client
    import('leaflet').then((L) => {
      // Fix for missing default icons in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const center = run.stops.length > 0
        ? [run.stops[0].lat, run.stops[0].lng] as [number, number]
        : [19.7515, 75.7139] as [number, number]

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // Draw route polyline connecting stops in sequence
      const coords = run.stops.map((s) => [s.lat, s.lng] as [number, number])
      if (coords.length > 1) {
        L.polyline(coords, {
          color: '#16a34a',
          weight: 2.5,
          opacity: 0.7,
          dashArray: '6 4',
        }).addTo(map)
      }

      // Add markers for each stop
      for (const stop of run.stops) {
        const color = getStopColor(stop)
        const isPickup = stop.type === 'pickup'

        const icon = L.divIcon({
          html: `
            <div style="
              width: 28px; height: 28px;
              border-radius: ${isPickup ? '50%' : '4px'};
              background: ${color};
              border: 2.5px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 700; color: white;
            ">${stop.sequence}</div>`,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const popupContent = `
          <div style="font-family: system-ui; min-width: 180px;">
            <p style="font-weight: 700; margin: 0 0 4px;">${isPickup ? '📦 Pickup' : '🏬 Drop-off'} #${stop.sequence}</p>
            <p style="margin: 2px 0; color: #555;">${stop.contact_name}</p>
            <p style="margin: 2px 0; color: #555;">${stop.location}</p>
            <p style="margin: 4px 0; font-size: 12px;">
              ${CROP_LABELS[stop.crop_type]} • ${stop.quantity} ${stop.unit}
            </p>
            <p style="margin: 4px 0; font-size: 12px;">
              Status: <strong>${stop.status.replace('_', ' ')}</strong>
            </p>
          </div>`

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(popupContent)
      }

      // Fit map to all stop coordinates
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords)
        map.fitBounds(bounds, { padding: [40, 40] })
      } else {
        map.setView(center, 10)
      }

      // Ensure proper tile rendering on initial layout and container resize (critical for mobile/tablet screens)
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize()
        }
      }, 250)

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize()
        }
      }
      window.addEventListener('resize', handleResize)
      // Save listener reference for cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(map as any)._resizeHandler = handleResize
    })

    return () => {
      if (mapInstanceRef.current) {
        if (mapInstanceRef.current._resizeHandler) {
          window.removeEventListener('resize', mapInstanceRef.current._resizeHandler)
        }
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  // Run only once on mount — stop changes trigger parent re-render which unmounts/remounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.id])

  return (
    <div
      ref={mapRef}
      className="h-[320px] sm:h-[380px] w-full max-w-full rounded-lg overflow-hidden border border-border/60"
      style={{ zIndex: 0 }}
    />
  )
}
