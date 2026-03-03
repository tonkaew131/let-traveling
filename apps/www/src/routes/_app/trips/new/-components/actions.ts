import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { db, schema } from '@/db'

const createTripSchema = z.object({
    prompt: z.string().describe('The user prompt to create the trip plan'),
})

export const createTrip = createServerFn({ method: 'POST' })
    .inputValidator(createTripSchema)
    .handler(async ({ data }) => {
        const [trip] = await db
            .insert(schema.trips)
            .values({
                title: data.prompt,
            })
            .returning()

        return trip
    })
