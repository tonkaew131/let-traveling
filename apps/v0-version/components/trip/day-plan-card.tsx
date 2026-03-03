"use client"

import { useState } from "react"
import {
  MapPin, Clock, DollarSign, Camera, UtensilsCrossed,
  Mountain, Landmark, ShoppingBag, Palmtree, Bus,
  ChevronDown, ChevronUp, Sun, Cloud, CloudRain, CloudSun
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Activity {
  time: string
  name: string
  description: string
  location: string
  lat: number
  lng: number
  duration: string
  cost: number
  category: string
}

interface DayPlanCardProps {
  day: number
  date: string
  title: string
  weather: {
    condition: string
    highTemp: number
    lowTemp: number
    icon: string
  }
  activities: Activity[]
  isActive: boolean
  onSelect: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="size-4" />,
  food: <UtensilsCrossed className="size-4" />,
  adventure: <Mountain className="size-4" />,
  culture: <Landmark className="size-4" />,
  shopping: <ShoppingBag className="size-4" />,
  relaxation: <Palmtree className="size-4" />,
  transport: <Bus className="size-4" />,
}

const categoryColors: Record<string, string> = {
  sightseeing: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  food: "bg-accent/10 text-accent border-accent/20",
  adventure: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  culture: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  shopping: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  relaxation: "bg-primary/10 text-primary border-primary/20",
  transport: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
}

const weatherIcons: Record<string, React.ReactNode> = {
  sun: <Sun className="size-4 text-accent" />,
  "cloud-sun": <CloudSun className="size-4 text-muted-foreground" />,
  cloud: <Cloud className="size-4 text-muted-foreground" />,
  "cloud-rain": <CloudRain className="size-4 text-primary" />,
}

export function DayPlanCard({ day, date, title, weather, activities, isActive, onSelect }: DayPlanCardProps) {
  const [expanded, setExpanded] = useState(isActive)
  const totalCost = activities.reduce((sum, a) => sum + a.cost, 0)

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${isActive ? "border-primary shadow-md ring-1 ring-primary/20" : "hover:border-primary/30"}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              {day}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {new Date(date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {weatherIcons[weather.icon] || <Sun className="size-4 text-accent" />}
              <span className="text-sm font-medium text-foreground">{weather.highTemp}°</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="rounded-md p-1 hover:bg-muted"
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <div className="relative flex flex-col gap-0">
            {activities.map((activity, i) => (
              <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Timeline line */}
                {i < activities.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                )}
                {/* Timeline dot */}
                <div className={`relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border ${categoryColors[activity.category] || "bg-muted"}`}>
                  {categoryIcons[activity.category] || <MapPin className="size-4" />}
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground leading-tight">{activity.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-foreground">{activity.time}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      <span className="truncate max-w-[120px]">{activity.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {activity.duration}
                    </span>
                    {activity.cost > 0 && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />
                        ${activity.cost}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">{activities.length} activities</span>
            <span className="text-sm font-semibold text-foreground">${totalCost} estimated</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
