import { Clock, Plane } from 'lucide-react'
import type { FlightData } from '@/routes/api/chat/-components/tools/search-flights'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FlightCardProps {
    outbound: FlightData
    returnFlight: FlightData
    totalPrice: number
}

function FlightSegment({
    flight,
    label,
}: {
    flight: FlightData
    label: string
}) {
    const departureDate = new Date(flight.departureTime)
    const arrivalDate = new Date(flight.arrivalTime)

    return (
        <div className="flex flex-col gap-3">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {label}
            </span>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-foreground text-lg font-semibold">
                        {departureDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {flight.departure}
                    </span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Clock className="size-3" />
                        {flight.duration}
                    </div>
                    <div className="relative flex w-full items-center">
                        <div className="bg-border h-px flex-1" />
                        <Plane className="text-primary mx-2 size-4" />
                        <div className="bg-border h-px flex-1" />
                    </div>
                    <span className="text-muted-foreground text-xs">
                        {flight.flightNumber}
                    </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-foreground text-lg font-semibold">
                        {arrivalDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {flight.arrival}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function FlightCard({
    outbound,
    returnFlight,
    totalPrice,
}: FlightCardProps) {
    return (
        <Card className="border-primary/20 overflow-hidden pt-0">
            <CardHeader className="bg-primary/5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plane className="text-primary size-5" />
                        <CardTitle className="text-base">Flights</CardTitle>
                    </div>
                    <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-0"
                    >
                        {outbound.airline}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <FlightSegment flight={outbound} label="Outbound" />
                <div className="border-t border-dashed" />
                <FlightSegment flight={returnFlight} label="Return" />
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                            {outbound.class}
                        </Badge>
                        <span>Round trip</span>
                    </div>
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
