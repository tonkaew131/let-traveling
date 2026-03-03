import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
    return (
        <div className="bg-card min-h-screen">
            <main className="container mx-auto flex gap-2 py-8">
                <Button render={<Link to="/trips/new">Planning</Link>} />
                <Button
                    variant="outline"
                    render={<Link to="/design-system">Design System</Link>}
                />
            </main>
        </div>
    )
}
