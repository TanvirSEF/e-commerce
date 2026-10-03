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
  productId: number
  productName: string
  productSlug: string
  thumbnailImg: string
  orderCode: string
  purchaseDate: string
  fileSize?: string
  fileFormat?: string
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
    productId: 16,
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
    if (!userId) return []

    const rows = await db
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
      .where(eq(shopFollowers.userId, userId))
      .orderBy(desc(shopFollowers.createdAt))

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        shopId: r.shopId,
        shopName: r.shopName,
        shopSlug: r.shopSlug,
        logo: r.logo || "/assets/img/placeholder.jpg",
        rating: Number(r.rating) || 5.0,
        totalProducts: 14,
        verified: !!r.verified,
        followedDate: r.followedDate ? new Date(r.followedDate).toISOString().slice(0, 10) : "2026-03-01",
      }))
    }

    return []
  } catch (err) {
    console.warn("getFollowedSellers DB query fallback:", err)
    return []
  }
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
    if (!userId) return []

    const whereCond = and(
      eq(orders.userId, userId),
      eq(products.isDigital, true),
      eq(orders.paymentStatus, "paid")
    )

    const rows = await db
      .select({
        itemId: orderItems.id,
        productId: products.id,
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
        productId: r.productId,
        productName: r.productName,
        productSlug: r.productSlug,
        thumbnailImg: r.thumbnailImg || "/assets/img/placeholder.jpg",
        orderCode: r.orderCode,
        purchaseDate: r.purchaseDate
          ? new Date(r.purchaseDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        fileSize: "Digital Asset",
        fileFormat: r.digitalFile ? r.digitalFile.split(".").pop()?.toUpperCase() || "ZIP" : "ZIP",
        downloadUrl: `/api/digital-products/download/${r.productId}`,
        licenseKey: `LIC-${r.itemId}-${r.orderCode.slice(-6)}`,
      }))
    }

    return []
  } catch (err) {
    console.warn("getDigitalPurchases DB query failed:", err)
    return []
  }
}

export interface WishlistProductItem {
  id: number
  productId: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  discount?: number
  discountType?: string
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
        unitPrice: products.unitPrice,
        discount: products.discount,
        discountType: products.discountType,
        thumbnail: products.thumbnailImg,
        createdAt: wishlists.createdAt,
      })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt))

    return rows.map((r) => {
      const rawPrice = Number(r.unitPrice) || 0
      const discount = Number(r.discount) || 0
      let discountedPrice = rawPrice

      if (discount > 0) {
        if (r.discountType === "percent") {
          discountedPrice = rawPrice - (rawPrice * discount) / 100
        } else {
          discountedPrice = Math.max(0, rawPrice - discount)
        }
      }

      return {
        id: r.id,
        productId: r.productId,
        name: r.name,
        slug: r.slug,
        price: discountedPrice,
        originalPrice: discount > 0 ? rawPrice : undefined,
        discount,
        discountType: r.discountType || "percent",
        thumbnail: r.thumbnail || "/assets/img/placeholder.jpg",
        createdAt: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }
    })
  } catch (err) {
    console.warn("getUserWishlistProducts fallback:", err)
    return []
  }
}

export async function getUserWishlistProductIds(userId: string): Promise<string[]> {
  try {
    if (!userId) return []
    const rows = await db
      .select({ productId: wishlists.productId })
      .from(wishlists)
      .where(eq(wishlists.userId, userId))
    return rows.map((r) => String(r.productId))
  } catch (err) {
    console.warn("getUserWishlistProductIds fallback:", err)
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

export async function removeFromWishlist(
  userId: string,
  wishlistIdOrProductId: number
): Promise<boolean> {
  try {
    if (!userId) return false

    // Try deleting by wishlist id first
    const byId = await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.id, wishlistIdOrProductId)))
      .returning({ id: wishlists.id })

    if (byId.length > 0) return true

    // Otherwise try deleting by productId
    const byProduct = await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, wishlistIdOrProductId)))
      .returning({ id: wishlists.id })

    return byProduct.length > 0
  } catch (err) {
    console.error("removeFromWishlist error:", err)
    return false
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
  setBilling: boolean
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
      setDefault: Boolean(r.setDefault),
      setBilling: Boolean((r as any).setBilling),
    }))
  } catch (err) {
    console.warn("getCustomerAddresses error:", err)
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
  setBilling?: boolean
}): Promise<CustomerAddressItem | null> {
  try {
    if (!data.userId) return null

    if (data.setDefault) {
      await db
        .update(customerAddresses)
        .set({ setDefault: false })
        .where(eq(customerAddresses.userId, data.userId))
    }
    if (data.setBilling) {
      await db
        .update(customerAddresses)
        .set({ setBilling: false })
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
        setDefault: data.setDefault ?? false,
        setBilling: data.setBilling ?? false,
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
          setDefault: Boolean(inserted.setDefault),
          setBilling: Boolean((inserted as any).setBilling),
        }
      : null
  } catch (err) {
    console.error("addCustomerAddress error:", err)
    return null
  }
}

