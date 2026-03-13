import { Link, createFileRoute } from '@tanstack/react-router'
import {
    IconArrowRight,
    IconCalendar,
    IconClock,
    IconCloud,
    IconCloudRain,
    IconFileTypePdf,
    IconHotelService,
    IconMapPin,
    IconPlane,
    IconSparkles,
    IconStar,
    IconSun,
    IconTemperature,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
    component: LandingPage,
    head: () => ({
        meta: [
            {
                title: "Let's Traveling - Agentic Travel Planner",
            },
        ],
    }),
})

const features = [
    {
        icon: IconPlane,
        title: 'Flight Search',
        description:
            'Find the best flights across airlines with real-time pricing and availability. Compare options and book with confidence.',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        hoverBorder: 'hover:border-sky-300',
    },
    {
        icon: IconHotelService,
        title: 'Hotel Search',
        description:
            'Discover and compare hotels that match your budget and style. From boutique stays to luxury resorts.',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        hoverBorder: 'hover:border-violet-300',
    },
    {
        icon: IconCloud,
        title: 'Weather Forecast',
        description:
            'Get accurate weather forecasts for your destination dates so you can pack right and plan outdoor activities.',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        hoverBorder: 'hover:border-amber-300',
    },
    {
        icon: IconFileTypePdf,
        title: 'Export to PDF',
        description:
            'Export your entire trip plan as a single printable PDF. Flights, hotels, itinerary, and weather all in one document.',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        hoverBorder: 'hover:border-rose-300',
    },
]

const steps = [
    {
        step: '1',
        title: 'Describe your trip',
        description:
            'Tell us where you want to go, when, and your budget. Our AI handles the rest.',
        bg: 'bg-sky-500',
    },
    {
        step: '2',
        title: 'Review your plan',
        description:
            'Get a complete itinerary with flights, hotels, weather, and daily activities.',
        bg: 'bg-violet-500',
    },
    {
        step: '3',
        title: 'Export and go',
        description:
            'Download a printable PDF with everything you need, or keep refining with the AI.',
        bg: 'bg-emerald-500',
    },
]

const destinations = [
    { city: 'Tokyo', color: 'border-rose-200 text-rose-700 bg-rose-50' },
    { city: 'Paris', color: 'border-sky-200 text-sky-700 bg-sky-50' },
    {
        city: 'Bali',
        color: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    },
    { city: 'Rome', color: 'border-amber-200 text-amber-700 bg-amber-50' },
    {
        city: 'New York',
        color: 'border-violet-200 text-violet-700 bg-violet-50',
    },
    { city: 'London', color: 'border-indigo-200 text-indigo-700 bg-indigo-50' },
]

/* ------------------------------------------------------------------ */
/*  Faux product mockup components (purely decorative, no real data)  */
/* ------------------------------------------------------------------ */

