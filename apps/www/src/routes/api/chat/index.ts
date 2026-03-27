import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'
import * as z from 'zod'
import { google } from '@ai-sdk/google'
import { getWeatherTool } from './-components/tools/get-weather'
import { searchFlights } from './-components/tools/search-flights'
import { searchHotels } from './-components/tools/search-hotels'

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
    category: z.enum([
        'sightseeing',
        'food',
        'adventure',
        'culture',
        'shopping',
        'relaxation',
        'transport',
    ]),
})

const tools = {
    searchFlights: searchFlights,

    updateFlights: tool({
        description:
            'Update flight preferences for an existing trip. Use when the user wants different flights without re-planning the whole itinerary.',
        inputSchema: z.object({
            instruction: z
                .string()
                .describe('User instruction describing what to change'),
        }),
        execute: ({ instruction }) => {
            return { instruction }
        },
    }),

    searchHotels: searchHotels,

    updateHotel: tool({
        description:
            'Update hotel preferences for an existing trip. Use when the user wants a different hotel without re-planning the whole itinerary.',
        inputSchema: z.object({
            instruction: z
                .string()
                .describe('User instruction describing what to change'),
        }),
        execute: ({ instruction }) => {
            return { instruction }
        },
    }),

    getWeather: getWeatherTool,

    createDayPlan: tool({
        description:
            'Create a detailed day-by-day itinerary for a specific day of the trip. Call this once per day.',
        inputSchema: z.object({
            day: z.number().describe('Day number of the trip'),
            date: z.string().describe('Date in YYYY-MM-DD format'),
            title: z
                .string()
                .describe(
                    'A catchy title for this day, e.g. "Historic Old Town & Beach Day"',
                ),
            city: z.string().describe('The city for this day'),
            instruction: z
                .string()
                .optional()
                .describe(
                    'Optional user instruction to update this specific day plan, e.g. "shopping instead of temples"',
                ),
            weather: z.object({
                date: z.string(),
                condition: z.string(),
                highTemp: z.number(),
                lowTemp: z.number(),
                humidity: z.number(),
                icon: z.string(),
            }),
            activities: z
                .array(activitySchema)
                .min(3)
                .max(7)
                .describe(
                    'List of activities for this day, ordered chronologically',
                ),
        }),
        execute: ({
            day,
            date,
            title,
            city,
            instruction,
            weather,
            activities,
        }) => {
            return { day, date, title, city, instruction, weather, activities }
        },
    }),

    generateTripSummary: tool({
        description:
            'Generate the final trip summary after all planning is complete.',
        inputSchema: z.object({
            destination: z.string(),
            country: z.string(),
            startDate: z.string(),
            endDate: z.string(),
            travelers: z.number(),
            totalBudget: z.number().describe('Estimated total budget in USD'),
            summary: z
                .string()
                .describe('A brief, exciting 2-3 sentence summary of the trip'),
        }),
        execute: (data) => {
            return data
        },
    }),

    googleSearch: google.tools.googleSearch({}),
}

const currentDate = new Date()
const systemPrompt = `You are Let's Traveling, a premium AI travel planner. You create comprehensive, personalized travel plans.

When a user asks you to plan a trip, follow these steps IN ORDER:

1.First, determine the best travel mode based on the user's request:
    - If the destination is far or the user mentions flying: use searchFlights.
    - If the user prefers driving, a road trip, or the locations are nearby: DO NOT call searchFlights.
    - If the user is unsure, ask for clarification or choose the most logical option based on distance.
2. Then, use searchHotels to find accommodation
3. Then, use getWeather to retrieve the forecast:
    - Detailed weather data is accessible for up to 5 days from today. 
    - For trips exceeding this duration, skip getWeather.
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

Editing rules (very important):
- If the user asks to change flights: use updateFlights to capture the instruction, then call searchFlights again with updated preferences if needed.
- If the user asks to change hotel: use updateHotel to capture the instruction, then call searchHotels again with updated preferences if needed.
- If the user asks to change a specific day: call createDayPlan ONLY for that day. Include the user's instruction in the optional instruction field and adjust activities accordingly. Do NOT regenerate other days.
- Today is ${currentDate.toDateString()}

Always be enthusiastic but professional. Format text responses with markdown for readability.`

export const Route = createFileRoute('/api/chat/')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                const { messages } = await request.json()

                // Back-compat: older persisted chats may store tool/function messages.
                // The UI chat hook expects roles: 'user' | 'assistant'.
                const sanitizedMessages = Array.isArray(messages)
                    ? messages.map((m: any) =>
                          m?.role === 'function'
                              ? { ...m, role: 'assistant' }
                              : m,
                      )
                    : messages

                const result = streamText({
                    model: openrouter('google/gemini-3-flash-preview'),
                    system: systemPrompt,
                    messages: await convertToModelMessages(sanitizedMessages),
                    tools,
                    stopWhen: stepCountIs(20),
                })

                return result.toUIMessageStreamResponse()
            },
        },
    },
})
