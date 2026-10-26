/**
 * Comprehensive Test Suite for Group 3: Multi-Vendor & Seller Management (3 Modules)
 * 
 * Tests the functionality of:
 *  1. shop-service.ts
 *  2. seller-service.ts
 *  3. seller-panel-service.ts
 * 
 * Evaluated across 3 distinct perspectives:
 *  - Customer / Storefront (Vendor storefront browsing, shop products catalog, shop discount coupons)
 *  - Seller Portal (Seller dashboard analytics, wallet summary, commission ledger, package overview, payout requests, KYC)
 *  - Admin CMS (Global sellers registry, vendor verification queue, withdraw payout processing)
 */

import {
  getShops,
  getShopBySlug,
  getShopProducts,
  getShopCoupons,
} from "../src/services/shop-service"
import {
  getSellerDashboardStats,
  getSellerFullDashboardData,
  getAllSellersAdmin,
  getAllWithdrawRequestsAdmin,
  getSellerWithdrawRequests,
  createSellerWithdrawRequest,
  getPendingVerificationsAdmin,
  submitSellerVerification,
} from "../src/services/seller-service"
import {
  getCurrentSeller,
  getSellerShop,
  getSellerWalletSummary,
  getSellerCommissionLedger,
  getSellerPayoutRequests,
  getSellerPackageOverview,
  getSellerCoupons,
  getSellerProductReviewsList,
  getSellerProductQueries,
  getSellerSupportTickets,
} from "../src/services/seller-panel-service"
import { pool } from "../src/db"

