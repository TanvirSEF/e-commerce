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
  productQueries,
  tickets,
  ticketReplies,
  conversations,
  messages,
} from "@/db/schema"
import { and, desc, asc, eq, or, sql, ilike } from "drizzle-orm"
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

/* -------------------------- Product Queries ---------------------------- */

export interface SellerProductQueryRow {
  id: number
  productId: number | null
  productName: string
  productSlug: string
  userId: string | null
  userName: string
  userAvatar: string | null
  question: string
  reply: string | null
  repliedBy: string | null
  status: string
  createdAt: string
}

export async function getSellerProductQueries(seller: CurrentSeller): Promise<SellerProductQueryRow[]> {
  const sellerProducts = await db
    .select({ id: products.id, name: products.name, slug: products.slug })
    .from(products)
    .where(
      seller.userId
        ? or(eq(products.shopId, seller.shopId), eq(products.userId, seller.userId))
        : eq(products.shopId, seller.shopId)
    )

  const productIds = sellerProducts.map((p) => p.id)
  const productNames = sellerProducts.map((p) => p.name)

  let rows: (typeof productQueries.$inferSelect)[] = []
  if (productIds.length > 0) {
    rows = await db
      .select()
      .from(productQueries)
      .where(
        or(
          sql`${productQueries.productId} IN ${productIds}`,
          sql`${productQueries.productName} IN ${productNames}`
        )
      )
      .orderBy(desc(productQueries.createdAt))
  }

  if (rows.length === 0) {
    rows = await db
      .select()
      .from(productQueries)
      .orderBy(desc(productQueries.createdAt))
      .limit(20)
  }

  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    productName: r.productName,
    productSlug: r.productSlug,
    userId: r.userId,
    userName: r.userName || "Customer",
    userAvatar: "/assets/img/avatar-placeholder.png",
    question: r.question,
    reply: r.reply,
    repliedBy: r.repliedBy,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }))
}

export async function replySellerProductQuery(id: number, replyText: string, repliedBy: string) {
  await db
    .update(productQueries)
    .set({
      reply: replyText.trim(),
      repliedBy,
      status: "approved",
      updatedAt: new Date(),
    })
    .where(eq(productQueries.id, id))
  return { success: true }
}

/* -------------------------- Support Tickets ---------------------------- */

export interface SellerSupportTicketRow {
  id: number
  code: string
  subject: string
  details: string
  files: string[]
  status: "pending" | "open" | "solved"
  createdAt: string
  replyCount: number
}

export async function getSellerSupportTickets(userId: string): Promise<SellerSupportTicketRow[]> {
  const rows = await db
    .select({
      id: tickets.id,
      code: tickets.code,
      subject: tickets.subject,
      details: tickets.details,
      files: tickets.files,
      status: tickets.status,
      createdAt: tickets.createdAt,
      replyCount: sql<number>`count(${ticketReplies.id})::int`,
    })
    .from(tickets)
    .leftJoin(ticketReplies, eq(ticketReplies.ticketId, tickets.id))
    .where(eq(tickets.userId, userId))
    .groupBy(tickets.id)
    .orderBy(desc(tickets.createdAt))

  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    subject: r.subject,
    details: r.details,
    files: r.files || [],
    status: (r.status as "pending" | "open" | "solved") || "pending",
    createdAt: r.createdAt.toISOString(),
    replyCount: r.replyCount || 0,
  }))
}

export interface SellerTicketReplyItem {
  id: number
  userId: string
  userName: string
  userAvatar: string | null
  reply: string
  files: string[]
  createdAt: string
}

export interface SellerTicketDetailData {
  ticket: {
    id: number
    code: string
    userId: string
    userName: string
    userAvatar: string | null
    subject: string
    details: string
    files: string[]
    status: "pending" | "open" | "solved"
    createdAt: string
  } | null
  replies: SellerTicketReplyItem[]
}

export async function getSellerTicketDetails(ticketId: number, userId: string): Promise<SellerTicketDetailData> {
  const [t] = await db
    .select({
      id: tickets.id,
      code: tickets.code,
      userId: tickets.userId,
      userName: users.name,
      userAvatar: users.image,
      subject: tickets.subject,
      details: tickets.details,
      files: tickets.files,
      status: tickets.status,
      createdAt: tickets.createdAt,
    })
    .from(tickets)
    .leftJoin(users, eq(tickets.userId, users.id))
    .where(and(eq(tickets.id, ticketId), eq(tickets.userId, userId)))
    .limit(1)

  if (!t) return { ticket: null, replies: [] }

  await db.update(tickets).set({ clientViewed: true }).where(eq(tickets.id, ticketId))

  const repRows = await db
    .select({
      id: ticketReplies.id,
      userId: ticketReplies.userId,
      userName: users.name,
      userAvatar: users.image,
      reply: ticketReplies.reply,
      files: ticketReplies.files,
      createdAt: ticketReplies.createdAt,
    })
    .from(ticketReplies)
    .leftJoin(users, eq(ticketReplies.userId, users.id))
    .where(eq(ticketReplies.ticketId, ticketId))
    .orderBy(asc(ticketReplies.createdAt))

  return {
    ticket: {
      ...t,
      status: (t.status as "pending" | "open" | "solved") || "pending",
      files: t.files || [],
      createdAt: t.createdAt.toISOString(),
      userName: t.userName || "Seller",
    },
    replies: repRows.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.userName || "Support Staff",
      userAvatar: r.userAvatar,
      reply: r.reply,
      files: r.files || [],
      createdAt: r.createdAt.toISOString(),
    })),
  }
}

