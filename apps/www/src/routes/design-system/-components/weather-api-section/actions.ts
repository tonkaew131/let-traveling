import { accuweatherConfig } from '@/lib/accuweather'
import { createServerFn } from '@tanstack/react-start'

export const searchWeather = createServerFn({ method: 'GET' }).inputValidator((data:string)=>data).handler(
    async ({ data: city }) => {
    const { apiKey, baseUrl } = accuweatherConfig;
    
    // Get Location Key
    const locRes = await fetch(`${baseUrl}/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}`);
    const locData = await locRes.json();
    
    if (!locData || locData.length === 0) return { error: 'City not found' };
    
    const locationKey = locData[0].Key;
    
    // Get 5-day forecast
    const forecastRes = await fetch(`${baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true&details=true`);
    return await forecastRes.json();
}
)