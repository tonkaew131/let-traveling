"use client"

import { MapPin, Calendar, Users, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TripSummaryProps {
  destination: string
  country: string
  startDate: string
  endDate: string
  travelers: number
  totalBudget: number
  summary: string
}

export function TripSummary({ destination, country, startDate, endDate, travelers, totalBudget, summary }: TripSummaryProps) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1

  return (
    <Card className="overflow-hidden border-0 bg-primary/5">
      <CardContent className="flex flex-col gap-4 py-5">
        <div>
          <h2 className="text-xl font-bold text-foreground text-balance">
            {destination}, {country}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-lg bg-card p-2.5 border">
            <Calendar className="size-4 text-primary" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</span>
              <p className="text-sm font-semibold text-foreground">{days} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card p-2.5 border">
            <MapPin className="size-4 text-primary" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Dates</span>
              <p className="text-sm font-semibold text-foreground">
                {start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - {end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card p-2.5 border">
            <Users className="size-4 text-primary" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Travelers</span>
              <p className="text-sm font-semibold text-foreground">{travelers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card p-2.5 border">
            <DollarSign className="size-4 text-primary" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</span>
              <p className="text-sm font-semibold text-foreground">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
