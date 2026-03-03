import { createServerFn } from '@tanstack/react-start'
import { asc, eq } from 'drizzle-orm'
import * as z from 'zod'

import { db, schema } from '@/db'

const getTripMessagesSchema = z.object({
    tripId: z.string(),
})

export const getTripMessages = createServerFn({ method: 'GET' })
    .inputValidator(getTripMessagesSchema)
    .handler(async ({ data }) => {
        const rows = await db
            .select({
                id: schema.tripMessages.id,
                role: schema.tripMessages.role,
                content: schema.tripMessages.content,
                createdAt: schema.tripMessages.createdAt,
            })
            .from(schema.tripMessages)
            .where(eq(schema.tripMessages.tripId, data.tripId))
            .orderBy(asc(schema.tripMessages.createdAt))

        return rows
    })
