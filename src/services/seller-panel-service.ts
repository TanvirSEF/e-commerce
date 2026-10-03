import { db } from "@/db"
import {
  shops,
  coupons,
  products,
  orders,
  orderItems,
  sellerWithdrawRequests,
  sellerPackages,
  sellerPackagePayments,
  customLabels,
  customerAddresses,
  reviews,
  users,
} from "@/db/schema"
import { and, desc, eq, or, sql, ilike } from "drizzle-orm"
import { getServerSession } from "@/lib/auth/session-helper"
import { getSellerCommissionSettings } from "@/services/settings-service"

export interface CurrentSeller {
  userId: string | null
  shopId: number
  shopSlug: string
  shopName: string
}

/** Resolves the logged-in seller's shop. Falls back to the first marketplace shop for unlinked demo accounts. */
export async function getCurrentSeller(): Promise<CurrentSeller | null> {
  const session = await getServerSession()
  const userId = session?.user?.id ?? null

  let shop: typeof shops.$inferSelect | undefined
  if (userId) {
    ;[shop] = await db.select().from(shops).where(eq(shops.userId, userId)).limit(1)
  }
  if (!shop) {
    ;[shop] = await db
      .select()
      .from(shops)
      .where(sql`${shops.slug} != 'inhouse-products'`)
      .orderBy(shops.id)
      .limit(1)
  }
  if (!shop) return null
  return { userId: userId ?? shop.userId, shopId: shop.id, shopSlug: shop.slug, shopName: shop.name }
}

/* ------------------------------ Coupons ------------------------------ */

export interface SellerCouponRow {
  id: number
  code: string
  type: string
  discount: number
  discountType: string
  minBuy: number
  maxDiscount: number
  startDate: number
  endDate: number
  status: boolean
}

export async function getSellerCoupons(userId: string | null): Promise<SellerCouponRow[]> {
  if (!userId) return []
  const rows = await db.select().from(coupons).where(eq(coupons.userId, userId)).orderBy(desc(coupons.createdAt))
  return rows.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    discount: Number(c.discount),
    discountType: c.discountType,
    minBuy: Number(c.details?.min_buy || 0),
    maxDiscount: Number(c.details?.max_discount || 0),
    startDate: c.startDate * 1000,
    endDate: c.endDate * 1000,
    status: c.status,
  }))
}

export async function createSellerCoupon(
  userId: string,
  data: {
    code: string
    type: "cart_base" | "product_base"
    discount: number
    discountType: "percent" | "amount"
    minBuy: number
    maxDiscount: number
    startDate: number
    endDate: number
  }
): Promise<{ success: boolean; error?: string }> {
  const code = data.code.trim().toUpperCase()
  if (!code) return { success: false, error: "Coupon code is required." }
  if (!(data.discount > 0)) return { success: false, error: "Discount must be greater than 0." }
  if (data.discountType === "percent" && data.discount > 100) {
    return { success: false, error: "Percentage discount cannot exceed 100%." }
  }
  if (data.endDate < data.startDate) return { success: false, error: "End date must be after start date." }

  const [dup] = await db.select({ id: coupons.id }).from(coupons).where(eq(coupons.code, code)).limit(1)
  if (dup) return { success: false, error: "Coupon code already exists." }

  await db.insert(coupons).values({
    userId,
    code,
    type: data.type,
    discount: String(data.discount),
    discountType: data.discountType,
    details: { min_buy: data.minBuy, max_discount: data.maxDiscount },
    startDate: Math.floor(data.startDate / 1000),
    endDate: Math.floor(data.endDate / 1000),
    status: true,
  })
  return { success: true }
}

export async function deleteSellerCoupon(userId: string, id: number): Promise<boolean> {
  const res = await db.delete(coupons).where(and(eq(coupons.id, id), eq(coupons.userId, userId))).returning({ id: coupons.id })
  return res.length > 0
}

export async function toggleSellerCoupon(userId: string, id: number, status: boolean): Promise<boolean> {
  const res = await db
    .update(coupons)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(coupons.id, id), eq(coupons.userId, userId)))
    .returning({ id: coupons.id })
  return res.length > 0
}

/* ------------------- Commission ledger & wallet balance ------------------- */

export interface CommissionLedgerRow {
  id: number
  orderCode: string
  orderTotal: number
  adminCommission: number
  sellerEarning: number
  commissionRate: number
  createdAt: string
}

