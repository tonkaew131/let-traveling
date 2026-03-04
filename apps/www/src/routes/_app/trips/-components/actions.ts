import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'

import { db, schema } from '@/db'

export const getTrips = createServerFn({ method: 'GET' }).handler(async () => {
    const rows = await db
        .select({
            id: schema.trips.id,
            title: schema.trips.title,
            createdAt: schema.trips.createdAt,
        })
        .from(schema.trips)
        .orderBy(desc(schema.trips.createdAt))

    return rows
})
