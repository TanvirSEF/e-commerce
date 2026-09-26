import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../src/db/schema/index.js"
import { hashPassword } from "better-auth/crypto"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const { Pool } = pg
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce"

async function run() {
  console.log("Connecting to:", dbUrl.replace(/:[^:]*@/, ":****@"))
  const pool = new Pool({ connectionString: dbUrl, connectionTimeoutMillis: 5000 })
  const db = drizzle(pool, { schema })

  try {
    const hashedPassword = await hashPassword("password123")
    console.log("Generated hash for password123")

    // 1. Admin
    const adminId = "usr_admin_default_01"
    await db
      .insert(schema.users)
      .values({
        id: adminId,
        name: "Active eCommerce Admin",
        email: "admin@example.com",
        emailVerified: true,
        role: "admin",
        phone: "+880 1700 000000",
        balance: "50000.00",
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { role: "admin", emailVerified: true, phone: "+880 1700 000000" },
      })

    await db
      .insert(schema.accounts)
      .values({
        id: "acc_admin_default_credential",
        userId: adminId,
        accountId: adminId,
        providerId: "credential",
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.accounts.id,
        set: {
          password: hashedPassword,
          accountId: adminId,
          userId: adminId,
          providerId: "credential",
        },
      })
    console.log("[OK] Admin account seeded: admin@example.com / password123")

    // 2. Customer (Tanvir Ahmed)
    const customerId = "usr_customer_default_01"
    await db
      .insert(schema.users)
      .values({
        id: customerId,
        name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        emailVerified: true,
        role: "customer",
        phone: "+880 1712 345678",
        balance: "2500.00",
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { role: "customer", emailVerified: true, phone: "+880 1712 345678" },
      })

    await db
      .insert(schema.accounts)
      .values({
        id: "acc_customer_default_credential",
        userId: customerId,
        accountId: customerId,
        providerId: "credential",
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.accounts.id,
        set: {
          password: hashedPassword,
          accountId: customerId,
          userId: customerId,
          providerId: "credential",
        },
      })
    console.log("[OK] Customer account seeded: tanvir@example.com / password123 / +880 1712 345678")

    // 3. Seller
    const sellerId = "usr_seller_default_01"
    await db
      .insert(schema.users)
      .values({
        id: sellerId,
        name: "Demo Seller Store",
        email: "seller@example.com",
        emailVerified: true,
        role: "seller",
        phone: "+880 1711 999888",
        balance: "15000.00",
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { role: "seller", emailVerified: true, phone: "+880 1711 999888" },
      })

    await db
      .insert(schema.accounts)
      .values({
        id: "acc_seller_default_credential",
        userId: sellerId,
        accountId: sellerId,
        providerId: "credential",
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.accounts.id,
        set: {
          password: hashedPassword,
          accountId: sellerId,
          userId: sellerId,
          providerId: "credential",
        },
      })
    console.log("[OK] Seller account seeded: seller@example.com / password123")

    // 4. Delivery Boy
    const deliveryBoyId = "usr_deliveryboy_default_01"
    await db
      .insert(schema.users)
      .values({
        id: deliveryBoyId,
        name: "Express Delivery Boy",
        email: "deliveryboy@example.com",
        emailVerified: true,
        role: "delivery_boy",
        phone: "+880 1722 111222",
        balance: "500.00",
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: { role: "delivery_boy", emailVerified: true, phone: "+880 1722 111222" },
      })

    await db
      .insert(schema.accounts)
      .values({
        id: "acc_deliveryboy_default_credential",
        userId: deliveryBoyId,
        accountId: deliveryBoyId,
        providerId: "credential",
        password: hashedPassword,
      })
      .onConflictDoUpdate({
        target: schema.accounts.id,
        set: {
          password: hashedPassword,
          accountId: deliveryBoyId,
          userId: deliveryBoyId,
          providerId: "credential",
        },
      })
    console.log("[OK] Delivery Boy account seeded: deliveryboy@example.com / password123")

    console.log("All accounts successfully verified and seeded!")
  } finally {
    await pool.end()
  }
}

run().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
