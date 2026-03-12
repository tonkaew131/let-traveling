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
        try {
            const results = await duffel.stays.search({
                rooms: 1,
                location: {
                    radius: 2, // in kilometers
                    geographic_coordinates: {
                        // latitude: 35.71576258642976,
                        // longitude: 139.72962596910423,
                        latitude: -24.38,
                        longitude: -128.32,
                    },
                },
                check_in_date: '2026-04-12',
                check_out_date: '2026-04-16',
                guests: [{ type: 'adult' }, { type: 'adult' }],
            })

            return JSON.stringify(results)
        } catch (error) {
            console.error('Error searching hotels:', error)
            throw error
        }
    },
)
