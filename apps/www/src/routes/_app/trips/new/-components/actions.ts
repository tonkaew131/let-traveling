import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { generateText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'
import { db, schema } from '@/db'

const createTripSchema = z.object({
    prompt: z.string().describe('The user prompt to create the trip plan'),
})

export const createTrip = createServerFn({ method: 'POST' })
    .inputValidator(createTripSchema)
    .handler(async ({ data }) => {
        const title = await generateText({
            model: openrouter('google/gemini-2.5-flash-lite'),
            prompt: `Extract a concise title for a trip based on the following user prompt. The title should be no more than 5 words and should capture the essence of the trip.\n\nUser Prompt: ${data.prompt}\n\nTitle:`,
        })

        const trip = await db.transaction(async (tx) => {
            const [_trip] = await tx
                .insert(schema.trips)
                .values({
                    title: title.text,
                })
                .returning()

            await tx.insert(schema.tripMessages).values({
                tripId: _trip.id,
                role: 'user',
                content: data.prompt,
            })

            return _trip
        })

        return trip
    })
