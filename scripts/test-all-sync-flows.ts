import { db } from "../src/db/index.js";
import { users, shops, products, orders, tickets, ticketReplies, refundRequests } from "../src/db/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { getProductReviews } from "../src/services/review-service.js";
import { getSupportTickets, createTicket } from "../src/services/ticket-service.js";
import { followShop, unfollowShop, getFollowedSellers } from "../src/services/customer-extra-service.js";
import { awardOrderClubPoints } from "../src/services/wallet-service.js";
import { getCustomerProductsByUser, createCustomerProduct } from "../src/services/customer-product-service.js";
import { createAffiliateWithdrawRequest } from "../src/services/affiliate-service.js";
import { findOrCreateConversation, getUserConversations } from "../src/services/conversation-service.js";
import { getAllRefundsAdmin } from "../src/services/refund-service.js";

async function runAllSyncTests() {
  console.log("=================================================");
  console.log("   CROSS-PANEL LIVE RUNTIME VERIFICATION SUITE   ");
  console.log("=================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  function report(name: string, ok: boolean, details?: string) {
    if (ok) {
      testPassed++;
      console.log(`[PASS] ${name}${details ? ` -> ${details}` : ""}`);
    } else {
      testFailed++;
      console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ""}`);
    }
  }

  try {
    // 0. Fetch a test user and shop from the database
    const [testUser] = await db.select().from(users).limit(1);
    if (!testUser) throw new Error("No user found in database to test with.");
    console.log(`Using Test User: ${testUser.name} (${testUser.id}, ${testUser.email})`);

    const [testShop] = await db.select().from(shops).limit(1);
    console.log(`Using Test Shop: ${testShop?.name || "None"} (${testShop?.id || "None"})\n`);

    // TEST 1: Refund System Sync
    try {
      const adminRefunds = await getAllRefundsAdmin();
      report("Phase 1: Refund System Query", Array.isArray(adminRefunds), `Found ${adminRefunds.length} refund requests`);
    } catch (e: any) {
      report("Phase 1: Refund System Query", false, e.message);
    }

    // TEST 2: Product Reviews & Ratings
    try {
      const [testProduct] = await db.select().from(products).limit(1);
      if (testProduct) {
        const reviews = await getProductReviews(testProduct.id);
        report("Phase 2: Product Reviews Query", Array.isArray(reviews), `Product ID ${testProduct.id} has ${reviews.length} reviews`);
      } else {
        report("Phase 2: Product Reviews Query", true, "Skipped (no products in db)");
      }
    } catch (e: any) {
      report("Phase 2: Product Reviews Query", false, e.message);
    }

    // TEST 3: Support Tickets & Multi-Party Replies
    try {
      const ticketsList = await getSupportTickets(testUser.id);
      report("Phase 3: Support Tickets with Replies Query", Array.isArray(ticketsList), `User has ${ticketsList.length} tickets`);
    } catch (e: any) {
      report("Phase 3: Support Tickets with Replies Query", false, e.message);
    }

    // TEST 4: Shop Follow / Unfollow Persistence
    if (testShop) {
      try {
        await followShop(testUser.id, testShop.id);
        const followed = await getFollowedSellers(testUser.id);
        const isFollowed = followed.some((s) => s.shopId === testShop.id);
        await unfollowShop(testUser.id, testShop.id);
        report("Phase 4: Follow/Unfollow Shop Cycle", isFollowed, `Followed and unfollowed shop ID ${testShop.id} successfully`);
      } catch (e: any) {
        report("Phase 4: Follow/Unfollow Shop Cycle", false, e.message);
      }
    } else {
      report("Phase 4: Follow/Unfollow Shop Cycle", true, "Skipped (no shops in db)");
    }

    // TEST 5: Club Points Auto-Awarding Logic
    try {
      const [order] = await db.select().from(orders).limit(1);
      if (order) {
        const result = await awardOrderClubPoints(order.id);
        report("Phase 5: Award Order Club Points", typeof result === "boolean", `Order ${order.id}: Processed (${result ? "Points Awarded" : "Already Awarded/Idempotent"})`);
      } else {
        report("Phase 5: Award Order Club Points", true, "Skipped (no orders in db)");
      }
    } catch (e: any) {
      report("Phase 5: Award Order Club Points", false, e.message);
    }

    // TEST 6: Customer Classified Ads Dynamic User Linkage
    try {
      const customerProducts = await getCustomerProductsByUser(testUser.id);
      report("Phase 6: Customer Classified Ads Query", Array.isArray(customerProducts), `User has ${customerProducts.length} classified items`);
    } catch (e: any) {
      report("Phase 6: Customer Classified Ads Query", false, e.message);
    }

    // TEST 7: Affiliate Withdraw Request
    try {
      const withdrawRes = await createAffiliateWithdrawRequest({
        userEmail: testUser.email,
        amount: 5,
        paymentMethod: "Bank Transfer",
      });
      report("Phase 7: Affiliate Withdraw Request", withdrawRes.success, withdrawRes.message || "Withdrawal request recorded");
    } catch (e: any) {
      report("Phase 7: Affiliate Withdraw Request", false, e.message);
    }

    // TEST 8: "Chat with Seller" from Product Page
    try {
      if (testShop) {
        const conv = await findOrCreateConversation({
          userId: testUser.id,
          shopId: testShop.id,
          title: "Inquiry regarding product #1",
          initialMessage: "Hello! Is this product available?",
        });
        report("Phase 8: Chat with Seller (findOrCreateConversation)", !!conv?.success, `Conversation ID: ${conv?.conversationId}`);
      } else {
        report("Phase 8: Chat with Seller", true, "Skipped (no shop in db)");
      }
    } catch (e: any) {
      report("Phase 8: Chat with Seller", false, e.message);
    }

  } catch (err: any) {
    console.error("Test suite fatal error:", err);
  } finally {
    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${testPassed} Passed, ${testFailed} Failed`);
    console.log("=================================================");
    process.exit(testFailed > 0 ? 1 : 0);
  }
}

runAllSyncTests();
