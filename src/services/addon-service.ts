import { db } from "../db"
import { addons, type AddonRecord } from "../db/schema/addons"
import { eq, asc, inArray } from "drizzle-orm"
import { notFound } from "next/navigation"
import type { AddonItem, AvailableAddonItem, InstallAddonPayload } from "@/types/addon"
export type { AddonItem, AvailableAddonItem, InstallAddonPayload } from "@/types/addon"

export const OFFICIAL_AVAILABLE_ADDONS: AvailableAddonItem[] = [
  {
    id: "pos_system",
    name: "POS (Point of Sale) System",
    image: "https://images.unsplash.com/photo-1556742049-0a67e5572248?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Complete in-store checkout terminal with barcode scanner, receipt printing, and live stock sync.",
    price: 49,
    link: "https://activeitzone.com/addons/public/pos",
    purchase: "https://codecanyon.net/item/active-ecommerce-pos-manager-addon/29521345",
  },
  {
    id: "otp_system",
    name: "OTP & SMS Notification System",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Mobile number authentication via Twilio, Fast2SMS, Nexmo, and automated SMS order alerts.",
    price: 39,
    link: "https://activeitzone.com/addons/public/otp",
    purchase: "https://codecanyon.net/item/active-ecommerce-otp-addon/28731327",
  },
  {
    id: "club_points",
    name: "Club Point Loyalty System",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Reward shoppers with points for purchases, exchangeable for wallet money and coupon vouchers.",
    price: 29,
    link: "https://activeitzone.com/addons/public/club-point",
    purchase: "https://codecanyon.net/item/active-ecommerce-club-point-system/28825732",
  },
  {
    id: "wholesale_system",
    name: "Wholesale Tiered Pricing",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Multi-tier bulk discount price brackets based on minimum order quantities.",
    price: 29,
    link: "https://activeitzone.com/addons/public/wholesale",
    purchase: "https://codecanyon.net/item/active-ecommerce-wholesale-b2b-addon/30588691",
  },
  {
    id: "auction_system",
    name: "Auction & Bidding System",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Real-time competitive bidding countdown lots for luxury goods and rare merchandise.",
    price: 39,
    link: "https://activeitzone.com/addons/public/auction",
    purchase: "https://codecanyon.net/item/active-ecommerce-auction-addon/34469274",
  },
  {
    id: "delivery_boy_system",
    name: "Delivery Boy Management",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Dedicated courier dispatch portal with COD collections, zone assignments, and commission payouts.",
    price: 39,
    link: "https://activeitzone.com/addons/public/delivery-boy",
    purchase: "https://codecanyon.net/item/active-ecommerce-delivery-boy-addon/31720896",
  },
  {
    id: "affiliate_system",
    name: "Affiliate Partner Program",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Multi-tier influencer referral links, cookie attribution tracking, and automated payout requests.",
    price: 29,
    link: "https://activeitzone.com/addons/public/affiliate",
    purchase: "https://codecanyon.net/item/active-ecommerce-affiliate-system-addon/30743603",
  },
  {
    id: "refund_system",
    name: "Refund & Return Management",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Buyer dispute desk with return reason workflows and automated wallet credits.",
    price: 25,
    link: "https://activeitzone.com/addons/public/refund",
    purchase: "https://codecanyon.net/item/active-ecommerce-refund-system-addon/29088612",
  },
  {
    id: "offline_payments",
    name: "Manual & Offline Payments",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Support manual bank transfers, bKash, Nagad, and cheque receipts with admin verification.",
    price: 29,
    link: "https://activeitzone.com/addons/public/offline-payment",
    purchase: "https://codecanyon.net/item/active-ecommerce-offline-payment-addon/28994770",
  },
  {
    id: "preorder_system",
    name: "Pre-Order System",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Accept partial deposits or full pre-orders on unreleased and scheduled batch products.",
    price: 35,
    link: "https://activeitzone.com/addons/public/pre-order",
    purchase: "https://codecanyon.net/item/active-ecommerce-preorder-system-addon/45499292",
  },
  {
    id: "flutter_app",
    name: "Flutter Mobile eCommerce App",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Native iOS and Android Flutter app connected to your Active eCommerce store in real time.",
    price: 59,
    link: "https://activeitzone.com/addons/public/flutter-app",
    purchase: "https://codecanyon.net/item/active-ecommerce-flutter-app/30113247",
  },
  {
    id: "seller_app",
    name: "Seller / Vendor Mobile App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
    rating: 5,
    shortDescription: "Dedicated mobile store management portal for multi-vendor merchants to manage products and orders.",
    price: 39,
    link: "https://activeitzone.com/addons/public/seller-app",
    purchase: "https://codecanyon.net/item/active-ecommerce-flutter-seller-app/36049281",
  },
]