function MockFlightCard() {
    return (
        <div className="rounded-xl border border-sky-200/60 bg-gradient-to-br from-white to-sky-50/50">
            <div className="flex items-center justify-between rounded-t-xl bg-sky-50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <IconPlane className="size-4 text-sky-600" />
                    <span className="text-foreground text-xs font-semibold">
                        Flights
                    </span>
                </div>
                <Badge
                    variant="secondary"
                    className="border-0 bg-sky-100 text-[10px] text-sky-700"
                >
                    Japan Airlines
                </Badge>
            </div>
            <div className="flex flex-col gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="text-center">
                        <p className="text-foreground text-sm font-semibold">
                            08:30
                        </p>
                        <p className="text-muted-foreground text-[10px]">JFK</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-0.5">
                        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                            <IconClock className="size-2.5" />
                            14h 05m
                        </div>
                        <div className="relative flex w-full items-center">
                            <div className="h-px flex-1 bg-sky-200" />
                            <IconPlane className="mx-1 size-3 text-sky-500" />
                            <div className="h-px flex-1 bg-sky-200" />
                        </div>
                        <p className="text-muted-foreground text-[10px]">
                            JL 005
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-foreground text-sm font-semibold">
                            11:35
                        </p>
                        <p className="text-muted-foreground text-[10px]">NRT</p>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-sky-200 pt-2">
                    <Badge
                        variant="outline"
                        className="border-sky-200 text-[10px] text-sky-700"
                    >
                        Economy
                    </Badge>
                    <div className="text-right">
                        <span className="text-foreground text-base font-bold">
                            $1,240
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                            {' '}
                            round trip
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MockDayPlanCard() {
    const activities = [
        {
            time: '9:00 AM',
            name: 'Senso-ji Temple',
            color: 'bg-rose-100 text-rose-600',
        },
        {
            time: '12:30 PM',
            name: 'Tsukiji Outer Market',
            color: 'bg-amber-100 text-amber-600',
        },
        {
            time: '3:00 PM',
            name: 'Shibuya Crossing',
            color: 'bg-violet-100 text-violet-600',
        },
    ]

    return (
        <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-white to-emerald-50/50">
            <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <IconCalendar className="size-4 text-emerald-600" />
                    <span className="text-foreground text-xs font-semibold">
                        Day 1
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                        Apr 15
                    </span>
                </div>
                <span className="text-[10px] font-medium text-emerald-600">
                    Asakusa & Shibuya
                </span>
            </div>
            <div className="flex flex-col gap-0 px-4 pb-0">
                {activities.map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex size-5 items-center justify-center rounded-full ${act.color}`}
                            >
                                <IconMapPin className="size-2.5" />
                            </div>
                            {i < activities.length - 1 && (
                                <div className="w-px flex-1 bg-emerald-200 py-2" />
                            )}
                        </div>
                        <div className="pb-3">
                            <p className="text-foreground text-[11px] font-medium">
                                {act.name}
                            </p>
                            <p className="text-muted-foreground text-[10px]">
                                {act.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function MockWeatherStrip() {
    const days = [
        { day: 'Mon', icon: IconSun, temp: '22', color: 'text-amber-500' },
        { day: 'Tue', icon: IconCloud, temp: '19', color: 'text-slate-400' },
        { day: 'Wed', icon: IconSun, temp: '24', color: 'text-amber-500' },
        { day: 'Thu', icon: IconCloudRain, temp: '17', color: 'text-sky-400' },
        { day: 'Fri', icon: IconSun, temp: '23', color: 'text-amber-500' },
    ]

    return (
        <div className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
                <IconTemperature className="size-4 text-amber-600" />
                <span className="text-foreground text-xs font-semibold">
                    Weather
                </span>
            </div>
            <div className="flex justify-between gap-1">
                {days.map((d) => (
                    <div
                        key={d.day}
                        className="flex flex-col items-center gap-1"
                    >
                        <span className="text-muted-foreground text-[10px]">
                            {d.day}
                        </span>
                        <d.icon className={`size-4 ${d.color}`} />
                        <span className="text-foreground text-[11px] font-medium">
                            {d.temp}°
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function MockHotelCard() {
    return (
        <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-white to-violet-50/50 px-4 py-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <IconHotelService className="size-4 text-violet-600" />
                    <div>
                        <p className="text-foreground text-[11px] font-semibold">
                            Hotel Gracery Shinjuku
                        </p>
                        <div className="mt-0.5 flex items-center gap-1">
                            <IconStar className="size-2.5 fill-amber-400 text-amber-400" />
                            <span className="text-muted-foreground text-[10px]">
                                4.5
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                                &middot; Shinjuku, Tokyo
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-violet-700">$89</p>
                    <p className="text-muted-foreground text-[10px]">/night</p>
                </div>
            </div>
        </div>
    )
}

function AppMockup() {
    return (
        <div className="bg-card mx-auto w-full max-w-sm rounded-2xl border shadow-lg sm:max-w-none">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <img
                    src="/logo.png"
                    alt=""
                    className="h-5 shrink-0 rounded object-contain"
                />
                <span className="text-xs font-bold text-[#516FA2]">
                    Let's Traveling
                </span>
                <div className="ml-auto flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-rose-400" />
                    <div className="size-2.5 rounded-full bg-amber-400" />
                    <div className="size-2.5 rounded-full bg-emerald-400" />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2.5 p-3">
                <MockFlightCard />
                <MockHotelCard />
                <MockWeatherStrip />
                <MockDayPlanCard />
            </div>
        </div>
    )
}

/* ------------------------------------------------------------------ */

function LandingPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Navigation */}
            <nav className="bg-card/80 sticky top-0 z-50 border-b backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Let's Traveling"
                            className="h-9 shrink-0 rounded object-contain"
                        />
                        <div>
                            <h1 className="text-base font-bold text-[#516FA2]">
                                Let's Traveling
                            </h1>
                            <p className="text-muted-foreground text-xs">
                                Agentic Travel Planner
                            </p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            render={
                                <Link to="/trips" className="text-sm">
                                    My trips
                                </Link>
                            }
                        />
                        <Button
                            render={
                                <Link to="/trips/new" className="text-sm">
                                    <IconSparkles className="size-4" />
                                    Start planning
                                </Link>
                            }
                        />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background decoration — multi-color blobs */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50/80" />
                <div className="absolute -top-32 -right-32 size-[28rem] rounded-full bg-sky-200/30 blur-3xl" />
                <div className="absolute top-1/2 -left-40 size-96 rounded-full bg-violet-200/25 blur-3xl" />
                <div className="absolute right-1/4 -bottom-24 size-80 rounded-full bg-amber-200/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-20 size-72 rounded-full bg-rose-200/20 blur-3xl" />
                <div className="absolute top-10 left-1/3 size-64 rounded-full bg-emerald-200/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Copy */}
                    <div className="max-lg:text-center">
                        <Badge
                            variant="secondary"
                            className="mb-5 gap-1.5 border-violet-200 bg-violet-50 px-3 py-1 text-violet-700"
                        >
                            <IconSparkles className="size-3" />
                            Powered by AI
                        </Badge>

                        <h2 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                            Plan your next{' '}
                            <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-500 bg-clip-text text-transparent">
                                adventure
                            </span>{' '}
                            in seconds
                        </h2>

                        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed max-lg:mx-auto sm:text-lg">
                            Tell our AI where you want to go and it will search
                            flights, find hotels, check the weather, and build a
                            complete day-by-day itinerary — ready to export as a
                            printable PDF.
                        </p>

                        <div className="mt-8 flex items-center gap-3 max-lg:justify-center">
                            <Button
                                size="lg"
                                className="h-11 bg-gradient-to-r from-sky-600 to-violet-600 px-5 text-sm text-white hover:from-sky-700 hover:to-violet-700"
                                render={
                                    <Link to="/trips/new">
                                        <IconSparkles className="size-4" />
                                        Plan a trip
                                        <IconArrowRight className="size-4" />
                                    </Link>
                                }
                            />
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-11 px-5 text-sm"
                                render={<Link to="/trips">View my trips</Link>}
                            />
                        </div>

                        {/* Destination pills — each a unique color */}
                        <div className="mt-8 flex flex-wrap items-center gap-2 max-lg:justify-center">
                            <span className="text-muted-foreground mr-1 text-xs">
                                Popular:
                            </span>
                            {destinations.map((d) => (
                                <span
                                    key={d.city}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${d.color}`}
                                >
                                    <IconMapPin className="size-3" />
                                    {d.city}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: App mockup */}
                    <div className="relative max-lg:mx-auto max-lg:max-w-sm lg:pl-4">
                        {/* Multi-color glow behind the card */}
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-200/40 via-violet-200/30 to-amber-200/40 blur-2xl" />
                        <div className="relative">
                            <AppMockup />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t">
                <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
                    <div className="text-center">
                        <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
                            Everything you need to plan a trip
                        </h3>
                        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                            Our AI agent handles the heavy lifting so you can
                            focus on the fun part.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`bg-card group rounded-xl border p-6 transition-colors ${feature.hoverBorder}`}
                            >
                                <div
                                    className={`flex size-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                                >
                                    <feature.icon
                                        className={`size-6 ${feature.iconColor}`}
                                    />
                                </div>
                                <h4 className="text-foreground mt-4 text-sm font-semibold">
                                    {feature.title}
                                </h4>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-card border-t">
                <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
                    <div className="text-center">
                        <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
                            How it works
                        </h3>
                        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                            Three simple steps to your perfect trip.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {steps.map((item, i) => (
                            <div
                                key={item.step}
                                className="relative text-center"
                            >
                                {/* Connector line between steps */}
                                {i < steps.length - 1 && (
                                    <div className="absolute top-5 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-gradient-to-r from-sky-200 via-violet-200 to-emerald-200 sm:block" />
                                )}
                                <div
                                    className={`relative mx-auto flex size-10 items-center justify-center rounded-full text-sm font-bold text-white ${item.bg}`}
                                >
                                    {item.step}
                                </div>
                                <h4 className="text-foreground mt-4 text-sm font-semibold">
                                    {item.title}
                                </h4>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t">
                <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
                    <div className="relative overflow-hidden rounded-2xl border p-8 text-center sm:p-12">
                        {/* Colorful background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-violet-50/50 to-amber-50" />
                        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-sky-200/40 blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-violet-200/40 blur-2xl" />

                        <div className="relative">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100">
                                <IconSparkles className="size-8 text-violet-600" />
                            </div>
                            <h3 className="text-foreground mt-5 text-2xl font-bold">
                                Ready to plan your next trip?
                            </h3>
                            <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-sm leading-relaxed">
                                Describe your dream trip in a few words and let
                                our AI agent handle flights, hotels, weather,
                                and itinerary planning. Export it all as a
                                printable PDF when you're done.
                            </p>
                            <div className="mt-6">
                                <Button
                                    size="lg"
                                    className="h-11 bg-gradient-to-r from-sky-600 to-violet-600 px-5 text-sm text-white hover:from-sky-700 hover:to-violet-700"
                                    render={
                                        <Link to="/trips/new">
                                            <IconSparkles className="size-4" />
                                            Start planning for free
                                            <IconArrowRight className="size-4" />
                                        </Link>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Let's Traveling"
                            className="h-6 shrink-0 rounded object-contain"
                        />
                        <span className="text-muted-foreground text-xs">
                            Let's Traveling
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Built with AI. Always verify travel details.
                    </p>
                </div>
            </footer>
        </div>
    )
}
