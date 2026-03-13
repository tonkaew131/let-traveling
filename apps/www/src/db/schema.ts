import {
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'

export const airlines = pgTable('airlines', {
    iata: text().primaryKey(),
    icao: text(),

    name: text().notNull(),
    logoSymbolUrl: text().notNull(),
})

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
    // Text messages store plain strings; persisted UI messages (incl. tool parts)
    // store a JSON object.
    content: jsonb().$type<any>().notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})
