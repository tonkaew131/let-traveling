

export const accuweatherConfig = {
    apiKey: process.env.ACCUWEATHER_API_KEY!,
    baseUrl: 'http://dataservice.accuweather.com',
}

if (!accuweatherConfig.apiKey) {
    console.warn('Warning: ACCUWEATHER_API_KEY is missing in environment variables');
}