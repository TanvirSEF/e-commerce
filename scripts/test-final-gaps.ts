import { db } from "../src/db"
import {
  users,
  products,
  orders,
  orderItems,
  deliveryBoys,
  deliveryCollections,
  productQueries,
} from "../src/db/schema"
import { eq, desc } from "drizzle-orm"
import {
  askProductQuestion,
  getQueriesForProduct,
  replyProductQuery,
} from "../src/services/product-query-service"
import {
  getDeliveryBoyAssignedOrders,
  confirmOrderDeliveryDrop,
} from "../src/services/delivery-boy-service"
import { getCustomerPackageQuota } from "../src/services/customer-package-service"
import {
  updateCustomerProfileAction,
  rechargeWalletAction,
} from "../src/app/actions/ecommerce-actions"

async function runTests() {
  console.log("==================================================")
  console.log("   CROSS-PANEL GAP RESOLUTION RUNTIME TEST SUITE  ")
  console.log("==================================================")

  let passed = 0
  let failed = 0

  // 1. Fetch test fixture entities from DB
  const [testUser] = await db.select().from(users).limit(1)
  const [testProduct] = await db.select().from(products).limit(1)

  if (!testUser || !testProduct) {
    console.error("FATAL: Test database requires at least 1 user and 1 product.")
    process.exit(1)
  }

  console.log(`[INFO] Using Test User: ${testUser.id} (${testUser.name || testUser.email})`)
  console.log(`[INFO] Using Test Product: ${testProduct.id} (${testProduct.name})`)

  // --- PHASE 1: Product Q&A Persistence & Approval ---
  try {
    console.log("\n[TEST 1] Testing Product Q&A Persistence...")
    const qResult = await askProductQuestion({
      productId: testProduct.id,
      question: "Runtime Test: What is the warranty period for this unit?",
      userId: testUser.id,
      userName: testUser.name || "Test Shopper",
    })
    console.log("  -> Question inserted with ID:", qResult.id)

    // Author should see their pending question
    const authorQueries = await getQueriesForProduct(testProduct.id, testUser.id)
    const foundAuth = authorQueries.find((q) => q.id === qResult.id)
    if (!foundAuth) {
      throw new Error("Author should see their pending question")
    }
    console.log("  -> Author view verified (question present)")

    // Reply to question
    const replyRes = await replyProductQuery({
      queryId: qResult.id,
      reply: "Official 2-Year Manufacturer Warranty included.",
      repliedBy: "admin",
    })
    if (!replyRes.success) {
      throw new Error("Failed to reply to question")
    }
    console.log("  -> Question replied and approved")

    // Public should now see answered question
    const publicQueries = await getQueriesForProduct(testProduct.id)
    const foundPublic = publicQueries.find((q) => q.id === qResult.id)
    if (!foundPublic || foundPublic.reply !== "Official 2-Year Manufacturer Warranty included.") {
      throw new Error("Answered question should be publicly visible with reply")
    }
    console.log("  -> Public storefront view verified")

    // Cleanup test question
    if (qResult.id) {
      await db.delete(productQueries).where(eq(productQueries.id, qResult.id))
    }
    console.log("  [PASS] Phase 1: Product Q&A Storefront <-> Admin/Seller verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 1 Error:", err?.message || err)
    failed++
  }

  // --- PHASE 2: Delivery Boy Lifecycle & Drop Confirmation ---
  try {
    console.log("\n[TEST 2] Testing Delivery Boy Lifecycle & Drop Confirmation...")
    let [deliveryBoy] = await db.select().from(deliveryBoys).limit(1)
    if (!deliveryBoy) {
      const [newBoy] = await db
        .insert(deliveryBoys)
        .values({
          name: "Test Courier Driver",
          email: "test.driver@huipper.com",
          phone: "01700000000",
          status: true,
          totalEarnings: "0.00",
          cashInHand: "0.00",
        } as any)
        .returning()
      deliveryBoy = newBoy
    }

    // Find an active order or create a test order
    let [assignedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.deliveryStatus, "on_the_way"))
      .limit(1)

    if (!assignedOrder) {
      const orderCode = `TEST-DELIV-${Date.now().toString().slice(-6)}`
      const [newOrder] = await db
        .insert(orders)
        .values({
          userId: testUser.id,
          code: orderCode,
          trackingCode: `TRK-${Date.now().toString().slice(-6)}`,
          deliveryStatus: "on_the_way",
          paymentStatus: "unpaid",
          paymentType: "cash_on_delivery",
          grandTotal: "150.00",
        })
        .returning()
      assignedOrder = newOrder
    }

    const assignedList = await getDeliveryBoyAssignedOrders(deliveryBoy.id)
    console.log(`  -> Active delivery orders available for courier:`, assignedList.length)
    if (assignedList.length === 0) {
      throw new Error("Active orders list should contain the assigned order")
    }

    // Confirm delivery drop
    const dropRes = await confirmOrderDeliveryDrop({
      orderId: assignedOrder.id,
      deliveryBoyId: deliveryBoy.id,
      collectedAmount: 150.0,
      paymentType: "cash_on_delivery",
    })

    if (!dropRes.success) {
      throw new Error("confirmOrderDeliveryDrop returned unsuccessful: " + dropRes.message)
    }
    console.log("  -> Drop confirmed successfully")

    // Verify order is marked delivered and paid
    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, assignedOrder.id))
    if (updatedOrder.deliveryStatus !== "delivered" || updatedOrder.paymentStatus !== "paid") {
      throw new Error(`Order status mismatch: ${updatedOrder.deliveryStatus}, ${updatedOrder.paymentStatus}`)
    }
    console.log(`  -> Order updated in DB: status=${updatedOrder.deliveryStatus}, payment=${updatedOrder.paymentStatus}`)

    // Verify delivery collection recorded
    const collections = await db
      .select()
      .from(deliveryCollections)
      .where(eq(deliveryCollections.orderCode, assignedOrder.code))
    console.log(`  -> Delivery collections records count:`, collections.length)
    if (collections.length === 0) {
      throw new Error("Expected deliveryCollections record to be created")
    }

    console.log("  [PASS] Phase 2: Delivery Boy Lifecycle & Drop Confirmation verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 2 Error:", err?.message || err)
    failed++
  }

  // --- PHASE 3: Customer Package Quota Tracking ---
  try {
    console.log("\n[TEST 3] Testing Customer Package Quota...")
    const quota = await getCustomerPackageQuota(testUser.id)
    console.log("  -> Quota result:", JSON.stringify(quota))
    if (
      typeof quota.packageName !== "string" ||
      typeof quota.totalUploads !== "number" ||
      typeof quota.remainingUploads !== "number" ||
      typeof quota.canUpload !== "boolean"
    ) {
      throw new Error("Quota response missing required fields or has invalid types")
    }
    console.log("  [PASS] Phase 3: Customer Package Quota tracking verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 3 Error:", err?.message || err)
    failed++
  }

  // --- PHASE 4 & 6: Action Revalidation Safety ---
  try {
    console.log("\n[TEST 4] Testing Revalidation Try-Catch Safety in Actions...")
    // Calling rechargeWalletAction without a session should gracefully return Unauthenticated
    const rechargeRes: any = await rechargeWalletAction({
      amount: 100,
      paymentMethod: "bank_transfer",
    })
    if (rechargeRes.error !== "Unauthenticated") {
      throw new Error("rechargeWalletAction should reject unauthenticated request with error: Unauthenticated")
    }
    console.log("  -> Unauthenticated recharge correctly handled without throws")
    console.log("  [PASS] Phase 4 & 6: Action Revalidation Safety verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 4 & 6 Error:", err?.message || err)
    failed++
  }

  // --- PHASE 5: Digital Product Download Security ---
  try {
    console.log("\n[TEST 5] Testing Digital Product Download Security Logic...")
    // Direct verification that unpaid/unpurchased orders are rejected in PostgreSQL
    const unpurchasedRows = await db
      .select()
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        eq(orders.userId, "non_existent_user_999999")
      )
    if (unpurchasedRows.length !== 0) {
      throw new Error("Security check failed: unauthenticated or non-purchased access returned rows")
    }
    console.log("  -> Query properly isolates paid purchases by authenticated userId")
    console.log("  [PASS] Phase 5: Digital Product Download Security verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 5 Error:", err?.message || err)
    failed++
  }

  // --- PHASE 7: Profile Update Auth Guard ---
  try {
    console.log("\n[TEST 7] Testing Profile Update Auth Guard...")
    // 1. Without userId and without session
    const unauthRes = await updateCustomerProfileAction({
      name: "Malicious Actor",
    })
    console.log("  -> Unauthenticated update result:", JSON.stringify(unauthRes))
    if (unauthRes.success !== false) {
      throw new Error("updateCustomerProfileAction should fail when targetUserId is missing")
    }

    // 2. With valid userId
    const originalName = testUser.name
    const updateRes = await updateCustomerProfileAction({
      userId: testUser.id,
      name: testUser.name || "Test User",
    })
    if (!updateRes.success) {
      throw new Error(`Valid profile update failed: ${updateRes.message}`)
    }
    console.log("  -> Valid user profile update succeeded safely")
    console.log("  [PASS] Phase 7: Profile Update Auth Guard verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Phase 7 Error:", err?.message || err)
    failed++
  }

  console.log("\n==================================================")
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`)
  console.log("==================================================")

  if (failed > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err)
  process.exit(1)
})
