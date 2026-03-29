import { Clock, Pencil, Plane } from 'lucide-react'
import { IconExternalLink } from '@tabler/icons-react'
import type { FlightData } from '@/routes/api/chat/-components/tools/search-flights'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface FlightCardProps {
    outbound: FlightData
    returnFlight: FlightData
    totalPrice: number
    onEdit?: () => void
}

function FlightSegment({
    flight,
    label,
}: {
    flight: FlightData
    label: string
}) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const departureDate = flight?.departureTime
        ? new Date(flight.departureTime)
        : null
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const arrivalDate = flight?.arrivalTime
        ? new Date(flight.arrivalTime)
        : null

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                {flight.airlineLogoUrl && (
                    <img
                        src={flight.airlineLogoUrl}
                        alt={flight.airline}
                        className="size-4"
                    />
                )}
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {label}
                </span>
                <a
                    href={`https://www.flightaware.com/live/flight/${flight.flightNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconExternalLink className="text-muted-foreground size-3" />
                </a>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-foreground text-lg font-semibold">
                        {departureDate
                            ? departureDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : 'N/A'}
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
                        {arrivalDate
                            ? arrivalDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : 'N/A'}
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
    onEdit,
}: FlightCardProps) {
    return (
        <Card className="border-primary/20 overflow-hidden pt-0">
            <CardHeader className="bg-primary/5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plane className="text-primary size-5" />
                        <CardTitle className="text-base">Flights</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-0"
                        >
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {typeof outbound?.airline === 'string'
                                ? outbound.airline
                                : 'N/A'}
                        </Badge>
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
            <CardContent className="flex flex-col gap-6">
                <FlightSegment flight={outbound} label="Outbound" />
                <div className="border-t border-dashed" />
                <FlightSegment flight={returnFlight} label="Return" />
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                            {returnFlight?.class || outbound?.class || 'N/A'}
                        </Badge>
                        <span>Round trip</span>
                    </div>
                    <div className="text-right">
                        <span className="text-foreground text-2xl font-bold">
                            ${totalPrice ? totalPrice.toLocaleString() : 'N/A'}
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
