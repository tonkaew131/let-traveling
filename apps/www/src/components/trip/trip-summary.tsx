'use client'

import { Calendar, DollarSign, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface TripSummaryProps {
    destination: string
    country: string
    startDate: string
    endDate: string
    travelers: number
    totalBudget: number
    summary: string
}

export function TripSummary({
    destination,
    country,
    startDate,
    endDate,
    travelers,
    totalBudget,
    summary,
}: TripSummaryProps) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1

    return (
        <Card className="bg-primary/5 overflow-hidden border-0">
            <CardContent className="flex flex-col gap-4 py-5">
                <div>
                    <h2 className="text-foreground text-xl font-bold text-balance">
                        {destination}, {country}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {summary}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="bg-card flex items-center gap-2 rounded-lg border p-2.5">
                        <Calendar className="text-primary size-4" />
                        <div>
                            <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                                Duration
                            </span>
                            <p className="text-foreground text-sm font-semibold">
                                {days} days
                            </p>
                        </div>
                    </div>
                    <div className="bg-card flex items-center gap-2 rounded-lg border p-2.5">
                        <MapPin className="text-primary size-4" />
                        <div>
                            <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                                Dates
                            </span>
                            <p className="text-foreground text-sm font-semibold">
                                {start.toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                })}{' '}
                                -{' '}
                                {end.toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card flex items-center gap-2 rounded-lg border p-2.5">
                        <Users className="text-primary size-4" />
                        <div>
                            <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                                Travelers
                            </span>
                            <p className="text-foreground text-sm font-semibold">
                                {travelers}
                            </p>
                        </div>
                    </div>
                    <div className="bg-card flex items-center gap-2 rounded-lg border p-2.5">
                        <DollarSign className="text-primary size-4" />
                        <div>
                            <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                                Budget
                            </span>
                            <p className="text-foreground text-sm font-semibold">
                                ${totalBudget.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
