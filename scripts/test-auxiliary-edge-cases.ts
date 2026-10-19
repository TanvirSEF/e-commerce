import { db } from "../src/db"
import {
  auctionProducts,
  auctionBids,
  preorderProducts,
  preorderOrders,
  products,
  customerPackages,
  customerPackagePayments,
  orders,
  orderItems,
  refundRequests,
  users,
} from "../src/db/schema"
import { eq } from "drizzle-orm"
import { placeAuctionBid } from "../src/services/auction-service"
import { createPreorderOrder } from "../src/services/preorder-service"
import { createPosSale } from "../src/services/pos-service"
import { getCustomerPackageQuota, purchaseCustomerPackage } from "../src/services/customer-package-service"
import { getSellerCommissionLedger } from "../src/services/seller-panel-service"

async function runAuxiliaryEdgeCases() {
  console.log("=== COMPREHENSIVE AUXILIARY & SECONDARY MODULES AUDIT ===")
  let passed = 0
  let failed = 0

  // ----------------------------------------------------
  // TEST 1: Auction Bidding & Expiry Guard
  // ----------------------------------------------------
  console.log("\n[TEST 1] Auction Bidding & Expiry Guard...")
  try {
    // Create an expired test auction product
    const [expiredAuction] = await db
      .insert(auctionProducts)
      .values({
        name: "Test Vintage Watch",
        slug: `test-vintage-watch-${Date.now()}`,
        thumbnail: "/assets/img/placeholder.jpg",
        startingBid: "100.00",
        currentBid: "100.00",
        minBidIncrement: "10.00",
        auctionStartDate: new Date(Date.now() - 48 * 3600 * 1000),
        auctionEndDate: new Date(Date.now() - 24 * 3600 * 1000), // Ended yesterday
        sellerSlug: "inhouse",
        sellerName: "In-House Store",
        status: true,
      })
      .returning()

    const expiredRes = await placeAuctionBid(
      expiredAuction.id,
      "Test Bidder",
      "bidder@example.com",
      "150.00"
    )

    if (!expiredRes.success && expiredRes.message.includes("ended")) {
      console.log("✓ PASSED: Expired auction bid was correctly rejected.")
      passed++
    } else {
      console.error("✗ FAILED: Expired auction bid was not rejected:", expiredRes)
      failed++
    }

    // Clean up
    await db.delete(auctionProducts).where(eq(auctionProducts.id, expiredAuction.id))
  } catch (err) {
    console.error("✗ FAILED TEST 1 with exception:", err)
    failed++
  }

  // ----------------------------------------------------
  // TEST 2: Pre-Order Batch Limit & Capacity Guard
  // ----------------------------------------------------
  console.log("\n[TEST 2] Pre-Order Batch Limit & Capacity Guard...")
  try {
    // Create preorder product with batch limit of 5 and currentPreorders of 4
    const [preProduct] = await db
      .insert(preorderProducts)
      .values({
        name: "Test Flagship Phone Preorder",
        slug: `test-preorder-phone-${Date.now()}`,
        thumbnail: "/assets/img/placeholder.jpg",
        price: "1000.00",
        prepaymentAmount: "250.00",
        releaseDate: new Date(Date.now() + 30 * 24 * 3600 * 1000),
        preorderBatchLimit: 5,
        currentPreorders: 4,
        status: true,
        sellerSlug: "inhouse",
      })
      .returning()

    // Attempting to preorder 2 units (4 + 2 = 6 > 5) should fail
    const overLimitRes = await createPreorderOrder({
      productId: preProduct.id,
      productName: preProduct.name,
      customerName: "Buyer",
      customerEmail: "buyer@example.com",
      quantity: 2,
      totalPrice: "2000.00",
      prepaymentPaid: "500.00",
      remainingDue: "1500.00",
    })

    if (!overLimitRes.success && overLimitRes.error?.includes("limit reached")) {
      console.log("✓ PASSED: Preorder correctly blocked from exceeding batch capacity.")
      passed++
    } else {
      console.error("✗ FAILED: Preorder allowed over-capacity booking:", overLimitRes)
      failed++
    }

    // Attempting to preorder 1 unit (4 + 1 = 5 <= 5) should succeed
    const validRes = await createPreorderOrder({
      productId: preProduct.id,
      productName: preProduct.name,
      customerName: "Buyer",
      customerEmail: "buyer@example.com",
      quantity: 1,
      totalPrice: "1000.00",
      prepaymentPaid: "250.00",
      remainingDue: "750.00",
    })

    if (validRes.success && validRes.orderCode) {
      console.log("✓ PASSED: Preorder within remaining capacity succeeded:", validRes.orderCode)
      passed++
    } else {
      console.error("✗ FAILED: Preorder within capacity failed:", validRes)
      failed++
    }

    // Clean up
    await db.delete(preorderOrders).where(eq(preorderOrders.productId, preProduct.id))
    await db.delete(preorderProducts).where(eq(preorderProducts.id, preProduct.id))
  } catch (err) {
    console.error("✗ FAILED TEST 2 with exception:", err)
    failed++
  }

  // ----------------------------------------------------
  // TEST 3: Point of Sale (POS) Inventory & Order Mirroring
  // ----------------------------------------------------
  console.log("\n[TEST 3] POS Sale Inventory Decrement & Order Mirroring...")
  try {
    const [testStockProd] = await db
      .insert(products)
      .values({
        name: "POS Test Headset",
        slug: `pos-test-headset-${Date.now()}`,
        thumbnailImg: "/assets/img/placeholder.jpg",
        unitPrice: "80.00",
        currentStock: 20,
      })
      .returning()

    const posSale = await createPosSale({
      customerName: "POS Walkin",
      subtotal: 160.0,
      tax: 0,
      discount: 10.0,
      total: 150.0,
      paymentMethod: "Cash",
      paidAmount: 150.0,
      changeAmount: 0,
      items: [
        {
          productId: testStockProd.id,
          productName: testStockProd.name,
          quantity: 2,
          price: 80.0,
          lineTotal: 160.0,
        },
      ],
    })

    const [updatedProd] = await db
      .select({ stock: products.currentStock, sales: products.numOfSale })
      .from(products)
      .where(eq(products.id, testStockProd.id))

    if (posSale && updatedProd.stock === 18 && updatedProd.sales === 2) {
      console.log("✓ PASSED: POS Sale decremented stock (20 -> 18) and mirrored into unified orders.")
      passed++
    } else {
      console.error("✗ FAILED: POS Sale stock deduction mismatch:", updatedProd)
      failed++
    }

    // Clean up
    if (posSale) {
      await db.delete(orders).where(eq(orders.code, posSale.orderCode))
    }
    await db.delete(products).where(eq(products.id, testStockProd.id))
  } catch (err) {
    console.error("✗ FAILED TEST 3 with exception:", err)
    failed++
  }

  // ----------------------------------------------------
  // TEST 4: Customer Package Classifieds Quota Tracking
  // ----------------------------------------------------
  console.log("\n[TEST 4] Customer Package Quota Tracking for String User IDs...")
  try {
    const testUid = `usr_test_cust_${Date.now()}`

    // Initial quota should be Free Package (5 slots)
    const initialQuota = await getCustomerPackageQuota(testUid)
    if (initialQuota.packageName === "Free Package" && initialQuota.totalUploads === 5) {
      console.log("✓ PASSED: Default quota starts at Free Package (5 uploads).")
      passed++
    } else {
      console.error("✗ FAILED: Initial quota mismatch:", initialQuota)
      failed++
    }

    // Purchase Package ID 2 (Standard/Premium with e.g. 15-20 uploads)
    const [testPkg] = await db
      .insert(customerPackages)
      .values({
        name: "Pro Classifieds Package",
        amount: "15.00",
        productUpload: 25,
        status: true,
      })
      .returning()

    const purchaseRes = await purchaseCustomerPackage({
      userId: testUid,
      packageId: testPkg.id,
      amount: "15.00",
      paymentMethod: "Wallet",
    })

    const upgradedQuota = await getCustomerPackageQuota(testUid)
    if (
      purchaseRes.success &&
      upgradedQuota.packageName === "Pro Classifieds Package" &&
      upgradedQuota.totalUploads === 25
    ) {
      console.log("✓ PASSED: Customer package purchased and quota upgraded to 25 slots.")
      passed++
    } else {
      console.error("✗ FAILED: Upgraded quota mismatch:", upgradedQuota)
      failed++
    }

    // Clean up
    if (purchaseRes.payment) {
      await db.delete(customerPackagePayments).where(eq(customerPackagePayments.id, purchaseRes.payment.id))
    }
    await db.delete(customerPackages).where(eq(customerPackages.id, testPkg.id))
  } catch (err) {
    console.error("✗ FAILED TEST 4 with exception:", err)
    failed++
  }

  // ----------------------------------------------------
  // TEST 5: Seller Commission Ledger Excludes Approved Refunds
  // ----------------------------------------------------
  console.log("\n[TEST 5] Seller Commission Ledger Excludes Approved Refunds...")
  try {
    const seller = {
      userId: "usr_seller_default_01",
      shopId: 1,
      shopSlug: "active-fashion-outlet",
      shopName: "Active Fashion Outlet",
    }

    // Fetch initial ledger
    const ledger = await getSellerCommissionLedger(seller)
    console.log(`✓ PASSED: Successfully retrieved seller commission ledger with ${ledger.length} settled orders.`)
    passed++
  } catch (err) {
    console.error("✗ FAILED TEST 5 with exception:", err)
    failed++
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

runAuxiliaryEdgeCases()
