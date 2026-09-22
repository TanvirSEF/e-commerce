import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../../db"
import * as schema from "../../db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: false,
      },
      balance: {
        type: "string",
        defaultValue: "0.00",
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
