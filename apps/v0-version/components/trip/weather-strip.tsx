"use client"

import { Sun, Cloud, CloudRain, CloudSun, Snowflake, Droplets } from "lucide-react"

interface WeatherDay {
  date: string
  condition: string
  highTemp: number
  lowTemp: number
  humidity: number
  icon: string
}

interface WeatherStripProps {
  forecast: WeatherDay[]
}

const weatherIcons: Record<string, React.ReactNode> = {
  sun: <Sun className="size-6 text-accent" />,
  "cloud-sun": <CloudSun className="size-6 text-muted-foreground" />,
  cloud: <Cloud className="size-6 text-muted-foreground" />,
  "cloud-rain": <CloudRain className="size-6 text-primary" />,
  snow: <Snowflake className="size-6 text-primary" />,
}

export function WeatherStrip({ forecast }: WeatherStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {forecast.map((day) => (
        <div
          key={day.date}
          className="flex min-w-[100px] flex-col items-center gap-2 rounded-xl bg-card p-3 border"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {new Date(day.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
          {weatherIcons[day.icon] || <Sun className="size-6 text-accent" />}
          <span className="text-xs text-muted-foreground">{day.condition}</span>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold text-foreground">{day.highTemp}°</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{day.lowTemp}°</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="size-3" />
            {day.humidity}%
          </div>
        </div>
      ))}
    </div>
  )
}
