import { db } from "../src/db"
import { users, products, orders, wallets } from "../src/db/schema"
import { eq, desc } from "drizzle-orm"
import {
  placeOrderAction,
  trackOrderByCodeAction,
} from "../src/app/actions/ecommerce-actions"
import { getCustomerOrderDetails } from "../src/services/order-service"

async function runTests() {
  console.log("==================================================")
  console.log("   CHECKOUT, WALLET DEBIT & TRACKING TEST SUITE   ")
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

  let createdOrderCode = ""
  let createdTrackingCode = ""

  // --- TEST 1: Checkout Order Placement & userId Linking ---
  try {
    console.log("\n[TEST 1] Testing Checkout Order Placement & Customer Account Linking...")
    const orderPayload = {
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        email: testUser.email || "customer@example.com",
        phone: "+880 1711 000000",
        address: "House 10, Road 5, Dhanmondi",
        city: "Dhaka",
        country: "Bangladesh",
        postal_code: "1205",
      },
      paymentType: "cash_on_delivery",
      items: [
        {
          productId: testProduct.id,
          price: 120,
          quantity: 1,
        },
      ],
      grandTotal: 120,
      shippingCost: 0,
      couponDiscount: 0,
    }

    const res = await placeOrderAction(orderPayload)
    if (!res.success || !res.order) {
      throw new Error("placeOrderAction failed: " + (res.error || "unknown error"))
    }

    createdOrderCode = res.order.code
    createdTrackingCode = res.order.trackingCode
    console.log(`  -> Order created in DB: code=${createdOrderCode}, tracking=${createdTrackingCode}`)

    // Verify order in PostgreSQL is linked to testUser.id
    const [dbOrder] = await db.select().from(orders).where(eq(orders.code, createdOrderCode)).limit(1)
    if (!dbOrder || dbOrder.userId !== testUser.id) {
      throw new Error(`Expected order.userId to be ${testUser.id}, got: ${dbOrder?.userId}`)
    }
    console.log(`  -> Verified in PostgreSQL: orders.userId === ${dbOrder.userId}`)

    // Verify customer order details page loads order successfully
    const details = await getCustomerOrderDetails(testUser.id, createdOrderCode)
    if (!details || details.code !== createdOrderCode) {
      throw new Error("getCustomerOrderDetails should return order for authenticated user")
    }
    console.log(`  -> Verified getCustomerOrderDetails: retrieved ${details.items.length} items`)

    console.log("  [PASS] Test 1: Checkout Order Linking verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 1 Error:", err?.message || err)
    failed++
  }

  // --- TEST 2: Wallet Payment Checkout Validation & Debit Logging ---
  try {
    console.log("\n[TEST 2] Testing Wallet Payment Checkout Validation & Debit Logging...")
    const originalBalance = Number(testUser.balance || 0)
    console.log(`  -> Current test user wallet balance: ৳${originalBalance.toFixed(2)}`)

    // Step A: Attempt checkout with wallet where cost exceeds balance
    const excessiveTotal = originalBalance + 50000
    const failOrderPayload = {
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        address: "House 10, Road 5",
        city: "Dhaka",
      },
      paymentType: "wallet",
      items: [{ productId: testProduct.id, price: excessiveTotal, quantity: 1 }],
      grandTotal: excessiveTotal,
    }

    const failRes = await placeOrderAction(failOrderPayload)
    if (failRes.success !== false) {
      throw new Error("Order with insufficient wallet balance should have failed")
    }
    console.log(`  -> Insufficient balance correctly rejected: ${failRes.error}`)

    // Step B: Top up user balance to test successful wallet purchase
    const orderCost = 150
    const fundedBalance = orderCost + 100
    await db
      .update(users)
      .set({ balance: fundedBalance.toFixed(2) })
      .where(eq(users.id, testUser.id))

    const successOrderPayload = {
      userId: testUser.id,
      shippingAddress: {
        name: testUser.name || "Test Customer",
        address: "House 10, Road 5",
        city: "Dhaka",
      },
      paymentType: "wallet",
      items: [{ productId: testProduct.id, price: orderCost, quantity: 1 }],
      grandTotal: orderCost,
    }

    const walletOrderRes = await placeOrderAction(successOrderPayload)
    if (!walletOrderRes.success || !walletOrderRes.order) {
      throw new Error("Wallet payment order failed: " + (walletOrderRes.error || "unknown"))
    }
    console.log(`  -> Wallet payment order placed: code=${walletOrderRes.order.code}`)

    // Verify balance was debited in PostgreSQL
    const [updatedUser] = await db.select().from(users).where(eq(users.id, testUser.id)).limit(1)
    const expectedRemaining = (fundedBalance - orderCost).toFixed(2)
    if (Number(updatedUser.balance).toFixed(2) !== expectedRemaining) {
      throw new Error(`Expected balance ৳${expectedRemaining}, found ৳${updatedUser.balance}`)
    }
    console.log(`  -> User balance debited: ৳${fundedBalance} -> ৳${updatedUser.balance}`)

    // Verify wallet ledger entry
    const [walletEntry] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, testUser.id))
      .orderBy(desc(wallets.id))
      .limit(1)

    if (!walletEntry || Number(walletEntry.amount) !== -orderCost) {
      throw new Error(`Expected debit of -৳${orderCost}, found: ${walletEntry?.amount}`)
    }
    console.log(`  -> Wallet ledger debit recorded: id=${walletEntry.id}, amount=${walletEntry.amount}, method=${walletEntry.paymentMethod}`)

    // Restore original balance
    await db
      .update(users)
      .set({ balance: originalBalance.toFixed(2) })
      .where(eq(users.id, testUser.id))

    console.log("  [PASS] Test 2: Wallet Checkout Validation & Debit Logging verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 2 Error:", err?.message || err)
    failed++
  }

  // --- TEST 3: Order Tracking Server Action ---
  try {
    console.log("\n[TEST 3] Testing Order Tracking Server Action...")
    if (!createdOrderCode) {
      throw new Error("Skipping Test 3: createdOrderCode was not set from Test 1")
    }

    // Lookup by Order Code
    const trackByCode = await trackOrderByCodeAction(createdOrderCode)
    if (!trackByCode.success || !trackByCode.order) {
      throw new Error("trackOrderByCodeAction should find order by order code")
    }
    console.log(`  -> Tracked by Order Code: code=${trackByCode.order.code}, grandTotal=${trackByCode.order.grand_total}, status=${trackByCode.order.delivery_status}`)

    // Lookup by Tracking Code
    if (createdTrackingCode) {
      const trackByTrk = await trackOrderByCodeAction(createdTrackingCode)
      if (!trackByTrk.success || !trackByTrk.order) {
        throw new Error("trackOrderByCodeAction should find order by tracking code")
      }
      console.log(`  -> Tracked by Tracking Code: trackingCode=${trackByTrk.order.trackingCode}`)
    }

    // Lookup invalid code
    const invalidTrack = await trackOrderByCodeAction("INVALID-CODE-99999")
    if (invalidTrack.success !== false) {
      throw new Error("Invalid tracking code should return success: false")
    }
    console.log("  -> Invalid code lookup correctly returned notFound")

    console.log("  [PASS] Test 3: Order Tracking Server Action verified.")
    passed++
  } catch (err: any) {
    console.error("  [FAIL] Test 3 Error:", err?.message || err)
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
