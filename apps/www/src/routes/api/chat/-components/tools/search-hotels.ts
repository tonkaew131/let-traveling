import { tool } from 'ai'
import * as z from 'zod'

export const searchHotels = tool({
    description:
        'Search for hotels in a destination city. Use this to find accommodation options.',
    inputSchema: z.object({
        city: z.string().describe('Destination city'),
        checkIn: z.string().describe('Check-in date YYYY-MM-DD'),
        checkOut: z.string().describe('Check-out date YYYY-MM-DD'),
        guests: z.number().describe('Number of guests'),
    }),
    execute: async ({ city, checkIn, checkOut, guests }) => {
        await new Promise((r) => setTimeout(r, 600))
        const hotelNames = [
            `Grand ${city} Hotel`,
            `The ${city} Palace`,
            `${city} Boutique Stay`,
            `Four Seasons ${city}`,
            `The Ritz ${city}`,
            `Hyatt ${city} Central`,
        ]
        const name = hotelNames[Math.floor(Math.random() * hotelNames.length)]
        const pricePerNight = 80 + Math.floor(Math.random() * 300)
        const amenitiesPool = [
            'Free WiFi',
            'Pool',
            'Spa',
            'Gym',
            'Restaurant',
            'Room Service',
            'Airport Shuttle',
            'Breakfast Included',
            'Rooftop Bar',
            'Concierge',
        ]
        const amenities = amenitiesPool
            .sort(() => 0.5 - Math.random())
            .slice(0, 4 + Math.floor(Math.random() * 3))
        return {
            name,
            rating: 3.5 + Math.random() * 1.5,
            pricePerNight,
            location: `Central ${city}`,
            amenities,
            checkIn,
            checkOut,
            guests,
            totalPrice:
                pricePerNight *
                Math.ceil(
                    (new Date(checkOut).getTime() -
                        new Date(checkIn).getTime()) /
                        86400000,
                ),
        }
    },
})
