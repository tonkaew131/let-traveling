"use client"

import { useState, useMemo } from "react"
import type { UIMessage } from "ai"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FlightCard } from "./flight-card"
import { HotelCard } from "./hotel-card"
import { WeatherStrip } from "./weather-strip"
import { DayPlanCard } from "./day-plan-card"
import { DayMap } from "./day-map"
import { TripSummary } from "./trip-summary"
import { Button } from "@/components/ui/button"
import { FileDown, Map, CalendarDays, Plane } from "lucide-react"

interface TripDisplayProps {
  messages: UIMessage[]
  onExportPDF: () => void
}

function extractToolData(messages: UIMessage[]) {
  const flights: any[] = []
  const hotels: any[] = []
  const weather: any[] = []
  const dayPlans: any[] = []
  const summaries: any[] = []

  for (const msg of messages) {
    for (const part of msg.parts) {
      if (part.type.startsWith("tool-") && "output" in part && part.state === "output-available") {
        const toolName = part.type.replace("tool-", "")
        const output = part.output as any
        if (toolName === "searchFlights") flights.push(output)
        if (toolName === "searchHotels") hotels.push(output)
        if (toolName === "getWeather") weather.push(output)
        if (toolName === "createDayPlan") dayPlans.push(output)
        if (toolName === "generateTripSummary") summaries.push(output)
      }
    }
  }

  return { flights, hotels, weather, dayPlans, summaries }
}

export function TripDisplay({ messages, onExportPDF }: TripDisplayProps) {
  const [activeDay, setActiveDay] = useState(0)
  const { flights, hotels, weather, dayPlans, summaries } = useMemo(
    () => extractToolData(messages),
    [messages]
  )

  const hasTripData = flights.length > 0 || hotels.length > 0 || dayPlans.length > 0
  if (!hasTripData) return null

  const sortedDayPlans = [...dayPlans].sort((a, b) => a.day - b.day)
  const currentDay = sortedDayPlans[activeDay]
  const allWeather = weather.length > 0 ? weather[0].forecast : []

  return (
    <div id="trip-display" className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <h2 className="text-lg font-bold text-foreground">Your Trip</h2>
        {dayPlans.length > 0 && (
          <Button size="sm" variant="outline" onClick={onExportPDF} className="gap-2">
            <FileDown className="size-4" />
            Export PDF
          </Button>
        )}
      </div>

      <Tabs defaultValue="itinerary" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b bg-card px-4">
          <TabsList className="h-10 w-full justify-start bg-transparent p-0">
            <TabsTrigger value="itinerary" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <CalendarDays className="size-4" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="booking" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Plane className="size-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Map className="size-4" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="itinerary" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
              {/* Trip Summary */}
              {summaries.length > 0 && (
                <TripSummary {...summaries[summaries.length - 1]} />
              )}
              {/* Weather Strip */}
              {allWeather.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Weather Forecast</h3>
                  <WeatherStrip forecast={allWeather} />
                </div>
              )}
              {/* Day Plans */}
              {sortedDayPlans.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-foreground">Daily Plans</h3>
                  {sortedDayPlans.map((plan, i) => (
                    <DayPlanCard
                      key={plan.day}
                      {...plan}
                      isActive={i === activeDay}
                      onSelect={() => setActiveDay(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="booking" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
              {flights.length > 0 && (
                <FlightCard
                  outbound={flights[flights.length - 1].outbound}
                  returnFlight={flights[flights.length - 1].return}
                  totalPrice={flights[flights.length - 1].totalPrice}
                />
              )}
              {hotels.length > 0 && (
                <HotelCard {...hotels[hotels.length - 1]} />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="map" className="flex-1 overflow-hidden m-0">
          <div className="flex h-full flex-col">
            {/* Day selector */}
            {sortedDayPlans.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-b bg-card p-3">
                {sortedDayPlans.map((plan, i) => (
                  <button
                    key={plan.day}
                    onClick={() => setActiveDay(i)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      i === activeDay
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Day {plan.day}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1">
              <DayMap
                activities={currentDay?.activities || []}
                className="h-full w-full"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
