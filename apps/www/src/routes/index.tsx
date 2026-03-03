import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
    return (
        <div className="bg-card min-h-screen">
            <main className="container mx-auto py-8 flex gap-2">
                <Button render={<Link to="/design-system">Planning</Link>} />
                <Button
                    variant="outline"
                    render={<Link to="/design-system">Design System</Link>}
                />
            </main>
        </div>
    )
}
