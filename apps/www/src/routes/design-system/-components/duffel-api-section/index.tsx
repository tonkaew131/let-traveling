import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconHotelService, IconLoader, IconPlane } from '@tabler/icons-react'
import { searchFlights, searchHotels } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DuffelApiSection() {
    const [enabledFlights, isEnabledFlights] = useState<boolean>(false)
    const [enabledHotels, isEnabledHotels] = useState<boolean>(false)

    const { data: flights, isLoading: isLoadingFlight } = useQuery({
        queryKey: ['duffel-flight-search'],
        queryFn: async () => {
            return await searchFlights()
        },
        enabled: enabledFlights,
    })

    const { data: hotels, isLoading: isLoadingHotel } = useQuery({
        queryKey: ['duffel-hotel-search'],
        queryFn: async () => {
            return await searchHotels()
        },
        enabled: enabledHotels,
    })

    return (
        <Card className="bg-background grid grid-cols-2 gap-4 p-4">
            <Button
                onClick={() => isEnabledFlights((prev) => !prev)}
                disabled={enabledFlights}
                size="lg"
            >
                <IconPlane />
                Enable Flight Search
            </Button>

            <Button
                onClick={() => isEnabledHotels((prev) => !prev)}
                disabled={enabledHotels}
                size="lg"
            >
                <IconHotelService />
                Enable Hotel Search
            </Button>

            {isLoadingFlight ? (
                <IconLoader className="size-4 animate-spin" />
            ) : (
                <pre>
                    {typeof flights !== 'undefined'
                        ? JSON.stringify(JSON.parse(flights), null, 2)
                        : 'No data...'}
                </pre>
            )}

            {isLoadingHotel ? (
                <IconLoader className="size-4 animate-spin" />
            ) : (
                <pre>
                    {typeof hotels !== 'undefined'
                        ? JSON.stringify(JSON.parse(hotels), null, 2)
                        : 'No data...'}
                </pre>
            )}
        </Card>
    )
}
