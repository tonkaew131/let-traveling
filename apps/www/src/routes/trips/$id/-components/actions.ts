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

const saveTripMessagesSchema = z.object({
    tripId: z.string().uuid(),
    messages: z.array(z.unknown()),
})

function coerceRole(role: unknown): 'user' | 'assistant' {
    return role === 'user' ? 'user' : 'assistant'
}

function sanitizePersistedMessage(message: any) {
    const id = typeof message?.id === 'string' ? message.id : undefined
    const role = coerceRole(message?.role)
    const parts = Array.isArray(message?.parts) ? message.parts : []
    return { ...(id ? { id } : {}), role, parts }
}

export const saveTripMessages = createServerFn({ method: 'POST' })
    .inputValidator(saveTripMessagesSchema)
    .handler(async ({ data }) => {
        const baseTime = Date.now()

        await db.transaction(async (tx) => {
            await tx
                .delete(schema.tripMessages)
                .where(eq(schema.tripMessages.tripId, data.tripId))

            const rows = data.messages.map((m: any, i: number) => {
                const sanitized = sanitizePersistedMessage(m)
                return {
                    tripId: data.tripId,
                    role: sanitized.role,
                    // Persist the full UI message (including tool parts) as JSON.
                    content: sanitized,
                    // Preserve ordering deterministically for reloads.
                    createdAt: new Date(baseTime + i),
                }
            })

            if (rows.length > 0) {
                await tx.insert(schema.tripMessages).values(rows)
            }
        })

        return { ok: true }
    })
