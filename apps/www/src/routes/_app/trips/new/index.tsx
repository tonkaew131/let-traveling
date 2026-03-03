import { IconSparkles } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import PromptInput from '@/components/prompt-input'

export const Route = createFileRoute('/_app/trips/new/')({
    component: RouteComponent,
})

const quickPrompts = [
    {
        label: 'Tokyo, 5 days',
        prompt: 'Plan a 5-day trip to Tokyo, Japan for 2 travelers. Budget around $3000. Departure from New York, traveling April 15-20, 2026.',
    },
    {
        label: 'Paris, 4 days',
        prompt: 'Plan a 4-day trip to Paris, France for 2 travelers. Budget around $2500. Departure from Los Angeles, traveling May 10-14, 2026.',
    },
    {
        label: 'Bali, 7 days',
        prompt: 'Plan a 7-day trip to Bali, Indonesia for 2 travelers. Budget around $2000. Departure from San Francisco, traveling June 1-8, 2026.',
    },
    {
        label: 'Rome, 3 days',
        prompt: 'Plan a 3-day trip to Rome, Italy for 1 traveler. Budget around $1500. Departure from Chicago, traveling March 20-23, 2026.',
    },
]

function RouteComponent() {
    return (
        <div className="bg-card flex min-h-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-primary/10 flex size-16 items-center justify-center rounded-2xl">
                        <IconSparkles className="text-primary size-8" />
                    </div>
                    <div>
                        <h2 className="text-foreground text-lg font-bold">
                            Plan your next adventure
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                            Tell me where you want to go, and I will plan
                            flights, hotels, weather, and a day-by-day itinerary
                            for you.
                        </p>
                    </div>
                    <div className="mt-2 grid w-full grid-cols-2 gap-2">
                        {quickPrompts.map((qp) => (
                            <button
                                key={qp.label}
                                className="bg-background hover:bg-muted rounded-xl border p-3 text-left transition-colors"
                            >
                                <span className="text-foreground text-sm font-medium">
                                    {qp.label}
                                </span>
                                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                                    Click to plan this trip
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-card border-t p-4">
                <PromptInput placeholder="Where do you want to go?" />

                <p className="text-muted-foreground mt-2 text-center text-[10px]">
                    Let's Traveling may make mistakes. Always verify important
                    travel details.
                </p>
            </div>
        </div>
    )
}
