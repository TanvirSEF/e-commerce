import { db } from "../src/db/index.js"
import { customerAddresses, wishlists, products, users } from "../src/db/schema/index.js"
import { eq } from "drizzle-orm"

async function main() {
  console.log("Seeding Customer Dashboard live data...")
  const userId = "usr_customer_default_01"

  // 1. Ensure user exists and has balance
  await db
    .update(users)
    .set({ balance: "2500.00" })
    .where(eq(users.id, userId))

  // 2. Address
  const existingAddr = await db
    .select()
    .from(customerAddresses)
    .where(eq(customerAddresses.userId, userId))

  if (existingAddr.length === 0) {
    await db.insert(customerAddresses).values({
      userId,
      address: "House 42, Road 11, Block D, Banani",
      country: "Bangladesh",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1213",
      phone: "+880 1712-345678",
      setDefault: true,
    })
    console.log("✓ Default shipping address seeded.")
  } else {
    console.log("✓ Customer address already exists.")
  }

  // 3. Wishlists: Add first 3 products to wishlist if not already there
  const allProds = await db.select().from(products).limit(5)
  if (allProds.length > 0) {
    const existingWishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, userId))

    if (existingWishlist.length === 0) {
      for (const p of allProds.slice(0, 4)) {
        await db.insert(wishlists).values({
          userId,
          productId: p.id,
        })
      }
      console.log("✓ Sample wishlist items seeded.")
    } else {
      console.log(`✓ Customer wishlist already has ${existingWishlist.length} items.`)
    }
  }

  console.log("Done seeding customer dashboard data!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Failed:", err)
  process.exit(1)
})
