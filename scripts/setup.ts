import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../src/db/schema/index.js"
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS, SEED_FLASH_DEALS, SEED_SHOPS, SEED_COUPONS } from "../src/db/seed/data.js"
import { eq } from "drizzle-orm"

const { Pool } = pg

async function runSetup() {
  console.log("==================================================")
  console.log("🚀 Huipper CodeCanyon Product Installer")
  console.log("==================================================")

  // 1. Validate environment
  const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce"
  console.log(`Database URL: ${dbUrl.replace(/:[^:]*@/, ":****@")}`)

  // 2. Test Connection
  const pool = new Pool({ connectionString: dbUrl, connectionTimeoutMillis: 5000 })
  try {
    const client = await pool.connect()
    console.log("[OK] Database connected")
    client.release()
  } catch (err) {
    console.error("❌ Database connection error:", (err as Error).message)
    console.error("👉 Please ensure PostgreSQL is running (e.g. docker compose up -d)")
    process.exit(1)
  }

  const db = drizzle(pool, { schema })

  try {
    // 3. Seed Default Business Settings
    const defaultSettings = [
      { type: "site_name", value: "Active eCommerce CMS" },
      { type: "currency_code", value: "BDT" },
      { type: "currency_symbol", value: "৳" },
      { type: "system_default_currency", value: "1" },
    ]

    for (const s of defaultSettings) {
      const existing = await db.select().from(schema.businessSettings).where(eq(schema.businessSettings.type, s.type))
      if (existing.length === 0) {
        await db.insert(schema.businessSettings).values(s)
      }
    }
    console.log("[OK] Settings seeded")

    // 4. Seed Categories
    const categoryMap = new Map<string, number>()
    for (const cat of SEED_CATEGORIES) {
      const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, cat.slug))
      if (existing.length === 0) {
        const [inserted] = await db
          .insert(schema.categories)
          .values({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            banner: cat.banner,
            featured: cat.featured,
            orderLevel: cat.orderLevel,
          })
          .returning()
        categoryMap.set(cat.slug, inserted.id)
      } else {
        categoryMap.set(cat.slug, existing[0].id)
      }
    }

    // 5. Seed Brands
    const brandMap = new Map<string, number>()
    for (const b of SEED_BRANDS) {
      const existing = await db.select().from(schema.brands).where(eq(schema.brands.slug, b.slug))
      if (existing.length === 0) {
        const [inserted] = await db
          .insert(schema.brands)
          .values({
            name: b.name,
            slug: b.slug,
            logo: b.logo,
            top: b.top,
          })
          .returning()
        brandMap.set(b.slug, inserted.id)
      } else {
        brandMap.set(b.slug, existing[0].id)
      }
    }

    // 6. Seed Products
    for (const p of SEED_PRODUCTS) {
      const existing = await db.select().from(schema.products).where(eq(schema.products.slug, p.slug))
      if (existing.length === 0) {
        await db.insert(schema.products).values({
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          categoryId: categoryMap.get(p.categorySlug) || null,
          brandId: brandMap.get(p.brandSlug) || null,
          photos: p.images,
          thumbnailImg: p.thumbnail,
          unitPrice: p.price.toString(),
          purchasePrice: p.originalPrice.toString(),
          discount: p.discountPercent.toString(),
          discountType: "percent",
          currentStock: p.stock,
          unit: p.unit,
          rating: p.rating.toString(),
          numOfReviews: p.reviewCount,
          numOfSale: p.salesCount,
          description: p.description,
          colors: p.colors.map((c) => c.hex),
          choiceOptions: [{ attribute_id: "size", values: p.sizes }],
          variations: p.sizes.map((s) => ({
            variant: s,
            sku: `${p.sku}-${s}`,
            price: p.price,
            stock: Math.floor(p.stock / (p.sizes.length || 1)),
          })),
          featured: p.featured,
          todaysDeal: p.todaysDeal,
          published: true,
        })
      }
    }
    console.log("[OK] Catalog seeded (categories, brands, products)")

    // 7. Seed Flash Deals
    for (const fd of SEED_FLASH_DEALS) {
      const existing = await db.select().from(schema.flashDeals).where(eq(schema.flashDeals.slug, fd.slug))
      if (existing.length === 0) {
        await db.insert(schema.flashDeals).values({
          title: fd.title,
          slug: fd.slug,
          startDate: Math.floor(fd.startDate / 1000),
          endDate: Math.floor(fd.endDate / 1000),
          status: fd.status,
          featured: fd.featured,
          banner: fd.banner,
        })
      }
    }

    // 8. Seed Default Administrator, Customer, and Seller
    const { hashPassword } = await import("better-auth/crypto")
    const defaultPasswordHash = await hashPassword("password123")

    const adminEmail = "admin@example.com"
    const adminId = "usr_admin_default_01"
    const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail))
    if (existingAdmin.length === 0) {
      await db.insert(schema.users).values({
        id: adminId,
        name: "Active eCommerce Admin",
        email: adminEmail,
        emailVerified: true,
        role: "admin",
        phone: "+880 1700 000000",
        balance: "50000.00",
      })
    }
    await db.insert(schema.accounts).values({
      id: "acc_admin_default_credential",
      userId: adminId,
      accountId: adminId,
      providerId: "credential",
      password: defaultPasswordHash,
    }).onConflictDoUpdate({
      target: schema.accounts.id,
      set: { password: defaultPasswordHash, accountId: adminId, userId: adminId, providerId: "credential" },
    })
    console.log("[OK] Administrator created (admin@example.com / password123)")

    const customerEmail = "tanvir@example.com"
    const customerId = "usr_customer_default_01"
    const existingCustomer = await db.select().from(schema.users).where(eq(schema.users.email, customerEmail))
    if (existingCustomer.length === 0) {
      await db.insert(schema.users).values({
        id: customerId,
        name: "Tanvir Ahmed",
        email: customerEmail,
        emailVerified: true,
        role: "customer",
        phone: "+880 1712 345678",
        balance: "2500.00",
      })
    }
    await db.insert(schema.accounts).values({
      id: "acc_customer_default_credential",
      userId: customerId,
      accountId: customerId,
      providerId: "credential",
      password: defaultPasswordHash,
    }).onConflictDoUpdate({
      target: schema.accounts.id,
      set: { password: defaultPasswordHash, accountId: customerId, userId: customerId, providerId: "credential" },
    })
    console.log("[OK] Default customer created (tanvir@example.com / password123)")

    const sellerEmail = "seller@example.com"
    const sellerId = "usr_seller_default_01"
    const existingSeller = await db.select().from(schema.users).where(eq(schema.users.email, sellerEmail))
    if (existingSeller.length === 0) {
      await db.insert(schema.users).values({
        id: sellerId,
        name: "Demo Seller Store",
        email: sellerEmail,
        emailVerified: true,
        role: "seller",
        phone: "+880 1711 999888",
        balance: "15000.00",
      })
    }
    await db.insert(schema.accounts).values({
      id: "acc_seller_default_credential",
      userId: sellerId,
      accountId: sellerId,
      providerId: "credential",
      password: defaultPasswordHash,
    }).onConflictDoUpdate({
      target: schema.accounts.id,
      set: { password: defaultPasswordHash, accountId: sellerId, userId: sellerId, providerId: "credential" },
    })
    console.log("[OK] Default seller created (seller@example.com / password123)")

    // 9. Seed Shops
    for (const shop of SEED_SHOPS) {
      const existing = await db.select().from(schema.shops).where(eq(schema.shops.slug, shop.slug))
      if (existing.length === 0) {
        await db.insert(schema.shops).values({
          name: shop.name,
          slug: shop.slug,
          logo: shop.logo,
          topBanner: shop.topBanner,
          sliders: shop.sliders,
          address: shop.address,
          phone: shop.phone,
          rating: shop.rating.toString(),
          numOfReviews: shop.reviewCount,
          verificationStatus: shop.verificationStatus,
          facebook: shop.facebook,
          instagram: shop.instagram,
          twitter: shop.twitter,
          youtube: shop.youtube,
        })
      }
    }
    console.log("[OK] Shops seeded")

    // 10. Seed Coupons
    for (const cp of SEED_COUPONS) {
      const existing = await db.select().from(schema.coupons).where(eq(schema.coupons.code, cp.code))
      if (existing.length === 0) {
        await db.insert(schema.coupons).values({
          code: cp.code,
          type: cp.type,
          discount: cp.discount.toString(),
          discountType: cp.discountType,
          startDate: Math.floor(cp.startDate / 1000),
          endDate: Math.floor(cp.endDate / 1000),
          details: { min_buy: cp.minBuy, max_discount: cp.maxDiscount },
          status: cp.status,
        })
      }
    }
    console.log("[OK] Coupons seeded")

    console.log("==================================================")
    console.log("[OK] Installation completed")
    console.log("==================================================")
    process.exit(0)
  } catch (err) {
    console.error("❌ Setup error:", err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runSetup()
