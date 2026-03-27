import WeatherCard from '@/components/weather-card'

interface WeatherDay {
    date: string
    condition: string
    highTemp: number
    lowTemp: number
    percentPrecipitation: number
    icon: string
}

interface WeatherStripProps {
    forecast: Array<WeatherDay>
}

export function WeatherStrip({ forecast }: WeatherStripProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {forecast.map((day) => (
                <WeatherCard key={day.date} {...day} />
            ))}
        </div>
    )
}
