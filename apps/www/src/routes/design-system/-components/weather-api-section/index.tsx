// -components/weather-api-section.tsx
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconLoader,IconCloud } from '@tabler/icons-react'
import { searchWeather } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import WeatherCard from '@/components/weather-card'

const mapWeatherIcon = (iconCode: number): string => {
    if (iconCode >= 1 && iconCode <= 5) return 'sun';
    if (iconCode >= 6 && iconCode <= 11) return 'cloud';
    if (iconCode >= 12 && iconCode <= 18) return 'cloud-rain';
    if (iconCode >= 33 && iconCode <= 44) return 'moon';
    return 'cloud-sun'; 
}

export default function WeatherApiSection() {

    const [city, setCity] = useState('Bangkok')
    const [enabled, setEnabled] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['weather-search', city],
        queryFn: () => searchWeather({ data: city }), 
        enabled: enabled,
    })
   
    return (
        <Card className="bg-background flex flex-col gap-4 p-4">
            <div className="flex gap-2">
                <Input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Enter city name..."
                />
                <Button onClick={() => setEnabled(true)} disabled={isLoading}>
                    <IconCloud /> Fetch Weather
                </Button>
            </div>

            {isLoading ? (
                <IconLoader className="animate-spin" />
            ) : data?.DailyForecasts ? (
                <div className='flex flex-wrap gap-2'>
                    {data.DailyForecasts.map((forecast: any) => (
                        <WeatherCard
                            key={forecast.Date}
                            date={forecast.Date}
                            condition={forecast.Day.IconPhrase}
                            highTemp={Math.round(forecast.Temperature.Maximum.Value)}
                            lowTemp={Math.round(forecast.Temperature.Minimum.Value)}
                            percentPrecipitation={forecast.Day.PrecipitationProbability ?? 0}
                            icon={mapWeatherIcon(forecast.Day.Icon)}
                        />
                    ))}
                </div>
            ) : (
                    <div className="text-muted-foreground">No data fetched yet...</div>
                // <pre className="max-h-60 overflow-auto text-xs">
                //     {data ? JSON.stringify(data, null, 2) : 'No data fetched yet...'}
                // </pre>
            )}
        </Card>
    )
}