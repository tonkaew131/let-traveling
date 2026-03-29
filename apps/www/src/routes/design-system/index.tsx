import { Link, createFileRoute } from '@tanstack/react-router'
import { IconChevronLeft } from '@tabler/icons-react'
import DuffelApiSection from './-components/duffel-api-section'
import WeatherApiSection from './-components/weather-api-section'
import AgodaApiSection from './-components/agoda-api-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import PromptInput from '@/components/prompt-input'
import WeatherCard from '@/components/weather-card'

export const Route = createFileRoute('/design-system/')({
    component: RouteComponent,
    head: () => ({
        meta: [{ title: 'Design System | Let Traveling' }],
    }),
})

function RouteComponent() {
    return (
        <div className="bg-card min-h-screen">
            <main className="container mx-auto grid gap-4 py-8">
                <Button
                    variant="outline"
                    className="w-fit"
                    render={
                        <Link to="/">
                            <IconChevronLeft />
                            Home
                        </Link>
                    }
                />

                <section className="grid gap-2">
                    <Label>Input</Label>
                    <Input className="max-w-md" />
                </section>

                <section className="grid gap-2">
                    <Label>Button</Label>
                    <div className="flex flex-wrap items-center">
                        <Button>Default</Button>
                    </div>
                </section>

                <section className="grid gap-2">
                    <Label>Prompt Input</Label>
                    <PromptInput placeholder="Where do you want to go?" />
                </section>

                <section className="grid gap-2">
                    <Label>Weather Card</Label>
                    <div className="bg-background flex flex-wrap items-center rounded-xl border p-2">
                        <WeatherCard
                            date="2026-04-15"
                            icon="cloud-sun"
                            condition="Partly Cloudy"
                            highTemp={88}
                            lowTemp={75}
                            percentPrecipitation={20}
                        />
                    </div>
                </section>
                <section className="grid gap-2">
                    <Label>Weather API Real Data</Label>
                    <WeatherApiSection />
                </section>
                <section className="grid gap-2">
                    <Label>Duffel API</Label>
                    <DuffelApiSection />
                </section>
                <section className="grid gap-2">
                    <Label>Agoda API</Label>
                    <AgodaApiSection />
                </section>
            </main>
        </div>
    )
}
