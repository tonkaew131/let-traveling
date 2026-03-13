import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconHotelService, IconLoader, IconPlane } from '@tabler/icons-react'
import { parse, toSeconds } from 'iso8601-duration'
import { searchFlights, searchHotels } from './actions'
import type { DuffelResponse, OfferRequest } from '@duffel/api/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DuffelApiSection() {
    const [enabledFlights, isEnabledFlights] = useState<boolean>(false)
    const [enabledHotels, isEnabledHotels] = useState<boolean>(false)

    const { data: _flights, isLoading: isLoadingFlight } = useQuery({
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

    const flights =
        typeof _flights === 'string'
            ? (() => {
                  const data = (
                      JSON.parse(_flights) as DuffelResponse<OfferRequest>
                  ).data

                  return {
                      offersLength: data.offers.length,
                      offers: data.offers.map((o) => ({
                          totalAmount: o.total_amount,
                          slices: o.slices.map((sl) => ({
                              class: sl.fare_brand_name,
                              segments: sl.segments.map((s) => {
                                  const duration = s.duration
                                      ? (
                                            toSeconds(parse(s.duration)) / 3600
                                        ).toFixed(2) + 'h'
                                      : null

                                  const flightNumber = `${s.operating_carrier.iata_code}${parseInt(s.operating_carrier_flight_number)}`
                                  return {
                                      flight: flightNumber,
                                      carrierName: s.operating_carrier.name,
                                      duration: duration,
                                      departingAt: s.departing_at,
                                      departingFrom: s.origin.iata_code,
                                      arrivingAt: s.arriving_at,
                                      arrivingTo: s.destination.iata_code,
                                      stops: s.stops,
                                      //   ...s,
                                  }
                              }),
                          })),
                          //   ...o,
                      })),
                  }
              })()
            : undefined

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
                        ? JSON.stringify(flights, null, 2)
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
