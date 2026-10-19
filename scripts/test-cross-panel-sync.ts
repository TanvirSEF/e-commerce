import dotenv from "dotenv"
dotenv.config({ path: ".env" })

import { db } from "../src/db"
import { users, products, orders, orderItems, wallets, clubPoints, refundRequests, reviews } from "../src/db/schema"
import { eq, desc, and } from "drizzle-orm"
import {
  placeOrderAction,
  updateOrderStatusAction,
  updateSellerOrderStatusAction,
  sellerUpdateRefundRequestStatusAction,
  submitReviewAction,
} from "../src/app/actions/ecommerce-actions"
import { updateOrderQuickManagementAction } from "../src/app/actions/order-admin-actions"
import { updateClassifiedPublishedAction } from "../src/app/actions/customer-product-actions"

async function runTests() {
  console.log("==================================================")
  console.log("   CROSS-PANEL DEEP SYNCHRONIZATION TEST SUITE    ")
  console.log("==================================================")

  let passed = 0
  let failed = 0

  const [testUser] = await db.select().from(users).limit(1)
  const [testProduct] = await db.select().from(products).limit(1)

  if (!testUser || !testProduct) {
    console.error("FATAL: Test database requires at least 1 user and 1 product.")
    process.exit(1)
  }

  console.log(`[INFO] Test User: ${testUser.id} (${testUser.name || testUser.email})`)
  console.log(`[INFO] Test Product: ${testProduct.id} (${testProduct.name}), Stock: ${testProduct.currentStock}`)

  // -------------------------------------------------------------------------
  // TEST 1: Stock Deduction on Order Place & Restock on Order Cancellation
  // -------------------------------------------------------------------------
  try {
    console.log("\n[TEST 1] Testing Order Placement Stock Deduction & Cancellation Restocking...")
    const initialStock = Number(testProduct.currentStock || 0)
    const initialSales = Number(testProduct.numOfSale || 0)

    // Place order
    const orderRes = await placeOrderAction({
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        phone: "+880 1711 000000",
        address: "Banani, Dhaka",
      },
      paymentType: "cash_on_delivery",
      items: [{ productId: testProduct.id, price: 100, quantity: 2 }],
      grandTotal: 200,
    })

    if (!orderRes.success || !orderRes.order) {
      throw new Error("Failed to place order: " + orderRes.error)
    }

    const createdOrderId = orderRes.order.id

    // Check stock was decremented by 2
    const [pAfterOrder] = await db
      .select({ currentStock: products.currentStock, numOfSale: products.numOfSale })
      .from(products)
      .where(eq(products.id, testProduct.id))

    const stockAfterOrder = Number(pAfterOrder.currentStock)
    const salesAfterOrder = Number(pAfterOrder.numOfSale)
    console.log(`  -> Stock after order: ${stockAfterOrder} (expected ${initialStock - 2})`)
    console.log(`  -> Sales after order: ${salesAfterOrder} (expected ${initialSales + 2})`)

    if (stockAfterOrder !== Math.max(0, initialStock - 2)) {
      throw new Error(`Stock deduction mismatch: got ${stockAfterOrder}, expected ${initialStock - 2}`)
    }

    // Now Cancel Order via updateOrderStatusAction (Admin changes status to 'cancelled')
    await updateOrderStatusAction({
      orderId: String(createdOrderId),
      deliveryStatus: "cancelled",
    })

    // Verify stock is restored
    const [pAfterCancel] = await db
      .select({ currentStock: products.currentStock, numOfSale: products.numOfSale })
      .from(products)
      .where(eq(products.id, testProduct.id))

    const stockAfterCancel = Number(pAfterCancel.currentStock)
    const salesAfterCancel = Number(pAfterCancel.numOfSale)
    console.log(`  -> Stock after cancellation: ${stockAfterCancel} (expected ${initialStock})`)
    console.log(`  -> Sales after cancellation: ${salesAfterCancel} (expected ${initialSales})`)

    if (stockAfterCancel !== initialStock) {
      throw new Error(`Stock restoration mismatch: got ${stockAfterCancel}, expected ${initialStock}`)
    }

    console.log("  [PASS] Order cancellation accurately restored product inventory and adjusted sales count.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 1 failed:", err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // TEST 2: Wallet Payment Cancellation Refund
  // -------------------------------------------------------------------------
  try {
    console.log("\n[TEST 2] Testing Paid Order Cancellation Wallet Balance Auto-Refund...")
    // Ensure test user has balance
    await db
      .update(users)
      .set({ balance: "1000.00" })
      .where(eq(users.id, testUser.id))

    const orderRes = await placeOrderAction({
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        phone: "+880 1711 000000",
        address: "Uttara, Dhaka",
      },
      paymentType: "wallet",
      items: [{ productId: testProduct.id, price: 150, quantity: 1 }],
      grandTotal: 150,
    })

    if (!orderRes.success || !orderRes.order) {
      throw new Error("Failed to place wallet order: " + orderRes.error)
    }

    const walletOrderId = orderRes.order.id

    // Verify user balance was debited to 850
    const [uDebited] = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, testUser.id))

    console.log(`  -> Balance after wallet order debit: ৳${uDebited.balance} (expected 850.00)`)
    if (Number(uDebited.balance) !== 850) {
      throw new Error(`Balance not properly debited: got ${uDebited.balance}`)
    }

    // Now Admin cancels the paid order via updateOrderQuickManagementAction
    await updateOrderQuickManagementAction(walletOrderId, {
      deliveryStatus: "cancelled",
      paymentStatus: "paid",
    })

    // Verify user balance was restored to 1000
    const [uRefunded] = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, testUser.id))

    console.log(`  -> Balance after cancellation refund: ৳${uRefunded.balance} (expected 1000.00)`)
    if (Number(uRefunded.balance) !== 1000) {
      throw new Error(`Balance not properly refunded: got ${uRefunded.balance}`)
    }

    // Verify wallet ledger entry
    const [refundLedger] = await db
      .select()
      .from(wallets)
      .where(
        and(
          eq(wallets.userId, testUser.id),
          eq(wallets.paymentMethod, "Refund")
        )
      )
      .orderBy(desc(wallets.id))
      .limit(1)

    if (!refundLedger || Number(refundLedger.amount) !== 150) {
      throw new Error("Wallet refund ledger entry missing or amount incorrect")
    }

    console.log(`  -> Wallet ledger transaction logged: +৳${refundLedger.amount} (${refundLedger.paymentDetails})`)
    console.log("  [PASS] Order cancellation auto-refunded wallet balance and recorded ledger transaction.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 2 failed:", err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // TEST 3: Admin Order Details Delivery Club Points Auto-Award
  // -------------------------------------------------------------------------
  try {
    console.log("\n[TEST 3] Testing Admin Order Details Delivery Club Points Auto-Award...")
    const orderRes = await placeOrderAction({
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        phone: "+880 1711 000000",
        address: "Gulshan, Dhaka",
      },
      paymentType: "cash_on_delivery",
      items: [{ productId: testProduct.id, price: 300, quantity: 1 }],
      grandTotal: 300,
    })

    if (!orderRes.success || !orderRes.order) {
      throw new Error("Failed to place order: " + orderRes.error)
    }

    const orderId = orderRes.order.id

    // Update status to delivered via updateOrderStatusAction
    await updateOrderStatusAction({
      orderId: String(orderId),
      deliveryStatus: "delivered",
      paymentStatus: "paid",
    })

    // Check club points awarded
    const [pts] = await db
      .select()
      .from(clubPoints)
      .where(and(eq(clubPoints.userId, testUser.id), eq(clubPoints.orderId, orderId)))
      .limit(1)

    if (!pts) {
      throw new Error(`Club points not found for order #${orderId}`)
    }

    console.log(`  -> Club points row created: ID ${pts.id}, Points: ${pts.points}, Status: ${pts.status}`)
    console.log("  [PASS] Admin order delivery accurately awarded customer club points.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 3 failed:", err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // TEST 4: Seller Refund Approval & Customer Wallet Credit
  // -------------------------------------------------------------------------
  try {
    console.log("\n[TEST 4] Testing Seller Refund Approval & Wallet Credit...")
    const [uBeforeRefund] = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, testUser.id))
    const startBal = Number(uBeforeRefund.balance || 0)

    // Create refund request in DB
    const [refundReq] = await db
      .insert(refundRequests)
      .values({
        orderCode: `ORD-TEST-${Date.now().toString().slice(-4)}`,
        userId: testUser.id,
        userName: testUser.name || "Test Customer",
        productName: testProduct.name,
        amount: "50.00",
        reason: "Defective item received",
        status: "pending",
      })
      .returning()

    console.log(`  -> Created Refund Request #${refundReq.id} for ৳${refundReq.amount}`)

    // Seller approves refund request
    const sellerRes = await sellerUpdateRefundRequestStatusAction({
      requestId: refundReq.id,
      status: "approved",
      adminNote: "Vendor approved return and refund",
    })

    if (!sellerRes.success) {
      throw new Error("Failed to approve refund via sellerUpdateRefundRequestStatusAction")
    }

    // Verify user balance increased by 50
    const [uAfterRefund] = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, testUser.id))

    const endBal = Number(uAfterRefund.balance)
    console.log(`  -> Balance after seller refund: ৳${endBal.toFixed(2)} (expected ${(startBal + 50).toFixed(2)})`)

    if (endBal !== startBal + 50) {
      throw new Error(`Balance mismatch after refund: got ${endBal}, expected ${startBal + 50}`)
    }

    console.log("  [PASS] Seller refund approval credited customer wallet balance.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 4 failed:", err.message)
    failed++
  }

  // -------------------------------------------------------------------------
  // TEST 5: Customer Review Submission & Product Rating Recalculation
  // -------------------------------------------------------------------------
  try {
    console.log("\n[TEST 5] Testing Product Review Submission & Rating Recalculation...")
    const reviewRes = await submitReviewAction({
      productId: testProduct.id,
      userId: testUser.id,
      userName: testUser.name || "Test Reviewer",
      rating: 5,
      comment: "Outstanding product quality and lightning fast delivery!",
    })

    if (!reviewRes.success) {
      throw new Error("Failed to submit review via submitReviewAction")
    }

    // Check product rating and numOfReviews
    const [pUpdated] = await db
      .select({ rating: products.rating, numOfReviews: products.numOfReviews })
      .from(products)
      .where(eq(products.id, testProduct.id))

    console.log(`  -> Updated Product Rating: ${pUpdated.rating}, Total Reviews: ${pUpdated.numOfReviews}`)

    if (Number(pUpdated.numOfReviews) < 1 || Number(pUpdated.rating) <= 0) {
      throw new Error("Product rating was not recalculated correctly")
    }

    console.log("  [PASS] Product review submission recalculated rating and review count.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 5 failed:", err.message)
    failed++
  }

  // Summary
  console.log("\n==================================================")
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log("==================================================")

  if (failed > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runTests().catch((e) => {
  console.error("Test execution fatal error:", e)
  process.exit(1)
})
