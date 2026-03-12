import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconLoader } from '@tabler/icons-react'
import { searchFlights } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DuffelApiSection() {
    const [enabled, isEnabled] = useState<boolean>(false)
    const { data, isLoading } = useQuery({
        queryKey: ['duffel-flight-search'],
        queryFn: async () => {
            return await searchFlights()
        },
        enabled,
    })

    return (
        <Card className="bg-background gap-4 p-4">
            <Button onClick={() => isEnabled((prev) => !prev)}>
                {enabled ? 'Disable' : 'Enable'} Flight Search
            </Button>

            {isLoading ? (
                <IconLoader className="size-4 animate-spin" />
            ) : (
                <pre>
                    {data
                        ? JSON.stringify(JSON.parse(data), null, 2)
                        : 'No data...'}
                </pre>
            )}
        </Card>
    )
}