export async function createSellerTicket(
  userId: string,
  data: { subject: string; details: string; files?: string[] }
) {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const [inserted] = await db
    .insert(tickets)
    .values({
      code,
      userId,
      subject: data.subject.trim(),
      details: data.details.trim(),
      files: data.files || [],
      status: "pending",
      viewed: false,
      clientViewed: true,
    })
    .returning()
  return inserted
}

export async function replySellerTicket(
  ticketId: number,
  userId: string,
  replyText: string,
  files?: string[]
) {
  const [rep] = await db
    .insert(ticketReplies)
    .values({
      ticketId,
      userId,
      reply: replyText.trim(),
      files: files || [],
    })
    .returning()

  await db
    .update(tickets)
    .set({
      status: "pending",
      viewed: false,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, ticketId))

  return rep
}

/* ---------------------------- Conversations ---------------------------- */

export interface SellerConversationRow {
  id: number
  title: string
  partnerId: string | null
  partnerName: string
  partnerAvatar: string | null
  lastMessage: string
  lastMessageAt: string
  isUnread: boolean
}

export async function getSellerConversationsList(seller: CurrentSeller): Promise<SellerConversationRow[]> {
  const ownership = seller.userId
    ? or(
        eq(conversations.shopId, seller.shopId),
        eq(conversations.receiverId, seller.userId),
        eq(conversations.senderId, seller.userId)
      )
    : eq(conversations.shopId, seller.shopId)

  const convRows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      senderId: conversations.senderId,
      receiverId: conversations.receiverId,
      shopId: conversations.shopId,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .where(ownership)
    .orderBy(desc(conversations.lastMessageAt))

  const results: SellerConversationRow[] = []

  for (const c of convRows) {
    const isSellerSender = seller.userId && c.senderId === seller.userId
    const partnerId = isSellerSender ? c.receiverId : c.senderId

    let partnerName = "Customer"
    let partnerAvatar: string | null = null
    if (partnerId) {
      const [u] = await db
        .select({ name: users.name, image: users.image })
        .from(users)
        .where(eq(users.id, partnerId))
        .limit(1)
      if (u) {
        partnerName = u.name
        partnerAvatar = u.image
      }
    }

    const latestMsgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, c.id))
      .orderBy(desc(messages.createdAt))
      .limit(1)

    const latest = latestMsgs[0]
    const isUnread = latest
      ? !latest.viewed && seller.userId !== null && latest.senderId !== seller.userId
      : false

    results.push({
      id: c.id,
      title: c.title,
      partnerId,
      partnerName,
      partnerAvatar,
      lastMessage: latest ? latest.message : "Inquiry",
      lastMessageAt: (latest ? latest.createdAt : c.lastMessageAt).toISOString(),
      isUnread,
    })
  }

  return results
}

export interface SellerConversationMessageItem {
  id: number
  conversationId: number
  senderId: string
  senderName: string
  senderAvatar: string | null
  message: string
  isSelf: boolean
  createdAt: string
}

export async function getSellerConversationThread(
  conversationId: number,
  seller: CurrentSeller
): Promise<{
  conversation: { id: number; title: string; partnerName: string; partnerAvatar: string | null } | null
  messages: SellerConversationMessageItem[]
}> {
  const [c] = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1)
  if (!c) return { conversation: null, messages: [] }

  const isSellerSender = seller.userId && c.senderId === seller.userId
  const partnerId = isSellerSender ? c.receiverId : c.senderId

  let partnerName = "Customer"
  let partnerAvatar: string | null = null
  if (partnerId) {
    const [u] = await db
      .select({ name: users.name, image: users.image })
      .from(users)
      .where(eq(users.id, partnerId))
      .limit(1)
    if (u) {
      partnerName = u.name
      partnerAvatar = u.image
    }
  }

  if (seller.userId) {
    await db
      .update(messages)
      .set({ viewed: true })
      .where(and(eq(messages.conversationId, conversationId), sql`${messages.senderId} != ${seller.userId}`))
  }

  const msgRows = await db
    .select({
      id: messages.id,
      conversationId: messages.conversationId,
      senderId: messages.senderId,
      message: messages.message,
      createdAt: messages.createdAt,
      senderName: users.name,
      senderAvatar: users.image,
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))

  return {
    conversation: {
      id: c.id,
      title: c.title,
      partnerName,
      partnerAvatar,
    },
    messages: msgRows.map((m) => {
      const isSelf = seller.userId ? m.senderId === seller.userId : false
      return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: isSelf ? (seller.shopName || "You") : (m.senderName || partnerName),
        senderAvatar: isSelf ? null : (m.senderAvatar || partnerAvatar),
        message: m.message,
        isSelf,
        createdAt: m.createdAt.toISOString(),
      }
    }),
  }
}

export async function sendSellerConversationMessage(
  conversationId: number,
  senderId: string,
  messageText: string
) {
  const [inserted] = await db
    .insert(messages)
    .values({
      conversationId,
      senderId,
      message: messageText.trim(),
      viewed: false,
    })
    .returning()

  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId))

  return inserted
}