interface TestResult {
  moduleNumber: number
  moduleName: string
  role: "Customer / Storefront" | "Seller" | "Admin"
  testName: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

function assert(
  moduleNumber: number,
  moduleName: string,
  role: "Customer / Storefront" | "Seller" | "Admin",
  testName: string,
  condition: boolean,
  details: string
) {
  results.push({
    moduleNumber,
    moduleName,
    role,
    testName,
    passed: condition,
    details,
  })
}

async function runTestSuite() {
  console.log("==========================================================================")
  console.log(" 🧪 STARTING TEST: Group 3 Multi-Vendor & Seller Management (3 Modules)")
  console.log("    Evaluating Customer, Seller, and Admin Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()
  const testSellerUserId = "usr_seller_default_01"
  const testShopSlug = "active-fashion-outlet"
  const testShopId = 1

  // Synchronize Postgres sequence for serial primary keys
  try {
    await pool.query("SELECT setval('seller_withdraw_requests_id_seq', (SELECT COALESCE(MAX(id), 1) FROM seller_withdraw_requests))")
  } catch {
    // ignore
  }

  // -------------------------------------------------------------------------
  // MODULE 1: shop-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 1: shop-service.ts ...")
  try {
    // 1.1 Customer Browse All Multi-vendor Stores
    const allShops = await getShops()
    assert(
      1,
      "shop-service",
      "Customer / Storefront",
      "Public Stores Directory & Follower Counts",
      Array.isArray(allShops) && allShops.length > 0,
      `Loaded ${allShops.length} active multi-vendor stores (e.g. '${allShops[0]?.name}')`
    )

    // 1.2 Customer Vendor Storefront Profile by Slug
    const shopProfile = await getShopBySlug(testShopSlug)
    assert(
      1,
      "shop-service",
      "Customer / Storefront",
      "Storefront Vendor Profile, Ratings & Social Links",
      shopProfile !== null && shopProfile.slug === testShopSlug,
      `Retrieved '${shopProfile?.name}', Rating: ${shopProfile?.rating}★, City: ${shopProfile?.address}`
    )

    // 1.3 Customer Shop Specific Product Catalog & Sorting
    const shopProductsRes = await getShopProducts(testShopSlug)
    assert(
      1,
      "shop-service",
      "Customer / Storefront",
      "Vendor Catalog Listing & Shop Search",
      Array.isArray(shopProductsRes.products),
      `Loaded ${shopProductsRes.products.length} products available from this vendor (Total: ${shopProductsRes.total})`
    )

    // 1.4 Customer Vendor Coupons & Store Vouchers
    const shopCoupons = await getShopCoupons(testShopSlug)
    assert(
      1,
      "shop-service",
      "Customer / Storefront",
      "Vendor Specific Discount Coupons & Vouchers",
      Array.isArray(shopCoupons),
      `Found ${shopCoupons.length} active coupon vouchers offered by '${shopProfile?.name || testShopSlug}'`
    )
  } catch (err: any) {
    assert(1, "shop-service", "Customer / Storefront", "Shop Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 2: seller-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 2: seller-service.ts ...")
  try {
    // 2.1 Seller Dashboard Statistics (Sales, Orders, Category Commissions)
    const stats = await getSellerDashboardStats(testShopSlug)
    assert(
      2,
      "seller-service",
      "Seller",
      "Seller Dashboard Performance Metrics & Commission Breakdown",
      stats !== null && typeof stats.totalSales === "number",
      `Total Sales: ৳${stats.totalSales}, Orders: ${stats.totalOrders}, Active Products: ${stats.totalProducts}`
    )

    // 2.2 Full Seller Dashboard Data Aggregator
    const fullDashboard = await getSellerFullDashboardData({
      shopSlug: testShopSlug,
      userId: testSellerUserId,
    })
    assert(
      2,
      "seller-service",
      "Seller",
      "Full Seller Portal Executive Overview & Metrics",
      fullDashboard !== null && fullDashboard.shop !== undefined && typeof fullDashboard.totalSales === "number",
      `Verified dashboard overview for shop: '${fullDashboard.shop?.name || testShopSlug}' (Total Sales: ৳${fullDashboard.totalSales})`
    )

    // 2.3 Seller Submit Payout / Withdraw Request
    const withdrawRes = await createSellerWithdrawRequest({
      shopId: testShopId,
      userId: testSellerUserId,
      amount: 1500,
      message: "Monthly sales settlement via bKash Merchant",
      paymentMethod: "bKash",
    })
    assert(
      2,
      "seller-service",
      "Seller",
      "Seller Payout & Earnings Withdraw Request Submission",
      withdrawRes.success === true,
      `Payout request processed successfully (Request ID: ${(withdrawRes as any).item?.id || (withdrawRes as any).id || "registered"})`
    )

    // 2.4 Seller View Own Withdraw History
    const sellerWithdraws = await getSellerWithdrawRequests(testSellerUserId)
    assert(
      2,
      "seller-service",
      "Seller",
      "Seller Payout Request History & Status Tracking",
      Array.isArray(sellerWithdraws) && sellerWithdraws.length > 0,
      `Retrieved ${sellerWithdraws.length} payout request record(s)`
    )

    // 2.5 Seller Submit KYC Verification Documents
    const kycRes = await submitSellerVerification(testShopId, {
      nidNumber: "1994029384918234",
      tradeLicense: "TRAD/DSCC/019284/2026",
      documentType: "Trade License & NID",
      bankName: "City Bank PLC",
      bankAccount: "1102938481029",
    })
    assert(
      2,
      "seller-service",
      "Seller",
      "Seller KYC & Business Verification Document Submission",
      kycRes.success === true,
      "KYC dossier submitted to admin review desk"
    )

    // 2.6 Admin Global Sellers Management Desk
    const adminSellersRes = await getAllSellersAdmin({ tab: "all" })
    assert(
      2,
      "seller-service",
      "Admin",
      "Admin Multi-Vendor Registry & Ban/Unban Desk",
      Array.isArray(adminSellersRes.sellers) && adminSellersRes.sellers.length > 0,
      `Admin registry contains ${adminSellersRes.sellers.length} registered merchant(s)`
    )

    // 2.7 Admin Pending Seller Verifications Queue
    const pendingVerifications = await getPendingVerificationsAdmin()
    assert(
      2,
      "seller-service",
      "Admin",
      "Admin Vendor KYC Verification & Approval Desk",
      Array.isArray(pendingVerifications),
      `Verification queue has ${pendingVerifications.length} vendor application(s)`
    )

    // 2.8 Admin Payout & Withdraw Processing Queue
    const adminWithdrawRequests = await getAllWithdrawRequestsAdmin()
    assert(
      2,
      "seller-service",
      "Admin",
      "Admin Seller Payouts Settlement & Audit Queue",
      Array.isArray(adminWithdrawRequests) && adminWithdrawRequests.length > 0,
      `Payout queue loaded ${adminWithdrawRequests.length} withdraw lot(s)`
    )
  } catch (err: any) {
    assert(2, "seller-service", "Seller", "Seller Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 3: seller-panel-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 3: seller-panel-service.ts ...")
  try {
    // 3.1 Seller Profile Session Resolution
    const seller = await getCurrentSeller()
    assert(
      3,
      "seller-panel-service",
      "Seller",
      "Active Seller Profile & Shop Resolution",
      seller !== null && typeof seller.shopId === "number",
      `Resolved active seller: '${seller?.shopName}' (ID: ${seller?.shopId}, Slug: '${seller?.shopSlug}')`
    )

    if (seller) {
      // 3.2 Seller Shop Settings & Contact Details
      const shopDetails = await getSellerShop(seller.shopId)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Shop Configuration & Profile Desk",
        shopDetails !== null,
        `Shop profile verified: '${shopDetails?.name}', Phone: ${shopDetails?.phone || "N/A"}`
      )

      // 3.3 Seller Wallet & Earnings Summary
      const walletSummary = await getSellerWalletSummary(seller)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Wallet Summary & Withdrawable Balance",
        walletSummary !== null && typeof walletSummary.balance === "number",
        `Balance: ৳${walletSummary.balance}, Min Withdraw: ৳${walletSummary.minimumWithdrawal || 0}`
      )

      // 3.4 Seller Commission Ledger & Financial Records
      const ledger = await getSellerCommissionLedger(seller)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Commission Ledger & Order Transaction Ledger",
        Array.isArray(ledger),
        `Ledger contains ${ledger.length} order commission line item(s)`
      )

      // 3.5 Seller Subscription Package Overview
      const packageOverview = await getSellerPackageOverview(seller)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Subscription Package Plan & Product Upload Quota",
        packageOverview !== null && Array.isArray(packageOverview.plans),
        `Available subscription tiers: ${packageOverview.plans.length}, Active plan: '${packageOverview.current?.name || "Free"}'`
      )

      // 3.6 Seller Discount Coupons Management
      const sellerCoupons = await getSellerCoupons(seller.userId)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Promotional Coupons & Vouchers Desk",
        Array.isArray(sellerCoupons),
        `Merchant has ${sellerCoupons.length} promotional coupon campaign(s)`
      )

      // 3.7 Seller Product Customer Reviews
      const sellerReviews = await getSellerProductReviewsList(seller)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Catalog Customer Feedback & Star Ratings",
        Array.isArray(sellerReviews),
        `Retrieved ${sellerReviews.length} customer review(s) for vendor products`
      )