async function getCommissionRate(): Promise<number> {
  const s = await getSellerCommissionSettings()
  return s.commissionActivation ? Number(s.fixedCommissionRate) || 0 : 0
}

/** Commission is settled on delivered orders, calculated from the seller's own order items. */
export async function getSellerCommissionLedger(seller: CurrentSeller): Promise<CommissionLedgerRow[]> {
  const rate = await getCommissionRate()
  const ownership = seller.userId
    ? or(eq(products.shopId, seller.shopId), eq(products.userId, seller.userId))
    : eq(products.shopId, seller.shopId)

  const rows = await db
    .select({
      id: orders.id,
      code: orders.code,
      createdAt: orders.createdAt,
      gross: sql<string>`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)`,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(and(ownership, eq(orders.deliveryStatus, "delivered")))
    .groupBy(orders.id, orders.code, orders.createdAt)
    .orderBy(desc(orders.createdAt))

  return rows.map((r) => {
    const gross = Number(r.gross)
    const commission = Math.round(gross * rate) / 100
    return {
      id: r.id,
      orderCode: r.code,
      orderTotal: gross,
      adminCommission: commission,
      sellerEarning: gross - commission,
      commissionRate: rate,
      createdAt: r.createdAt.toISOString(),
    }
  })
}

export async function getSellerWalletSummary(seller: CurrentSeller) {
  const [ledger, settings] = await Promise.all([getSellerCommissionLedger(seller), getSellerCommissionSettings()])
  const earned = ledger.reduce((s, r) => s + r.sellerEarning, 0)
  const requests = await db.select().from(sellerWithdrawRequests).where(eq(sellerWithdrawRequests.shopId, seller.shopId))
  const reserved = requests
    .filter((r) => r.status === "pending" || r.status === "paid")
    .reduce((s, r) => s + Number(r.amount), 0)
  return {
    balance: Math.max(0, Math.round((earned - reserved) * 100) / 100),
    minimumWithdrawal: Number(settings.minimumWithdrawalAmount) || 0,
  }
}

export async function getSellerPayoutRequests(shopId: number) {
  const rows = await db
    .select()
    .from(sellerWithdrawRequests)
    .where(eq(sellerWithdrawRequests.shopId, shopId))
    .orderBy(desc(sellerWithdrawRequests.createdAt))
  return rows.map((r) => ({
    id: r.id,
    amount: Number(r.amount),
    message: r.message || "",
    status: r.status as "pending" | "paid" | "rejected",
    paymentMethod: r.paymentMethod || "",
    transactionId: r.transactionId || "",
    date: r.createdAt.toISOString(),
  }))
}

export async function createSellerPayout(
  seller: CurrentSeller,
  data: { amount: number; message: string; paymentMethod: string }
): Promise<{ success: boolean; error?: string }> {
  const { balance, minimumWithdrawal } = await getSellerWalletSummary(seller)
  if (!(data.amount > 0)) return { success: false, error: "Enter a valid amount." }
  if (data.amount < minimumWithdrawal) {
    return { success: false, error: `Minimum withdrawal amount is ${minimumWithdrawal}.` }
  }
  if (data.amount > balance) return { success: false, error: "You do not have enough balance to send withdraw request." }
  if (!seller.userId) return { success: false, error: "Seller account is not linked to a user." }

  await db.insert(sellerWithdrawRequests).values({
    shopId: seller.shopId,
    userId: seller.userId,
    amount: String(data.amount),
    message: data.message,
    paymentMethod: data.paymentMethod,
    status: "pending",
  })
  return { success: true }
}

/* ------------------------------ Packages ------------------------------ */

export async function getSellerPackageOverview(seller: CurrentSeller) {
  const [plans, payments, [productCount]] = await Promise.all([
    db.select().from(sellerPackages).where(eq(sellerPackages.status, true)).orderBy(sellerPackages.id),
    db
      .select()
      .from(sellerPackagePayments)
      .where(and(eq(sellerPackagePayments.sellerId, seller.shopId), eq(sellerPackagePayments.approval, true)))
      .orderBy(desc(sellerPackagePayments.createdAt)),
    db.select({ n: sql<number>`count(*)::int` }).from(products).where(eq(products.shopId, seller.shopId)),
  ])

  let current: {
    packageId: number
    name: string
    uploadLimit: number
    expiresAt: string
    remainingUploads: number
  } | null = null

  for (const pay of payments) {
    const plan = plans.find((p) => p.id === pay.sellerPackageId)
    if (!plan) continue
    const expires = new Date(pay.createdAt.getTime() + plan.duration * 86400000)
    if (expires.getTime() > Date.now()) {
      current = {
        packageId: plan.id,
        name: plan.name,
        uploadLimit: plan.productUploadLimit,
        expiresAt: expires.toISOString(),
        remainingUploads: Math.max(0, plan.productUploadLimit - Number(productCount?.n || 0)),
      }
      break
    }
  }
  return { plans, current }
}

export async function purchaseSellerPackageFor(
  seller: CurrentSeller,
  packageId: number,
  paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
  const [plan] = await db
    .select()
    .from(sellerPackages)
    .where(and(eq(sellerPackages.id, packageId), eq(sellerPackages.status, true)))
    .limit(1)
  if (!plan) return { success: false, error: "Package not found." }

  const offline = paymentMethod === "Bank Slip"
  await db.insert(sellerPackagePayments).values({
    sellerId: seller.shopId,
    sellerPackageId: plan.id,
    amount: plan.amount,
    paymentMethod,
    offlinePayment: offline,
    approval: Number(plan.amount) === 0 ? true : !offline,
  })
  return { success: true }
}

/* ----------------------------- Custom labels ----------------------------- */

export async function getSellerVisibleLabels() {
  return db
    .select()
    .from(customLabels)
    .where(and(eq(customLabels.status, true), or(eq(customLabels.sellerAccess, true), eq(customLabels.userType, "seller"))))
    .orderBy(desc(customLabels.createdAt))
}

/* ----------------------- Seller Package Payments ----------------------- */

export interface SellerPackagePaymentRow {
  id: number
  amount: string
  paymentMethod: string
  paymentDetails: string | null
  offlinePayment: boolean
  approval: boolean
  receipt: string | null
  createdAt: string
  packageName: string
}

export async function getSellerPackagePayments(shopId: number): Promise<SellerPackagePaymentRow[]> {
  const rows = await db
    .select({
      id: sellerPackagePayments.id,
      amount: sellerPackagePayments.amount,
      paymentMethod: sellerPackagePayments.paymentMethod,
      paymentDetails: sellerPackagePayments.paymentDetails,
      offlinePayment: sellerPackagePayments.offlinePayment,
      approval: sellerPackagePayments.approval,
      receipt: sellerPackagePayments.receipt,
      createdAt: sellerPackagePayments.createdAt,
      packageName: sellerPackages.name,
    })
    .from(sellerPackagePayments)
    .leftJoin(sellerPackages, eq(sellerPackagePayments.sellerPackageId, sellerPackages.id))
    .where(eq(sellerPackagePayments.sellerId, shopId))
    .orderBy(desc(sellerPackagePayments.createdAt))

  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    packageName: r.packageName || "Membership Plan",
  }))
}

