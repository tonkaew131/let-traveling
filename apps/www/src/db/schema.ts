import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const trips = pgTable('trips', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})