      // 3.8 Seller Customer Product Queries (Q&A)
      const sellerQueries = await getSellerProductQueries(seller)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Customer Pre-Sale Queries & Inquiries",
        Array.isArray(sellerQueries),
        `Vendor pre-sale inquiry desk has ${sellerQueries.length} question(s)`
      )

      // 3.9 Seller Support Desk Tickets
      const sellerTickets = await getSellerSupportTickets(seller.userId || testSellerUserId)
      assert(
        3,
        "seller-panel-service",
        "Seller",
        "Seller Technical & Commercial Helpdesk Tickets",
        Array.isArray(sellerTickets),
        `Support desk contains ${sellerTickets.length} support ticket thread(s)`
      )
    }
  } catch (err: any) {
    assert(3, "seller-panel-service", "Seller", "Seller Panel Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // REPORT GENERATION & METRICS
  // -------------------------------------------------------------------------
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
  const totalTests = results.length
  const passedTests = results.filter((r) => r.passed).length
  const failedTests = totalTests - passedTests

  console.log("\n==========================================================================")
  console.log(` 📊 TEST RESULTS SUMMARY (${elapsed}s)`)
  console.log(`    Total Scenarios Tested : ${totalTests}`)
  console.log(`    Passed                 : ${passedTests} ✅`)
  console.log(`    Failed                 : ${failedTests} ❌`)
  console.log("==========================================================================\n")

  console.log("| # | Module | Stakeholder Scope | Test Scenario | Status | Details |")
  console.log("|---|---|---|---|---|---|")
  results.forEach((r, idx) => {
    const statusIcon = r.passed ? "✅ PASS" : "❌ FAIL"
    console.log(
      `| ${idx + 1} | ${r.moduleName} | ${r.role} | ${r.testName} | ${statusIcon} | ${r.details} |`
    )
  })

  // Role summary
  console.log("\n--- Stakeholder Breakdown ---")
  const roles = ["Customer / Storefront", "Seller", "Admin"] as const
  for (const role of roles) {
    const roleResults = results.filter((r) => r.role === role)
    const rolePassed = roleResults.filter((r) => r.passed).length
    console.log(`  * ${role.padEnd(23)}: ${rolePassed}/${roleResults.length} passed (${Math.round((rolePassed / roleResults.length) * 100)}%)`)
  }

  // Clean pool connection
  try {
    await pool.end()
  } catch {
    // ignore
  }

  process.exit(failedTests > 0 ? 1 : 0)
}

runTestSuite().catch(async (e) => {
  console.error("Fatal test runner crash:", e)
  try {
    await pool.end()
  } catch {}
  process.exit(1)
})