/* ----------------------------- Seller Shop ----------------------------- */

export async function getSellerShop(shopId: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.id, shopId)).limit(1)
  return shop ?? null
}

export async function updateSellerShop(
  shopId: number,
  data: {
    name?: string
    phone?: string
    address?: string
    logo?: string
    topBanner?: string
    facebook?: string
    instagram?: string
    twitter?: string
    google?: string
    youtube?: string
    metaTitle?: string
    metaDescription?: string
  }
) {
  const updateData: Record<string, any> = { updatedAt: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.address !== undefined) updateData.address = data.address
  if (data.logo !== undefined) updateData.logo = data.logo
  if (data.topBanner !== undefined) updateData.topBanner = data.topBanner
  if (data.facebook !== undefined) updateData.facebook = data.facebook
  if (data.instagram !== undefined) updateData.instagram = data.instagram
  if (data.twitter !== undefined) updateData.twitter = data.twitter
  if (data.google !== undefined) updateData.google = data.google
  if (data.youtube !== undefined) updateData.youtube = data.youtube
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription

  await db.update(shops).set(updateData).where(eq(shops.id, shopId))
  return { success: true }
}

/* -------------------------- Seller Addresses --------------------------- */

export async function getSellerAddresses(userId: string) {
  return await db
    .select()
    .from(customerAddresses)
    .where(eq(customerAddresses.userId, userId))
    .orderBy(desc(customerAddresses.setDefault), desc(customerAddresses.createdAt))
}

