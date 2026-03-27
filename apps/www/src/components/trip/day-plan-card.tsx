'use client'

import { useState } from 'react'
import {
    Bus,
    Camera,
    ChevronDown,
    ChevronUp,
    Clock,
    Cloud,
    CloudRain,
    CloudSun,
    DollarSign,
    Landmark,
    MapPin,
    Mountain,
    Palmtree,
    Pencil,
    ShoppingBag,
    Sun,
    UtensilsCrossed,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    activities: Array<Activity>
    isActive: boolean
    onSelect: () => void
    onEdit?: () => void
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
    sightseeing: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    food: 'bg-accent/10 text-accent border-accent/20',
    adventure: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    culture: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
    shopping: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
    relaxation: 'bg-primary/10 text-primary border-primary/20',
    transport:
        'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
}

const weatherIcons: Record<string, React.ReactNode> = {
    sun: <Sun className="text-accent size-4" />,
    'cloud-sun': <CloudSun className="text-muted-foreground size-4" />,
    cloud: <Cloud className="text-muted-foreground size-4" />,
    'cloud-rain': <CloudRain className="text-primary size-4" />,
}

export function DayPlanCard({
    day,
    date,
    title,
    weather,
    activities,
    isActive,
    onSelect,
    onEdit,
}: DayPlanCardProps) {
    const [expanded, setExpanded] = useState(isActive)
    const totalCost = activities.reduce((sum, a) => sum + a.cost, 0)

    return (
        <Card
            className={`cursor-pointer transition-all duration-200 ${isActive ? 'border-primary ring-primary/20 shadow-md ring-1' : 'hover:border-primary/30'}`}
            onClick={onSelect}
        >
            <CardHeader className="">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg text-sm font-bold">
                            {day}
                        </div>
                        <div>
                            <CardTitle className="text-base">{title}</CardTitle>
                            <p className="text-muted-foreground text-xs">
                                {new Date(date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            {weatherIcons[weather.icon] || (
                                <Sun className="text-accent size-4" />
                            )}
                            <span className="text-foreground text-sm font-medium">
                                {weather.highTemp}°
                            </span>
                        </div>
                        {onEdit && (
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit()
                                }}
                                className="gap-2"
                            >
                                <Pencil className="size-3.5" />
                            </Button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setExpanded(!expanded)
                            }}
                            className="hover:bg-muted rounded-md p-1"
                        >
                            {expanded ? (
                                <ChevronUp className="size-4" />
                            ) : (
                                <ChevronDown className="size-4" />
                            )}
                        </button>
                    </div>
                </div>
            </CardHeader>
            {expanded && (
                <CardContent className="pt-0">
                    <div className="relative flex flex-col gap-0">
                        {activities.map((activity, i) => (
                            <div
                                key={i}
                                className="relative flex gap-3 pb-4 last:pb-0"
                            >
                                {/* Timeline line */}
                                {i < activities.length - 1 && (
                                    <div className="bg-border absolute top-8 left-[15px] h-[calc(100%-16px)] w-px" />
                                )}
                                {/* Timeline dot */}
                                <div
                                    className={`relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border ${categoryColors[activity.category] || 'bg-muted'}`}
                                >
                                    {categoryIcons[activity.category] || (
                                        <MapPin className="size-4" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="text-foreground text-sm leading-tight font-semibold">
                                                {activity.name}
                                            </h4>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-foreground shrink-0 text-xs font-medium">
                                            {activity.time}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            <span className="max-w-[120px] truncate">
                                                {activity.location}
                                            </span>
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
                        <span className="text-muted-foreground text-xs">
                            {activities.length} activities
                        </span>
                        <span className="text-foreground text-sm font-semibold">
                            ${totalCost} estimated
                        </span>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
