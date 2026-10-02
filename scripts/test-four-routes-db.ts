import { getUserRefunds } from "../src/services/refund-service"
import { getCustomerProductsByUser } from "../src/services/customer-product-service"
import { getFollowedSellers } from "../src/services/customer-extra-service"
import { getUserConversations, getConversationDetails } from "../src/services/conversation-service"

async function main() {
  const userId = "usr_customer_default_01"
  console.log("=== Testing 4 Customer Routes DB Queries for:", userId, "===")

  // 1. Refund Requests
  const refunds = await getUserRefunds(userId)
  console.log(`\n1. Refund Requests: Found ${refunds.length} items`)
  refunds.forEach((r) => {
    console.log(`   - [${r.status.toUpperCase()}] Order: ${r.orderCode}, Product: ${r.productName.slice(0, 35)}..., Amount: ৳${r.amount}`)
  })

  // 2. Classified Products
  const products = await getCustomerProductsByUser(userId)
  console.log(`\n2. Customer Products: Found ${products.length} items`)
  products.forEach((p) => {
    console.log(`   - ID ${p.id}: ${p.name.slice(0, 35)}... (Status: ${p.status}, Price: ৳${p.unitPrice})`)
  })

  // 3. Followed Sellers
  const sellers = await getFollowedSellers(userId)
  console.log(`\n3. Followed Sellers: Found ${sellers.length} items`)
  sellers.forEach((s) => {
    console.log(`   - Shop ID ${s.shopId}: ${s.shopName} (Slug: ${s.shopSlug}, Rating: ${s.rating})`)
  })

  // 4. Conversations
  const conversations = await getUserConversations(userId)
  console.log(`\n4. Conversations: Found ${conversations.length} items`)
  for (const c of conversations) {
    console.log(`   - Conv ID ${c.id}: "${c.title}" with ${c.shopName}, Last: "${c.lastMessage.slice(0, 30)}..."`)
  }

  if (conversations.length > 0) {
    const detail = await getConversationDetails(Number(conversations[0].id), userId)
    console.log(`   * Detail for Conv #${conversations[0].id}: ${detail.messages.length} messages loaded`)
  }

  console.log("\n=== ALL 4 ROUTES SUCCESSFULLY TESTED FROM DATABASE ===")
  process.exit(0)
}

main().catch((err) => {
  console.error("Test failed:", err)
  process.exit(1)
})