export async function getAddons(): Promise<AddonItem[]> {
  try {
    const rows = await db.select().from(addons).orderBy(asc(addons.id))
    return rows.map((r: AddonRecord) => ({
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
  } catch (err) {
    console.error("getAddons error:", err)
    return []
  }
}

export async function toggleAddonActivation(id: number, activated: boolean): Promise<boolean> {
  try {
    await db
      .update(addons)
      .set({ activated, updatedAt: new Date() })
      .where(eq(addons.id, id))
    return true
  } catch (err) {
    console.error("toggleAddonActivation error:", err)
    return false
  }
}

const ADDON_ALIASES: Record<string, string[]> = {
  auction: ["auction", "auction_system"],
  auction_system: ["auction", "auction_system"],
  wholesale: ["wholesale", "wholesale_system"],
  wholesale_system: ["wholesale", "wholesale_system"],
  pos: ["pos", "pos_system"],
  pos_system: ["pos", "pos_system"],
  club_point: ["club_point", "club_points"],
  club_points: ["club_point", "club_points"],
  otp: ["otp", "otp_system"],
  otp_system: ["otp", "otp_system"],
  affiliate: ["affiliate", "affiliate_system"],
  affiliate_system: ["affiliate", "affiliate_system"],
  delivery_boy: ["delivery_boy", "delivery_boy_system"],
  delivery_boy_system: ["delivery_boy", "delivery_boy_system"],
  refund_request: ["refund_request", "refund_system"],
  refund_system: ["refund_request", "refund_system"],
  offline_payment: ["offline_payment", "offline_payments"],
  offline_payments: ["offline_payment", "offline_payments"],
  preorder: ["preorder", "preorder_system"],
  preorder_system: ["preorder", "preorder_system"],
}

export async function isAddonActivated(uniqueIdentifier: string): Promise<boolean> {
  const normalized = uniqueIdentifier.toLowerCase().trim()
  const candidates = ADDON_ALIASES[normalized] || [
    normalized,
    `${normalized}_system`,
    normalized.replace(/_system$/, ""),
  ]

  try {
    const rows = await db
      .select({ activated: addons.activated })
      .from(addons)
      .where(inArray(addons.uniqueIdentifier, candidates))
      .limit(1)

    if (rows.length > 0) {
      return Boolean(rows[0].activated)
    }
  } catch (err) {
    console.error("isAddonActivated error:", err)
  }
  return false
}

export async function ensureAddonActivated(uniqueIdentifier: string): Promise<void> {
  const activated = await isAddonActivated(uniqueIdentifier)
  if (!activated) {
    notFound()
  }
}

export async function installAddon(data: InstallAddonPayload): Promise<AddonItem> {
  try {
    const version = data.version || "1.0"
    const [created] = await db
      .insert(addons)
      .values({
        name: data.name,
        uniqueIdentifier: data.uniqueIdentifier,
        version,
        description: data.description || "Active eCommerce Addon Extension",
        image: data.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
        purchaseCode: data.purchaseCode,
        activated: true,
      })
      .onConflictDoUpdate({
        target: addons.uniqueIdentifier,
        set: {
          name: data.name,
          version,
          purchaseCode: data.purchaseCode,
          updatedAt: new Date(),
        },
      })
      .returning()

    return {
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
  } catch (err) {
    console.error("installAddon error:", err)
    throw err
  }
}

export async function getAvailableAddons(): Promise<AvailableAddonItem[]> {
  return OFFICIAL_AVAILABLE_ADDONS
}
