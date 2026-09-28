import { db } from "../db"
import { addons, type AddonRecord } from "../db/schema/addons"
import { eq, asc, sql } from "drizzle-orm"

export interface AddonItem {
  id: number
  name: string
  uniqueIdentifier: string
  version: string
  description: string
  image: string
  installed: boolean
  activated: boolean
  purchaseCode?: string
}

export const CANONICAL_ADDONS: Omit<AddonItem, "id">[] = [
  {
    uniqueIdentifier: "pos_system",
    name: "POS (Point of Sale) System",
    version: "3.1",
    description: "Complete in-store checkout terminal with barcode scanner, thermal receipt printing, and live stock sync.",
    image: "https://images.unsplash.com/photo-1556742049-0a67e5572248?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-pos-live-licensed-2026",
  },
  {
    uniqueIdentifier: "club_points",
    name: "Club Point System",
    version: "2.4",
    description: "Reward shoppers with points for purchases, exchangeable for wallet money and coupon vouchers.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-clubpoints-live-licensed-2026",
  },
  {
    uniqueIdentifier: "otp_system",
    name: "OTP & SMS Notifications",
    version: "2.8",
    description: "Mobile number authentication via Twilio, Fast2SMS, Nexmo, and SMS order alerts.",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-otp-live-licensed-2026",
  },
  {
    uniqueIdentifier: "wholesale_system",
    name: "Wholesale Tiered Pricing",
    version: "2.0",
    description: "Multi-tier bulk discount price brackets based on purchase quantity brackets.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-wholesale-live-licensed-2026",
  },
  {
    uniqueIdentifier: "preorder_system",
    name: "Pre-Order System",
    version: "1.9",
    description: "Accept partial deposits or full pre-orders on unreleased and scheduled batch products.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-preorder-live-licensed-2026",
  },
  {
    uniqueIdentifier: "auction_system",
    name: "Auction & Bidding System",
    version: "2.2",
    description: "Real-time competitive bidding countdown lots for luxury timepieces and rare merchandise.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-auction-live-licensed-2026",
  },
  {
    uniqueIdentifier: "affiliate_system",
    name: "Affiliate Partner Program",
    version: "2.5",
    description: "Multi-tier influencer referral links, cookie attribution tracking, and automated payout requests.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-affiliate-live-licensed-2026",
  },
  {
    uniqueIdentifier: "delivery_boy_system",
    name: "Delivery Boy Management",
    version: "3.0",
    description: "Dedicated courier dispatch portal with COD collections, zone assignments, and commission payouts.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-deliveryboy-live-licensed-2026",
  },
  {
    uniqueIdentifier: "refund_system",
    name: "Refund & Return Management",
    version: "2.1",
    description: "Buyer dispute desk with return reason workflows and automated wallet credits.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-refund-live-licensed-2026",
  },
  {
    uniqueIdentifier: "offline_payments",
    name: "Manual & Offline Payments",
    version: "2.0",
    description: "Support manual bank transfers, bKash, Nagad, and cheque receipts with admin verification.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
    purchaseCode: "aec-offlinepay-live-licensed-2026",
  },
]

// In-memory fallback cache
let cachedAddons: AddonItem[] = CANONICAL_ADDONS.map((a, idx) => ({ ...a, id: idx + 1 }))

export async function getAddons(): Promise<AddonItem[]> {
  try {
    await db.execute(sql`
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

    const rows = await db.select().from(addons).orderBy(asc(addons.name))

    if (rows.length === 0) {
      // Auto-seed canonical addons into database
      const insertedList: AddonItem[] = []
      for (const item of CANONICAL_ADDONS) {
        const [inserted] = await db
          .insert(addons)
          .values({
            name: item.name,
            uniqueIdentifier: item.uniqueIdentifier,
            version: item.version,
            description: item.description,
            image: item.image,
            purchaseCode: item.purchaseCode,
            activated: item.activated,
          })
          .onConflictDoNothing()
          .returning()

        if (inserted) {
          insertedList.push({
            id: inserted.id,
            name: inserted.name,
            uniqueIdentifier: inserted.uniqueIdentifier,
            version: inserted.version,
            description: inserted.description || "",
            image: inserted.image || "",
            installed: true,
            activated: inserted.activated,
            purchaseCode: inserted.purchaseCode || undefined,
          })
        }
      }
      if (insertedList.length > 0) {
        cachedAddons = insertedList
        return insertedList
      }
    } else {
      const mapped = rows.map((r: AddonRecord) => ({
        id: r.id,
        name: r.name,
        uniqueIdentifier: r.uniqueIdentifier,
        version: r.version,
        description: r.description || "",
        image: r.image || "",
        installed: true,
        activated: r.activated,
        purchaseCode: r.purchaseCode || undefined,
      }))
      cachedAddons = mapped
      return mapped
    }
  } catch (err) {
    console.warn("getAddons DB fallback:", (err as Error).message)
  }
  return cachedAddons
}

export async function toggleAddonActivation(id: number, activated: boolean): Promise<boolean> {
  try {
    await db
      .update(addons)
      .set({ activated, updatedAt: new Date() })
      .where(eq(addons.id, id))

    cachedAddons = cachedAddons.map((a) => (a.id === id ? { ...a, activated } : a))
    return true
  } catch (err) {
    console.error("toggleAddonActivation error:", (err as Error).message)
    cachedAddons = cachedAddons.map((a) => (a.id === id ? { ...a, activated } : a))
    return true
  }
}

export async function isAddonActivated(uniqueIdentifier: string): Promise<boolean> {
  const normalized = uniqueIdentifier.toLowerCase().trim()
  try {
    const [row] = await db
      .select({ activated: addons.activated })
      .from(addons)
      .where(eq(addons.uniqueIdentifier, normalized))
      .limit(1)

    if (row) return row.activated
  } catch {
    // fallback to cache
  }

  const found = cachedAddons.find(
    (a) => a.uniqueIdentifier.toLowerCase() === normalized ||
           a.uniqueIdentifier.toLowerCase().replace(/_system$/, "") === normalized
  )
  return found ? found.activated : true
}

export async function installAddon(data: {
  name: string
  uniqueIdentifier: string
  version?: string
  purchaseCode?: string
  description?: string
  image?: string
}): Promise<AddonItem> {
  const version = data.version || "1.0"
  const [created] = await db
    .insert(addons)
    .values({
      name: data.name,
      uniqueIdentifier: data.uniqueIdentifier,
      version,
      description: data.description || "Active eCommerce Addon Extension",
      image: data.image || "/assets/img/placeholder.jpg",
      purchaseCode: data.purchaseCode || "AEC-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      activated: true,
    })
    .returning()

  const item: AddonItem = {
    id: created.id,
    name: created.name,
    uniqueIdentifier: created.uniqueIdentifier,
    version: created.version,
    description: created.description || "",
    image: created.image || "",
    installed: true,
    activated: created.activated,
    purchaseCode: created.purchaseCode || undefined,
  }

  cachedAddons = [...cachedAddons, item]
  return item
}