export async function updateCustomerAddress(data: {
  id: number
  userId: string
  address?: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  phone?: string
  setDefault?: boolean
  setBilling?: boolean
}): Promise<boolean> {
  try {
    if (!data.userId || !data.id) return false

    if (data.setDefault) {
      await db
        .update(customerAddresses)
        .set({ setDefault: false })
        .where(eq(customerAddresses.userId, data.userId))
    }
    if (data.setBilling) {
      await db
        .update(customerAddresses)
        .set({ setBilling: false })
        .where(eq(customerAddresses.userId, data.userId))
    }

    const updateObj: Record<string, any> = { updatedAt: new Date() }
    if (data.address !== undefined) updateObj.address = data.address
    if (data.country !== undefined) updateObj.country = data.country
    if (data.city !== undefined) updateObj.city = data.city
    if (data.state !== undefined) updateObj.state = data.state
    if (data.postalCode !== undefined) updateObj.postalCode = data.postalCode
    if (data.phone !== undefined) updateObj.phone = data.phone
    if (data.setDefault !== undefined) updateObj.setDefault = data.setDefault
    if (data.setBilling !== undefined) updateObj.setBilling = data.setBilling

    await db
      .update(customerAddresses)
      .set(updateObj)
      .where(and(eq(customerAddresses.id, data.id), eq(customerAddresses.userId, data.userId)))

    return true
  } catch (err) {
    console.error("updateCustomerAddress error:", err)
    return false
  }
}

export async function deleteCustomerAddress(id: number, userId: string): Promise<boolean> {
  try {
    if (!id || !userId) return false
    await db
      .delete(customerAddresses)
      .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    return true
  } catch (err) {
    console.error("deleteCustomerAddress error:", err)
    return false
  }
}

export async function setDefaultAddress(id: number, userId: string, type: "shipping" | "billing"): Promise<boolean> {
  try {
    if (!id || !userId) return false
    if (type === "shipping") {
      await db.update(customerAddresses).set({ setDefault: false }).where(eq(customerAddresses.userId, userId))
      await db.update(customerAddresses).set({ setDefault: true }).where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    } else {
      await db.update(customerAddresses).set({ setBilling: false }).where(eq(customerAddresses.userId, userId))
      await db.update(customerAddresses).set({ setBilling: true }).where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    }
    return true
  } catch (err) {
    console.error("setDefaultAddress error:", err)
    return false
  }
}

// ==========================================
// Customer Payment Information (Refund Payout)
// ==========================================

export interface CustomerPaymentInfoItem {
  id: number
  userId: string
  paymentType: "bank_transfer" | "bkash" | "nagad" | "others"
  bankName: string | null
  accountName: string
  accountNumber: string
  routingNumber: string | null
  paymentInstruction: string | null
  setDefault: boolean
}

export async function getCustomerPaymentInfos(userId: string): Promise<CustomerPaymentInfoItem[]> {
  try {
    if (!userId) return []
    const { customerPaymentInfos } = await import("@/db/schema/customer")
    const rows = await db
      .select()
      .from(customerPaymentInfos)
      .where(eq(customerPaymentInfos.userId, userId))
      .orderBy(desc(customerPaymentInfos.setDefault), desc(customerPaymentInfos.id))

    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      paymentType: (r.paymentType as any) || "others",
      bankName: r.bankName,
      accountName: r.accountName,
      accountNumber: r.accountNumber,
      routingNumber: r.routingNumber,
      paymentInstruction: r.paymentInstruction,
      setDefault: r.setDefault,
    }))
  } catch (err) {
    console.warn("getCustomerPaymentInfos error:", err)
    return []
  }
}

export async function addCustomerPaymentInfo(data: {
  userId: string
  paymentType: "bank_transfer" | "bkash" | "nagad" | "others"
  bankName?: string
  accountName: string
  accountNumber: string
  routingNumber?: string
  paymentInstruction?: string
  setDefault?: boolean
}): Promise<CustomerPaymentInfoItem | null> {
  try {
    if (!data.userId) return null
    const { customerPaymentInfos } = await import("@/db/schema/customer")

    if (data.setDefault) {
      await db
        .update(customerPaymentInfos)
        .set({ setDefault: false })
        .where(eq(customerPaymentInfos.userId, data.userId))
    }

    const [inserted] = await db
      .insert(customerPaymentInfos)
      .values({
        userId: data.userId,
        paymentType: data.paymentType,
        bankName: data.bankName || null,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber || null,
        paymentInstruction: data.paymentInstruction || null,
        setDefault: data.setDefault ?? false,
      })
      .returning()

    return inserted
      ? {
          id: inserted.id,
          userId: inserted.userId,
          paymentType: inserted.paymentType as any,
          bankName: inserted.bankName,
          accountName: inserted.accountName,
          accountNumber: inserted.accountNumber,
          routingNumber: inserted.routingNumber,
          paymentInstruction: inserted.paymentInstruction,
          setDefault: inserted.setDefault,
        }
      : null
  } catch (err) {
    console.error("addCustomerPaymentInfo error:", err)
    return null
  }
}

export async function deleteCustomerPaymentInfo(id: number, userId: string): Promise<boolean> {
  try {
    if (!id || !userId) return false
    const { customerPaymentInfos } = await import("@/db/schema/customer")
    await db
      .delete(customerPaymentInfos)
      .where(and(eq(customerPaymentInfos.id, id), eq(customerPaymentInfos.userId, userId)))
    return true
  } catch (err) {
    console.error("deleteCustomerPaymentInfo error:", err)
    return false
  }
}

export async function setDefaultPaymentInfo(id: number, userId: string): Promise<boolean> {
  try {
    if (!id || !userId) return false
    const { customerPaymentInfos } = await import("@/db/schema/customer")
    await db
      .update(customerPaymentInfos)
      .set({ setDefault: false })
      .where(eq(customerPaymentInfos.userId, userId))

    await db
      .update(customerPaymentInfos)
      .set({ setDefault: true })
      .where(and(eq(customerPaymentInfos.id, id), eq(customerPaymentInfos.userId, userId)))
    return true
  } catch (err) {
    console.error("setDefaultPaymentInfo error:", err)
    return false
  }
}

