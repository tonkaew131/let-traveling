import * as z from 'zod'
import { tool } from 'ai'
import { parse, toSeconds } from 'iso8601-duration'
import { duffel } from '@/lib/duffel'
import { redis } from '@/ioredis'

type SearchFlightsResult = {
    outbound: {
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
    return: {
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
    totalPrice: number
}

const mockSearchFlights = async (options: {
    from: string
    to: string
    departureDate: string
    returnDate: string
    travelers: number
}): Promise<SearchFlightsResult> => {
    const { from, to, departureDate, returnDate, travelers } = options

    await new Promise((r) => setTimeout(r, 800))
    const airlines = [
        'Emirates',
        'Singapore Airlines',
        'Qatar Airways',
        'Lufthansa',
        'Delta',
        'Japan Airlines',
        'British Airways',
    ]
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const basePrice = 400 + Math.floor(Math.random() * 800)

    return {
        outbound: {
            airline,
            flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
            departure: from,
            arrival: to,
            departureTime: `${departureDate}T${6 + Math.floor(Math.random() * 12)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
            arrivalTime: `${departureDate}T${14 + Math.floor(Math.random() * 8)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
            duration: `${4 + Math.floor(Math.random() * 12)}h ${Math.floor(Math.random() * 4) * 15}m`,
            price: basePrice,
            class: 'Economy',
        },
        return: {
            airline,
            flightNumber: `${airline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
            departure: to,
            arrival: from,
            departureTime: `${returnDate}T${6 + Math.floor(Math.random() * 12)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
            arrivalTime: `${returnDate}T${14 + Math.floor(Math.random() * 8)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
            duration: `${4 + Math.floor(Math.random() * 12)}h ${Math.floor(Math.random() * 4) * 15}m`,
            price: basePrice - 50 + Math.floor(Math.random() * 100),
            class: 'Economy',
        },
        totalPrice:
            (basePrice * 2 - 50 + Math.floor(Math.random() * 100)) * travelers,
    }
}

const formatDuration = (durationSeconds: number) => {
    const hours = Math.floor(durationSeconds / 3600)
    const minutes = Math.floor((durationSeconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

export const searchFlights = tool({
    description:
        'Search for flights between two cities. Use this to find flight options for the trip.',
    inputSchema: z.object({
        from: z.string().describe('Departure airport in IATA code'),
        to: z.string().describe('Arrival airport in IATA code'),
        departureDate: z
            .string()
            .describe('Departure date in YYYY-MM-DD format'),
        returnDate: z.string().describe('Return date in YYYY-MM-DD format'),
        travelers: z.number().describe('Number of travelers'),
    }),
    execute: async ({ from, to, departureDate, returnDate, travelers }) => {
        // TODO: Implement with Duffel API

        const cacheKey = `searchFlights:${from}:${to}:${departureDate}:${returnDate}:${travelers}`
        const cachedResult = await redis.get(cacheKey)
        // if (cachedResult) {
        //     return JSON.parse(cachedResult)
        // }

        const results = await duffel.offerRequests.create({
            slices: [
                {
                    origin: from,
                    destination: to,
                    departure_date: departureDate,
                    departure_time: null,
                    arrival_time: null,
                },
                {
                    origin: to,
                    destination: from,
                    departure_date: returnDate,
                    departure_time: null,
                    arrival_time: null,
                },
            ],
            passengers: Array.from({ length: travelers }, () => ({
                type: 'adult',
            })),
            max_connections: 0,
        })

        await redis.set(cacheKey, JSON.stringify(results), 'EX', 60 * 60) // Cache for 1 hour

        const cheapestOffer = results.data.offers.reduce((cheapest, offer) => {
            const totalAmount = parseFloat(offer.total_amount)
            return totalAmount < parseFloat(cheapest.total_amount)
                ? offer
                : cheapest
        }, results.data.offers[0])

        const outboundSlice = cheapestOffer.slices[0]
        const returnSlice = cheapestOffer.slices[1]

        const outboundDurationSeconds = outboundSlice.duration
            ? toSeconds(parse(outboundSlice.duration))
            : null
        const returnDurationSeconds = returnSlice.duration
            ? toSeconds(parse(returnSlice.duration))
            : null

        return {
            totalPrice: parseFloat(cheapestOffer.total_amount),
            outbound: {
                airline: outboundSlice.segments[0].operating_carrier.name,
                flightNumber: `${outboundSlice.segments[0].operating_carrier.iata_code}${parseInt(outboundSlice.segments[0].operating_carrier_flight_number)}`,
                departure: outboundSlice.segments[0].origin.iata_code,
                arrival: outboundSlice.segments[0].destination.iata_code,
                departureTime: outboundSlice.segments[0].departing_at,
                arrivalTime: outboundSlice.segments[0].arriving_at,
                duration: outboundDurationSeconds
                    ? formatDuration(outboundDurationSeconds)
                    : null,
                class: outboundSlice.fare_brand_name,
                price: 0,
            },
            return: {
                airline: returnSlice.segments[0].operating_carrier.name,
                flightNumber: `${returnSlice.segments[0].operating_carrier.iata_code}${parseInt(returnSlice.segments[0].operating_carrier_flight_number)}`,
                departure: returnSlice.segments[0].origin.iata_code,
                arrival: returnSlice.segments[0].destination.iata_code,
                departureTime: returnSlice.segments[0].departing_at,
                arrivalTime: returnSlice.segments[0].arriving_at,
                duration: returnDurationSeconds
                    ? formatDuration(returnDurationSeconds)
                    : null,
                class: returnSlice.fare_brand_name,
                price: 0,
            },
        } as SearchFlightsResult

        return await mockSearchFlights({
            from,
            to,
            departureDate,
            returnDate,
            travelers,
        })
    },
})
