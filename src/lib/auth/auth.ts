import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../../db"
import * as schema from "../../db/schema"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "huipper_ecommerce_super_secure_better_auth_secret_key_32chars",
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
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1:3000",
    "http://127.0.0.1",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
    "http://2.25.150.87:3000",
    "http://2.25.150.87",
    "https://2.25.150.87",
  ].filter(Boolean),
  advanced: {
    useSecureCookies:
      process.env.NODE_ENV === "production" &&
      Boolean(process.env.BETTER_AUTH_URL?.startsWith("https")),
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
