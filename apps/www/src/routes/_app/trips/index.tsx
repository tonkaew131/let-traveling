import { Link, createFileRoute } from '@tanstack/react-router'
import { IconPlaneArrival, IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { getTrips } from './-components/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_app/trips/')({
    loader: async () => {
        const trips = await getTrips()
        return { trips }
    },
    component: RouteComponent,
    head: () => ({
        meta: [{ title: "My Trips - Let's Traveling" }],
    }),
})

function RouteComponent() {
    const { trips } = Route.useLoaderData()
    const [query, setQuery] = useState('')

    const filteredTrips = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return trips
        return trips.filter((t) => (t.title || '').toLowerCase().includes(q))
    }, [query, trips])

    return (
        <div className="bg-card flex min-h-0 flex-1 flex-col">
            <div className="border-b">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-foreground text-xl font-bold">
                                My trips
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Pick up where you left off.
                            </p>
                        </div>
                        <Button
                            className="shrink-0"
                            render={
                                <Link to="/trips/new" className="text-sm">
                                    Plan a new trip
                                </Link>
                            }
                        />
                    </div>

                    <div className="relative">
                        <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search trips by title"
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
                {filteredTrips.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                        <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
                            <IconPlaneArrival className="size-7" />
                        </div>
                        <h3 className="text-foreground mt-4 text-base font-semibold">
                            {trips.length === 0
                                ? 'No trips yet'
                                : 'No trips match your search'}
                        </h3>
                        <p className="text-muted-foreground mt-1 max-w-sm text-center text-sm">
                            {trips.length === 0
                                ? "Create your first trip and I'll generate flights, hotels, weather, and a day-by-day itinerary."
                                : 'Try a different keyword.'}
                        </p>
                        {trips.length === 0 ? (
                            <div className="mt-4">
                                <Button
                                    render={
                                        <Link to="/trips/new">
                                            Plan a new trip
                                        </Link>
                                    }
                                />
                            </div>
                        ) : (
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setQuery('')}
                                >
                                    Clear search
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {filteredTrips.map((trip) => (
                            <Card key={trip.id} className="py-0">
                                <CardContent className="p-0">
                                    <Link
                                        to="/trips/$id"
                                        params={{ id: trip.id }}
                                        className="hover:bg-muted/30 block rounded-xl p-5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-foreground truncate text-sm font-semibold">
                                                    {trip.title ||
                                                        'Untitled trip'}
                                                </p>
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    Created{' '}
                                                    {new Date(
                                                        trip.createdAt,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-primary mt-0.5 shrink-0 text-xs font-medium">
                                                Open
                                            </span>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
