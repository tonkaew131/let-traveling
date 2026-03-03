"use client"

import { Building2, Star, Wifi, Dumbbell, UtensilsCrossed, CarFront, Coffee, Waves } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HotelCardProps {
  name: string
  rating: number
  pricePerNight: number
  location: string
  amenities: string[]
  checkIn: string
  checkOut: string
  totalPrice: number
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="size-3.5" />,
  "Gym": <Dumbbell className="size-3.5" />,
  "Restaurant": <UtensilsCrossed className="size-3.5" />,
  "Airport Shuttle": <CarFront className="size-3.5" />,
  "Breakfast Included": <Coffee className="size-3.5" />,
  "Pool": <Waves className="size-3.5" />,
}

export function HotelCard({ name, rating, pricePerNight, location, amenities, checkIn, checkOut, totalPrice }: HotelCardProps) {
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  )

  return (
    <Card className="overflow-hidden border-accent/20">
      <CardHeader className="bg-accent/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-accent" />
            <CardTitle className="text-base">Hotel</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-accent text-accent" />
            <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div className="flex gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Check-in</span>
            <p className="text-sm font-medium text-foreground">
              {new Date(checkIn).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Check-out</span>
            <p className="text-sm font-medium text-foreground">
              {new Date(checkOut).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Nights</span>
            <p className="text-sm font-medium text-foreground">{nights}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <Badge key={amenity} variant="outline" className="gap-1 text-xs font-normal">
              {amenityIcons[amenity] || null}
              {amenity}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">${pricePerNight}/night</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">${totalPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground"> total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
