import * as z from 'zod'
import { tool } from 'ai'
import { parse, toSeconds } from 'iso8601-duration'
import { duffel } from '@/lib/duffel'
import { redis } from '@/ioredis'

export type FlightData = {
    airline: string
    flightNumber: string
    duration: string
    class: string

    departure: string
    departureTime: string
    departureZone: string

    arrival: string
    arrivalTime: string
    arrivalZone: string
}

export type SearchFlightsResult = {
    outbound: FlightData
    return: FlightData
    totalPrice: number
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
        const cacheKey = `searchFlights:${from}:${to}:${departureDate}:${returnDate}:${travelers}`
        // const cachedResult = await redis.get(cacheKey)
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
                duration: outboundDurationSeconds
                    ? formatDuration(outboundDurationSeconds)
                    : null,
                class: outboundSlice.fare_brand_name,

                departure: outboundSlice.segments[0].origin.iata_code,
                departureTime: outboundSlice.segments[0].departing_at,
                departureZone: outboundSlice.segments[0].origin.time_zone,

                arrival: outboundSlice.segments[0].destination.iata_code,
                arrivalTime: outboundSlice.segments[0].arriving_at,
                arrivalZone: outboundSlice.segments[0].destination.time_zone,
            },
            return: {
                airline: returnSlice.segments[0].operating_carrier.name,
                flightNumber: `${returnSlice.segments[0].operating_carrier.iata_code}${parseInt(returnSlice.segments[0].operating_carrier_flight_number)}`,
                duration: returnDurationSeconds
                    ? formatDuration(returnDurationSeconds)
                    : null,
                class: returnSlice.fare_brand_name,

                departure: returnSlice.segments[0].origin.iata_code,
                departureTime: returnSlice.segments[0].departing_at,
                departureZone: returnSlice.segments[0].origin.time_zone,

                arrival: returnSlice.segments[0].destination.iata_code,
                arrivalTime: returnSlice.segments[0].arriving_at,
                arrivalZone: returnSlice.segments[0].destination.time_zone,
            },
        } as SearchFlightsResult
    },
})
