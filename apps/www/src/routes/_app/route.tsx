import { IconSparkles } from '@tabler/icons-react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <div className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                    <IconSparkles className="size-5 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-foreground">
                        Let's Traveling
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Agentic Travel Planner
                    </p>
                </div>
            </div>

            <main className="flex min-h-0 flex-1 flex-col">
                <Outlet />
            </main>
        </div>
    )
}
