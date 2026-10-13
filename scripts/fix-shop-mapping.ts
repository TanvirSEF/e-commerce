import { db } from "../src/db"
import { shops, users, products, sellerWithdrawRequests } from "../src/db/schema"
import { eq } from "drizzle-orm"

async function fixShopMapping() {
  console.log("Fixing shop user assignments...")

  // 1. Insert separate vendor users for other shops
  await db
    .insert(users)
    .values([
      {
        id: "usr_seller_gadget_02",
        name: "Rafiqul Islam",
        email: "gadget@example.com",
        emailVerified: true,
        role: "seller",
        phone: "+880 1819 223344",
        balance: "32000.00",
      },
      {
        id: "usr_seller_home_03",
        name: "Nazmul Hossain",
        email: "home@example.com",
        emailVerified: true,
        role: "seller",
        phone: "+880 1912 334455",
        balance: "7500.00",
      },
    ])
    .onConflictDoUpdate({
      target: users.id,
      set: { role: "seller" },
    })

  // 2. Map shops 1:1 to their actual owners
  await db.update(shops).set({ userId: "usr_seller_default_01" }).where(eq(shops.id, 1))
  await db.update(shops).set({ userId: "usr_seller_gadget_02" }).where(eq(shops.id, 2))
  await db.update(shops).set({ userId: "usr_seller_home_03" }).where(eq(shops.id, 4))
  await db.update(shops).set({ userId: null }).where(eq(shops.id, 3))

  // 3. Products
  await db.update(products).set({ userId: "usr_seller_default_01" }).where(eq(products.shopId, 1))
  await db.update(products).set({ userId: "usr_seller_gadget_02" }).where(eq(products.shopId, 2))

  // 4. Withdraw requests
  await db.update(sellerWithdrawRequests).set({ userId: "usr_seller_default_01" }).where(eq(sellerWithdrawRequests.shopId, 1))
  await db.update(sellerWithdrawRequests).set({ userId: "usr_seller_gadget_02" }).where(eq(sellerWithdrawRequests.shopId, 2))
  await db.update(sellerWithdrawRequests).set({ userId: "usr_seller_home_03" }).where(eq(sellerWithdrawRequests.shopId, 4))

  const allShops = await db.select().from(shops)
  console.log("SHOPS AFTER FIX:")
  allShops.forEach((s) => console.log(`ID: ${s.id} | Slug: ${s.slug} | Name: ${s.name} | User: ${s.userId}`))
}

fixShopMapping()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
