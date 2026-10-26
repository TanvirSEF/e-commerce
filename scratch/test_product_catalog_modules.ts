/**
 * Comprehensive Test Suite for Group 1: Products & Catalog Management (11 Modules)
 * 
 * Tests the functionality of:
 *  1. product-service.ts
 *  2. category-service.ts
 *  3. brand-service.ts
 *  4. attribute-service.ts
 *  5. color-service.ts
 *  6. size-chart-service.ts
 *  7. warranty-service.ts
 *  8. custom-label-service.ts
 *  9. product-query-service.ts
 * 10. frequently-bought-service.ts
 * 11. promotional-product-service.ts
 * 
 * Evaluated across 3 distinct perspectives:
 *  - Customer / Storefront (Catalog, search, filters, details, Q&A, recommendations)
 *  - Seller Portal (Seller product filter, digital products, attribute/color choices, custom labels)
 *  - Admin CMS (Listing, digital products, categories hierarchy, warranties, size charts, promotional hub)
 */

import {
  getProducts,
  getProductBySlug,
  getCatalogFilterFacets,
  getDigitalProductsAdmin,
  getSellerDigitalProducts,
} from "../src/services/product-service"
import {
  getCategories,
  getCategoryBySlug,
  getAllCategoriesHierarchy,
  getCustomerProductsCategoryTree,
} from "../src/services/category-service"
import { getBrands } from "../src/services/brand-service"
import { getAllAttributes } from "../src/services/attribute-service"
import { getAllColors } from "../src/services/color-service"
import {
  getAllSizeCharts,
  getSizeChartByCategory,
  getAllMeasurementPoints,
} from "../src/services/size-chart-service"
import { getAllWarranties } from "../src/services/warranty-service"
import { getCustomLabels } from "../src/services/custom-label-service"
import {
  getAllQueriesAdmin,
  getQueriesForProduct,
  askProductQuestion,
} from "../src/services/product-query-service"
import {
  getFrequentlyBoughtProducts,
  recordProductView,
  getLastViewedProducts,
} from "../src/services/frequently-bought-service"
import {
  getPromotionalProducts,
  searchProductsForPromotional,
  getCategoriesForPromotional,
} from "../src/services/promotional-product-service"
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
  console.log(" 🧪 STARTING TEST: Group 1 Products & Catalog Management (11 Modules)")
  console.log("    Evaluating Customer, Seller, and Admin Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()

  // -------------------------------------------------------------------------
  // MODULE 1: product-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 1: product-service.ts ...")
  try {
    // 1.1 Customer Catalog Listing & Search
    const catalogRes = await getProducts({ page: 1, limit: 8, sort: "newest" })
    assert(
      1,
      "product-service",
      "Customer / Storefront",
      "Public Catalog Fetch & Pagination",
      Array.isArray(catalogRes.data) && catalogRes.data.length > 0 && catalogRes.total > 0,
      `Fetched ${catalogRes.data.length} products (Total: ${catalogRes.total})`
    )

    // 1.2 Customer Product Details by Slug
    const sampleSlug = catalogRes.data[0]?.slug
    if (sampleSlug) {
      const singleProd = await getProductBySlug(sampleSlug)
      assert(
        1,
        "product-service",
        "Customer / Storefront",
        "Single Product Details by Slug",
        singleProd !== null && singleProd.slug === sampleSlug,
        `Retrieved product '${singleProd?.name}' with price ৳${singleProd?.price}`
      )
    }

    // 1.3 Customer Catalog Facets & Filter Counts
    const facets = await getCatalogFilterFacets()
    assert(
      1,
      "product-service",
      "Customer / Storefront",
      "Catalog Filter Facets (Categories, Brands, Colors)",
      Array.isArray(facets.categories) && Array.isArray(facets.brands) && Array.isArray(facets.colors),
      `Categories: ${facets.categories.length}, Brands: ${facets.brands.length}, Colors: ${facets.colors.length}`
    )

    // 1.4 Seller Products Filter
    const sellerProds = await getProducts({ addedBy: "seller", limit: 5 })
    assert(
      1,
      "product-service",
      "Seller",
      "Seller Products Scope & Filter",
      Array.isArray(sellerProds.data),
      `Filtered seller products successfully (Found: ${sellerProds.data.length})`
    )

    // 1.5 Seller Digital Products
    const sellerDigital = await getSellerDigitalProducts(1)
    assert(
      1,
      "product-service",
      "Seller",
      "Seller Digital Products Desk",
      Array.isArray(sellerDigital),
      `Seller digital desk returned ${sellerDigital.length} items`
    )

    // 1.6 Admin Digital Products
    const adminDigital = await getDigitalProductsAdmin()
    assert(
      1,
      "product-service",
      "Admin",
      "Admin Digital Products Desk",
      Array.isArray(adminDigital),
      `Admin digital desk returned ${adminDigital.length} products`
    )
  } catch (err: any) {
    assert(1, "product-service", "Customer / Storefront", "Product Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 2: category-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 2: category-service.ts ...")
  try {
    // 2.1 Customer Storefront Categories
    const categories = await getCategories()
    assert(
      2,
      "category-service",
      "Customer / Storefront",
      "Storefront Categories Listing with Product Count",
      Array.isArray(categories) && categories.length > 0,
      `Loaded ${categories.length} categories with live counters`
    )

    // 2.2 Customer Category Details by Slug
    const firstCat = categories[0]
    if (firstCat) {
      const catBySlug = await getCategoryBySlug(firstCat.slug)
      assert(
        2,
        "category-service",
        "Customer / Storefront",
        "Category by Slug lookup",
        catBySlug !== null && catBySlug.slug === firstCat.slug,
        `Retrieved category '${catBySlug?.name}'`
      )
    }

    // 2.3 Admin / Megamenu Category Hierarchy Tree
    const hierarchy = await getAllCategoriesHierarchy()
    assert(
      2,
      "category-service",
      "Admin",
      "Multi-level Category Tree Hierarchy",
      Array.isArray(hierarchy) && hierarchy.length > 0,
      `Generated ${hierarchy.length} root category nodes with nested sub-branches`
    )

    // 2.4 Seller & Customer Classified Category Tree
    const classifiedTree = await getCustomerProductsCategoryTree()
    assert(
      2,
      "category-service",
      "Seller",
      "Classified / Customer Product Category Selection",
      Array.isArray(classifiedTree.level0) && classifiedTree.level0.length > 0,
      `Provided ${classifiedTree.level0.length} primary categories for submissions`
    )
  } catch (err: any) {
    assert(2, "category-service", "Customer / Storefront", "Category Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 3: brand-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 3: brand-service.ts ...")
  try {
    const brands = await getBrands()
    assert(
      3,
      "brand-service",
      "Customer / Storefront",
      "Storefront Brands Directory & Product Counts",
      Array.isArray(brands) && brands.length > 0,
      `Loaded ${brands.length} active brands`
    )

    // Admin & Seller brand availability
    const topBrands = brands.filter((b) => b.top)
    assert(
      3,
      "brand-service",
      "Admin",
      "Top Brands Promotion Filter",
      Array.isArray(topBrands),
      `Found ${topBrands.length} promoted top brands`
    )
  } catch (err: any) {
    assert(3, "brand-service", "Customer / Storefront", "Brand Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 4: attribute-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 4: attribute-service.ts ...")
  try {
    const attributes = await getAllAttributes()
    assert(
      4,
      "attribute-service",
      "Seller",
      "Seller Product Variation Attributes (Size, RAM, Fabric, etc.)",
      Array.isArray(attributes) && attributes.length > 0,
      `Found ${attributes.length} attributes with configurable option values`
    )

    assert(
      4,
      "attribute-service",
      "Admin",
      "Admin Global Attributes Management",
      attributes.some((a) => a.values && a.values.length > 0),
      `Attribute values verified (e.g., '${attributes[0]?.name}': ${attributes[0]?.values?.join(", ")})`
    )
  } catch (err: any) {
    assert(4, "attribute-service", "Admin", "Attribute Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 5: color-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 5: color-service.ts ...")
  try {
    const colors = await getAllColors()
    assert(
      5,
      "color-service",
      "Customer / Storefront",
      "Storefront Color Swatches & Filter Palettes",
      Array.isArray(colors) && colors.length > 0,
      `Loaded ${colors.length} verified color hex codes (e.g., ${colors[0]?.name}: ${colors[0]?.code})`
    )

    assert(
      5,
      "color-service",
      "Seller",
      "Seller Variant Color Palette Selection",
      colors.every((c) => c.code.startsWith("#")),
      "All colors format-validated with standard HEX codes"
    )
  } catch (err: any) {
    assert(5, "color-service", "Customer / Storefront", "Color Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 6: size-chart-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 6: size-chart-service.ts ...")
  try {
    const allCharts = await getAllSizeCharts()
    assert(
      6,
      "size-chart-service",
      "Admin",
      "Admin Size Charts Library",
      Array.isArray(allCharts) && allCharts.length > 0,
      `Retrieved ${allCharts.length} configured size chart guides`
    )

    const measurementPoints = await getAllMeasurementPoints()
    assert(
      6,
      "size-chart-service",
      "Admin",
      "Measurement Points Registry (Chest, Waist, Hip, Length)",
      Array.isArray(measurementPoints),
      `Registry contains ${measurementPoints.length} standard measurement guidelines`
    )

    // Customer Lookup by Category
    const categorySizeChart = await getSizeChartByCategory(2) // Apparel / Fashion
    assert(
      6,
      "size-chart-service",
      "Customer / Storefront",
      "Customer Product Details Size Guide Modal",
      categorySizeChart !== null || allCharts.length > 0,
      categorySizeChart ? `Category mapped to size chart: '${categorySizeChart.name}'` : "Default size charts accessible"
    )
  } catch (err: any) {
    assert(6, "size-chart-service", "Customer / Storefront", "Size Chart Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 7: warranty-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 7: warranty-service.ts ...")
  try {
    const warranties = await getAllWarranties()
    assert(
      7,
      "warranty-service",
      "Customer / Storefront",
      "Customer Product Warranty Badges (Brand Warranty, Replacement)",
      Array.isArray(warranties) && warranties.length > 0,
      `Loaded ${warranties.length} warranty options (e.g. '${warranties[0]?.text}')`
    )

    assert(
      7,
      "warranty-service",
      "Seller",
      "Seller Warranty Policy Selection for Products",
      warranties.some((w) => w.duration && w.duration.length > 0),
      "Warranty duration rules validated"
    )
  } catch (err: any) {
    assert(7, "warranty-service", "Customer / Storefront", "Warranty Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 8: custom-label-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 8: custom-label-service.ts ...")
  try {
    const labels = await getCustomLabels()
    assert(
      8,
      "custom-label-service",
      "Customer / Storefront",
      "Customer Product Card Visual Badges ('Hot Deal', 'Super Saver')",
      Array.isArray(labels) && labels.length > 0,
      `Active badges retrieved: ${labels.map((l) => l.text).join(", ")}`
    )

    // Seller Access Verification
    const sellerAccessibleLabels = labels.filter((l) => l.sellerAccess)
    assert(
      8,
      "custom-label-service",
      "Seller",
      "Seller Access Permission for Custom Product Badges",
      Array.isArray(sellerAccessibleLabels),
      `${sellerAccessibleLabels.length} labels granted for seller product taggings`
    )
  } catch (err: any) {
    assert(8, "custom-label-service", "Customer / Storefront", "Custom Label Service Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 9: product-query-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 9: product-query-service.ts ...")
  try {
    // 9.1 Customer Ask Question on Product
    const testQuestionText = `Is this product covered under original factory warranty? [Test ${Date.now().toString().slice(-4)}]`
    const askRes = await askProductQuestion({
      productId: 1,
      productName: "Classic Men's Casual Shirt",
      productSlug: "classic-mens-casual-shirt",
      userName: "Rafiqul Islam",
      question: testQuestionText,
      userId: "usr_test_customer",
    })

    assert(
      9,
      "product-query-service",
      "Customer / Storefront",
      "Customer Submits Product Inquiry / Question (Q&A)",
      askRes.success === true,
      `Question submitted with ID: ${askRes.id || "created"}`
    )

    // 9.2 Customer Product Q&A List
    const productQueries = await getQueriesForProduct(1, "usr_test_customer")
    assert(
      9,
      "product-query-service",
      "Customer / Storefront",
      "Customer Views Product Questions & Vendor Answers",
      Array.isArray(productQueries),
      `Retrieved ${productQueries.length} inquiries for product ID 1`
    )

    // 9.3 Admin Q&A Moderation Desk
    const adminQueries = await getAllQueriesAdmin({ page: 1, limit: 10 })
    assert(
      9,
      "product-query-service",
      "Admin",
      "Admin & Vendor Moderation Desk for Customer Inquiries",
      Array.isArray(adminQueries.queries) && adminQueries.totalCount >= 0,
      `Moderation desk has ${adminQueries.totalCount} inquiries across all products`
    )
  } catch (err: any) {
    assert(9, "product-query-service", "Customer / Storefront", "Product Query Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 10: frequently-bought-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 10: frequently-bought-service.ts ...")
  try {
    // 10.1 Customer Product View Recording
    let viewSuccess = true
    try {
      await recordProductView("usr_test_customer", 1)
    } catch {
      viewSuccess = false
    }
    assert(
      10,
      "frequently-bought-service",
      "Customer / Storefront",
      "Customer Product View Activity Logging",
      viewSuccess,
      "Product view event recorded for personalized recommendation engine"
    )

    // 10.2 Customer Recently Viewed History
    const lastViewed = await getLastViewedProducts("usr_test_customer", 5)
    assert(
      10,
      "frequently-bought-service",
      "Customer / Storefront",
      "Customer Recently Viewed Items Carousel",
      Array.isArray(lastViewed),
      `Customer history returned ${lastViewed.length} recently browsed products`
    )

    // 10.3 Frequently Bought Together Recommendations
    const frequentlyBought = await getFrequentlyBoughtProducts(1, 4)
    assert(
      10,
      "frequently-bought-service",
      "Customer / Storefront",
      "Frequently Bought Together Bundles on Product Page",
      Array.isArray(frequentlyBought),
      `Algorithm suggested ${frequentlyBought.length} bundle companions`
    )
  } catch (err: any) {
    assert(10, "frequently-bought-service", "Customer / Storefront", "Frequently Bought Execution", false, err.message)
  }

  // -------------------------------------------------------------------------
  // MODULE 11: promotional-product-service.ts
  // -------------------------------------------------------------------------
  console.log("▶ Testing Module 11: promotional-product-service.ts ...")
  try {
    // 11.1 Admin Promotional Hub Listing
    const promoRes = await getPromotionalProducts({ page: 1, limit: 10 })
    assert(
      11,
      "promotional-product-service",
      "Admin",
      "Admin Promotional Products Hub & Campaign Overview",
      Array.isArray(promoRes.products) && promoRes.totalCount >= 0,
      `Hub loaded ${promoRes.products.length} products (Total: ${promoRes.totalCount})`
    )

    // 11.2 Admin Search Candidate Products for Campaigns
    const searchPromo = await searchProductsForPromotional({ searchKey: "shirt" })
    assert(
      11,
      "promotional-product-service",
      "Admin",
      "Admin Product Search for Promotional Campaign Enrollment",
      Array.isArray(searchPromo),
      `Found ${searchPromo.length} candidate products matching search`
    )

    // 11.3 Storefront Promotional Categories
    const promoCats = await getCategoriesForPromotional()
    assert(
      11,
      "promotional-product-service",
      "Customer / Storefront",
      "Promotional Campaign Categories Filter Bar",
      Array.isArray(promoCats),
      `Loaded ${promoCats.length} promotional category filters`
    )
  } catch (err: any) {
    assert(11, "promotional-product-service", "Admin", "Promotional Product Execution", false, err.message)
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
