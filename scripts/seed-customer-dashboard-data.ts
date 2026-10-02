import { db } from "../src/db"
import { sql } from "drizzle-orm"
import { shopFollowers, customerProducts, conversations, messages } from "../src/db/schema"

async function main() {
  console.log("Starting customer dashboard data seeding...")

  // 1. Add user_id column to customer_products if missing
  await db.execute(
    sql`ALTER TABLE customer_products ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE CASCADE;`
  )
  console.log("Verified user_id column on customer_products.")

  const customerId = "usr_customer_default_01"

  // 2. Link existing customer_products to Tanvir Ahmed
  await db.execute(
    sql`UPDATE customer_products SET user_id = ${customerId}, status = '1' WHERE user_id IS NULL OR user_id = '';`
  )
  console.log("Linked customer_products to", customerId)

  // 3. Seed followed sellers for Tanvir Ahmed
  const existingFollowers = await db
    .select()
    .from(shopFollowers)
    .where(sql`user_id = ${customerId}`)

  if (existingFollowers.length === 0) {
    await db.insert(shopFollowers).values([
      { userId: customerId, shopId: 1 },
      { userId: customerId, shopId: 2 },
    ])
    console.log("Seeded shopFollowers (Shop 1 & Shop 2) for", customerId)
  } else {
    console.log(`shopFollowers already has ${existingFollowers.length} rows for`, customerId)
  }

  // 4. Seed conversations & messages for Tanvir Ahmed
  const existingConversations = await db
    .select()
    .from(conversations)
    .where(sql`sender_id = ${customerId} OR receiver_id = ${customerId}`)

  if (existingConversations.length === 0) {
    // Insert Conversation 1
    const [conv1] = await db
      .insert(conversations)
      .values({
        senderId: customerId,
        receiverId: "usr_seller_default_01",
        shopId: 1,
        title: "Inquiry about Cotton Shirt Size XL",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      })
      .returning()

    if (conv1) {
      await db.insert(messages).values([
        {
          conversationId: conv1.id,
          senderId: customerId,
          message: "Hello, is the Classic Men's Casual Shirt size XL in stock in Navy Blue?",
          viewed: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          conversationId: conv1.id,
          senderId: "usr_seller_default_01",
          message: "Hi Tanvir! Yes, size XL in Navy Blue and Olive is available and ready for fast delivery.",
          viewed: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
          conversationId: conv1.id,
          senderId: customerId,
          message: "Awesome, I have already placed my order for it. Please make sure it's packed securely!",
          viewed: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
      ])
    }

    // Insert Conversation 2
    const [conv2] = await db
      .insert(conversations)
      .values({
        senderId: customerId,
        receiverId: "usr_seller_default_01",
        shopId: 2,
        title: "Mechanical Gaming Keyboard RGB Warranty Inquiry",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      })
      .returning()

    if (conv2) {
      await db.insert(messages).values([
        {
          conversationId: conv2.id,
          senderId: customerId,
          message: "Hi, does this keyboard come with an official manufacturer replacement warranty?",
          viewed: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
        },
        {
          conversationId: conv2.id,
          senderId: "usr_seller_default_01",
          message: "Hello Tanvir! Yes, it includes 1 Year Official Brand Replacement Warranty with warranty card included in the box.",
          viewed: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      ])
    }

    console.log("Seeded conversations and messages for", customerId)
  } else {
    console.log(`conversations already has ${existingConversations.length} rows for`, customerId)
  }

  console.log("Customer dashboard data seeding complete!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seeding failed:", err)
  process.exit(1)
})
