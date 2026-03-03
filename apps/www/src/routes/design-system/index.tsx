import { Link, createFileRoute } from '@tanstack/react-router'
import { IconChevronLeft } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import PromptInput from '@/components/prompt-input'

export const Route = createFileRoute('/design-system/')({
    component: RouteComponent,
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
            </main>
        </div>
    )
}