export async function createSellerAddress(
  userId: string,
  data: {
    address: string
    country?: string
    city?: string
    state?: string
    postalCode?: string
    phone?: string
    setDefault?: boolean
  }
) {
  if (data.setDefault) {
    await db.update(customerAddresses).set({ setDefault: false }).where(eq(customerAddresses.userId, userId))
  }
  const [inserted] = await db
    .insert(customerAddresses)
    .values({
      userId,
      address: data.address,
      country: data.country || "Bangladesh",
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      phone: data.phone || null,
      setDefault: !!data.setDefault,
    })
    .returning()
  return inserted
}

export async function updateSellerAddress(
  userId: string,
  id: number,
  data: {
    address: string
    country?: string
    city?: string
    state?: string
    postalCode?: string
    phone?: string
    setDefault?: boolean
  }
) {
  if (data.setDefault) {
    await db.update(customerAddresses).set({ setDefault: false }).where(eq(customerAddresses.userId, userId))
  }
  const [updated] = await db
    .update(customerAddresses)
    .set({
      address: data.address,
      country: data.country || "Bangladesh",
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      phone: data.phone || null,
      setDefault: !!data.setDefault,
      updatedAt: new Date(),
    })
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
    .returning()
  return updated
}

export async function deleteSellerAddress(userId: string, id: number) {
  await db
    .delete(customerAddresses)
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
  return { success: true }
}

export async function setDefaultSellerAddress(userId: string, id: number) {
  await db.update(customerAddresses).set({ setDefault: false }).where(eq(customerAddresses.userId, userId))
  await db
    .update(customerAddresses)
    .set({ setDefault: true })
    .where(and(eq(customerAddresses.id, id), eq(customerAddresses.userId, userId)))
  return { success: true }
}

/* --------------------------- Product Reviews --------------------------- */

export interface SellerReviewedProductRow {
  id: number
  name: string
  thumbnailImg: string | null
  rating: number
  reviewsCount: number
  unviewedCount: number
}

export async function getSellerProductReviewsList(
  seller: CurrentSeller,
  filter?: { search?: string; ratingSort?: "asc" | "desc" }
): Promise<SellerReviewedProductRow[]> {
  const ownership = seller.userId
    ? or(eq(products.shopId, seller.shopId), eq(products.userId, seller.userId))
    : eq(products.shopId, seller.shopId)

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      thumbnailImg: products.thumbnailImg,
      rating: products.rating,
      reviewsCount: sql<number>`count(${reviews.id})::int`,
      unviewedCount: sql<number>`count(case when ${reviews.viewed} = false then 1 end)::int`,
    })
    .from(products)
    .innerJoin(reviews, eq(reviews.productId, products.id))
    .where(ownership)
    .groupBy(products.id, products.name, products.thumbnailImg, products.rating)
    .orderBy(
      filter?.ratingSort === "asc"
        ? products.rating
        : filter?.ratingSort === "desc"
        ? desc(products.rating)
        : desc(products.createdAt)
    )

  if (filter?.search) {
    const q = filter.search.toLowerCase()
    return rows.filter((r) => r.name.toLowerCase().includes(q)).map((r) => ({
      ...r,
      rating: Number(r.rating) || 0,
    }))
  }

  return rows.map((r) => ({
    ...r,
    rating: Number(r.rating) || 0,
  }))
}

export interface SellerProductReviewDetail {
  id: number
  productId: number
  customerName: string
  customerAvatar: string | null
  rating: number
  comment: string
  photos: string[] | null
  status: boolean
  viewed: boolean
  createdAt: string
}

export async function getSellerProductReviewDetails(
  productId: number
): Promise<{ product: { id: number; name: string; thumbnailImg: string | null; rating: number } | null; reviews: SellerProductReviewDetail[] }> {
  const [prod] = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  if (!prod) return { product: null, reviews: [] }

  const revs = await db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      customerName: reviews.userName,
      customerAvatar: reviews.userAvatar,
      rating: reviews.rating,
      comment: reviews.comment,
      photos: reviews.photos,
      status: reviews.status,
      viewed: reviews.viewed,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))

  // Mark reviews as viewed
  await db.update(reviews).set({ viewed: true }).where(eq(reviews.productId, productId))

  return {
    product: {
      id: prod.id,
      name: prod.name,
      thumbnailImg: prod.thumbnailImg,
      rating: Number(prod.rating) || 0,
    },
    reviews: revs.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }
}

