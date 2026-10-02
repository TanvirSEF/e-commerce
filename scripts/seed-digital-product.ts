import { db } from "../src/db"
import { products, orderItems, orders } from "../src/db/schema"
import { eq, and } from "drizzle-orm"

async function main() {
  console.log("Seeding canonical digital product...")
  
  // 1. Check if digital product exists
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, "windows-11-pro-license-key"))
    .limit(1)

  let prodId: number

  if (existing.length > 0) {
    prodId = existing[0].id
    await db
      .update(products)
      .set({
        isDigital: true,
        digitalFile: "windows-11-pro-license-activation.txt",
      })
      .where(eq(products.id, prodId))
    console.log(`Updated existing digital product ID: ${prodId}`)
  } else {
    const [inserted] = await db
      .insert(products)
      .values({
        name: "Windows 11 Pro Retail License Key (Lifetime Activation)",
        slug: "windows-11-pro-license-key",
        thumbnailImg: "/assets/img/products/1.jpg",
        unitPrice: "2450.00",
        isDigital: true,
        digitalFile: "windows-11-pro-license-activation.txt",
        published: true,
        currentStock: 999,
      })
      .returning({ id: products.id })
    prodId = inserted.id
    console.log(`Inserted new digital product ID: ${prodId}`)
  }

  // 2. Attach to Tanvir Ahmed's paid order (order 1)
  const [targetOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, "usr_customer_default_01"), eq(orders.paymentStatus, "paid")))
    .limit(1)

  if (targetOrder) {
    const existingItem = await db
      .select({ id: orderItems.id })
      .from(orderItems)
      .where(and(eq(orderItems.orderId, targetOrder.id), eq(orderItems.productId, prodId)))
      .limit(1)

    if (existingItem.length === 0) {
      await db.insert(orderItems).values({
        orderId: targetOrder.id,
        productId: prodId,
        price: "2450.00",
        quantity: 1,
      })
      console.log(`Successfully linked digital product to Order #${targetOrder.id}`)
    } else {
      console.log(`Digital product already linked to Order #${targetOrder.id}`)
    }
  }

  console.log("Seeding complete.")
  process.exit(0)
}

main().catch((e) => {
  console.error("Error seeding digital product:", e)
  process.exit(1)
})
