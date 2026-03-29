import { IconSearch } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { searchHotels } from './actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AgodaApiSection() {
    const { mutate, data, isPending } = useMutation({
        mutationFn: async () => {
            return searchHotels({
                data: {
                    query: 'Tokyo, Japan',
                    checkInDate: new Date('2026-04-12'),
                    checkOutDate: new Date('2026-04-15'),
                },
            })
        },
    })

    return (
        <Card className="bg-background grid gap-4 p-4">
            <Button
                className="w-fit"
                onClick={() => mutate()}
                disabled={isPending}
            >
                <IconSearch className="size-4" />
                Search
            </Button>

            {data && (
                <div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </Card>
    )
}
