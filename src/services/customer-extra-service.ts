import { db } from "@/db"
import { shops, shopFollowers } from "@/db/schema/shops"
import { orders, orderItems, customerAddresses } from "@/db/schema/orders"
import { products } from "@/db/schema/products"
import { wishlists } from "@/db/schema/customer"
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

export interface WishlistProductItem {
  id: number
  productId: number
  name: string
  slug: string
  price: number
  thumbnail: string
  createdAt: string
}

export async function getUserWishlistProducts(userId: string): Promise<WishlistProductItem[]> {
  try {
    if (!userId) return []

    const rows = await db
      .select({
        id: wishlists.id,
        productId: products.id,
        name: products.name,
        slug: products.slug,
        price: products.unitPrice,
        thumbnail: products.thumbnailImg,
        createdAt: wishlists.createdAt,
      })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt))

    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      name: r.name,
      slug: r.slug,
      price: Number(r.price) || 0,
      thumbnail: r.thumbnail || "/assets/img/placeholder.jpg",
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }))
  } catch (err) {
    console.warn("getUserWishlistProducts fallback:", err)
    return []
  }
}

export async function toggleWishlistProduct(
  userId: string,
  productId: number
): Promise<{ added: boolean }> {
  try {
    const existing = await db
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
      .limit(1)

    if (existing.length > 0) {
      await db.delete(wishlists).where(eq(wishlists.id, existing[0].id))
      return { added: false }
    } else {
      await db.insert(wishlists).values({ userId, productId })
      return { added: true }
    }
  } catch (err) {
    console.error("toggleWishlistProduct error:", err)
    return { added: false }
  }
}

export interface CustomerAddressItem {
  id: number
  userId: string
  address: string
  country: string
  city: string | null
  state: string | null
  postalCode: string | null
  phone: string | null
  setDefault: boolean
}

export async function getCustomerAddresses(userId: string): Promise<CustomerAddressItem[]> {
  try {
    if (!userId) return []
    const rows = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.userId, userId))
      .orderBy(desc(customerAddresses.setDefault), desc(customerAddresses.id))

    return rows.map((r) => ({
      id: r.id,
      userId: r.userId || "",
      address: r.address,
      country: r.country,
      city: r.city,
      state: r.state,
      postalCode: r.postalCode,
      phone: r.phone,
      setDefault: r.setDefault,
    }))
  } catch (err) {
    console.warn("getCustomerAddresses fallback:", err)
    return []
  }
}

export async function getDefaultShippingAddress(userId: string): Promise<CustomerAddressItem | null> {
  try {
    const list = await getCustomerAddresses(userId)
    return list.find((a) => a.setDefault) || list[0] || null
  } catch {
    return null
  }
}

export async function addCustomerAddress(data: {
  userId: string
  address: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
  setDefault?: boolean
}): Promise<CustomerAddressItem | null> {
  try {
    if (data.setDefault) {
      await db
        .update(customerAddresses)
        .set({ setDefault: false })
        .where(eq(customerAddresses.userId, data.userId))
    }
    const [inserted] = await db
      .insert(customerAddresses)
      .values({
        userId: data.userId,
        address: data.address,
        country: data.country || "Bangladesh",
        city: data.city || "Dhaka",
        state: data.state || "",
        postalCode: data.postalCode || "",
        phone: data.phone || "",
        setDefault: data.setDefault ?? true,
      })
      .returning()
    return inserted
      ? {
          id: inserted.id,
          userId: inserted.userId || "",
          address: inserted.address,
          country: inserted.country,
          city: inserted.city,
          state: inserted.state,
          postalCode: inserted.postalCode,
          phone: inserted.phone,
          setDefault: inserted.setDefault,
        }
      : null
  } catch (err) {
    console.error("addCustomerAddress error:", err)
    return null
  }
}

