import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-dvh flex-col">
            <div className=" shrink-0  border-b bg-card ">
                <Link to="/">
                    <div className="flex items-center gap-3  w-fit px-4 py-3">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-9 object-contain shrink-0 rounded"
                        />
                        <div>
                            <h1 className="text-base font-bold text-[#516FA2]">
                                Let's Traveling
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Agentic Travel Planner
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            <main className="flex min-h-0 flex-1 flex-col">
                <Outlet />
            </main>
        </div>
    )
}
