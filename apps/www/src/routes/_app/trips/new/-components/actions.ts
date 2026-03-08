import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { db, schema } from '@/db'
import { generateTripTitle } from '@/pg-boss/workers/generate-trip-title'

const createTripSchema = z.object({
    prompt: z.string().describe('The user prompt to create the trip plan'),
})

export const createTrip = createServerFn({ method: 'POST' })
    .inputValidator(createTripSchema)
    .handler(async ({ data }) => {
        const trip = await db.transaction(async (tx) => {
            const [_trip] = await tx
                .insert(schema.trips)
                .values({
                    title: 'My Trip',
                })
                .returning()

            await tx.insert(schema.tripMessages).values({
                tripId: _trip.id,
                role: 'user',
                content: {
                    role: 'user',
                    parts: [{ type: 'text', text: data.prompt }],
                },
            })

            return _trip
        })

        await generateTripTitle(trip.id, data.prompt)
        return trip
    })
