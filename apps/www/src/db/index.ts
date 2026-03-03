import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import * as schema from './schema'

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema, casing: 'snake_case' })
export * as schema from './schema'
