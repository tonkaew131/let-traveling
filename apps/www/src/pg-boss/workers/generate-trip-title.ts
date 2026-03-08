import { generateText } from 'ai'

import { openrouter } from '@openrouter/ai-sdk-provider'
import { eq } from 'drizzle-orm'
import { boss } from '..'
import { db, schema } from '@/db'

const queue = 'generate-trip-title'

interface GenerateTripTitlePayload {
    tripId: string
    prompt: string
}
export const generateTripTitle = async (tripId: string, prompt: string) => {
    await boss.send(queue, {
        tripId,
        prompt,
    })
}

await boss.createQueue(queue)
await boss.work(queue, async ([job]) => {
    const { tripId, prompt } = job.data as GenerateTripTitlePayload
    const title = await generateText({
        model: openrouter('google/gemini-2.5-flash-lite'),
        prompt: `Extract a concise title for a trip based on the following user prompt. The title should be no more than 5 words and should capture the essence of the trip. The language should match the user's language.\n\nUser Prompt: ${prompt}\n\nTitle:`,
    })

    await db
        .update(schema.trips)
        .set({
            title: title.text,
        })
        .where(eq(schema.trips.id, tripId))
})
