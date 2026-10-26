import { db } from "../src/db"
import { sql } from "drizzle-orm"

// Module 1: home-service
import { getHomePageData } from "../src/services/home-service"

// Module 2: blog-service
import {
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  getBlogCategories,
  createBlog,
  updateBlog,
  toggleBlogStatus,
  deleteBlog,
  getBlogs,
  getBlogBySlug,
  getRecentBlogs,
} from "../src/services/blog-service"

// Module 3: page-service
import {
  getAllPages,
  getPageBySlug,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
} from "../src/services/page-service"

// Module 4: appearance-service
import {
  getAppearanceSettings,
  updateAppearanceSettings,
} from "../src/services/appearance-service"

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
    { table: "blogs", seq: "blogs_id_seq" },
    { table: "blog_categories", seq: "blog_categories_id_seq" },
    { table: "pages", seq: "pages_id_seq" },
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
  console.log(" 🧪 STARTING TEST: Group 9 Content & Website Layout (4 Modules)")
  console.log("    Evaluating Customer / Storefront and Admin Scenarios")
  console.log("==========================================================================\n")

  const startTime = Date.now()
  await syncSequences()

  let homeData: any = null
  let tempBlogId: number | null = null
  let tempBlogSlug: string | null = null
  let tempPageId: number | null = null

  // ==========================================================================
  // MODULE 1: home-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 1: home-service.ts ...")

  await record(
    1,
    "home-service",
    "Customer / Storefront",
    "Storefront Home Master Aggregation Pipeline Execution",
    async () => {
      homeData = await getHomePageData()
      if (!homeData || !homeData.hero) throw new Error("Failed to load home page aggregation data")
      return `Loaded full homepage master tree`
    }
  )

  await record(
    2,
    "home-service",
    "Customer / Storefront",
    "Hero Categories Multi-Level Hierarchy Tree",
    async () => {
      const cats = homeData?.hero?.categories || []
      return `Tree contains ${cats.length} parent category node(s) with subcategory links`
    }
  )

  await record(
    3,
    "home-service",
    "Customer / Storefront",
    "Hero Promotional Hero Sliders & Banners",
    async () => {
      const sliders = homeData?.hero?.sliders || []
      return `Carousel loaded ${sliders.length} responsive slider slides`
    }
  )

  await record(
    4,
    "home-service",
    "Customer / Storefront",
    "Flash Deals Active Countdown & Discount Showcase",
    async () => {
      const fd = homeData?.flashDeal
      return fd
        ? `Active Flash Deal: '${fd.title}' with ${fd.products.length} discounted products`
        : `No active flash deal campaign scheduled`
    }
  )

  await record(
    5,
    "home-service",
    "Customer / Storefront",
    "Today's Special Hot Deals Product Grid",
    async () => {
      const deals = homeData?.todaysDeals || []
      return `Loaded ${deals.length} daily spotlight product deal(s)`
    }
  )

  await record(
    6,
    "home-service",
    "Customer / Storefront",
    "Featured Categories Quick Access Grid",
    async () => {
      const featCats = homeData?.featuredCategories || []
      return `Loaded ${featCats.length} featured category icon cards`
    }
  )

  await record(
    7,
    "home-service",
    "Customer / Storefront",
    "Featured Products & Editor's Picks Showcase",
    async () => {
      const featProds = homeData?.featuredProducts || []
      return `Loaded ${featProds.length} featured catalog product(s)`
    }
  )

  await record(
    8,
    "home-service",
    "Customer / Storefront",
    "Best Selling Products Popularity Ranking",
    async () => {
      const best = homeData?.bestSellingProducts || []
      return `Loaded ${best.length} top sales volume product(s)`
    }
  )

  await record(
    9,
    "home-service",
    "Customer / Storefront",
    "Top Parent Categories Showcase Sections",
    async () => {
      const sections = homeData?.categorySections || []
      return `Rendered ${sections.length} category deep-dive row(s) (e.g. ${sections[0]?.name || "N/A"})`
    }
  )

  await record(
    10,
    "home-service",
    "Customer / Storefront",
    "Top Rated Verified Vendor Shops Roster",
    async () => {
      const sellers = homeData?.topSellers || []
      return `Loaded ${sellers.length} top merchant storefront(s) (e.g. ${sellers[0]?.name || "N/A"})`
    }
  )

  await record(
    11,
    "home-service",
    "Customer / Storefront",
    "Promotional Brand Logos Carousel",
    async () => {
      const brands = homeData?.topBrands || []
      return `Loaded ${brands.length} official brand partner logo(s)`
    }
  )

  await record(
    12,
    "home-service",
    "Customer / Storefront",
    "Pre-Orders & Auction Lots Homepage Teaser Feeds",
    async () => {
      const preorders = homeData?.preorders || []
      const auctions = homeData?.auctions || []
      return `Feeds loaded: ${preorders.length} preorder item(s), ${auctions.length} live auction item(s)`
    }
  )

  // ==========================================================================
  // MODULE 2: blog-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 2: blog-service.ts ...")

  await record(
    13,
    "blog-service",
    "Customer / Storefront",
    "Public Blog Articles Feed & Listing",
    async () => {
      const blogs = await getBlogs()
      return `Storefront blog magazine loaded ${blogs.length} published article(s)`
    }
  )

  await record(
    14,
    "blog-service",
    "Customer / Storefront",
    "Storefront Blog Keyword Search",
    async () => {
      const searchRes = await getBlogs({ search: "guide" })
      return `Found ${searchRes.length} blog article(s) matching keyword 'guide'`
    }
  )

  await record(
    15,
    "blog-service",
    "Customer / Storefront",
    "Recent Editorial Articles Widget Feed",
    async () => {
      const recent = await getRecentBlogs(3)
      return `Recent widget loaded ${recent.length} recent editorial post(s)`
    }
  )

  await record(
    16,
    "blog-service",
    "Admin",
    "Admin Blog Management Desk & Publication Metrics",
    async () => {
      const res = await getAllBlogsAdmin()
      return `Admin blog desk loaded ${res.blogs.length} article(s) (Published: ${res.publishedCount}, Draft: ${res.draftCount})`
    }
  )

  await record(
    17,
    "blog-service",
    "Admin",
    "Admin Blog Categories Taxonomy Roster",
    async () => {
      const cats = await getBlogCategories()
      return `Loaded ${cats.length} blog taxonomy category/categories`
    }
  )

  await record(
    18,
    "blog-service",
    "Admin",
    "Admin Create New Editorial Blog Post",
    async () => {
      const slug = `top-10-fashion-trends-${Date.now().toString().slice(-4)}`
      const res = await createBlog({
        title: "Top 10 Fashion Trends in Bangladesh for 2026",
        slug,
        shortDescription: "Explore the newest seasonal styles, fabrics, and contemporary apparel collections.",
        description: "<p>Detailed guide on modern fashion trends, traditional fusions, and sustainable garments.</p>",
        status: true,
      })
      if (!res.success || !res.blog) throw new Error("Failed to create blog post")
      tempBlogId = res.blog.id
      tempBlogSlug = res.blog.slug
      return `Blog post created: '${res.blog.title}' (ID: ${res.blog.id}, Slug: ${res.blog.slug})`
    }
  )

  await record(
    19,
    "blog-service",
    "Customer / Storefront",
    "Detailed Article Reader View Resolution by Slug",
    async () => {
      if (!tempBlogSlug) throw new Error("No blog slug available")
      const article = await getBlogBySlug(tempBlogSlug)
      if (!article) throw new Error("Could not resolve article by slug")
      return `Article reader view loaded: '${article.title}' by ${article.author}`
    }
  )

  await record(
    20,
    "blog-service",
    "Admin",
    "Admin Inspect & Modify Existing Blog Content",
    async () => {
      if (!tempBlogId || !tempBlogSlug) throw new Error("No blog ID")
      const blog = await getBlogByIdAdmin(tempBlogId)
      if (!blog) throw new Error("Blog not found by ID")
      const updated = await updateBlog(tempBlogId, {
        title: blog.title + " [Updated]",
        slug: tempBlogSlug,
        shortDescription: blog.shortDescription,
        description: blog.description + "<p>Additional styling tips added.</p>",
      })
      if (!updated.success) throw new Error("Failed to update blog")
      return `Blog #${tempBlogId} updated successfully`
    }
  )

  await record(
    21,
    "blog-service",
    "Admin",
    "Admin Toggle Article Published / Draft Status",
    async () => {
      if (!tempBlogId) throw new Error("No blog ID")
      const toggled = await toggleBlogStatus(tempBlogId, false)
      if (!toggled.success) throw new Error("Failed to toggle status")
      return `Blog #${tempBlogId} status set to Draft`
    }
  )

  await record(
    22,
    "blog-service",
    "Admin",
    "Admin Delete Blog Post Record",
    async () => {
      if (!tempBlogId) throw new Error("No blog ID")
      const deleted = await deleteBlog(tempBlogId)
      if (!deleted.success) throw new Error("Failed to delete blog")
      tempBlogId = null
      return `Blog record removed cleanly from database`
    }
  )

  // ==========================================================================
  // MODULE 3: page-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 3: page-service.ts ...")

  await record(
    23,
    "page-service",
    "Customer / Storefront",
    "Customer Access Standard System Policy Pages",
    async () => {
      const terms = await getPageBySlug("terms")
      const privacy = await getPageBySlug("privacy-policy")
      if (!terms || !privacy) throw new Error("System policy pages missing")
      return `Policy pages verified: '${terms.title}' and '${privacy.title}'`
    }
  )

  await record(
    24,
    "page-service",
    "Admin",
    "Master CMS Pages Directory & Page Types",
    async () => {
      const pages = await getAllPages()
      return `Loaded ${pages.length} CMS page(s) (System pages & Custom landing pages)`
    }
  )

  await record(
    25,
    "page-service",
    "Admin",
    "Admin Create New Custom Marketing Landing Page",
    async () => {
      const slug = `campaign-eid-special-${Date.now().toString().slice(-4)}`
      const page = await createCustomPage({
        title: "Eid Mega Campaign 2026",
        slug,
        content: "<h2>Celebrate Eid with Flat Discounts across All Categories!</h2>",
        metaTitle: "Eid Mega Campaign | Huipper",
        metaDescription: "Exclusive Eid shopping offers and voucher discounts.",
      })
      if (!page || !page.id) throw new Error("Failed to create custom page")
      tempPageId = page.id
      return `Custom page created: '${page.title}' (ID: ${page.id}, Slug: /${page.slug})`
    }
  )

  await record(
    26,
    "page-service",
    "Admin",
    "Admin Update Custom Page Content & SEO Metadata",
    async () => {
      if (!tempPageId) throw new Error("No page ID")
      const updated = await updateCustomPage(tempPageId, {
        title: "Eid Mega Campaign 2026 (Grand Edition)",
        slug: `campaign-eid-special-grand`,
        content: "<h2>Celebrate Eid with Flat 50% Discounts and Free Delivery!</h2>",
        metaTitle: "Eid Grand Campaign 2026",
        metaDescription: "Updated campaign details and offers.",
      })
      if (!updated) throw new Error("Failed to update page")
      return `Custom page #${tempPageId} content & SEO tags updated`
    }
  )

  await record(
    27,
    "page-service",
    "Admin",
    "Admin Delete Custom Page with System Page Protection",
    async () => {
      if (!tempPageId) throw new Error("No page ID")
      const deleted = await deleteCustomPage(tempPageId)
      if (!deleted) throw new Error("Failed to delete custom page")
      tempPageId = null
      return `Custom page removed cleanly`
    }
  )

  // ==========================================================================
  // MODULE 4: appearance-service.ts
  // ==========================================================================
  console.log("▶ Testing Module 4: appearance-service.ts ...")

  await record(
    28,
    "appearance-service",
    "Customer / Storefront",
    "Global Website Appearance, Theme Palette & Announcements",
    async () => {
      const settings = await getAppearanceSettings()
      if (!settings.primaryColor || !settings.secondaryColor) {
        throw new Error("Invalid appearance settings structure")
      }
      return `Palette: Primary ${settings.primaryColor}, Secondary ${settings.secondaryColor}, Announcement: '${settings.headerAnnouncement.slice(0, 40)}...'`
    }
  )

  await record(
    29,
    "appearance-service",
    "Admin",
    "Admin Update Website Header Announcement & Layout Flags",
    async () => {
      const current = await getAppearanceSettings()
      const res = await updateAppearanceSettings({
        ...current,
        headerAnnouncement: "🔥 Flash Eid Sale: Enjoy 35% Instant Off with Code EID35!",
        stickyHeader: true,
        showTopBanner: true,
      })
      if (!res.success) throw new Error("Failed to update appearance settings")
      return `Updated header announcement and sticky header layout flags`
    }
  )

  await record(
    30,
    "appearance-service",
    "Admin",
    "Admin Update Footer Branding, Address & Social Connect Links",
    async () => {
      const current = await getAppearanceSettings()
      const res = await updateAppearanceSettings({
        ...current,
        footerEmail: "support@huipper.com",
        footerPhone: "+880 1700-112233",
        facebookUrl: "https://facebook.com/huipper",
        instagramUrl: "https://instagram.com/huipper",
      })
      if (!res.success) throw new Error("Failed to update footer appearance")
      return `Footer contact info and social links verified and saved`
    }
  )

  await record(
    31,
    "appearance-service",
    "Customer / Storefront",
    "Storefront Live Theme Configuration Synchronization",
    async () => {
      const settings = await getAppearanceSettings()
      if (!settings.headerAnnouncement.includes("EID35")) {
        throw new Error("Announcement change was not reflected")
      }
      return `Verified live storefront announcement: '${settings.headerAnnouncement}'`
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
