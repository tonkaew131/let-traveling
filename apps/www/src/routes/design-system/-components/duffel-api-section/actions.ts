import { createServerFn } from '@tanstack/react-start'
import { duffel } from '@/lib/duffel'

export const searchFlights = createServerFn({ method: 'GET' }).handler(
    async () => {
        const results = await duffel.offerRequests.create({
            slices: [
                {
                    origin: 'BKK',
                    destination: 'HND',
                    departure_date: '2026-04-12',
                    arrival_time: null,
                    departure_time: null,
                },
            ],
            passengers: [{ type: 'adult' }, { type: 'adult' }, { age: 1 }],
            // cabin_class: 'economy',
        })

        return JSON.stringify(results)
    },
)

export const searchHotels = createServerFn({ method: 'GET' }).handler(
    async () => {
        const results = await duffel.stays.search({
            rooms: 1,
            location: {
                radius: 2,
                geographic_coordinates: {
                    longitude: -0.1416,
                    latitude: 51.5071,
                },
            },
            check_out_date: '2026-04-16',
            check_in_date: '2026-04-12',
            guests: [{ type: 'adult' }, { type: 'adult' }],
        })

        return JSON.stringify(results)
    },
)
