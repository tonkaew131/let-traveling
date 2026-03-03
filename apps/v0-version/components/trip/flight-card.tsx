"use client"

import { Plane, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FlightData {
  airline: string
  flightNumber: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  class: string
}

interface FlightCardProps {
  outbound: FlightData
  returnFlight: FlightData
  totalPrice: number
}

function FlightSegment({ flight, label }: { flight: FlightData; label: string }) {
  const departureDate = new Date(flight.departureTime)
  const arrivalDate = new Date(flight.arrivalTime)

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-foreground">
            {departureDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-xs text-muted-foreground">{flight.departure}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {flight.duration}
          </div>
          <div className="relative flex w-full items-center">
            <div className="h-px flex-1 bg-border" />
            <Plane className="mx-2 size-4 text-primary" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <span className="text-xs text-muted-foreground">{flight.flightNumber}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-foreground">
            {arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-xs text-muted-foreground">{flight.arrival}</span>
        </div>
      </div>
    </div>
  )
}

export function FlightCard({ outbound, returnFlight, totalPrice }: FlightCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="size-5 text-primary" />
            <CardTitle className="text-base">Flights</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            {outbound.airline}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FlightSegment flight={outbound} label="Outbound" />
        <div className="border-t border-dashed" />
        <FlightSegment flight={returnFlight} label="Return" />
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs">{outbound.class}</Badge>
            <span>Round trip</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">${totalPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground"> total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
