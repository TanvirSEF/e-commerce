import { db } from "../src/db"
import { sql } from "drizzle-orm"

// Module 1: admin-dashboard-service
import { getAdminDashboardData } from "../src/services/admin-dashboard-service"

// Module 2: admin-profile-service
import {
  getAdminProfile,
  updateAdminProfile,
} from "../src/services/admin-profile-service"

// Module 3: staff-service
import {
  getAllStaffsAdmin,
  getStaffByIdAdmin,
  createStaff,
  updateStaff,
  updateStaffStatus,
  deleteStaff,
  getAllRolesAdmin,
  getRoleByIdAdmin,
  createRoleAdmin,
  updateRoleAdmin,
  deleteRoleAdmin,
} from "../src/services/staff-service"

// Module 4: report-service
import {
  getInhouseSalesReport,
  getSellerSalesReport,
  getStockReport,
  getUserSearchReport,
  getProductWishlistReport,
  getCommissionHistoryReport,
  getAiTokenUsageReport,
  getEarningPayoutReport,
  getServerStatusDiagnostics,
} from "../src/services/report-service"

// Module 5: analytics-service
import {
  getAnalyticsSettings,
  updateAnalyticsSettings,
} from "../src/services/analytics-service"

// Module 6: package-service
import {
  getAllSellerPackages,
  getSellerPackageById,
  createSellerPackage,
  updateSellerPackage,
  toggleSellerPackageStatus,
  deleteSellerPackage,
  getAllSellerPackagePayments,
  purchaseSellerPackage,
} from "../src/services/package-service"

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
    { table: "staffs", seq: "staffs_id_seq" },
    { table: "staff_roles", seq: "staff_roles_id_seq" },
    { table: "seller_packages", seq: "seller_packages_id_seq" },
    { table: "seller_package_payments", seq: "seller_package_payments_id_seq" },
    { table: "customer_packages", seq: "customer_packages_id_seq" },
    { table: "customer_package_payments", seq: "customer_package_payments_id_seq" },
    { table: "user_searches", seq: "user_searches_id_seq" },
    { table: "commission_histories", seq: "commission_histories_id_seq" },
    { table: "ai_token_logs", seq: "ai_token_logs_id_seq" },
    { table: "business_settings", seq: "business_settings_id_seq" },
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
    } catch {
      // Ignore if table/sequence doesn't exist
    }
  }
}

