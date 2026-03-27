'use client'

import {
    Building2,
    CarFront,
    Coffee,
    Dumbbell,
    Pencil,
    Star,
    UtensilsCrossed,
    Waves,
    Wifi,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HotelCardProps {
    name: string
    rating: number
    pricePerNight: number
    location: string
    amenities: Array<string>
    checkIn: string
    checkOut: string
    totalPrice: number
    onEdit?: () => void
}

const amenityIcons: Record<string, React.ReactNode> = {
    'Free WiFi': <Wifi className="size-3.5" />,
    Gym: <Dumbbell className="size-3.5" />,
    Restaurant: <UtensilsCrossed className="size-3.5" />,
    'Airport Shuttle': <CarFront className="size-3.5" />,
    'Breakfast Included': <Coffee className="size-3.5" />,
    Pool: <Waves className="size-3.5" />,
}

export function HotelCard({
    name,
    rating,
    pricePerNight,
    location,
    amenities,
    checkIn,
    checkOut,
    totalPrice,
    onEdit,
}: HotelCardProps) {
    const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    )

    return (
        <Card className="border-accent/20 overflow-hidden pt-0">
            <CardHeader className="bg-accent/5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="text-accent size-5" />
                        <CardTitle className="text-base">Hotel</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="fill-accent text-accent size-4" />
                            <span className="text-foreground text-sm font-semibold">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                        {onEdit && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onEdit}
                                className="gap-2"
                            >
                                <Pencil className="size-4" />
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <h3 className="text-foreground text-lg font-semibold">
                        {name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{location}</p>
                </div>
                <div className="flex gap-6">
                    <div>
                        <span className="text-muted-foreground text-xs tracking-wider uppercase">
                            Check-in
                        </span>
                        <p className="text-foreground text-sm font-medium">
                            {new Date(checkIn).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs tracking-wider uppercase">
                            Check-out
                        </span>
                        <p className="text-foreground text-sm font-medium">
                            {new Date(checkOut).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs tracking-wider uppercase">
                            Nights
                        </span>
                        <p className="text-foreground text-sm font-medium">
                            {nights}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                        <Badge
                            key={amenity}
                            variant="outline"
                            className="gap-1 text-xs font-normal"
                        >
                            {amenityIcons[amenity] || null}
                            {amenity}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-muted-foreground text-sm">
                        ${pricePerNight}/night
                    </span>
                    <div className="text-right">
                        <span className="text-foreground text-2xl font-bold">
                            ${totalPrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm">
                            {' '}
                            total
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
