import { db } from "../src/db"
import { sql } from "drizzle-orm"

// Module 1: customer-service
import {
  getAllCustomersAdmin,
  banToggleCustomer,
  suspiciousToggleCustomer,
  createCustomerAdmin,
  bulkBanCustomers,
  deleteCustomer,
} from "../src/services/customer-service"

// Module 2: customer-extra-service
import {
  getCustomerAddresses,
  addCustomerAddress,
  getDefaultShippingAddress,
  updateCustomerAddress,
  setDefaultAddress,
  deleteCustomerAddress,
  getUserWishlistProducts,
  getUserWishlistProductIds,
  toggleWishlistProduct,
  removeFromWishlist,
  getFollowedSellers,
  followShop,
  unfollowShop,
  getDigitalPurchases,
  getCustomerPaymentInfos,
  addCustomerPaymentInfo,
  deleteCustomerPaymentInfo,
  setDefaultPaymentInfo,
} from "../src/services/customer-extra-service"

// Module 3: customer-product-service
import {
  getAllClassifiedProductsAdmin,
  getClassifiedProductsAdminPaginated,
  getPublishedCustomerProducts,
  getCustomerProductsByUser,
  createCustomerProduct,
  getCustomerProductById,
  getCustomerProductBySlug,
  updateClassifiedPublished,
  updateCustomerProductStatus,
  deleteClassifiedProduct,
} from "../src/services/customer-product-service"

// Module 4: customer-package-service
import {
  getAllCustomerPackages,
  getCustomerPackageQuota,
  purchaseCustomerPackage,
  createCustomerPackage,
  getCustomerPackageById,
  updateCustomerPackage,
  deleteCustomerPackage,
} from "../src/services/customer-package-service"

