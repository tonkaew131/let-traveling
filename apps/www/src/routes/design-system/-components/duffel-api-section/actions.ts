import { createServerFn } from '@tanstack/react-start'
import { duffel } from '@/lib/duffel'

export const searchFlights = createServerFn({ method: 'GET' }).handler(
    async () => {
        const results = await duffel.offerRequests.create({
            slices: [
                {
                    origin: 'BKK',
                    destination: 'HND',
                    departure_date: '2026-03-12',
                },
            ],
            passengers: [{ type: 'adult' }, { type: 'adult' }, { age: 1 }],
            cabin_class: 'economy',
        })

        return results
    },
)
