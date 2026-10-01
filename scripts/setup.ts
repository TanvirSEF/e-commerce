import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import * as schema from "../src/db/schema/index.js"
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS, SEED_FLASH_DEALS, SEED_SHOPS, SEED_COUPONS } from "../src/db/seed/data.js"
import { eq, count } from "drizzle-orm"

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
    // 2.5 Run database migrations
    console.log("[...] Applying database schema migrations...")
    try {
      await migrate(db, { migrationsFolder: "./src/db/migrations" })
      console.log("[OK] Database schema migrated successfully")
    } catch (migErr) {
      console.warn("⚠️ Migration notice:", (migErr as Error).message)
    }

    // 2.6 Ensure Addons Table Exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unique_identifier VARCHAR(100) NOT NULL UNIQUE,
        version VARCHAR(50) NOT NULL DEFAULT '1.0',
        activated BOOLEAN NOT NULL DEFAULT true,
        image TEXT,
        purchase_code VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS affiliate_users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        user_name VARCHAR(150) NOT NULL,
        user_email VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        paypal_email VARCHAR(150),
        bank_info TEXT,
        verification_info TEXT,
        balance NUMERIC(10, 2) NOT NULL DEFAULT '0.00',
        status BOOLEAN NOT NULL DEFAULT true,
        approved BOOLEAN NOT NULL DEFAULT true,
        referral_code VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE affiliate_users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE affiliate_users ADD COLUMN IF NOT EXISTS verification_info TEXT;
      ALTER TABLE affiliate_users ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT true;

      CREATE TABLE IF NOT EXISTS affiliate_options (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL UNIQUE,
        percentage NUMERIC(5, 2) NOT NULL,
        details TEXT,
        status BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE affiliate_options ADD COLUMN IF NOT EXISTS details TEXT;

      CREATE TABLE IF NOT EXISTS affiliate_configs (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS affiliate_payments (
        id SERIAL PRIMARY KEY,
        affiliate_user_id INTEGER NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_details TEXT,
        txn_code VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS affiliate_referrals (
        id SERIAL PRIMARY KEY,
        affiliate_user_id INTEGER NOT NULL,
        referred_user_name VARCHAR(150) NOT NULL,
        referred_user_email VARCHAR(150) NOT NULL,
        referred_user_phone VARCHAR(50),
        referral_type VARCHAR(50) NOT NULL DEFAULT 'Registration',
        order_code VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS affiliate_withdraw_requests (
        id SERIAL PRIMARY KEY,
        affiliate_user_id INTEGER NOT NULL,
        user_name VARCHAR(150) NOT NULL,
        user_email VARCHAR(150) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_details TEXT,
        txn_code VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE affiliate_withdraw_requests ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE affiliate_withdraw_requests ADD COLUMN IF NOT EXISTS payment_details TEXT;
      ALTER TABLE affiliate_withdraw_requests ADD COLUMN IF NOT EXISTS txn_code VARCHAR(100);

      CREATE TABLE IF NOT EXISTS affiliate_logs (
        id SERIAL PRIMARY KEY,
        affiliate_user_id INTEGER NOT NULL,
        affiliate_user_name VARCHAR(150),
        referred_user_name VARCHAR(150) NOT NULL,
        affiliate_type VARCHAR(50) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        order_code VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE affiliate_logs ADD COLUMN IF NOT EXISTS affiliate_user_name VARCHAR(150);

      CREATE TABLE IF NOT EXISTS delivery_boys (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(50) NOT NULL,
        avatar VARCHAR(500),
        zone_id INTEGER NOT NULL DEFAULT 1,
        zone_name VARCHAR(100) NOT NULL DEFAULT 'Default Zone',
        city VARCHAR(100),
        address TEXT,
        monthly_salary NUMERIC(10, 2) DEFAULT '0.00',
        commission_rate NUMERIC(5, 2) DEFAULT '0.00',
        status BOOLEAN NOT NULL DEFAULT true,
        total_earnings NUMERIC(10, 2) NOT NULL DEFAULT '0.00',
        total_collection NUMERIC(10, 2) NOT NULL DEFAULT '0.00',
        current_pending_deliveries INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE delivery_boys ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE delivery_boys ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE delivery_boys ADD COLUMN IF NOT EXISTS monthly_salary NUMERIC(10, 2) DEFAULT '0.00';
      ALTER TABLE delivery_boys ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5, 2) DEFAULT '0.00';

      CREATE TABLE IF NOT EXISTS delivery_collections (
        id SERIAL PRIMARY KEY,
        delivery_boy_id INTEGER NOT NULL,
        delivery_boy_name VARCHAR(150) NOT NULL,
        order_code VARCHAR(50) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        collection_date TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS delivery_payouts (
        id SERIAL PRIMARY KEY,
        delivery_boy_id INTEGER NOT NULL,
        delivery_boy_name VARCHAR(150) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash',
        txn_code VARCHAR(100),
        notes TEXT,
        payment_date TIMESTAMP NOT NULL DEFAULT NOW()
      );
      ALTER TABLE delivery_payouts ADD COLUMN IF NOT EXISTS txn_code VARCHAR(100);
      ALTER TABLE delivery_payouts ADD COLUMN IF NOT EXISTS notes TEXT;

      CREATE TABLE IF NOT EXISTS delivery_cancel_requests (
        id SERIAL PRIMARY KEY,
        delivery_boy_id INTEGER NOT NULL,
        delivery_boy_name VARCHAR(150) NOT NULL,
        order_code VARCHAR(50) NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_searches (
        id SERIAL PRIMARY KEY,
        query VARCHAR(255) NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS commission_histories (
        id SERIAL PRIMARY KEY,
        order_id INTEGER,
        order_code VARCHAR(100) NOT NULL,
        seller_id VARCHAR(100),
        seller_name VARCHAR(150),
        admin_commission NUMERIC(12, 2) NOT NULL DEFAULT '0.00',
        seller_earning NUMERIC(12, 2) NOT NULL DEFAULT '0.00',
        order_from VARCHAR(20) NOT NULL DEFAULT 'web',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ai_token_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100),
        user_name VARCHAR(150),
        feature VARCHAR(255) NOT NULL,
        model VARCHAR(100) NOT NULL,
        prompt_tokens INTEGER NOT NULL DEFAULT 0,
        completion_tokens INTEGER NOT NULL DEFAULT 0,
        total_tokens INTEGER NOT NULL DEFAULT 0,
        cost_usd NUMERIC(10, 4) NOT NULL DEFAULT '0.0000',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        file_original_name TEXT,
        file_name TEXT NOT NULL,
        user_id TEXT,
        file_size INTEGER DEFAULT 0,
        extension TEXT DEFAULT 'jpg',
        type TEXT DEFAULT 'image',
        external_link TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

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

    const deliveryBoyEmail = "deliveryboy@example.com"
    const deliveryBoyId = "usr_deliveryboy_default_01"
    const existingDeliveryBoy = await db.select().from(schema.users).where(eq(schema.users.email, deliveryBoyEmail))
    if (existingDeliveryBoy.length === 0) {
      await db.insert(schema.users).values({
        id: deliveryBoyId,
        name: "Express Delivery Boy",
        email: deliveryBoyEmail,
        emailVerified: true,
        role: "delivery_boy",
        phone: "+880 1722 111222",
        balance: "500.00",
      })
    }
    await db.insert(schema.accounts).values({
      id: "acc_deliveryboy_default_credential",
      userId: deliveryBoyId,
      accountId: deliveryBoyId,
      providerId: "credential",
      password: defaultPasswordHash,
    }).onConflictDoUpdate({
      target: schema.accounts.id,
      set: { password: defaultPasswordHash, accountId: deliveryBoyId, userId: deliveryBoyId, providerId: "credential" },
    })
    console.log("[OK] Default delivery boy created (deliveryboy@example.com / password123)")

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

    // 11. Seed Canonical Addons
    const CANONICAL_ADDONS_SEED = [
      {
        uniqueIdentifier: "pos_system",
        name: "POS (Point of Sale) System",
        version: "3.1",
        description: "Complete in-store checkout terminal with barcode scanner, thermal receipt printing, and live stock sync.",
        image: "https://images.unsplash.com/photo-1556742049-0a67e5572248?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-pos-live-licensed-2026",
      },
      {
        uniqueIdentifier: "club_points",
        name: "Club Point System",
        version: "2.4",
        description: "Reward shoppers with points for purchases, exchangeable for wallet money and coupon vouchers.",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-clubpoints-live-licensed-2026",
      },
      {
        uniqueIdentifier: "otp_system",
        name: "OTP & SMS Notifications",
        version: "2.8",
        description: "Mobile number authentication via Twilio, Fast2SMS, Nexmo, and SMS order alerts.",
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-otp-live-licensed-2026",
      },
      {
        uniqueIdentifier: "wholesale_system",
        name: "Wholesale Tiered Pricing",
        version: "2.0",
        description: "Multi-tier bulk discount price brackets based on purchase quantity brackets.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-wholesale-live-licensed-2026",
      },
      {
        uniqueIdentifier: "preorder_system",
        name: "Pre-Order System",
        version: "1.9",
        description: "Accept partial deposits or full pre-orders on unreleased and scheduled batch products.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-preorder-live-licensed-2026",
      },
      {
        uniqueIdentifier: "auction_system",
        name: "Auction & Bidding System",
        version: "2.2",
        description: "Real-time competitive bidding countdown lots for luxury timepieces and rare merchandise.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-auction-live-licensed-2026",
      },
      {
        uniqueIdentifier: "affiliate_system",
        name: "Affiliate Partner Program",
        version: "2.5",
        description: "Multi-tier influencer referral links, cookie attribution tracking, and automated payout requests.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-affiliate-live-licensed-2026",
      },
      {
        uniqueIdentifier: "delivery_boy_system",
        name: "Delivery Boy Management",
        version: "3.0",
        description: "Dedicated courier dispatch portal with COD collections, zone assignments, and commission payouts.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-deliveryboy-live-licensed-2026",
      },
      {
        uniqueIdentifier: "refund_system",
        name: "Refund & Return Management",
        version: "2.1",
        description: "Buyer dispute desk with return reason workflows and automated wallet credits.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-refund-live-licensed-2026",
      },
      {
        uniqueIdentifier: "offline_payments",
        name: "Manual & Offline Payments",
        version: "2.0",
        description: "Support manual bank transfers, bKash, Nagad, and cheque receipts with admin verification.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80",
        purchaseCode: "aec-offlinepay-live-licensed-2026",
      },
    ]

    for (const addon of CANONICAL_ADDONS_SEED) {
      const existing = await db
        .select()
        .from(schema.addons)
        .where(eq(schema.addons.uniqueIdentifier, addon.uniqueIdentifier))
      if (existing.length === 0) {
        await db.insert(schema.addons).values({
          name: addon.name,
          uniqueIdentifier: addon.uniqueIdentifier,
          version: addon.version,
          description: addon.description,
          image: addon.image,
          purchaseCode: addon.purchaseCode,
          activated: true,
        })
      }
    }
    console.log("[OK] Canonical Addons seeded")

    // 12. Seed Canonical Orders for Active eCommerce CMS
    const dbProducts = await db.select().from(schema.products)
    const existingOrdersCount = await db.select({ val: count() }).from(schema.orders)
    if (Number(existingOrdersCount[0]?.val || 0) === 0 && dbProducts.length > 0) {
      const now = new Date()
      const getPastDate = (daysAgo: number) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

      const SEED_ORDERS_DATA = [
        {
          code: "ORD-942851",
          trackingCode: "TRK-942851",
          userId: "usr_customer_default_01",
          customerName: "Tanvir Ahmed",
          customerEmail: "tanvir@example.com",
          amount: "2200.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(1),
          productId: dbProducts[0]?.id,
          qty: 1,
        },
        {
          code: "ORD-938210",
          trackingCode: "TRK-938210",
          userId: "usr_customer_default_01",
          customerName: "Rashidul Islam",
          customerEmail: "rashidul@example.com",
          amount: "3450.00",
          paymentType: "wallet",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(3),
          productId: dbProducts[1]?.id || dbProducts[0]?.id,
          qty: 2,
        },
        {
          code: "ORD-921473",
          trackingCode: "TRK-921473",
          userId: "usr_customer_default_01",
          customerName: "Mohammad Ali",
          customerEmail: "ali@example.com",
          amount: "999.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "unpaid",
          deliveryStatus: "pending",
          date: getPastDate(4),
          productId: dbProducts[2]?.id || dbProducts[0]?.id,
          qty: 1,
        },
        {
          code: "ORD-915420",
          trackingCode: "TRK-915420",
          userId: "usr_customer_default_01",
          customerName: "Sarah Khan",
          customerEmail: "sarah@example.com",
          amount: "4800.00",
          paymentType: "sslcommerz",
          paymentStatus: "paid",
          deliveryStatus: "confirmed",
          date: getPastDate(5),
          productId: dbProducts[3]?.id || dbProducts[0]?.id,
          qty: 1,
        },
        {
          code: "ORD-902184",
          trackingCode: "TRK-902184",
          userId: "usr_customer_default_01",
          customerName: "Arif Hossain",
          customerEmail: "arif@example.com",
          amount: "1650.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "paid",
          deliveryStatus: "on_the_way",
          date: getPastDate(7),
          productId: dbProducts[4]?.id || dbProducts[0]?.id,
          qty: 1,
        },
        {
          code: "ORD-894721",
          trackingCode: "TRK-894721",
          userId: "usr_customer_default_01",
          customerName: "Nusrat Jahan",
          customerEmail: "nusrat@example.com",
          amount: "3200.00",
          paymentType: "wallet",
          paymentStatus: "paid",
          deliveryStatus: "picked_up",
          date: getPastDate(12),
          productId: dbProducts[5]?.id || dbProducts[0]?.id,
          qty: 2,
        },
        {
          code: "ORD-882190",
          trackingCode: "TRK-882190",
          userId: "usr_customer_default_01",
          customerName: "Tanvir Ahmed",
          customerEmail: "tanvir@example.com",
          amount: "5800.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(25),
          productId: dbProducts[0]?.id,
          qty: 2,
        },
        {
          code: "ORD-871203",
          trackingCode: "TRK-871203",
          userId: "usr_customer_default_01",
          customerName: "Mehedi Hasan",
          customerEmail: "mehedi@example.com",
          amount: "7500.00",
          paymentType: "bkash",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(45),
          productId: dbProducts[1]?.id || dbProducts[0]?.id,
          qty: 3,
        },
        {
          code: "ORD-860492",
          trackingCode: "TRK-860492",
          userId: "usr_customer_default_01",
          customerName: "Shamima Akter",
          customerEmail: "shamima@example.com",
          amount: "9200.00",
          paymentType: "wallet",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(70),
          productId: dbProducts[2]?.id || dbProducts[0]?.id,
          qty: 2,
        },
        {
          code: "ORD-851928",
          trackingCode: "TRK-851928",
          userId: "usr_customer_default_01",
          customerName: "Tanvir Ahmed",
          customerEmail: "tanvir@example.com",
          amount: "12400.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "paid",
          deliveryStatus: "delivered",
          date: getPastDate(100),
          productId: dbProducts[3]?.id || dbProducts[0]?.id,
          qty: 4,
        },
        {
          code: "ORD-840192",
          trackingCode: "TRK-840192",
          userId: "usr_customer_default_01",
          customerName: "Rashed Khan",
          customerEmail: "rashed@example.com",
          amount: "1200.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "unpaid",
          deliveryStatus: "cancelled",
          date: getPastDate(10),
          productId: dbProducts[4]?.id || dbProducts[0]?.id,
          qty: 1,
        },
        {
          code: "ORD-831092",
          trackingCode: "TRK-831092",
          userId: "usr_customer_default_01",
          customerName: "Farhana Yeasmin",
          customerEmail: "farhana@example.com",
          amount: "2900.00",
          paymentType: "cash_on_delivery",
          paymentStatus: "paid",
          deliveryStatus: "confirmed",
          date: getPastDate(6),
          productId: dbProducts[5]?.id || dbProducts[0]?.id,
          qty: 1,
        },
      ]

      for (const ord of SEED_ORDERS_DATA) {
        const [newOrder] = await db
          .insert(schema.orders)
          .values({
            code: ord.code,
            trackingCode: ord.trackingCode,
            userId: ord.userId,
            shippingAddress: {
              name: ord.customerName,
              email: ord.customerEmail,
              address: "House 12, Road 5, Dhanmondi",
              city: "Dhaka",
              country: "Bangladesh",
              phone: "+880 1712 000000",
            },
            paymentType: ord.paymentType,
            paymentStatus: ord.paymentStatus,
            deliveryStatus: ord.deliveryStatus,
            grandTotal: ord.amount,
            createdAt: ord.date,
            updatedAt: ord.date,
          })
          .returning()

        if (newOrder && ord.productId) {
          await db.insert(schema.orderItems).values({
            orderId: newOrder.id,
            productId: ord.productId,
            quantity: ord.qty,
            price: ord.amount,
            tax: "0.00",
            shippingCost: "0.00",
            createdAt: ord.date,
            updatedAt: ord.date,
          })
        }
      }
      console.log("[OK] Canonical Orders & Order Items seeded")
    }

    // 13. Seed Canonical Refund Reasons & Requests
    const existingReasonsCount = await db.select({ val: count() }).from(schema.refundReasons)
    if (Number(existingReasonsCount[0]?.val || 0) === 0) {
      const canonicalReasons = [
        "Damaged or defective item received",
        "Item does not match description or specifications",
        "Wrong item or wrong variation delivered",
        "Item arrived significantly later than promised",
        "Quality not as expected / Missing accessories",
        "Customer changed mind / No longer needed",
      ]
      for (const r of canonicalReasons) {
        await db.insert(schema.refundReasons).values({
          reason: r,
          type: "customer_refund_reason",
          status: true,
        })
      }
      console.log("[OK] Canonical Refund Reasons seeded")
    }

    const existingRefundsCount = await db.select({ val: count() }).from(schema.refundRequests)
    if (Number(existingRefundsCount[0]?.val || 0) === 0) {
      await db.insert(schema.refundRequests).values([
        {
          orderId: 1,
          orderCode: "ORD-942851",
          userId: "usr_customer_default_01",
          userName: "Tanvir Ahmed",
          shopId: 1,
          shopName: "Active Fashion Outlet",
          productName: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
          amount: "1250.00",
          reason: "Damaged or defective item received",
          details: "The collar button and seams arrived torn on unboxing. Requesting refund to wallet.",
          attachment: "/assets/img/placeholder.jpg",
          status: "pending",
        },
        {
          orderId: 4,
          orderCode: "ORD-915420",
          userId: "usr_customer_default_01",
          userName: "Tanvir Ahmed",
          shopId: 2,
          shopName: "Gadget Hub BD",
          productName: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
          amount: "2200.00",
          reason: "Item does not match description or specifications",
          details: "Received red switches instead of blue switches as advertised in product listing.",
          status: "pending",
        },
        {
          orderId: 2,
          orderCode: "ORD-938210",
          userId: "usr_customer_default_01",
          userName: "Rashidul Islam",
          shopId: 4,
          shopName: "Home Essentials",
          productName: "Philips Rice Cooker 0.6L Compact Non-Stick Inner Pot",
          amount: "3450.00",
          reason: "Wrong item or wrong variation delivered",
          details: "Ordered 1.8L model but received 0.6L compact model.",
          attachment: "/assets/img/placeholder.jpg",
          status: "approved",
          adminNote: "Approved and full amount refunded to customer wallet balance.",
        },
        {
          orderId: 5,
          orderCode: "ORD-902184",
          userId: "usr_customer_default_01",
          userName: "Tanvir Ahmed",
          shopId: 3,
          shopName: "Inhouse Products",
          productName: "Multi-Pocket Travel Backpack with USB Charging Port Waterproof",
          amount: "1350.00",
          reason: "Customer changed mind / No longer needed",
          details: "Buyer changed mind after tag was removed.",
          status: "rejected",
          adminNote: "Rejected: Return policy does not allow returns with removed security tags.",
        },
      ])
      console.log("[OK] Canonical Refund Requests seeded")
    }

    // 14. Seed Canonical Pre-Order Products
    const existingPreordersCount = await db.select({ val: count() }).from(schema.preorderProducts)
    if (Number(existingPreordersCount[0]?.val || 0) === 0) {
      await db.insert(schema.preorderProducts).values([
        {
          name: "PlayStation 5 Pro 2TB Edition",
          slug: "playstation-5-pro-2tb-edition",
          sku: "PS5-PRO-2TB",
          thumbnail: "/assets/img/placeholder.jpg",
          price: "799.00",
          prepaymentAmount: "159.80",
          releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          preorderBatchLimit: 150,
          currentPreorders: 84,
          sellerSlug: "inhouse",
          status: true,
          featured: true,
          categoryName: "Gaming Consoles",
          unit: "Pc",
          minQty: 1,
          isRefundable: true,
          discount: "0.00",
          discountType: "percent",
          isAvailable: false,
          availableDate: "25-10-2026",
          finalOrders: 12,
        },
        {
          name: "Apple Vision Pro (2nd Generation)",
          slug: "apple-vision-pro-2nd-gen",
          sku: "AVP-2026-M4",
          thumbnail: "/assets/img/placeholder-rect.jpg",
          price: "3499.00",
          prepaymentAmount: "700.00",
          releaseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          preorderBatchLimit: 50,
          currentPreorders: 39,
          sellerSlug: "gadget-hub",
          status: true,
          featured: true,
          categoryName: "Virtual Reality & AI",
          unit: "Pc",
          minQty: 1,
          isRefundable: true,
          discount: "5.00",
          discountType: "percent",
          isAvailable: false,
          availableDate: "09-11-2026",
          finalOrders: 5,
        },
        {
          name: "Sony Alpha A9 III Global Shutter Camera",
          slug: "sony-alpha-a9-iii-camera",
          sku: "SONY-A9M3-BODY",
          thumbnail: "/assets/img/placeholder.jpg",
          price: "5999.00",
          prepaymentAmount: "1200.00",
          releaseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          preorderBatchLimit: 30,
          currentPreorders: 18,
          sellerSlug: "inhouse",
          status: true,
          featured: false,
          categoryName: "Cameras & Optics",
          unit: "Pc",
          minQty: 1,
          isRefundable: true,
          discount: "200.00",
          discountType: "flat",
          isAvailable: true,
          availableDate: "15-10-2026",
          finalOrders: 8,
        },
        {
          name: "DJI Mavic 4 Pro Cinema Drone 8K",
          slug: "dji-mavic-4-pro-cinema",
          sku: "DJI-M4P-8K",
          thumbnail: "/assets/img/placeholder.jpg",
          price: "2499.00",
          prepaymentAmount: "500.00",
          releaseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          preorderBatchLimit: 40,
          currentPreorders: 22,
          sellerSlug: "gadget-hub",
          status: false,
          featured: false,
          categoryName: "Drones & Aerial",
          unit: "Pc",
          minQty: 1,
          isRefundable: false,
          discount: "10.00",
          discountType: "percent",
          isAvailable: false,
          availableDate: "15-12-2026",
          finalOrders: 0,
        },
        {
          name: "Steam Deck OLED 1TB White Limited Edition",
          slug: "steam-deck-oled-1tb-white",
          sku: "SD-OLED-1TB-WHT",
          thumbnail: "/assets/img/placeholder.jpg",
          price: "649.00",
          prepaymentAmount: "130.00",
          releaseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          preorderBatchLimit: 100,
          currentPreorders: 65,
          sellerSlug: "inhouse",
          status: true,
          featured: true,
          categoryName: "Gaming Consoles",
          unit: "Pc",
          minQty: 1,
          isRefundable: true,
          discount: "0.00",
          discountType: "percent",
          isAvailable: true,
          availableDate: "05-10-2026",
          finalOrders: 40,
        },
      ])
      console.log("[OK] Canonical Pre-Order Products seeded")
    }

    // 15. Seed Canonical Seller Packages & Payments
    const existingSellerPackagesCount = await db.select({ val: count() }).from(schema.sellerPackages)
    if (Number(existingSellerPackagesCount[0]?.val || 0) === 0) {
      await db.insert(schema.sellerPackages).values([
        {
          name: "Starter Merchant",
          amount: "0.00",
          productUploadLimit: 25,
          duration: 365,
          logo: "/assets/img/package-starter.png",
          status: true,
        },
        {
          name: "Silver Growth",
          amount: "29.00",
          productUploadLimit: 150,
          duration: 30,
          logo: "/assets/img/package-silver.png",
          status: true,
        },
        {
          name: "Gold Enterprise",
          amount: "79.00",
          productUploadLimit: 1000,
          duration: 30,
          logo: "/assets/img/package-gold.png",
          status: true,
        },
      ])
      console.log("[OK] Canonical Seller Packages seeded")
    }

    const existingSellerPaymentsCount = await db.select({ val: count() }).from(schema.sellerPackagePayments)
    if (Number(existingSellerPaymentsCount[0]?.val || 0) === 0) {
      await db.insert(schema.sellerPackagePayments).values([
        {
          sellerId: 1,
          sellerPackageId: 2,
          amount: "29.00",
          paymentMethod: "bKash",
          paymentDetails: "TrxID: 9X238FA2",
          offlinePayment: false,
          approval: true,
        },
        {
          sellerId: 2,
          sellerPackageId: 3,
          amount: "79.00",
          paymentMethod: "Bank Slip",
          paymentDetails: "Bank: City Bank, Dep Ref #55412",
          offlinePayment: true,
          approval: true,
          receipt: "/uploads/slips/slip-55412.jpg",
        },
      ])
      console.log("[OK] Canonical Seller Package Payments seeded")
    }

    // 16. Seed Canonical Affiliate System Data
    const existingAffiliateOptionsCount = await db.select({ val: count() }).from(schema.affiliateOptions)
    if (Number(existingAffiliateOptionsCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateOptions).values([
        {
          type: "product_sharing",
          percentage: "5.00",
          status: true,
        },
        {
          type: "category_wise_affiliate",
          percentage: "0.00",
          details: JSON.stringify({ 1: "8.00", 2: "6.50", 3: "5.00", 4: "4.00" }),
          status: false,
        },
        {
          type: "user_registration",
          percentage: "2.50",
          status: true,
        },
        {
          type: "user_registration_first_purchase",
          percentage: "3.00",
          status: true,
        },
      ])
      console.log("[OK] Canonical Affiliate Options seeded")
    }

    const existingAffiliateConfigsCount = await db.select({ val: count() }).from(schema.affiliateConfigs)
    if (Number(existingAffiliateConfigsCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateConfigs).values([
        {
          type: "minimum_withdraw_amount",
          value: "50",
        },
        {
          type: "cookie_duration_days",
          value: "30",
        },
        {
          type: "affiliate_terms",
          value: "Commissions are credited upon verified order delivery. Fraudulent clicks, bot traffic, or self-referrals will result in immediate disqualification and forfeiture of accumulated earnings.",
        },
        {
          type: "verification_form",
          value: JSON.stringify([
            { id: "website_url", label: "Website or Social Media Profile URL", type: "text", required: true },
            { id: "traffic_volume", label: "Estimated Monthly Audience / Followers", type: "select", options: ["Under 5,000", "5,000 - 25,000", "25,000 - 100,000", "100,000+"], required: true },
            { id: "promotion_strategy", label: "Primary Promotional Channels", type: "text", required: true },
            { id: "payout_method", label: "Preferred Payout Gateway", type: "select", options: ["Bank Transfer", "PayPal", "bKash / Mobile Wallet"], required: true },
          ]),
        },
      ])
      console.log("[OK] Canonical Affiliate Configurations seeded")
    }

    const existingAffiliateUsersCount = await db.select({ val: count() }).from(schema.affiliateUsers)
    if (Number(existingAffiliateUsersCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateUsers).values([
        {
          userId: "usr_1",
          userName: "Marcus Harrison",
          userEmail: "marcus.h@techreviews.com",
          phone: "+880 1711 223344",
          paypalEmail: "payouts@techreviews.com",
          bankInfo: "Chase Manhattan Bank - Routing: 021000021, Acct: ****8841",
          verificationInfo: JSON.stringify({
            website_url: "https://youtube.com/@techreviews_marcus",
            traffic_volume: "25,000 - 100,000",
            promotion_strategy: "Tech gadget unboxings and YouTube video descriptions",
            payout_method: "PayPal",
          }),
          balance: "485.50",
          status: true,
          approved: true,
          referralCode: "MARCUS-PRO",
        },
        {
          userId: "usr_2",
          userName: "Elena Gilbert",
          userEmail: "elena.style@gmail.com",
          phone: "+880 1822 334455",
          paypalEmail: "elena.style@gmail.com",
          bankInfo: "Bank of America - Routing: 121000358, Acct: ****1922",
          verificationInfo: JSON.stringify({
            website_url: "https://instagram.com/elena_style_vibe",
            traffic_volume: "5,000 - 25,000",
            promotion_strategy: "Fashion outfit reels and story swipe-up links",
            payout_method: "Bank Transfer",
          }),
          balance: "192.00",
          status: true,
          approved: true,
          referralCode: "ELENA-LUX",
        },
        {
          userId: "usr_3",
          userName: "Devon Miller",
          userEmail: "devon.deals@outlook.com",
          phone: "+880 1933 445566",
          paypalEmail: "devon.deals@outlook.com",
          bankInfo: "City Bank PLC - Acct: 110293847201",
          verificationInfo: JSON.stringify({
            website_url: "https://t.me/devondealsbd",
            traffic_volume: "Under 5,000",
            promotion_strategy: "Telegram discounts channel and community groups",
            payout_method: "bKash / Mobile Wallet",
          }),
          balance: "35.00",
          status: false,
          approved: false,
          referralCode: "DEVON-DEALS",
        },
      ])
      console.log("[OK] Canonical Affiliate Users seeded")
    }

    const existingReferralsCount = await db.select({ val: count() }).from(schema.affiliateReferrals)
    if (Number(existingReferralsCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateReferrals).values([
        {
          affiliateUserId: 1,
          referredUserName: "Sadman Sakib",
          referredUserEmail: "sadman.sakib@example.com",
          referredUserPhone: "+880 1755 112233",
          referralType: "Product Sharing",
          orderCode: "ORD-942851",
        },
        {
          affiliateUserId: 1,
          referredUserName: "Tasmia Rahman",
          referredUserEmail: "tasmia.rahman@example.com",
          referredUserPhone: "+880 1866 223344",
          referralType: "User Registration",
        },
        {
          affiliateUserId: 2,
          referredUserName: "Fahim Faysal",
          referredUserEmail: "fahim.faysal@example.com",
          referredUserPhone: "+880 1977 334455",
          referralType: "Product Sharing",
          orderCode: "ORD-915420",
        },
        {
          affiliateUserId: 2,
          referredUserName: "Sabrina Mostafa",
          referredUserEmail: "sabrina.m@example.com",
          referredUserPhone: "+880 1688 445566",
          referralType: "First Purchase",
          orderCode: "ORD-938210",
        },
      ])
      console.log("[OK] Canonical Affiliate Referrals seeded")
    }

    const existingWithdrawsCount = await db.select({ val: count() }).from(schema.affiliateWithdrawRequests)
    if (Number(existingWithdrawsCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateWithdrawRequests).values([
        {
          affiliateUserId: 1,
          userName: "Marcus Harrison",
          userEmail: "marcus.h@techreviews.com",
          amount: "300.00",
          paymentMethod: "PayPal",
          paymentDetails: "PayPal Email: payouts@techreviews.com",
          status: "pending",
        },
        {
          affiliateUserId: 2,
          userName: "Elena Gilbert",
          userEmail: "elena.style@gmail.com",
          amount: "150.00",
          paymentMethod: "Bank Transfer",
          paymentDetails: "Bank of America - Routing: 121000358, Acct: ****1922",
          txnCode: "BOA-REF-9921448",
          status: "approved",
        },
      ])
      console.log("[OK] Canonical Affiliate Withdraw Requests seeded")
    }

    const existingAffiliateLogsCount = await db.select({ val: count() }).from(schema.affiliateLogs)
    if (Number(existingAffiliateLogsCount[0]?.val || 0) === 0) {
      await db.insert(schema.affiliateLogs).values([
        {
          affiliateUserId: 1,
          affiliateUserName: "Marcus Harrison",
          referredUserName: "Sadman Sakib",
          affiliateType: "Product Sharing",
          amount: "45.00",
          orderCode: "ORD-942851",
        },
        {
          affiliateUserId: 1,
          affiliateUserName: "Marcus Harrison",
          referredUserName: "Tasmia Rahman",
          affiliateType: "User Registration",
          amount: "2.50",
        },
        {
          affiliateUserId: 2,
          affiliateUserName: "Elena Gilbert",
          referredUserName: "Fahim Faysal",
          affiliateType: "Product Sharing",
          amount: "18.50",
          orderCode: "ORD-915420",
        },
        {
          affiliateUserId: 2,
          affiliateUserName: "Elena Gilbert",
          referredUserName: "Sabrina Mostafa",
          affiliateType: "First Purchase",
          amount: "12.00",
          orderCode: "ORD-938210",
        },
      ])
      console.log("[OK] Canonical Affiliate Audit Logs seeded")
    }

    // 17. Seed Canonical Delivery Boy Data & Configurations
    const deliveryBoySettings = [
      { type: "delivery_boy_payment_type", value: "commission" },
      { type: "delivery_boy_commission", value: "3.50" },
      { type: "delivery_boy_monthly_salary", value: "15000.00" },
      { type: "delivery_boy_cash_collection_limit", value: "5000.00" },
      { type: "delivery_boy_mail_notification", value: "1" },
      { type: "delivery_boy_otp_notification", value: "1" },
    ]
    for (const s of deliveryBoySettings) {
      const existing = await db
        .select()
        .from(schema.businessSettings)
        .where(eq(schema.businessSettings.type, s.type))
      if (existing.length === 0) {
        await db.insert(schema.businessSettings).values(s)
      }
    }

    const existingDeliveryBoysCount = await db.select({ val: count() }).from(schema.deliveryBoys)
    if (Number(existingDeliveryBoysCount[0]?.val || 0) === 0) {
      await db.insert(schema.deliveryBoys).values([
        {
          name: "Tariqul Islam",
          email: "tariq.courier@example.com",
          phone: "+880 1711-892341",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          zoneId: 1,
          zoneName: "Dhaka Metro North",
          city: "Dhaka",
          address: "House 42, Road 11, Sector 4, Uttara, Dhaka",
          monthlySalary: "15000.00",
          commissionRate: "3.50",
          status: true,
          totalEarnings: "640.00",
          totalCollection: "3480.00",
          currentPendingDeliveries: 4,
        },
        {
          name: "Mohammad Fahim",
          email: "fahim.speed@example.com",
          phone: "+880 1822-771239",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          zoneId: 2,
          zoneName: "Dhaka Metro South",
          city: "Dhaka",
          address: "Flat 3B, Dhanmondi 27, Dhaka",
          monthlySalary: "15000.00",
          commissionRate: "3.50",
          status: true,
          totalEarnings: "890.50",
          totalCollection: "5120.00",
          currentPendingDeliveries: 7,
        },
        {
          name: "Tanvir Rahman",
          email: "tanvir.delivery@example.com",
          phone: "+880 1933-445566",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
          zoneId: 3,
          zoneName: "Chittagong Central",
          city: "Chittagong",
          address: "GEC Circle, Nasirabad, Chittagong",
          monthlySalary: "14000.00",
          commissionRate: "3.50",
          status: false,
          totalEarnings: "120.00",
          totalCollection: "680.00",
          currentPendingDeliveries: 0,
        },
      ])
      console.log("[OK] Canonical Delivery Boys seeded")
    }

    const existingDeliveryCollectionsCount = await db.select({ val: count() }).from(schema.deliveryCollections)
    if (Number(existingDeliveryCollectionsCount[0]?.val || 0) === 0) {
      await db.insert(schema.deliveryCollections).values([
        {
          deliveryBoyId: 1,
          deliveryBoyName: "Tariqul Islam",
          orderCode: "ORD-202609-1002",
          amount: "145.00",
          collectionDate: new Date("2026-09-24T15:30:00Z"),
        },
        {
          deliveryBoyId: 2,
          deliveryBoyName: "Mohammad Fahim",
          orderCode: "ORD-202609-1005",
          amount: "320.00",
          collectionDate: new Date("2026-09-25T11:20:00Z"),
        },
        {
          deliveryBoyId: 1,
          deliveryBoyName: "Tariqul Islam",
          orderCode: "ORD-202609-1008",
          amount: "89.00",
          collectionDate: new Date("2026-09-25T16:45:00Z"),
        },
      ])
      console.log("[OK] Canonical Delivery Collections seeded")
    }

    const existingDeliveryPayoutsCount = await db.select({ val: count() }).from(schema.deliveryPayouts)
    if (Number(existingDeliveryPayoutsCount[0]?.val || 0) === 0) {
      await db.insert(schema.deliveryPayouts).values([
        {
          deliveryBoyId: 1,
          deliveryBoyName: "Tariqul Islam",
          amount: "400.00",
          paymentMethod: "bKash Agent",
          txnCode: "BK7710294",
          notes: "Fortnight commission settlement",
          paymentDate: new Date("2026-09-20T12:00:00Z"),
        },
        {
          deliveryBoyId: 2,
          deliveryBoyName: "Mohammad Fahim",
          amount: "600.00",
          paymentMethod: "Bank Transfer",
          txnCode: "CITY-REF-8841",
          notes: "Monthly base settlement",
          paymentDate: new Date("2026-09-21T14:30:00Z"),
        },
      ])
      console.log("[OK] Canonical Delivery Payouts seeded")
    }

    const existingDeliveryCancelsCount = await db.select({ val: count() }).from(schema.deliveryCancelRequests)
    if (Number(existingDeliveryCancelsCount[0]?.val || 0) === 0) {
      await db.insert(schema.deliveryCancelRequests).values([
        {
          deliveryBoyId: 1,
          deliveryBoyName: "Tariqul Islam",
          orderCode: "ORD-202609-0994",
          reason: "Recipient phone switched off for 3 consecutive delivery attempts at specified address.",
          status: "pending",
          createdAt: new Date("2026-09-23T18:00:00Z"),
        },
        {
          deliveryBoyId: 2,
          deliveryBoyName: "Mohammad Fahim",
          orderCode: "ORD-202609-0988",
          reason: "Customer moved to another city before delivery window.",
          status: "approved",
          createdAt: new Date("2026-09-22T10:30:00Z"),
        },
      ])
      console.log("[OK] Canonical Delivery Cancel Requests seeded")
    }

    // 18. Seed Reports Tables (user_searches, commission_histories, ai_token_logs)
    const existingSearchesCount = await db.select({ val: count() }).from(schema.userSearches)
    if (Number(existingSearchesCount[0]?.val || 0) === 0) {
      await db.insert(schema.userSearches).values([
        { query: "iPhone 15 Pro Max", count: 482 },
        { query: "Samsung Galaxy S24 Ultra", count: 329 },
        { query: "Wireless Bluetooth Earbuds", count: 274 },
        { query: "Smartwatch AMOLED Display", count: 215 },
        { query: "Mechanical Gaming Keyboard RGB", count: 184 },
        { query: "USB-C Fast Charger 65W GaN", count: 142 },
        { query: "Noise Cancelling Headphones", count: 118 },
        { query: "Power Bank 20000mAh", count: 96 },
        { query: "Men Casual Cotton Shirt", count: 78 },
        { query: "Leather Formal Wallet & Belt", count: 64 },
      ])
      console.log("[OK] Canonical User Searches seeded")
    }

    const existingCommissionsCount = await db.select({ val: count() }).from(schema.commissionHistories)
    if (Number(existingCommissionsCount[0]?.val || 0) === 0) {
      await db.insert(schema.commissionHistories).values([
        {
          orderId: 1,
          orderCode: "ORD-202609-0891",
          sellerId: "usr_seller_demo",
          sellerName: "TechZone Official",
          adminCommission: "45.00",
          sellerEarning: "405.00",
          orderFrom: "web",
          createdAt: new Date("2026-09-25T15:30:00Z"),
        },
        {
          orderId: 2,
          orderCode: "ORD-202609-0895",
          sellerId: "usr_seller_demo_2",
          sellerName: "Electro Gadgets Hub",
          adminCommission: "12.00",
          sellerEarning: "108.00",
          orderFrom: "web",
          createdAt: new Date("2026-09-25T12:10:00Z"),
        },
        {
          orderId: 3,
          orderCode: "ORD-202609-0902",
          sellerId: "usr_seller_demo",
          sellerName: "Fashion Fusion BD",
          adminCommission: "10.20",
          sellerEarning: "74.80",
          orderFrom: "pos",
          createdAt: new Date("2026-09-24T18:45:00Z"),
        },
        {
          orderId: 4,
          orderCode: "ORD-202609-0915",
          sellerId: "usr_seller_demo_2",
          sellerName: "TechZone Official",
          adminCommission: "78.00",
          sellerEarning: "702.00",
          orderFrom: "web",
          createdAt: new Date("2026-09-24T10:15:00Z"),
        },
        {
          orderId: 5,
          orderCode: "ORD-202609-0922",
          sellerId: "usr_seller_demo",
          sellerName: "Smart Accessories",
          adminCommission: "18.50",
          sellerEarning: "166.50",
          orderFrom: "web",
          createdAt: new Date("2026-09-23T14:20:00Z"),
        },
      ])
      console.log("[OK] Canonical Commission Histories seeded")
    }

    const existingAiLogsCount = await db.select({ val: count() }).from(schema.aiTokenLogs)
    if (Number(existingAiLogsCount[0]?.val || 0) === 0) {
      await db.insert(schema.aiTokenLogs).values([
        {
          userId: "usr_admin_demo",
          userName: "Admin Officer",
          feature: "Product Title & Description Generation",
          model: "gpt-4o",
          promptTokens: 420,
          completionTokens: 1000,
          totalTokens: 1420,
          costUsd: "0.0210",
          createdAt: new Date("2026-09-25T14:22:10Z"),
        },
        {
          userId: "usr_seller_demo",
          userName: "Rahim Chowdhury",
          feature: "SEO Meta Tags & Snippet Optimization",
          model: "gpt-4o-mini",
          promptTokens: 180,
          completionTokens: 400,
          totalTokens: 580,
          costUsd: "0.0030",
          createdAt: new Date("2026-09-25T11:15:45Z"),
        },
        {
          userId: "usr_admin_demo",
          userName: "Admin Officer",
          feature: "Customer Review Sentiment Extraction",
          model: "gpt-4o-mini",
          promptTokens: 350,
          completionTokens: 540,
          totalTokens: 890,
          costUsd: "0.0040",
          createdAt: new Date("2026-09-24T16:40:02Z"),
        },
        {
          userId: "usr_seller_demo_2",
          userName: "Tanvir Ahmed",
          feature: "Product Bulk Features Bullet Generator",
          model: "gpt-4o",
          promptTokens: 800,
          completionTokens: 2300,
          totalTokens: 3100,
          costUsd: "0.0460",
          createdAt: new Date("2026-09-24T09:12:30Z"),
        },
        {
          userId: "usr_admin_demo",
          userName: "Admin Officer",
          feature: "Marketing Email Copywriter",
          model: "gpt-4o",
          promptTokens: 450,
          completionTokens: 980,
          totalTokens: 1430,
          costUsd: "0.0215",
          createdAt: new Date("2026-09-23T16:05:12Z"),
        },
      ])
      console.log("[OK] Canonical AI Token Logs seeded")
    }

    // 19. Seed Canonical Uploads
    const existingUploadsCount = await db.select({ val: count() }).from(schema.uploads)
    if (Number(existingUploadsCount[0]?.val || 0) === 0) {
      await db.insert(schema.uploads).values([
        {
          fileOriginalName: "iphone15-pro-max-banner.jpg",
          fileName: "/images/banners/banner1.jpg",
          userId: "usr_admin_demo",
          fileSize: 450200,
          extension: "jpg",
          type: "image",
          externalLink: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
        },
        {
          fileOriginalName: "samsung-galaxy-s24-ultra.png",
          fileName: "/images/products/s24-ultra.png",
          userId: "usr_admin_demo",
          fileSize: 320140,
          extension: "png",
          type: "image",
          externalLink: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
        },
        {
          fileOriginalName: "apple-watch-ultra-hero.jpg",
          fileName: "/images/products/apple-watch.jpg",
          userId: "usr_admin_demo",
          fileSize: 280900,
          extension: "jpg",
          type: "image",
          externalLink: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
        },
        {
          fileOriginalName: "sony-wh1000xm5-headphones.jpg",
          fileName: "/images/products/sony-headphones.jpg",
          userId: "usr_admin_demo",
          fileSize: 512000,
          extension: "jpg",
          type: "image",
          externalLink: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        },
        {
          fileOriginalName: "warranty_terms_and_policy.pdf",
          fileName: "/docs/warranty_terms.pdf",
          userId: "usr_admin_demo",
          fileSize: 1048576,
          extension: "pdf",
          type: "document",
          externalLink: null,
        },
      ])
      console.log("[OK] Canonical Uploads seeded")
    }

    // 25. Seed Canonical Support Tickets & Replies
    const existingTicketsCount = await db.select({ val: count() }).from(schema.tickets)
    if (Number(existingTicketsCount[0]?.val || 0) === 0) {
      const [t1] = await db.insert(schema.tickets).values({
        code: "100234",
        userId: "usr_customer_default_01",
        subject: "Delivery delay for Order #20260920-101122",
        details: "I placed an order 3 days ago and the delivery status has not updated yet. Please assist with courier tracking.",
        files: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"],
        status: "open",
        viewed: false,
        clientViewed: true,
      }).returning()

      if (t1) {
        await db.insert(schema.ticketReplies).values({
          ticketId: t1.id,
          userId: "usr_admin_default_01",
          reply: "Hello Tanvir! We apologize for the delay. The logistics rider picked up your parcel today and it is currently out for delivery.",
          files: [],
        })
      }

      const [t2] = await db.insert(schema.tickets).values({
        code: "100189",
        userId: "usr_customer_default_01",
        subject: "Inquiry regarding return policy on electronics",
        details: "Can I replace an earphone if the left earbud stops working within 7 days of purchase?",
        files: [],
        status: "solved",
        viewed: true,
        clientViewed: true,
      }).returning()

      if (t2) {
        await db.insert(schema.ticketReplies).values({
          ticketId: t2.id,
          userId: "usr_admin_default_01",
          reply: "Yes! All electronic accessories have a 7-day hassle-free replacement warranty. Please keep the original packaging and invoice intact.",
          files: ["/docs/warranty_terms.pdf"],
        })
      }

      await db.insert(schema.tickets).values([
        {
          code: "100412",
          userId: "usr_seller_default_01",
          subject: "Seller commission withdrawal inquiry",
          details: "My monthly withdrawal request of ৳45,000 has been submitted. When will the bank transfer be processed by the accounts team?",
          files: [],
          status: "pending",
          viewed: true,
          clientViewed: true,
        },
        {
          code: "100508",
          userId: "usr_customer_default_01",
          subject: "Wrong color received for Wireless Bluetooth Headphones",
          details: "I ordered the Matte Black version but received the Silver edition. Here is the invoice and photo of the received box.",
          files: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
          status: "open",
          viewed: false,
          clientViewed: true,
        },
      ])
      console.log("[OK] Canonical Support Tickets & Replies seeded")
    }

    // 26. Seed Canonical Blog Categories & Blogs
    const existingBlogCatsCount = await db.select({ val: count() }).from(schema.blogCategories)
    if (Number(existingBlogCatsCount[0]?.val || 0) === 0) {
      const [cat1, cat2, cat3, cat4] = await db
        .insert(schema.blogCategories)
        .values([
          { categoryName: "Fashion & Trends", slug: "fashion-trends" },
          { categoryName: "Technology & Gadgets", slug: "technology-gadgets" },
          { categoryName: "Lifestyle & Living", slug: "lifestyle-living" },
          { categoryName: "Shopping Tips", slug: "shopping-tips" },
        ])
        .returning()

      await db.insert(schema.blogs).values([
        {
          categoryId: cat2.id,
          title: "10 Essential Gadgets Every Remote Worker Needs in 2026",
          slug: "10-essential-gadgets-remote-worker-2026",
          shortDescription:
            "Discover the top productivity boosters and smart desktop accessories to elevate your daily home office experience.",
          description:
            "Working remotely has become the standard for modern professionals. Having the right tools and ergonomic peripherals not only enhances your daily workflow efficiency but also protects your physical well-being. From active noise-cancelling headphones to wireless charging stations and ultrawide monitors, here is our ultimate gear checklist for 2026.",
          banner: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&auto=format&fit=crop&q=80",
          status: true,
          metaTitle: "10 Essential Gadgets for Remote Work (2026)",
          metaImg: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
          metaDescription: "Boost your productivity with top home office and remote work accessories.",
          metaKeywords: "gadgets, remote work, home office, technology",
        },
        {
          categoryId: cat1.id,
          title: "The Ultimate Guide to Seasonal Fashion & Sustainable Fabrics",
          slug: "ultimate-guide-seasonal-fashion-sustainable-fabrics",
          shortDescription:
            "Explore eco-friendly wardrobe staples, organic cotton blends, and modern minimalist outfit styling.",
          description:
            "Sustainable fashion is more than a trend—it is a conscious choice towards enduring quality. In this article, our stylists break down the essential pieces you need for versatile seasonal layering, breathable pure cottons, and timeless colors that never go out of style.",
          banner: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
          status: true,
          metaTitle: "Seasonal Fashion & Sustainable Fabrics Guide",
          metaImg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
          metaDescription: "Tips and advice for choosing sustainable and eco-friendly outfits this season.",
          metaKeywords: "fashion, sustainable clothing, seasonal styles",
        },
        {
          categoryId: cat4.id,
          title: "How to Maximize Your Savings During Flash Sales and Festival Promos",
          slug: "how-to-maximize-savings-flash-sales",
          shortDescription:
            "Smart coupon stacking tricks, wallet cashbacks, and early-bird checkout tips to get the highest discounts.",
          description:
            "Online flash sales offer incredible price drops, but items go out of stock in minutes. Learn the best strategies: setting wishlist alerts, pre-filling shipping addresses, combining store vouchers with bank payment discounts, and collecting club points for extra savings.",
          banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
          status: true,
          metaTitle: "Maximize Savings in Flash Sales & Promotions",
          metaImg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
          metaDescription: "Proven shopping strategies to score the biggest savings on ecommerce sales.",
          metaKeywords: "flash sale, coupons, discount tips, smart shopping",
        },
        {
          categoryId: cat3.id,
          title: "The Modern Home: Minimalist Living and Smart Organization in 2026",
          slug: "modern-home-minimalist-living",
          shortDescription:
            "Declutter your living space and create a calm, functional home environment with smart interior design.",
          description:
            "Minimalist living is not about having less—it is about making room for what truly matters. Transform your home using neutral palettes, modular storage units, and ambient smart lighting to achieve a serene daily sanctuary.",
          banner: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
          status: true,
          metaTitle: "Minimalist Living & Modern Home Organization",
          metaImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
          metaDescription: "Discover tips to organize your modern home and embrace peaceful minimalist design.",
          metaKeywords: "interior design, minimalism, home organization, lifestyle",
        },
      ])
      console.log("[OK] Canonical Blog Categories & Blogs seeded")
    }

    // ─── Step 27: Ensure banned/is_suspicious columns exist on users ──────────
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS banned boolean NOT NULL DEFAULT false`)
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspicious boolean NOT NULL DEFAULT false`)
    console.log("[OK] Step 27: users.banned + users.is_suspicious columns ensured")

    // ─── Step 28: Canonical Customer Packages ─────────────────────────────────
    const pkgCount = await db.select({ c: count() }).from(schema.customerPackages)
    if (Number(pkgCount[0]?.c ?? 0) === 0) {
      await db.insert(schema.customerPackages).values([
        { name: "Free", amount: "0.00", productUpload: 3, logo: null, status: true },
        { name: "Basic", amount: "500.00", productUpload: 10, logo: null, status: true },
        { name: "Premium", amount: "1500.00", productUpload: 30, logo: null, status: true },
      ])
      console.log("[OK] Step 28: 3 canonical customer packages seeded")
    } else {
      console.log("[OK] Step 28: Customer packages already seeded — skipped")
    }

    // ─── Step 29: Canonical Wallet Recharges ──────────────────────────────────
    const walletRechargeCount = await db.select({ c: count() }).from(schema.wallets).where(eq(schema.wallets.offlinePayment, true))
    if (Number(walletRechargeCount[0]?.c ?? 0) === 0) {
      // Use first real user or skip gracefully
      const allUsers = await db.select({ id: schema.users.id }).from(schema.users).limit(3)
      if (allUsers.length > 0) {
        const uid0 = allUsers[0].id
        const uid1 = allUsers[1]?.id ?? uid0
        const uid2 = allUsers[2]?.id ?? uid0
        await db.insert(schema.wallets).values([
          { userId: uid0, amount: "5000.00", paymentMethod: "bKash", paymentDetails: "Sender: 01711-223344 | TrxID: BKH948271049", offlinePayment: true, approval: false, addedBy: "customer" },
          { userId: uid1, amount: "2500.00", paymentMethod: "Nagad", paymentDetails: "Sender: 01812-998877 | TrxID: NGD849201948", offlinePayment: true, approval: true, addedBy: "customer" },
          { userId: uid2, amount: "10000.00", paymentMethod: "Bank Transfer", paymentDetails: "Branch: Gulshan | Slip: 84920 | TrxID: CBL-849201", offlinePayment: true, approval: false, addedBy: "customer" },
          { userId: uid0, amount: "1500.00", paymentMethod: "Admin Credit", paymentDetails: "Admin adjustment", offlinePayment: true, approval: true, addedBy: "admin" },
          { userId: uid1, amount: "3000.00", paymentMethod: "bKash", paymentDetails: "Sender: 01900-112233 | TrxID: BKH128374650", offlinePayment: true, approval: false, addedBy: "customer" },
        ])
        console.log("[OK] Step 29: 5 canonical wallet offline recharge requests seeded")
      } else {
        console.log("[SKIP] Step 29: No users found — wallet recharges skipped")
      }
    } else {
      console.log("[OK] Step 29: Wallet recharges already seeded — skipped")
    }

    // ─── Step 30: Canonical Staff Roles & Staffs ──────────────────────────────
    const roleCount = await db.select({ c: count() }).from(schema.staffRoles)
    if (Number(roleCount[0]?.c ?? 0) === 0) {
      await db.insert(schema.staffRoles).values([
        {
          name: "Super Admin",
          permissions: [
            "manage_products",
            "manage_orders",
            "manage_sellers",
            "manage_refunds",
            "manage_customers",
            "manage_marketing",
            "manage_reports",
            "manage_settings",
            "manage_staffs",
          ],
        },
        {
          name: "Order & Logistics Manager",
          permissions: ["manage_orders", "manage_refunds", "track_couriers"],
        },
        {
          name: "Customer Support Specialist",
          permissions: ["manage_support_tickets", "conversations", "reviews"],
        },
        {
          name: "Product & Catalog Editor",
          permissions: ["manage_products", "manage_categories", "manage_brands", "manage_attributes"],
        },
      ])
      console.log("[OK] Step 30a: 4 canonical staff roles seeded")
    } else {
      console.log("[OK] Step 30a: Staff roles already seeded — skipped")
    }

    const staffCount = await db.select({ c: count() }).from(schema.staffs)
    if (Number(staffCount[0]?.c ?? 0) === 0) {
      const existingRoles = await db.select().from(schema.staffRoles).limit(4)
      const r1 = existingRoles.find((r) => r.name === "Super Admin") || existingRoles[0]
      const r2 = existingRoles.find((r) => r.name === "Customer Support Specialist") || existingRoles[1] || r1
      const r3 = existingRoles.find((r) => r.name === "Order & Logistics Manager") || existingRoles[2] || r1

      await db.insert(schema.staffs).values([
        {
          name: "Mahmud Hasan",
          email: "mahmud.admin@huipper.com",
          phone: "+880 1711-223344",
          roleId: r1.id,
          roleName: r1.name,
          isActive: true,
        },
        {
          name: "Farhana Akter",
          email: "farhana.support@huipper.com",
          phone: "+880 1812-998877",
          roleId: r2.id,
          roleName: r2.name,
          isActive: true,
        },
        {
          name: "Kamrul Islam",
          email: "kamrul.ops@huipper.com",
          phone: "+880 1913-445566",
          roleId: r3.id,
          roleName: r3.name,
          isActive: true,
        },
      ])
      console.log("[OK] Step 30b: 3 canonical staff accounts seeded")
    } else {
      console.log("[OK] Step 30b: Staff accounts already seeded — skipped")
    }

    // ─── Step 31: Canonical SMS Templates & OTP Settings ──────────────────────
    const templateCount = await db.select({ c: count() }).from(schema.smsTemplates)
    if (Number(templateCount[0]?.c ?? 0) === 0) {
      await db.insert(schema.smsTemplates).values([
        {
          identifier: "phone_verification_otp",
          title: "Phone Verification OTP Code",
          body: "Your verification code is [[otp_code]]. Valid for 5 minutes. Do not share this PIN with anyone - [[site_name]].",
          variables: ["[[otp_code]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "order_placed",
          title: "Order Placed Successfully",
          body: "Dear [[customer_name]], your order [[order_code]] has been received. Total: [[total_amount]]. Thank you for shopping with [[site_name]]!",
          variables: ["[[customer_name]]", "[[order_code]]", "[[total_amount]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "order_confirmed",
          title: "Order Confirmed & Processing",
          body: "Hello [[customer_name]], your order [[order_code]] is confirmed and packed for courier dispatch by [[site_name]].",
          variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "order_picked_up",
          title: "Order Picked Up by Delivery Boy",
          body: "Dear [[customer_name]], order [[order_code]] has been picked up by delivery personnel [[delivery_boy_name]].",
          variables: ["[[customer_name]]", "[[order_code]]", "[[delivery_boy_name]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "order_on_the_way",
          title: "Order On The Way",
          body: "Dear [[customer_name]], your order [[order_code]] is out for delivery. Rider: [[delivery_boy_name]] (Phone: [[delivery_boy_phone]]).",
          variables: ["[[customer_name]]", "[[order_code]]", "[[delivery_boy_name]]", "[[delivery_boy_phone]]"],
          status: true,
        },
        {
          identifier: "order_shipped",
          title: "Order Shipped with Tracking",
          body: "Your order [[order_code]] has been handed over to [[courier_name]] (Tracking: [[tracking_code]]). Track online at [[site_url]].",
          variables: ["[[customer_name]]", "[[order_code]]", "[[courier_name]]", "[[tracking_code]]", "[[site_url]]"],
          status: true,
        },
        {
          identifier: "delivery_completed",
          title: "Order Delivered Successfully",
          body: "Order [[order_code]] has been delivered successfully. We appreciate your purchase with [[site_name]]!",
          variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "order_cancelled",
          title: "Order Cancelled Notification",
          body: "Dear [[customer_name]], your order [[order_code]] has been cancelled. Please visit [[site_url]] for more details.",
          variables: ["[[customer_name]]", "[[order_code]]", "[[site_name]]", "[[site_url]]"],
          status: true,
        },
        {
          identifier: "order_paid",
          title: "Order Payment Received",
          body: "Payment of [[amount]] for order [[order_code]] received successfully. Thank you - [[site_name]].",
          variables: ["[[customer_name]]", "[[order_code]]", "[[amount]]", "[[site_name]]"],
          status: true,
        },
        {
          identifier: "assign_delivery_boy",
          title: "Delivery Boy Assignment",
          body: "New delivery assigned: Order [[order_code]]. Pickup and deliver promptly - [[site_name]].",
          variables: ["[[order_code]]", "[[delivery_boy_name]]", "[[site_name]]"],
          status: true,
        },
      ])
      console.log("[OK] Step 31: 10 canonical SMS notification templates seeded")
    } else {
      console.log("[OK] Step 31: SMS templates already seeded — skipped")
    }

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
