"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface Activity {
  time: string
  name: string
  lat: number
  lng: number
  category: string
}

interface DayMapProps {
  activities: Activity[]
  className?: string
}

const categoryEmoji: Record<string, string> = {
  sightseeing: "S",
  food: "F",
  adventure: "A",
  culture: "C",
  shopping: "$",
  relaxation: "R",
  transport: "T",
}

export function DayMap({ activities, className }: DayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || activities.length === 0) return

    const loadMap = async () => {
      // @ts-ignore
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

      // Clean up previous map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const bounds = activities.map((a) => [a.lat, a.lng] as [number, number])
      const center: [number, number] = [
        bounds.reduce((s, b) => s + b[0], 0) / bounds.length,
        bounds.reduce((s, b) => s + b[1], 0) / bounds.length,
      ]

      const map = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, 13)

      L.control.zoom({ position: "bottomright" }).addTo(map)

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map)

      // Add markers with custom numbered icons
      const newMarkers: any[] = []
      activities.forEach((activity, index) => {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background: #2d7a5e;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">${index + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker([activity.lat, activity.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'DM Sans', sans-serif; padding: 4px 0;">
              <strong style="font-size: 13px;">${activity.name}</strong><br/>
              <span style="font-size: 11px; color: #666;">${activity.time}</span>
            </div>`,
            { closeButton: false, offset: [0, -10] }
          )
        newMarkers.push(marker)
      })

      markersRef.current = newMarkers

      // Draw a line connecting activities in order
      if (activities.length > 1) {
        const latlngs = activities.map((a) => [a.lat, a.lng] as [number, number])
        L.polyline(latlngs, {
          color: "#2d7a5e",
          weight: 2,
          opacity: 0.5,
          dashArray: "8, 8",
        }).addTo(map)
      }

      // Fit bounds
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] })
      }

      mapInstanceRef.current = map
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [activities])

  if (activities.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="size-8" />
          <span className="text-sm">Select a day to see the map</span>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className={`rounded-xl overflow-hidden ${className}`} />
}
