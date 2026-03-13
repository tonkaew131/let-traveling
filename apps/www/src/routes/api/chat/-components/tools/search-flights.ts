import * as z from 'zod'
import { tool } from 'ai'
import { duffel } from '@/lib/duffel'

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

export const searchFlights = tool({
    description:
        'Search for flights between two cities. Use this to find flight options for the trip.',
    inputSchema: z.object({
        from: z.string().describe('Departure city'),
        to: z.string().describe('Arrival city'),
        departureDate: z
            .string()
            .describe('Departure date in YYYY-MM-DD format'),
        returnDate: z.string().describe('Return date in YYYY-MM-DD format'),
        travelers: z.number().describe('Number of travelers'),
    }),
    execute: async ({ from, to, departureDate, returnDate, travelers }) => {
        // TODO: Implement with Duffel API
        return await mockSearchFlights({
            from,
            to,
            departureDate,
            returnDate,
            travelers,
        })
    },
})
