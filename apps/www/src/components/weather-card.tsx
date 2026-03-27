import {
    Cloud,
    CloudRain,
    CloudSun,
    Droplets,
    Moon,
    Snowflake,
    Sun,
} from 'lucide-react'

interface WeatherCardProps {
    date: string
    condition: string
    highTemp: number
    lowTemp: number
    percentPrecipitation: number
    icon: string
}

const weatherIcons: Record<string, React.ReactNode> = {
    sun: <Sun className="text-accent size-6" />,
    'cloud-sun': <CloudSun className="text-muted-foreground size-6" />,
    cloud: <Cloud className="text-muted-foreground size-6" />,
    'cloud-rain': <CloudRain className="text-primary size-6" />,
    snow: <Snowflake className="text-primary size-6" />,
    moon: <Moon className="size-6 text-yellow-200" />,
}

export default function WeatherCard(props: WeatherCardProps) {
    const { date, condition, highTemp, lowTemp, percentPrecipitation, icon } =
        props

    return (
        <div
            key={date}
            className="bg-card flex w-25 flex-col items-center gap-2 rounded-xl border p-3"
        >
            <span className="text-muted-foreground text-xs font-medium">
                {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                })}
            </span>
            {weatherIcons[icon] || <Sun className="text-accent size-6" />}
            <span
                className="text-muted-foreground max-w-full truncate text-xs"
                title={condition}
            >
                {condition}
            </span>
            <div className="flex items-center gap-1 text-sm">
                <span className="text-foreground font-semibold">
                    {highTemp}°
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{lowTemp}°</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Droplets className="size-3" />
                {percentPrecipitation}%
            </div>
        </div>
    )
}
