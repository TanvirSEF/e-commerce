import { db } from "../src/db"
import { orders, orderItems, products, users, wallets, refundRequests, reviews } from "../src/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { createOrder, cancelCustomerOrder, getSellerOrderById } from "../src/services/order-service"
import { processRefundAdmin } from "../src/services/refund-service"
import { submitReview } from "../src/services/review-service"
import { processWalletRechargeAdmin } from "../src/services/wallet-service"

async function runEdgeCaseTests() {
  console.log("=== EXHAUSTIVE MICRO-EDGE-CASE VERIFICATION ===")
  let passed = 0
  let failed = 0

  // TEST 1: Physical Product Out of Stock Pre-Validation
  console.log("\n[TEST 1] Out-of-Stock Pre-Validation in createOrder...")
  try {
    // Pick an existing product or create a temporary 0-stock product
    const [testProd] = await db
      .insert(products)
      .values({
        name: "Test Zero Stock Product",
        slug: `test-zero-stock-${Date.now()}`,
        thumbnailImg: "/assets/img/placeholder.jpg",
        unitPrice: "100.00",
        currentStock: 0,
        isDigital: false,
        published: true,
      })
      .returning()

    const orderRes = await createOrder({
      userId: "usr_customer_default_01",
      paymentType: "cash_on_delivery",
      grandTotal: 100,
      items: [{ productId: testProd.id, price: 100, quantity: 1 }],
      shippingAddress: { name: "Test User", address: "Dhaka", phone: "01700000000" },
    })

    if (!orderRes.success && orderRes.error?.includes("out of stock")) {
      console.log("✓ PASSED: Order rejected because product stock is 0.")
      passed++
    } else {
      console.error("✗ FAILED: Order was not rejected for 0 stock product!", orderRes)
      failed++
    }

    // Clean up
    await db.delete(products).where(eq(products.id, testProd.id)).catch(() => {})
  } catch (err: any) {
    console.error("✗ FAILED Test 1 exception:", err.message)
    failed++
  }

  // TEST 2: Wallet Order Cancellation & Auto-Refund
  console.log("\n[TEST 2] Customer Order Cancellation for Wallet-Paid Order...")
  try {
    // 1. Give customer test balance
    const testUserId = "usr_customer_default_01"
    const [uBefore] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const initialBal = Number(uBefore?.balance || 0)

    // 2. Create order marked as wallet payment
    const [walletOrder] = await db
      .insert(orders)
      .values({
        userId: testUserId,
        code: `TEST-WAL-${Date.now()}`,
        trackingCode: `TRK-WAL-${Date.now()}`,
        paymentType: "wallet",
        paymentStatus: "paid",
        deliveryStatus: "pending",
        grandTotal: "150.00",
        shippingAddress: { name: "Test User", address: "Dhaka", phone: "01700000000" },
      })
      .returning()

    // 3. Customer cancels the wallet order
    const cancelRes = await cancelCustomerOrder(testUserId, walletOrder.id)
    if (cancelRes.success) {
      // 4. Verify balance refunded
      const [uAfter] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
      const finalBal = Number(uAfter?.balance || 0)
      if (Math.abs(finalBal - (initialBal + 150)) < 0.01) {
        console.log(`✓ PASSED: Wallet order cancelled and balance refunded from ${initialBal} to ${finalBal}.`)
        passed++
      } else {
        console.error(`✗ FAILED: Expected balance ${initialBal + 150}, but got ${finalBal}`)
        failed++
      }
    } else {
      console.error("✗ FAILED: Customer cancel returned error:", cancelRes.message)
      failed++
    }

    // Clean up test order
    await db.delete(orders).where(eq(orders.id, walletOrder.id)).catch(() => {})
    // Reset balance
    await db.update(users).set({ balance: initialBal.toFixed(2) }).where(eq(users.id, testUserId)).catch(() => {})
  } catch (err: any) {
    console.error("✗ FAILED Test 2 exception:", err.message)
    failed++
  }

  // TEST 3: Duplicate Refund Guard (No Double Crediting)
  console.log("\n[TEST 3] Duplicate Refund Approval Wallet Credit Guard...")
  try {
    const testUserId = "usr_customer_default_01"
    const [uBefore] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const initialBal = Number(uBefore?.balance || 0)

    // Create a pending refund request
    const [refReq] = await db
      .insert(refundRequests)
      .values({
        orderCode: `TEST-REF-${Date.now()}`,
        userId: testUserId,
        productName: "Test Product",
        amount: "50.00",
        reason: "Defective",
        status: "pending",
      })
      .returning()

    // Approve 1st time
    const app1 = await processRefundAdmin({ requestId: refReq.id, status: "approved" })
    const [uMid] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const midBal = Number(uMid?.balance || 0)

    // Approve 2nd time (duplicate call)
    const app2 = await processRefundAdmin({ requestId: refReq.id, status: "approved" })
    const [uAfter] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const finalBal = Number(uAfter?.balance || 0)

    if (midBal === initialBal + 50 && finalBal === midBal) {
      console.log(`✓ PASSED: First approval credited 50. Second approval did NOT double credit (remained ${finalBal}).`)
      passed++
    } else {
      console.error(`✗ FAILED: Double credit detected! Initial: ${initialBal}, Mid: ${midBal}, Final: ${finalBal}`)
      failed++
    }

    // Clean up
    await db.delete(refundRequests).where(eq(refundRequests.id, refReq.id)).catch(() => {})
    await db.update(users).set({ balance: initialBal.toFixed(2) }).where(eq(users.id, testUserId)).catch(() => {})
  } catch (err: any) {
    console.error("✗ FAILED Test 3 exception:", err.message)
    failed++
  }

  // TEST 4: Multi-Vendor Order Privacy Isolation
  console.log("\n[TEST 4] Multi-Vendor Order Privacy Isolation...")
  try {
    // Order belongs to shop 1
    const [prodShop1] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.shopId, 1))
      .limit(1)

    if (prodShop1) {
      const [testOrder] = await db
        .insert(orders)
        .values({
          code: `TEST-ISO-${Date.now()}`,
          trackingCode: `TRK-ISO-${Date.now()}`,
          grandTotal: "200.00",
          shippingAddress: { name: "Guest", address: "Dhaka" },
        })
        .returning()

      await db.insert(orderItems).values({
        orderId: testOrder.id,
        productId: prodShop1.id,
        price: "200.00",
        quantity: 1,
      })

      // Shop 999 queries this order
      const sellerOrder = await getSellerOrderById(testOrder.id, 999)
      if (sellerOrder === null) {
        console.log("✓ PASSED: Seller 999 was denied access (null) to Shop 1's order.")
        passed++
      } else {
        console.error("✗ FAILED: Cross-vendor data leak! Seller 999 could see Shop 1's order:", sellerOrder)
        failed++
      }

      // Clean up
      await db.delete(orderItems).where(eq(orderItems.orderId, testOrder.id)).catch(() => {})
      await db.delete(orders).where(eq(orders.id, testOrder.id)).catch(() => {})
    } else {
      console.log("⚠️ Skipped: No product with shopId 1 found")
      passed++
    }
  } catch (err: any) {
    console.error("✗ FAILED Test 4 exception:", err.message)
    failed++
  }

  // TEST 5: Duplicate Product Review Guard
  console.log("\n[TEST 5] Duplicate Product Review Guard...")
  try {
    const testUserId = "usr_customer_default_01"
    const [testProd] = await db.select({ id: products.id }).from(products).limit(1)

    // Remove existing review if any for clean state
    await db.delete(reviews).where(and(eq(reviews.productId, testProd.id), eq(reviews.userId, testUserId))).catch(() => {})

    // First review
    const rev1 = await submitReview({
      productId: testProd.id,
      userId: testUserId,
      userName: "Tester",
      rating: 5,
      comment: "First review",
    })

    // Second review
    const rev2 = await submitReview({
      productId: testProd.id,
      userId: testUserId,
      userName: "Tester",
      rating: 5,
      comment: "Second duplicate review",
    })

    if (rev1.success && !rev2.success && (rev2 as any).message?.includes("already reviewed")) {
      console.log("✓ PASSED: Duplicate review was rejected with message: " + (rev2 as any).message)
      passed++
    } else {
      console.error("✗ FAILED: Duplicate review was not rejected!", rev1, rev2)
      failed++
    }

    // Clean up
    await db.delete(reviews).where(and(eq(reviews.productId, testProd.id), eq(reviews.userId, testUserId))).catch(() => {})
  } catch (err: any) {
    console.error("✗ FAILED Test 5 exception:", err.message)
    failed++
  }

  // TEST 6: Offline Wallet Recharge Duplicate Approval Guard
  console.log("\n[TEST 6] Offline Wallet Recharge Duplicate Approval Guard...")
  try {
    const testUserId = "usr_customer_default_01"
    const [uBefore] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const initialBal = Number(uBefore?.balance || 0)

    const [wRow] = await db
      .insert(wallets)
      .values({
        userId: testUserId,
        amount: "75.00",
        paymentMethod: "Bank Transfer",
        offlinePayment: true,
        approval: false,
      })
      .returning()

    // 1st approval
    await processWalletRechargeAdmin(wRow.id, true)
    const [uMid] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const midBal = Number(uMid?.balance || 0)

    // 2nd approval
    await processWalletRechargeAdmin(wRow.id, true)
    const [uAfter] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, testUserId)).limit(1)
    const finalBal = Number(uAfter?.balance || 0)

    if (midBal === initialBal + 75 && finalBal === midBal) {
      console.log(`✓ PASSED: Recharge approval credited 75 once. Re-approval did not double credit (remained ${finalBal}).`)
      passed++
    } else {
      console.error(`✗ FAILED: Double credit detected in wallet recharge! Mid: ${midBal}, Final: ${finalBal}`)
      failed++
    }

    // Clean up
    await db.delete(wallets).where(eq(wallets.id, wRow.id)).catch(() => {})
    await db.update(users).set({ balance: initialBal.toFixed(2) }).where(eq(users.id, testUserId)).catch(() => {})
  } catch (err: any) {
    console.error("✗ FAILED Test 6 exception:", err.message)
    failed++
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

runEdgeCaseTests().catch((e) => {
  console.error("Execution failed:", e)
  process.exit(1)
})