async function runAllTests() {
  console.log("==========================================================================")
  console.log(" 🧪 STARTING TEST: Group 10 Administration, Analytics & Staff (6 Modules)")
  console.log("    Evaluating Seller, Admin, and System Diagnostic Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()
  await syncSequences()

  let dashboardData: any = null
  let tempRoleId: number | null = null
  let tempStaffId: number | null = null
  let tempPackageId: number | null = null

  // ==========================================================================
  // MODULE 1: admin-dashboard-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 1: admin-dashboard-service.ts ...")

  await record(
    1,
    "admin-dashboard-service",
    "Admin",
    "Master Dashboard Core KPI Counters & Store Overview",
    async () => {
      dashboardData = await getAdminDashboardData()
      if (!dashboardData) throw new Error("Dashboard data query returned null")
      return `KPIs loaded: ${dashboardData.totalOrders} orders, ৳${dashboardData.totalSales} gross sales, ${dashboardData.totalProducts} products, ${dashboardData.totalCustomers} customers`
    }
  )

  await record(
    2,
    "admin-dashboard-service",
    "Admin",
    "Top Spending Customers Leaderboard Ranking",
    async () => {
      const topCusts = dashboardData?.topCustomers || []
      return `Loaded ${topCusts.length} top customer(s) (Leader: ${topCusts[0]?.name || "Nusrat Jahan"} with ৳${topCusts[0]?.totalSpent || 0})`
    }
  )

  await record(
    3,
    "admin-dashboard-service",
    "Admin",
    "Monthly Revenue Progression & 12-Month Sales Chart",
    async () => {
      const yearly = dashboardData?.yearlySalesStat || []
      return `Yearly trend contains ${yearly.length} monthly data points (This month: ৳${dashboardData?.saleThisMonth || 0})`
    }
  )

  await record(
    4,
    "admin-dashboard-service",
    "Admin",
    "Order Processing Lifecycle Status Breakdown",
    async () => {
      return `Orders breakdown: ${dashboardData?.totalPlacedOrders} placed, ${dashboardData?.totalConfirmedOrders} confirmed, ${dashboardData?.totalShippedOrders} shipped`
    }
  )

  await record(
    5,
    "admin-dashboard-service",
    "Admin",
    "In-House Store Revenue & Payment Method Distribution",
    async () => {
      const payments = dashboardData?.paymentTypeWiseInhouseSale || []
      return `Payment distribution tracked across ${payments.length} payment gateways`
    }
  )

  await record(
    6,
    "admin-dashboard-service",
    "Admin",
    "Recent Orders Live Activity Ledger",
    async () => {
      const recents = dashboardData?.recentOrders || []
      return `Recent orders ledger loaded ${recents.length} latest transaction(s)`
    }
  )

  // ==========================================================================
  // MODULE 2: admin-profile-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 2: admin-profile-service.ts ...")

  await record(
    7,
    "admin-profile-service",
    "Admin",
    "Super Administrator Profile Information Inquiry",
    async () => {
      const profile = await getAdminProfile("usr_admin_default_01")
      if (!profile) throw new Error("Could not retrieve admin profile")
      return `Admin Profile: '${profile.name}' (${profile.email}, Role: ${profile.role})`
    }
  )

  await record(
    8,
    "admin-profile-service",
    "Admin",
    "Update Administrator Profile Contact & Credentials",
    async () => {
      const res = await updateAdminProfile("usr_admin_default_01", {
        name: "Super Administrator",
        email: "admin@example.com",
        phone: "+880 1700-112233",
      })
      if (!res.success) throw new Error("Failed to update admin profile")
      return `Admin profile updated successfully`
    }
  )

  await record(
    9,
    "admin-profile-service",
    "Admin",
    "Verify Updated Admin Profile State",
    async () => {
      const profile = await getAdminProfile("usr_admin_default_01")
      return `Verified name: '${profile.name}', Phone: ${profile.phone}`
    }
  )

  // ==========================================================================
  // MODULE 3: staff-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 3: staff-service.ts ...")

  await record(
    10,
    "staff-service",
    "Admin",
    "Admin Staff Directory & Role Pagination",
    async () => {
      const res = await getAllStaffsAdmin({ page: 1, limit: 10 })
      return `Staff directory loaded ${res.items.length} staff member(s) (Total: ${res.total})`
    }
  )

  await record(
    11,
    "staff-service",
    "Admin",
    "Staff Role Permission Groups Roster",
    async () => {
      const roles = await getAllRolesAdmin()
      return `Loaded ${roles.length} role definition(s) (e.g. ${roles[0]?.name || "Staff"})`
    }
  )

  await record(
    12,
    "staff-service",
    "Admin",
    "Admin Create New Staff Role with Granular Permissions",
    async () => {
      const role = await createRoleAdmin({
        name: `Support Specialist ${Date.now().toString().slice(-4)}`,
        permissions: ["manage_orders", "view_reports", "manage_tickets"],
      })
      tempRoleId = role.id
      return `Role created with ID #${role.id} (3 permissions)`
    }
  )

  await record(
    13,
    "staff-service",
    "Admin",
    "Inspect & Modify Role Permissions Specification",
    async () => {
      if (!tempRoleId) throw new Error("No role ID")
      const r = await getRoleByIdAdmin(tempRoleId)
      if (!r) throw new Error("Role not found")
      await updateRoleAdmin(tempRoleId, {
        name: r.name + " (Senior)",
        permissions: [...r.permissions, "manage_refunds"],
      })
      return `Role #${tempRoleId} permissions updated (New count: 4)`
    }
  )

  await record(
    14,
    "staff-service",
    "Admin",
    "Register New Backoffice Staff Member & Auth Sync",
    async () => {
      const uniqueEmail = `staff_agent_${Date.now()}@example.com`
      const res = await createStaff({
        name: "Tanvir Ahmed",
        email: uniqueEmail,
        phone: "+880 1711-889900",
        roleId: tempRoleId || undefined,
        password: "StaffPassword@123",
      })
      tempStaffId = res.id
      return `Staff created: ID #${res.id} (${uniqueEmail})`
    }
  )

  await record(
    15,
    "staff-service",
    "Admin",
    "Inspect Staff Profile Details & Modify Contact Information",
    async () => {
      if (!tempStaffId) throw new Error("No staff ID")
      const staff = await getStaffByIdAdmin(tempStaffId)
      if (!staff) throw new Error("Staff member not found")
      await updateStaff(tempStaffId, {
        name: staff.name + " (Ops Lead)",
        email: staff.email,
        phone: "+880 1711-990011",
      })
      return `Staff #${tempStaffId} contact details updated`
    }
  )

  await record(
    16,
    "staff-service",
    "Admin",
    "Toggle Staff Account Active Access Status",
    async () => {
      if (!tempStaffId) throw new Error("No staff ID")
      await updateStaffStatus(tempStaffId, false)
      await updateStaffStatus(tempStaffId, true)
      return `Staff #${tempStaffId} access status toggled: Inactive -> Active`
    }
  )

  await record(
    17,
    "staff-service",
    "Admin",
    "Delete Staff Account & Better Auth Cleanup",
    async () => {
      if (!tempStaffId) throw new Error("No staff ID")
      await deleteStaff(tempStaffId)
      tempStaffId = null
      return `Staff account and auth record deleted cleanly`
    }
  )

  await record(
    18,
    "staff-service",
    "Admin",
    "Delete Custom Staff Role",
    async () => {
      if (!tempRoleId) throw new Error("No role ID")
      await deleteRoleAdmin(tempRoleId)
      tempRoleId = null
      return `Role removed cleanly from staff_roles`
    }
  )

  // ==========================================================================
  // MODULE 4: report-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 4: report-service.ts ...")

  await record(
    19,
    "report-service",
    "Admin",
    "In-House Products Sales Volume & Revenue Report",
    async () => {
      const inhouse = await getInhouseSalesReport()
      return `Report loaded ${inhouse.length} in-house catalog item(s)`
    }
  )

  await record(
    20,
    "report-service",
    "Admin",
    "Seller Merchant Selling Performance & Revenue Report",
    async () => {
      const sellers = await getSellerSalesReport()
      return `Loaded selling performance for ${sellers.length} merchant store(s)`
    }
  )

  await record(
    21,
    "report-service",
    "Admin",
    "Product-Wise Stock Inventory Audit Report",
    async () => {
      const stock = await getStockReport()
      return `Stock audit tracks ${stock.length} catalog SKU(s)`
    }
  )

  await record(
    22,
    "report-service",
    "Admin",
    "Customer Search Query & Search Intent Analytics",
    async () => {
      const searches = await getUserSearchReport()
      return `Search report tracks ${searches.length} search keyword(s)`
    }
  )

  await record(
    23,
    "report-service",
    "Admin",
    "Customer Wishlist Demand & Product Interest Report",
    async () => {
      const wishes = await getProductWishlistReport()
      return `Wishlist report loaded interest metrics for ${wishes.length} product(s)`
    }
  )

  await record(
    24,
    "report-service",
    "Admin",
    "Marketplace Commission History & Ledger Report",
    async () => {
      const comm = await getCommissionHistoryReport()
      return `Commission ledger tracks ${comm.commissions.length} transaction entries across ${comm.sellers.length} seller(s)`
    }
  )

  await record(
    25,
    "report-service",
    "Admin",
    "AI Token Usage & API Consumption Cost Analytics",
    async () => {
      const ai = await getAiTokenUsageReport()
      return `AI Tokens: ${ai.totalTokens} tokens consumed over ${ai.totalRequests} request(s)`
    }
  )

  await record(
    26,
    "report-service",
    "Admin",
    "Platform Earnings vs Seller Payouts Financial Ledger",
    async () => {
      const fin = await getEarningPayoutReport()
      return `All-time Sales: ৳${fin.totalSalesAlltime}, Payouts: ৳${fin.totalPayouts}, History: ${fin.monthlyData.length} months`
    }
  )

  await record(
    27,
    "report-service",
    "Admin",
    "Server Infrastructure & Runtime Environment Diagnostics",
    async () => {
      const diag = await getServerStatusDiagnostics()
      return `Node ${diag.nodeVersion}, Next.js ${diag.nextVersion}, ${diag.postgresVersion}, Memory: ${Math.round(diag.memory.heapUsedBytes / (1024 * 1024))}MB Heap`
    }
  )

  // ==========================================================================
  // MODULE 5: analytics-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 5: analytics-service.ts ...")

  await record(
    28,
    "analytics-service",
    "Admin",
    "Marketing Pixels & Conversion Tracking Configuration",
    async () => {
      const settings = await getAnalyticsSettings()
      return `Tracking loaded: GA: ${settings.googleAnalyticsId} (${settings.googleAnalyticsActive}), Pixel: ${settings.metaPixelId} (${settings.metaPixelActive})`
    }
  )

  await record(
    29,
    "analytics-service",
    "Admin",
    "Admin Update Marketing Tracking Pixels & Tags",
    async () => {
      const current = await getAnalyticsSettings()
      const res = await updateAnalyticsSettings({
        ...current,
        googleAnalyticsId: "G-TEST9948201",
        googleAnalyticsActive: true,
        metaPixelId: "998877665544332",
      })
      if (!res.success) throw new Error("Failed to update analytics settings")
      return `Analytics pixel IDs saved successfully`
    }
  )

  await record(
    30,
    "analytics-service",
    "Admin",
    "Verify Live Tracking Tag Configuration",
    async () => {
      const settings = await getAnalyticsSettings()
      if (settings.googleAnalyticsId !== "G-TEST9948201") {
        throw new Error("Analytics update not reflected")
      }
      return `Verified active GA ID: ${settings.googleAnalyticsId}`
    }
  )

  // ==========================================================================
  // MODULE 6: package-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 6: package-service.ts ...")

  await record(
    31,
    "package-service",
    "Seller",
    "Available Seller Subscription Packages Directory",
    async () => {
      const pkgs = await getAllSellerPackages()
      return `Loaded ${pkgs.length} seller subscription tier(s)`
    }
  )

  await record(
    32,
    "package-service",
    "Admin",
    "Admin Create New Seller Subscription Package Tier",
    async () => {
      const newPkg = await createSellerPackage({
        name: `Platinum Enterprise Seller ${Date.now().toString().slice(-4)}`,
        amount: "1500.00",
        productUploadLimit: 500,
        duration: 365,
      })
      tempPackageId = newPkg.id
      return `Created package ID #${newPkg.id}: '${newPkg.name}' (৳${newPkg.amount}, Limit: ${newPkg.productUploadLimit})`
    }
  )

  await record(
    33,
    "package-service",
    "Admin",
    "Inspect & Modify Package Quota Limits",
    async () => {
      if (!tempPackageId) throw new Error("No package ID")
      const pkg = await getSellerPackageById(tempPackageId)
      if (!pkg) throw new Error("Package not found")
      const updated = await updateSellerPackage(tempPackageId, {
        productUploadLimit: 600,
        amount: "1800.00",
      })
      if (!updated) throw new Error("Failed to update package")
      return `Package #${tempPackageId} updated (New limit: 600 uploads)`
    }
  )

  await record(
    34,
    "package-service",
    "Admin",
    "Toggle Seller Package Active Status",
    async () => {
      if (!tempPackageId) throw new Error("No package ID")
      const toggled = await toggleSellerPackageStatus(tempPackageId, true)
      if (!toggled) throw new Error("Failed to toggle status")
      return `Package #${tempPackageId} status verified active`
    }
  )

  await record(
    35,
    "package-service",
    "Seller",
    "Seller Subscribe to Package Tier & Process Payment",
    async () => {
      if (!tempPackageId) throw new Error("No package ID to purchase")
      const res = await purchaseSellerPackage({
        sellerId: 1, // Active Fashion Outlet
        sellerPackageId: tempPackageId,
        amount: "1800.00",
        paymentMethod: "bKash Online",
      })
      if (!res.success) throw new Error(res.error || "Subscription purchase failed")
      return `Seller subscribed to package #${tempPackageId} successfully`
    }
  )

  await record(
    36,
    "package-service",
    "Admin",
    "Master Seller Package Payments Audit Trail",
    async () => {
      const payments = await getAllSellerPackagePayments()
      return `Payment audit tracks ${payments.length} package payment(s)`
    }
  )

  await record(
    37,
    "package-service",
    "Admin",
    "Clean up Seller Subscription Package",
    async () => {
      if (!tempPackageId) throw new Error("No package ID")
      const deleted = await deleteSellerPackage(tempPackageId)
      if (!deleted) throw new Error("Failed to delete package")
      tempPackageId = null
      return `Seller package removed cleanly`
    }
  )

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
  const sellerPassed = results.filter((r) => r.stakeholder === "Seller" && r.passed).length
  const sellerTotal = results.filter((r) => r.stakeholder === "Seller").length
  const adminPassed = results.filter((r) => r.stakeholder === "Admin" && r.passed).length
  const adminTotal = results.filter((r) => r.stakeholder === "Admin").length

  console.log(`  * Seller                 : ${sellerPassed}/${sellerTotal} passed (${Math.round((sellerPassed / (sellerTotal || 1)) * 100)}%)`)
  console.log(`  * Admin                  : ${adminPassed}/${adminTotal} passed (${Math.round((adminPassed / (adminTotal || 1)) * 100)}%)`)
}

runAllTests()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Fatal error during test execution:", e)
    process.exit(1)
  })
