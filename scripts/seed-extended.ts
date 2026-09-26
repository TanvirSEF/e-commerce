import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import dotenv from "dotenv"
import * as schema from "../src/db/schema/index.js"
import { eq } from "drizzle-orm"

import { SEED_LANGUAGES, SEED_TRANSLATIONS } from "../src/services/language-service.js"
import { SEED_COUNTRIES, SEED_STATES, SEED_ZONES } from "../src/services/geographic-service.js"
import { SEED_SELLER_PACKAGES, SEED_CUSTOMER_PACKAGES } from "../src/services/package-service.js"
import { SEED_PREORDER_PRODUCTS } from "../src/services/preorder-service.js"
import { SEED_AUCTION_PRODUCTS } from "../src/services/auction-service.js"
import { SEED_AFFILIATE_OPTIONS, SEED_AFFILIATE_CONFIGS, SEED_AFFILIATE_USERS } from "../src/services/affiliate-service.js"
import { SEED_DELIVERY_BOYS } from "../src/services/delivery-boy-service.js"

dotenv.config({ path: ".env.local" })

const { Pool } = pg

async function runExtendedSeed() {
  console.log("==================================================")
  console.log("🌱 Active eCommerce CMS Extended Data Seeder")
  console.log("==================================================")

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error("DATABASE_URL is not set!")
    process.exit(1)
  }

  const pool = new Pool({ connectionString: dbUrl, connectionTimeoutMillis: 10000 })
  const db = drizzle(pool, { schema })

  try {
    // 1. Languages
    console.log("Seeding Languages...")
    for (const lang of SEED_LANGUAGES) {
      const existing = await db.select().from(schema.languages).where(eq(schema.languages.code, lang.code))
      if (existing.length === 0) {
        await db.insert(schema.languages).values({
          name: lang.name,
          code: lang.code,
          appLangCode: lang.appLangCode,
          rtl: lang.rtl,
          status: lang.status,
          isDefault: lang.isDefault,
        })
      }
    }

    // 2. Translations
    console.log("Seeding Translations...")
    for (const [langCode, pairs] of Object.entries(SEED_TRANSLATIONS)) {
      for (const [langKey, langVal] of Object.entries(pairs)) {
        const existing = await db
          .select()
          .from(schema.translations)
          .where(eq(schema.translations.langKey, langKey))
        if (existing.length === 0) {
          await db.insert(schema.translations).values({
            lang: langCode,
            langKey,
            langValue: langVal,
          })
        }
      }
    }

    // 3. Zones & Geographic
    console.log("Seeding Zones & Countries...")
    for (const z of SEED_ZONES) {
      const existing = await db.select().from(schema.zones).where(eq(schema.zones.name, z.name))
      if (existing.length === 0) {
        await db.insert(schema.zones).values({
          name: z.name,
          status: z.status,
        })
      }
    }

    for (const c of SEED_COUNTRIES) {
      const existing = await db.select().from(schema.countries).where(eq(schema.countries.code, c.code))
      if (existing.length === 0) {
        await db.insert(schema.countries).values({
          name: c.name,
          code: c.code,
          phoneCode: c.phoneCode,
          zoneId: c.zoneId,
          status: c.status,
        })
      }
    }

    for (const s of SEED_STATES) {
      const existing = await db.select().from(schema.states).where(eq(schema.states.name, s.name))
      if (existing.length === 0) {
        await db.insert(schema.states).values({
          countryId: s.countryId,
          name: s.name,
          status: s.status,
        })
      }
    }

    // 4. Packages (Seller & Customer)
    console.log("Seeding Subscription Packages...")
    for (const sp of SEED_SELLER_PACKAGES) {
      const existing = await db.select().from(schema.sellerPackages).where(eq(schema.sellerPackages.name, sp.name))
      if (existing.length === 0) {
        await db.insert(schema.sellerPackages).values({
          name: sp.name,
          amount: sp.amount,
          productUploadLimit: sp.productUploadLimit,
          duration: sp.duration,
          logo: sp.logo,
          status: sp.status,
        })
      }
    }

    for (const cp of SEED_CUSTOMER_PACKAGES) {
      const existing = await db.select().from(schema.customerPackages).where(eq(schema.customerPackages.name, cp.name))
      if (existing.length === 0) {
        await db.insert(schema.customerPackages).values({
          name: cp.name,
          amount: cp.amount,
          productUpload: cp.productUpload,
          logo: cp.logo,
          status: cp.status,
        })
      }
    }

    // 5. Pre-order Products
    console.log("Seeding Pre-Order Products...")
    for (const pop of SEED_PREORDER_PRODUCTS) {
      const existing = await db.select().from(schema.preorderProducts).where(eq(schema.preorderProducts.slug, pop.slug))
      if (existing.length === 0) {
        await db.insert(schema.preorderProducts).values({
          name: pop.name,
          slug: pop.slug,
          sku: pop.sku,
          thumbnail: pop.thumbnail,
          price: pop.price,
          prepaymentAmount: pop.prepaymentAmount,
          releaseDate: pop.releaseDate,
          preorderBatchLimit: pop.preorderBatchLimit,
          currentPreorders: pop.currentPreorders,
          sellerSlug: pop.sellerSlug,
          status: pop.status,
          featured: pop.featured,
        })
      }
    }

    // 6. Auction Products
    console.log("Seeding Auction Products...")
    for (const ap of SEED_AUCTION_PRODUCTS) {
      const existing = await db.select().from(schema.auctionProducts).where(eq(schema.auctionProducts.slug, ap.slug))
      if (existing.length === 0) {
        await db.insert(schema.auctionProducts).values({
          name: ap.name,
          slug: ap.slug,
          thumbnail: ap.thumbnail,
          description: ap.description,
          startingBid: ap.startingBid,
          currentBid: ap.currentBid,
          minBidIncrement: ap.minBidIncrement,
          auctionStartDate: ap.auctionStartDate,
          auctionEndDate: ap.auctionEndDate,
          totalBids: ap.totalBids,
          sellerSlug: ap.sellerSlug,
          sellerName: ap.sellerName,
          status: ap.status,
          featured: ap.featured,
          isClosed: ap.isClosed,
        })
      }
    }

    // 7. Affiliate
    console.log("Seeding Affiliate Options & Users...")
    for (const opt of SEED_AFFILIATE_OPTIONS) {
      const existing = await db.select().from(schema.affiliateOptions).where(eq(schema.affiliateOptions.type, opt.type))
      if (existing.length === 0) {
        await db.insert(schema.affiliateOptions).values({
          type: opt.type,
          percentage: opt.percentage,
          status: opt.status,
        })
      }
    }

    for (const [key, val] of Object.entries(SEED_AFFILIATE_CONFIGS)) {
      const existing = await db.select().from(schema.affiliateConfigs).where(eq(schema.affiliateConfigs.type, key))
      if (existing.length === 0) {
        await db.insert(schema.affiliateConfigs).values({
          type: key,
          value: val,
        })
      }
    }

    for (const aff of SEED_AFFILIATE_USERS) {
      const existing = await db.select().from(schema.affiliateUsers).where(eq(schema.affiliateUsers.userEmail, aff.userEmail))
      if (existing.length === 0) {
        await db.insert(schema.affiliateUsers).values({
          userName: aff.userName,
          userEmail: aff.userEmail,
          balance: aff.balance,
          status: aff.status,
          referralCode: aff.referralCode,
        })
      }
    }

    // 8. Delivery Boys
    console.log("Seeding Delivery Boys...")
    for (const dboy of SEED_DELIVERY_BOYS) {
      const existing = await db.select().from(schema.deliveryBoys).where(eq(schema.deliveryBoys.email, dboy.email))
      if (existing.length === 0) {
        await db.insert(schema.deliveryBoys).values({
          name: dboy.name,
          email: dboy.email,
          phone: dboy.phone,
          avatar: dboy.avatar,
          zoneId: dboy.zoneId,
          zoneName: dboy.zoneName,
          status: dboy.status,
          totalEarnings: dboy.totalEarnings,
          totalCollection: dboy.totalCollection,
          currentPendingDeliveries: dboy.currentPendingDeliveries,
        })
      }
    }

    console.log("==================================================")
    console.log("✅ All Extended Modules Seeded Successfully into Production DB!")
    console.log("==================================================")
    process.exit(0)
  } catch (err) {
    console.error("❌ Seed error:", err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runExtendedSeed()
