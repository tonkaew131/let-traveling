import {
  convertToModelMessages,
  streamText,
  tool,
  stepCountIs,
} from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'
import * as z from 'zod'

export const maxDuration = 60

const activitySchema = z.object({
  time: z.string().describe('Time of the activity, e.g. "09:00 AM"'),
  name: z.string().describe('Name of the activity'),
  description: z.string().describe('Brief description'),
  location: z.string().describe('Location name'),
  lat: z.number().describe('Latitude coordinate'),
  lng: z.number().describe('Longitude coordinate'),
  duration: z.string().describe('Duration, e.g. "2 hours"'),
  cost: z.number().describe('Estimated cost in USD'),
  category: z.enum(['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'relaxation', 'transport']),
})

const tools = {
  searchFlights: tool({
    description: 'Search for flights between two cities. Use this to find flight options for the trip.',
    inputSchema: z.object({
      from: z.string().describe('Departure city'),
      to: z.string().describe('Arrival city'),
      departureDate: z.string().describe('Departure date in YYYY-MM-DD format'),
      returnDate: z.string().describe('Return date in YYYY-MM-DD format'),
      travelers: z.number().describe('Number of travelers'),
    }),
    execute: async ({ from, to, departureDate, returnDate, travelers }) => {
      await new Promise(r => setTimeout(r, 800))
      const airlines = ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'Lufthansa', 'Delta', 'Japan Airlines', 'British Airways']
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
        totalPrice: (basePrice * 2 - 50 + Math.floor(Math.random() * 100)) * travelers,
      }
    },
  }),

  searchHotels: tool({
    description: 'Search for hotels in a destination city. Use this to find accommodation options.',
    inputSchema: z.object({
      city: z.string().describe('Destination city'),
      checkIn: z.string().describe('Check-in date YYYY-MM-DD'),
      checkOut: z.string().describe('Check-out date YYYY-MM-DD'),
      guests: z.number().describe('Number of guests'),
    }),
    execute: async ({ city, checkIn, checkOut, guests }) => {
      await new Promise(r => setTimeout(r, 600))
      const hotelNames = [
        `Grand ${city} Hotel`, `The ${city} Palace`, `${city} Boutique Stay`,
        `Four Seasons ${city}`, `The Ritz ${city}`, `Hyatt ${city} Central`
      ]
      const name = hotelNames[Math.floor(Math.random() * hotelNames.length)]
      const pricePerNight = 80 + Math.floor(Math.random() * 300)
      const amenitiesPool = ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Airport Shuttle', 'Breakfast Included', 'Rooftop Bar', 'Concierge']
      const amenities = amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3))
      return {
        name,
        rating: 3.5 + Math.random() * 1.5,
        pricePerNight,
        location: `Central ${city}`,
        amenities,
        checkIn,
        checkOut,
        guests,
        totalPrice: pricePerNight * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000),
      }
    },
  }),

  getWeather: tool({
    description: 'Get weather forecast for a destination for specific dates.',
    inputSchema: z.object({
      city: z.string().describe('City name'),
      dates: z.array(z.string()).describe('Array of dates in YYYY-MM-DD format'),
    }),
    execute: async ({ city, dates }) => {
      await new Promise(r => setTimeout(r, 400))
      const conditions = [
        { condition: 'Sunny', icon: 'sun' },
        { condition: 'Partly Cloudy', icon: 'cloud-sun' },
        { condition: 'Cloudy', icon: 'cloud' },
        { condition: 'Light Rain', icon: 'cloud-rain' },
        { condition: 'Clear', icon: 'sun' },
      ]
      return {
        city,
        forecast: dates.map(date => {
          const c = conditions[Math.floor(Math.random() * conditions.length)]
          const highTemp = 65 + Math.floor(Math.random() * 25)
          return {
            date,
            condition: c.condition,
            highTemp,
            lowTemp: highTemp - 8 - Math.floor(Math.random() * 10),
            humidity: 40 + Math.floor(Math.random() * 40),
            icon: c.icon,
          }
        }),
      }
    },
  }),

  createDayPlan: tool({
    description: 'Create a detailed day-by-day itinerary for a specific day of the trip. Call this once per day.',
    inputSchema: z.object({
      day: z.number().describe('Day number of the trip'),
      date: z.string().describe('Date in YYYY-MM-DD format'),
      title: z.string().describe('A catchy title for this day, e.g. "Historic Old Town & Beach Day"'),
      city: z.string().describe('The city for this day'),
      weather: z.object({
        date: z.string(),
        condition: z.string(),
        highTemp: z.number(),
        lowTemp: z.number(),
        humidity: z.number(),
        icon: z.string(),
      }),
      activities: z.array(activitySchema).min(3).max(7).describe('List of activities for this day, ordered chronologically'),
    }),
    execute: async ({ day, date, title, city, weather, activities }) => {
      return { day, date, title, city, weather, activities }
    },
  }),

  generateTripSummary: tool({
    description: 'Generate the final trip summary after all planning is complete.',
    inputSchema: z.object({
      destination: z.string(),
      country: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      travelers: z.number(),
      totalBudget: z.number().describe('Estimated total budget in USD'),
      summary: z.string().describe('A brief, exciting 2-3 sentence summary of the trip'),
    }),
    execute: async (data) => {
      return data
    },
  }),
}

const systemPrompt = `You are Voyager, a premium AI travel planner. You create comprehensive, personalized travel plans.

When a user asks you to plan a trip, follow these steps IN ORDER:

1. First, use searchFlights to find flights
2. Then, use searchHotels to find accommodation
3. Then, use getWeather to get the weather forecast for all trip dates
4. Then, use createDayPlan for EACH day of the trip (call it multiple times, once per day). Make sure each day has:
   - A catchy title
   - 4-6 activities with real-ish coordinates for the destination
   - Realistic timing (start around 8-9 AM, end by 9-10 PM)
   - A mix of categories (sightseeing, food, culture, etc.)
   - The weather data for that specific day
5. Finally, use generateTripSummary to create the overview

IMPORTANT: 
- Use realistic latitude/longitude coordinates for actual landmarks and restaurants in the destination city
- Make activities diverse and interesting
- Include meal times (breakfast, lunch, dinner)
- Consider weather when suggesting activities
- When users ask to modify the plan, use the relevant tools to update just that part

Always be enthusiastic but professional. Format text responses with markdown for readability.`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openrouter('openai/gpt-5-mini'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(20),
  })

  return result.toUIMessageStreamResponse()
}
