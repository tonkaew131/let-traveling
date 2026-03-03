'use client'

import {
    Cloud,
    CloudRain,
    CloudSun,
    Droplets,
    Snowflake,
    Sun,
} from 'lucide-react'

interface WeatherDay {
    date: string
    condition: string
    highTemp: number
    lowTemp: number
    humidity: number
    icon: string
}

interface WeatherStripProps {
    forecast: Array<WeatherDay>
}

const weatherIcons: Record<string, React.ReactNode> = {
    sun: <Sun className="text-accent size-6" />,
    'cloud-sun': <CloudSun className="text-muted-foreground size-6" />,
    cloud: <Cloud className="text-muted-foreground size-6" />,
    'cloud-rain': <CloudRain className="text-primary size-6" />,
    snow: <Snowflake className="text-primary size-6" />,
}

export function WeatherStrip({ forecast }: WeatherStripProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {forecast.map((day) => (
                <div
                    key={day.date}
                    className="bg-card flex min-w-[100px] flex-col items-center gap-2 rounded-xl border p-3"
                >
                    <span className="text-muted-foreground text-xs font-medium">
                        {new Date(day.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                    {weatherIcons[day.icon] || (
                        <Sun className="text-accent size-6" />
                    )}
                    <span className="text-muted-foreground text-xs">
                        {day.condition}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                        <span className="text-foreground font-semibold">
                            {day.highTemp}°
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">
                            {day.lowTemp}°
                        </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Droplets className="size-3" />
                        {day.humidity}%
                    </div>
                </div>
            ))}
        </div>
    )
}
