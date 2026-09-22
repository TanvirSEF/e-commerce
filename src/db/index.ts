import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema"

const { Pool } = pg

declare global {
  var __pgPool: pg.Pool | undefined
}

const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce"

export const pool =
  global.__pgPool ||
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool
}

export const db = drizzle(pool, { schema })
export type Database = typeof db
