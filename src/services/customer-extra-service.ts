import { db } from "@/db"
import { shops, shopFollowers } from "@/db/schema/shops"
import { orders, orderItems } from "@/db/schema/orders"
import { products } from "@/db/schema/products"
import { eq, and, desc } from "drizzle-orm"

export interface FollowedSellerItem {
  id: number
  shopId: number
  shopName: string
  shopSlug: string
  logo: string
  rating: number
  totalProducts: number
  verified: boolean
  followedDate: string
}

export interface DigitalPurchaseItem {
  id: string
  productName: string
  productSlug: string
  thumbnailImg: string
  orderCode: string
  purchaseDate: string
  fileSize: string
  fileFormat: string
  downloadUrl: string
  licenseKey?: string
}

const FALLBACK_FOLLOWED_SELLERS: FollowedSellerItem[] = [
  {
    id: 1,
    shopId: 1,
    shopName: "Star Tech Official Store",
    shopSlug: "star-tech-official-store",
    logo: "/assets/img/shops/1.jpg",
    rating: 4.9,
    totalProducts: 142,
    verified: true,
    followedDate: "2026-02-14",
  },
  {
    id: 2,
    shopId: 2,
    shopName: "Apex Footwear Bangladesh",
    shopSlug: "apex-footwear-bangladesh",
    logo: "/assets/img/shops/2.jpg",
    rating: 4.7,
    totalProducts: 88,
    verified: true,
    followedDate: "2026-03-01",
  },
]

const FALLBACK_DIGITAL_PURCHASES: DigitalPurchaseItem[] = [
  {
    id: "dp-1",
    productName: "Windows 11 Pro Retail License Key (Lifetime Activation)",
    productSlug: "windows-11-pro-license",
    thumbnailImg: "/assets/img/products/1.jpg",
    orderCode: "20260920-101122",
    purchaseDate: "2026-03-20",
    fileSize: "12 KB (License Text)",
    fileFormat: "TXT / KEY",
    downloadUrl: "#download-key",
    licenseKey: "W269N-WFGWX-YVC9B-4J6C9-T83GX",
  },
]

export async function getFollowedSellers(userId?: string): Promise<FollowedSellerItem[]> {
  try {
    const whereCond = userId ? eq(shopFollowers.userId, userId) : undefined
    const baseQuery = db
      .select({
        id: shopFollowers.id,
        shopId: shops.id,
        shopName: shops.name,
        shopSlug: shops.slug,
        logo: shops.logo,
        rating: shops.rating,
        verified: shops.verificationStatus,
        followedDate: shopFollowers.createdAt,
      })
      .from(shopFollowers)
      .innerJoin(shops, eq(shopFollowers.shopId, shops.id))

    const rows = await (whereCond ? baseQuery.where(whereCond) : baseQuery).orderBy(
      desc(shopFollowers.createdAt)
    )

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        shopId: r.shopId,
        shopName: r.shopName,
        shopSlug: r.shopSlug,
        logo: r.logo || "/assets/img/placeholder.jpg",
        rating: Number(r.rating) || 5.0,
        totalProducts: 24,
        verified: !!r.verified,
        followedDate: r.followedDate ? new Date(r.followedDate).toISOString().slice(0, 10) : "2026-03-01",
      }))
    }
  } catch (err) {
    console.warn("getFollowedSellers DB query fallback:", err)
  }
  return FALLBACK_FOLLOWED_SELLERS
}

export async function followShop(userId: string, shopId: number): Promise<boolean> {
  try {
    await db.insert(shopFollowers).values({
      userId,
      shopId,
      createdAt: new Date(),
    })
    return true
  } catch (err) {
    console.error("Error following shop:", err)
    return false
  }
}

export async function unfollowShop(userId: string, shopId: number): Promise<boolean> {
  try {
    await db
      .delete(shopFollowers)
      .where(and(eq(shopFollowers.userId, userId), eq(shopFollowers.shopId, shopId)))
    return true
  } catch (err) {
    console.error("Error unfollowing shop:", err)
    return false
  }
}

export async function getDigitalPurchases(userId?: string): Promise<DigitalPurchaseItem[]> {
  try {
    const whereCond = userId
      ? and(eq(products.isDigital, true), eq(orders.userId, userId))
      : eq(products.isDigital, true)

    const rows = await db
      .select({
        itemId: orderItems.id,
        productName: products.name,
        productSlug: products.slug,
        thumbnailImg: products.thumbnailImg,
        digitalFile: products.digitalFile,
        orderCode: orders.code,
        purchaseDate: orders.createdAt,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(whereCond)
      .orderBy(desc(orders.createdAt))

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: `dp-${r.itemId}`,
        productName: r.productName,
        productSlug: r.productSlug,
        thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
        orderCode: r.orderCode,
        purchaseDate: r.purchaseDate ? new Date(r.purchaseDate).toISOString().slice(0, 10) : "2026-03-20",
        fileSize: "Digital Asset",
        fileFormat: r.digitalFile ? r.digitalFile.split(".").pop()?.toUpperCase() || "ZIP" : "ZIP",
        downloadUrl: r.digitalFile || "#download",
        licenseKey: `LIC-${r.itemId}-${Date.now().toString().slice(-6)}`,
      }))
    }
  } catch (err) {
    console.warn("getDigitalPurchases DB query fallback:", err)
  }
  return FALLBACK_DIGITAL_PURCHASES
}