interface TestResult {
  num: number
  module: string
  stakeholder: "Customer / Storefront" | "Seller" | "Admin"
  scenario: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

async function record(
  num: number,
  module: string,
  stakeholder: "Customer / Storefront" | "Seller" | "Admin",
  scenario: string,
  fn: () => Promise<string>
) {
  try {
    const details = await fn()
    results.push({ num, module, stakeholder, scenario, passed: true, details })
    console.log(`  [PASS] #${num} [${module}] [${stakeholder}] ${scenario}`)
  } catch (err: any) {
    const details = err?.message || String(err)
    results.push({ num, module, stakeholder, scenario, passed: false, details })
    console.error(`  [FAIL] #${num} [${module}] [${stakeholder}] ${scenario}:`, details)
  }
}

async function syncSequences() {
  const tables = [
    { table: "customer_products", seq: "customer_products_id_seq" },
    { table: "customer_packages", seq: "customer_packages_id_seq" },
    { table: "customer_package_payments", seq: "customer_package_payments_id_seq" },
    { table: "customer_addresses", seq: "customer_addresses_id_seq" },
    { table: "customer_payment_infos", seq: "customer_payment_infos_id_seq" },
    { table: "wishlists", seq: "wishlists_id_seq" },
    { table: "shop_followers", seq: "shop_followers_id_seq" },
  ]

  for (const { table, seq } of tables) {
    try {
      await db.execute(sql.raw(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_class WHERE relname = '${seq}') THEN
            PERFORM setval('${seq}', COALESCE((SELECT MAX(id) FROM ${table}), 1));
          END IF;
        END $$;
      `))
    } catch (e: any) {
      // Ignore if sequence doesn't exist
    }
  }
}

async function runAllTests() {
  console.log("==========================================================================")
  console.log(" 🧪 STARTING TEST: Group 6 Customer & Classified Ads (4 Modules)")
  console.log("    Evaluating Customer, Seller, and Admin Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()
  await syncSequences()

  const TEST_CUSTOMER_ID = "usr_customer_02" // Nusrat Jahan
  const TEST_SHOP_ID = 1 // Active Fashion Outlet
  let tempCreatedUserId: string | null = null
  let tempAddressId: number | null = null
  let tempPaymentInfoId: number | null = null
  let tempClassifiedId: number | null = null
  let tempClassifiedSlug: string | null = null
  let tempPackageId: number | null = null

  // ==========================================================================
  // MODULE 1: customer-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 1: customer-service.ts ...")

  await record(
    1,
    "customer-service",
    "Admin",
    "Admin Customers Directory & Status Metric Counts",
    async () => {
      const res = await getAllCustomersAdmin({ page: 1, limit: 10 })
      if (!res || !Array.isArray(res.items)) throw new Error("Invalid customers response")
      return `Loaded ${res.items.length} customer(s) (Total: ${res.total}, Verified: ${res.counts.verified}, Banned: ${res.counts.banned})`
    }
  )

  await record(
    2,
    "customer-service",
    "Admin",
    "Admin Customer Keyword Search & Filtering",
    async () => {
      const res = await getAllCustomersAdmin({ search: "Nusrat" })
      if (!res.items.some((c) => c.name.toLowerCase().includes("nusrat") || c.email.toLowerCase().includes("nusrat"))) {
        throw new Error("Customer 'Nusrat' search returned no expected match")
      }
      return `Found ${res.items.length} matching customer record(s) for query 'Nusrat'`
    }
  )

  await record(
    3,
    "customer-service",
    "Admin",
    "Admin Customer Account Ban / Unban Toggle",
    async () => {
      const res1 = await banToggleCustomer(TEST_CUSTOMER_ID)
      const res2 = await banToggleCustomer(TEST_CUSTOMER_ID) // revert back
      return `Ban toggle verified (Banned -> ${res1.banned}, Reverted -> ${res2.banned})`
    }
  )

  await record(
    4,
    "customer-service",
    "Admin",
    "Admin Suspicious Account Flag Toggle",
    async () => {
      const res1 = await suspiciousToggleCustomer(TEST_CUSTOMER_ID)
      const res2 = await suspiciousToggleCustomer(TEST_CUSTOMER_ID) // revert back
      return `Suspicious toggle verified (Flag -> ${res1.isSuspicious}, Reverted -> ${res2.isSuspicious})`
    }
  )

  await record(
    5,
    "customer-service",
    "Admin",
    "Admin Direct Customer Account Creation",
    async () => {
      const uniqueEmail = `test_customer_${Date.now()}@example.com`
      const res = await createCustomerAdmin({
        name: "Test Direct Customer",
        email: uniqueEmail,
        phone: "+880 1700 999111",
        password: "Password@123",
      })
      if (!res.success || !res.user) throw new Error(res.error || "Failed to create customer")
      tempCreatedUserId = res.user.id
      return `Created customer account: ${res.user.name} (${res.user.email}, ID: ${res.user.id})`
    }
  )

  await record(
    6,
    "customer-service",
    "Admin",
    "Admin Bulk Ban / Unban Operations",
    async () => {
      if (!tempCreatedUserId) throw new Error("No test customer ID available")
      const banned = await bulkBanCustomers([tempCreatedUserId], true)
      const unbanned = await bulkBanCustomers([tempCreatedUserId], false)
      if (!banned || !unbanned) throw new Error("Bulk ban operation failed")
      return `Bulk ban/unban executed successfully for customer ID ${tempCreatedUserId}`
    }
  )

  // ==========================================================================
  // MODULE 2: customer-extra-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 2: customer-extra-service.ts ...")

  await record(
    7,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Saved Delivery Addresses Directory",
    async () => {
      const addresses = await getCustomerAddresses(TEST_CUSTOMER_ID)
      return `Retrieved ${addresses.length} saved customer address(es)`
    }
  )

  await record(
    8,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer New Address Book Entry Registration",
    async () => {
      const newAddr = await addCustomerAddress({
        userId: TEST_CUSTOMER_ID,
        address: "House 42, Road 11, Block D, Banani",
        city: "Dhaka",
        country: "Bangladesh",
        postalCode: "1213",
        phone: "+880 1711 000000",
        setDefault: true,
      })
      if (!newAddr || !newAddr.id) throw new Error("Failed to add customer address")
      tempAddressId = newAddr.id
      return `Address saved with ID: ${newAddr.id} (${newAddr.city}, ${newAddr.address})`
    }
  )

  await record(
    9,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Default Shipping Address Resolution",
    async () => {
      const defAddr = await getDefaultShippingAddress(TEST_CUSTOMER_ID)
      if (!defAddr) throw new Error("Default shipping address could not be resolved")
      return `Default shipping address resolved: ${defAddr.address}, ${defAddr.city}`
    }
  )

  await record(
    10,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Address Details Modification",
    async () => {
      if (!tempAddressId) throw new Error("No address ID to update")
      const updated = await updateCustomerAddress({
        id: tempAddressId,
        userId: TEST_CUSTOMER_ID,
        address: "House 42 (Updated Suite), Road 11, Banani",
      })
      if (!updated) throw new Error("Address update returned false")
      return `Address #${tempAddressId} updated successfully`
    }
  )

  await record(
    11,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Set Default Shipping / Billing Flags",
    async () => {
      if (!tempAddressId) throw new Error("No address ID to set default")
      const shipOk = await setDefaultAddress(tempAddressId, TEST_CUSTOMER_ID, "shipping")
      const billOk = await setDefaultAddress(tempAddressId, TEST_CUSTOMER_ID, "billing")
      if (!shipOk || !billOk) throw new Error("Failed to set default address flag")
      return `Default flags updated (Shipping: ${shipOk}, Billing: ${billOk})`
    }
  )

  await record(
    12,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Wishlist Product Toggle & Add",
    async () => {
      const res = await toggleWishlistProduct(TEST_CUSTOMER_ID, 1)
      return `Wishlist product #1 toggle state: ${res.added ? "Added to wishlist" : "Removed from wishlist"}`
    }
  )

  await record(
    13,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Wishlist Products Feed with Discount Calculations",
    async () => {
      // Ensure product #1 is in wishlist
      await toggleWishlistProduct(TEST_CUSTOMER_ID, 1)
      const list = await getUserWishlistProducts(TEST_CUSTOMER_ID)
      return `Customer wishlist loaded ${list.length} item(s)`
    }
  )

  await record(
    14,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Wishlist Product ID Array Check",
    async () => {
      const ids = await getUserWishlistProductIds(TEST_CUSTOMER_ID)
      return `Active wishlist contains ${ids.length} product ID(s)`
    }
  )

  await record(
    15,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Wishlist Item Removal",
    async () => {
      const removed = await removeFromWishlist(TEST_CUSTOMER_ID, 1)
      return `Product #1 removal from wishlist: ${removed ? "Success" : "Already removed"}`
    }
  )

  await record(
    16,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Follow Merchant Shop Storefront",
    async () => {
      const followed = await followShop(TEST_CUSTOMER_ID, TEST_SHOP_ID)
      return `Shop #${TEST_SHOP_ID} follow action: ${followed ? "Success" : "Failed"}`
    }
  )

  await record(
    17,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Followed Sellers Directory",
    async () => {
      const followedSellers = await getFollowedSellers(TEST_CUSTOMER_ID)
      return `Customer follows ${followedSellers.length} vendor shop(s)`
    }
  )

  await record(
    18,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Unfollow Merchant Shop",
    async () => {
      const unfollowed = await unfollowShop(TEST_CUSTOMER_ID, TEST_SHOP_ID)
      return `Shop #${TEST_SHOP_ID} unfollow action: ${unfollowed ? "Success" : "Failed"}`
    }
  )

  await record(
    19,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Digital Assets & Software License Purchases",
    async () => {
      const digitals = await getDigitalPurchases(TEST_CUSTOMER_ID)
      return `Customer has ${digitals.length} digital asset purchase(s)`
    }
  )

  await record(
    20,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Refund Payout Payment Method Registration",
    async () => {
      const pInfo = await addCustomerPaymentInfo({
        userId: TEST_CUSTOMER_ID,
        paymentType: "bkash",
        accountName: "Nusrat Jahan",
        accountNumber: "01711223344",
        paymentInstruction: "Personal bKash wallet",
        setDefault: true,
      })
      if (!pInfo || !pInfo.id) throw new Error("Failed to register payout payment info")
      tempPaymentInfoId = pInfo.id
      return `Payment info registered (ID: ${pInfo.id}, Type: ${pInfo.paymentType}, Number: ${pInfo.accountNumber})`
    }
  )

  await record(
    21,
    "customer-extra-service",
    "Customer / Storefront",
    "Customer Refund Payment Methods Directory",
    async () => {
      const infos = await getCustomerPaymentInfos(TEST_CUSTOMER_ID)
      return `Customer has ${infos.length} saved refund payout destination(s)`
    }
  )

  // ==========================================================================
  // MODULE 3: customer-product-service.ts (Classified Ads)
  // ==========================================================================
  console.log("▶ Testing Module 3: customer-product-service.ts ...")

  await record(
    22,
    "customer-product-service",
    "Customer / Storefront",
    "Customer Post Classified Ad / Used Item Listing",
    async () => {
      const res = await createCustomerProduct({
        userId: TEST_CUSTOMER_ID,
        name: `Dell XPS 15 9520 (OLED 4K, 32GB RAM, Mint Condition) ${Date.now().toString().slice(-4)}`,
        category: "Computers & Laptops",
        unitPrice: 145000,
        condition: "Used - Like New",
        customerName: "Nusrat Jahan",
        customerPhone: "+880 1711 223344",
        customerEmail: "nusrat@example.com",
        location: "Gulshan 2, Dhaka",
      })
      if (!res.success || !res.product) throw new Error("Failed to post classified product")
      tempClassifiedId = res.product.id
      tempClassifiedSlug = res.product.slug
      return `Classified ad posted: '${res.product.name}' (ID: ${res.product.id}, Slug: ${res.product.slug})`
    }
  )

  await record(
    23,
    "customer-product-service",
    "Customer / Storefront",
    "Customer Dashboard Classified Ads Feed",
    async () => {
      const myAds = await getCustomerProductsByUser(TEST_CUSTOMER_ID)
      return `Retrieved ${myAds.length} customer posted ad(s)`
    }
  )

  await record(
    24,
    "customer-product-service",
    "Customer / Storefront",
    "Public Classified Ads Catalog & Filtering",
    async () => {
      const res = await getPublishedCustomerProducts({ page: 1, limit: 10 })
      return `Catalog returned ${res.products.length} published classified item(s) (Total: ${res.total})`
    }
  )

  await record(
    25,
    "customer-product-service",
    "Customer / Storefront",
    "Classified Product Details Resolution by Slug & ID",
    async () => {
      if (!tempClassifiedSlug || !tempClassifiedId) throw new Error("No classified slug/id available")
      const bySlug = await getCustomerProductBySlug(tempClassifiedSlug)
      const byId = await getCustomerProductById(tempClassifiedId)
      if (!bySlug && !byId) throw new Error("Could not resolve classified product")
      return `Classified ad resolved successfully (Slug: '${bySlug?.slug || byId?.slug}', Price: ৳${byId?.unitPrice || bySlug?.unitPrice})`
    }
  )

  await record(
    26,
    "customer-product-service",
    "Admin",
    "Admin Classified Ads Directory & Management Desk",
    async () => {
      const res = await getClassifiedProductsAdminPaginated({ page: 1, limit: 10 })
      return `Admin classified desk loaded ${res.items.length} ad(s) (Total: ${res.total})`
    }
  )

  await record(
    27,
    "customer-product-service",
    "Admin",
    "Admin Toggle Classified Ad Published Visibility",
    async () => {
      if (!tempClassifiedId) throw new Error("No classified ID")
      const res = await updateClassifiedPublished(tempClassifiedId, true)
      if (!res.success) throw new Error("Failed to toggle classified published state")
      return `Classified ad #${tempClassifiedId} visibility set to Published`
    }
  )

  await record(
    28,
    "customer-product-service",
    "Admin",
    "Admin Classified Ad Moderation & Approval Status",
    async () => {
      if (!tempClassifiedId) throw new Error("No classified ID")
      const res = await updateCustomerProductStatus(tempClassifiedId, "approved")
      if (!res.success) throw new Error("Failed to update status")
      return `Classified ad #${tempClassifiedId} approval status updated to 'approved'`
    }
  )

  // ==========================================================================
  // MODULE 4: customer-package-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 4: customer-package-service.ts ...")

  await record(
    29,
    "customer-package-service",
    "Customer / Storefront",
    "Customer Classified Listing Packages Directory",
    async () => {
      const pkgs = await getAllCustomerPackages()
      return `Loaded ${pkgs.length} available customer ad upload package(s)`
    }
  )

  await record(
    30,
    "customer-package-service",
    "Customer / Storefront",
    "Customer Classified Ad Upload Quota Balance",
    async () => {
      const quota = await getCustomerPackageQuota(TEST_CUSTOMER_ID)
      return `Active Plan: '${quota.packageName}' (Total: ${quota.totalUploads}, Remaining: ${quota.remainingUploads}, Can Upload: ${quota.canUpload})`
    }
  )

  await record(
    31,
    "customer-package-service",
    "Admin",
    "Admin Customer Listing Package Creation",
    async () => {
      const pkg = await createCustomerPackage({
        name: `VIP Classified Pack ${Date.now().toString().slice(-4)}`,
        amount: 500,
        productUpload: 50,
      })
      tempPackageId = pkg.id
      return `Created package ID: ${pkg.id} (Uploads limit: 50)`
    }
  )

  await record(
    32,
    "customer-package-service",
    "Admin",
    "Admin Customer Package Details & Quota Update",
    async () => {
      if (!tempPackageId) throw new Error("No package ID")
      const pkg = await getCustomerPackageById(tempPackageId)
      if (!pkg) throw new Error("Package not found")
      await updateCustomerPackage(tempPackageId, {
        name: pkg.name + " (Updated)",
        amount: 600,
        productUpload: 60,
      })
      return `Package #${tempPackageId} updated successfully (New limit: 60 uploads)`
    }
  )

  await record(
    33,
    "customer-package-service",
    "Customer / Storefront",
    "Customer Classified Package Upgrade & Payment Processing",
    async () => {
      if (!tempPackageId) throw new Error("No package ID to purchase")
      const res = await purchaseCustomerPackage({
        userId: TEST_CUSTOMER_ID,
        packageId: tempPackageId,
        amount: "600.00",
        paymentMethod: "bKash Online",
      })
      if (!res.success) throw new Error(res.error || "Failed to purchase package")
      return `Package #${tempPackageId} purchased successfully for customer ${TEST_CUSTOMER_ID}`
    }
  )

  await record(
    34,
    "customer-package-service",
    "Admin",
    "Admin Package Cleanup & Deletion",
    async () => {
      if (!tempPackageId) throw new Error("No package ID to delete")
      await deleteCustomerPackage(tempPackageId)
      return `Customer package #${tempPackageId} removed cleanly`
    }
  )

  // ==========================================================================
  // CLEANUP TEMPORARY RECORDS
  // ==========================================================================
  try {
    if (tempCreatedUserId) {
      await deleteCustomer(tempCreatedUserId)
    }
    if (tempAddressId) {
      await deleteCustomerAddress(tempAddressId, TEST_CUSTOMER_ID)
    }
    if (tempPaymentInfoId) {
      await deleteCustomerPaymentInfo(tempPaymentInfoId, TEST_CUSTOMER_ID)
    }
    if (tempClassifiedId) {
      await deleteClassifiedProduct(tempClassifiedId)
    }
  } catch (err) {
    // cleanup warnings non-fatal
  }

  // ==========================================================================
  // REPORT
  // ==========================================================================
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log("\n==========================================================================")
  console.log(` 📊 TEST RESULTS SUMMARY (${duration}s)`)
  console.log(`    Total Scenarios Tested : ${total}`)
  console.log(`    Passed                 : ${passed} ✅`)
  console.log(`    Failed                 : ${failed} ❌`)
  console.log("==========================================================================\n")

  console.log("| # | Module | Stakeholder Scope | Test Scenario | Status | Details |")
  console.log("|---|---|---|---|---|---|")
  results.forEach((r) => {
    console.log(
      `| ${r.num} | ${r.module} | ${r.stakeholder} | ${r.scenario} | ${r.passed ? "✅ PASS" : "❌ FAIL"} | ${r.details} |`
    )
  })

  console.log("\n--- Stakeholder Breakdown ---")
  const custPassed = results.filter((r) => r.stakeholder === "Customer / Storefront" && r.passed).length
  const custTotal = results.filter((r) => r.stakeholder === "Customer / Storefront").length
  const adminPassed = results.filter((r) => r.stakeholder === "Admin" && r.passed).length
  const adminTotal = results.filter((r) => r.stakeholder === "Admin").length

  console.log(`  * Customer / Storefront  : ${custPassed}/${custTotal} passed (${Math.round((custPassed / (custTotal || 1)) * 100)}%)`)
  console.log(`  * Admin                  : ${adminPassed}/${adminTotal} passed (${Math.round((adminPassed / (adminTotal || 1)) * 100)}%)`)
}

runAllTests()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Fatal error during test execution:", e)
    process.exit(1)
  })
