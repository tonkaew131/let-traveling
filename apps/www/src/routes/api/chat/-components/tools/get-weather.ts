import { tool } from 'ai'
import * as z from 'zod'

export const getWeatherTool = tool({
    description: 'Get weather forecast for a destination for specific dates.',
    inputSchema: z.object({
        city: z.string().describe('City name'),
        dates: z
            .array(z.string())
            .describe('Array of dates in YYYY-MM-DD format'),
    }),
    execute: async ({ city, dates }) => {
        await new Promise((r) => setTimeout(r, 400))
        const conditions = [
            { condition: 'Sunny', icon: 'sun' },
            { condition: 'Partly Cloudy', icon: 'cloud-sun' },
            { condition: 'Cloudy', icon: 'cloud' },
            { condition: 'Light Rain', icon: 'cloud-rain' },
            { condition: 'Clear', icon: 'sun' },
        ]

        return {
            city,
            forecast: dates.map((date) => {
                const c =
                    conditions[Math.floor(Math.random() * conditions.length)]
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
})
