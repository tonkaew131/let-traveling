import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const trips = pgTable('trips', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
})
