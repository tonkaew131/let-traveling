import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { redirect } from '@tanstack/react-router'
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

        throw redirect({
            to: '/trips/$id',
            params: {
                id: trip.id,
            },
        })
    })
