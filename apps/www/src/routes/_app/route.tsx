import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { IconPlaneArrival, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <div className="bg-card flex w-full shrink-0 items-center gap-2 border-b pr-4">
                <Link to="/">
                    <div className="flex w-fit items-center gap-3 px-4 py-3">
                        <img
                            src="/logo.png"
                            alt="Logo"
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
                    </div>
                </Link>

                <Button
                    variant="ghost"
                    render={
                        <Link
                            to="/trips"
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                            <IconPlaneArrival />
                            My trips
                        </Link>
                    }
                />

                <Button
                    variant="default"
                    className="mx-auto mr-0"
                    render={
                        <Link to="/trips/new" className="text-sm font-medium">
                            <IconPlus />
                            New trip
                        </Link>
                    }
                />
            </div>

            <main className="flex min-h-0 flex-1 flex-col">
                <Outlet />
            </main>
        </div>
    )
}
