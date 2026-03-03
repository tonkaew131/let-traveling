import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const trips = pgTable('trips', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})

export const tripMessageRole = pgEnum('trip_message_role', [
    'user',
    'assistant',
    'function',
])
export const tripMessages = pgTable('trip_messages', {
    id: uuid().defaultRandom().primaryKey(),
    tripId: uuid()
        .references(() => trips.id, {
            onDelete: 'cascade',
        })
        .notNull(),

    role: tripMessageRole().notNull(),
    content: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})
