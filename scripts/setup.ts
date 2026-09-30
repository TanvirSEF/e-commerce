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
