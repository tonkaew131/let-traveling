import { tool } from 'ai'
import * as z from 'zod'
import { accuweatherConfig } from '@/lib/accuweather'

const mapWeatherIcon = (iconCode: number): string => {
    if (iconCode >= 1 && iconCode <= 5) return 'sun'
    if (iconCode >= 6 && iconCode <= 11) return 'cloud'
    if (iconCode >= 12 && iconCode <= 18) return 'cloud-rain'
    if (iconCode >= 33 && iconCode <= 44) return 'moon'
    return 'cloud-sun'
}

export const getWeatherTool = tool({
    description: 'Get weather forecast for a destination for specific dates.',
    inputSchema: z.object({
        city: z.string().describe('City name'),
        dates: z
            .array(z.string())
            .describe('Array of dates in YYYY-MM-DD format'),
    }),
    execute: async ({ city, dates }) => {
        const { apiKey, baseUrl } = accuweatherConfig
        try {
            const locationUrl = `${baseUrl}/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}`
            const locationResponse = await fetch(locationUrl)
            const locationData = await locationResponse.json()
            if (!locationData || locationData.length === 0) {
                return { error: 'Could not find location key for ' + city }
            }

            const locationKey = locationData[0].Key
            const localizedCityName = locationData[0].LocalizedName
            // const country = locationData[0].Country.ID

            const forecastUrl = `${baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true&details=true`
            const forecastResponse = await fetch(forecastUrl)
            const rawForecastData = await forecastResponse.json()

            const forecast = dates.map((requestedDate) => {
                const dayMatch = rawForecastData.DailyForecasts.find((f: any) =>
                    f.Date.startsWith(requestedDate),
                )
                if (dayMatch) {
                    return {
                        date: requestedDate,
                        condition: dayMatch.Day.IconPhrase,
                        highTemp: Math.round(
                            dayMatch.Temperature.Maximum.Value,
                        ),
                        lowTemp: Math.round(dayMatch.Temperature.Minimum.Value),
                        percentPrecipitation:
                            dayMatch.Day.PrecipitationProbability ?? 0,
                        icon: mapWeatherIcon(dayMatch.Day.Icon),
                    }
                }
                return {
                    date: requestedDate,
                    condition: 'No Data',
                    highTemp: 0,
                    lowTemp: 0,
                    percentPrecipitation: 0,
                    icon: 'cloud',
                }
            })
            return {
                city: localizedCityName,
                locationKey,
                forecast: forecast,
            }
        } catch (error) {
            console.error('Error fetching weather data:', error)
            throw new Error('Failed to fetch weather data')
        }
    },
})
