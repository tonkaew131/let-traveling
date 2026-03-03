export interface FlightInfo {
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

export interface HotelInfo {
  name: string
  rating: number
  pricePerNight: number
  location: string
  amenities: string[]
  checkIn: string
  checkOut: string
}

export interface WeatherInfo {
  date: string
  condition: string
  highTemp: number
  lowTemp: number
  humidity: number
  icon: string
}

export interface ActivityInfo {
  time: string
  name: string
  description: string
  location: string
  lat: number
  lng: number
  duration: string
  cost: number
  category: "sightseeing" | "food" | "adventure" | "culture" | "shopping" | "relaxation" | "transport"
}

export interface DayPlan {
  day: number
  date: string
  title: string
  weather: WeatherInfo
  activities: ActivityInfo[]
}

export interface TripPlan {
  destination: string
  country: string
  startDate: string
  endDate: string
  travelers: number
  totalBudget: number
  flights: {
    outbound: FlightInfo
    return: FlightInfo
  }
  hotel: HotelInfo
  dailyPlans: DayPlan[]
  summary: string
}
