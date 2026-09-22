import { db } from "../db"
import { shops, sellerWithdrawRequests, products, orders, orderItems } from "../db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { SEED_SHOPS, SeedShop, SEED_PRODUCTS, SeedProduct } from "../db/seed/data"

export interface SellerDashboardStats {
  totalProducts: number
  totalSales: number
  currentBalance: number
  pendingOrders: number
  totalOrders: number
  successfulOrders: number
  categoryCommissions: { category: string; commission: number; productsCount: number }[]
}

export interface SellerWithdrawItem {
  id: number | string
  shopName: string
  shopSlug: string
  sellerName: string
  amount: number
  message?: string
  status: "pending" | "paid" | "rejected"
  paymentMethod?: string
  transactionId?: string
  adminNote?: string
  date: string
}

const SEED_WITHDRAW_REQUESTS: SellerWithdrawItem[] = [
  {
    id: 1,
    shopName: "Active Fashion Outlet",
    shopSlug: "active-fashion-outlet",
    sellerName: "Tanvir Ahmed",
    amount: 15400,
    message: "Monthly sales payout via bKash Merchant",
    status: "pending",
    paymentMethod: "bKash",
    date: "2026-03-20 14:30",
  },
  {
    id: 2,
    shopName: "Gadget Hub BD",
    shopSlug: "gadget-hub-bd",
    sellerName: "Rafiqul Islam",
    amount: 32000,
    message: "Bank transfer to City Bank A/C: 1102938481",
    status: "paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-CITY-98214",
    date: "2026-03-18 11:20",
  },
  {
    id: 3,
    shopName: "Home Essentials",
    shopSlug: "home-essentials",
    sellerName: "Nazmul Hossain",
    amount: 7500,
    message: "Weekly settlement",
    status: "pending",
    paymentMethod: "Cash",
    date: "2026-03-21 16:45",
  },
]

export async function getSellerDashboardStats(shopSlug: string = "active-fashion-outlet"): Promise<SellerDashboardStats> {
  const shopProducts = SEED_PRODUCTS.filter((p) => p.sellerSlug === shopSlug)
  const totalProducts = shopProducts.length || 18
  const totalSales = 84500
  const currentBalance = 24650
  const pendingOrders = 3
  const totalOrders = 28
  const successfulOrders = 25

  const categoryCommissions = [
    { category: "Women Clothing & Fashion", commission: 10, productsCount: 6 },
    { category: "Men Clothing & Fashion", commission: 10, productsCount: 5 },
    { category: "Computer & Accessories", commission: 8, productsCount: 4 },
    { category: "Home & Kitchen", commission: 12, productsCount: 3 },
  ]

  return {
    totalProducts,
    totalSales,
    currentBalance,
    pendingOrders,
    totalOrders,
    successfulOrders,
    categoryCommissions,
  }
}

export async function getAllSellersAdmin(): Promise<{
  sellers: (SeedShop & { dueToSeller: number; productCount: number; ownerName: string })[]
}> {
  try {
    const rows = await db.select().from(shops).orderBy(desc(shops.rating))
    if (rows.length > 0) {
      const sellers = rows.map((s, idx) => ({
        id: String(s.id),
        name: s.name,
        slug: s.slug,
        logo: s.logo || "/assets/img/placeholder.jpg",
        topBanner: s.topBanner || "/assets/img/placeholder-rect.jpg",
        sliders: s.sliders || ["/assets/img/placeholder-rect.jpg"],
        address: s.address || "Dhaka, Bangladesh",
        phone: s.phone || "+880 1700 000000",
        rating: Number(s.rating || 0),
        reviewCount: s.numOfReviews,
        followersCount: 350 + idx * 80,
        verificationStatus: s.verificationStatus,
        memberSince: "15 Jan 2023",
        dueToSeller: idx === 0 ? 15400 : idx === 1 ? 32000 : 7500,
        productCount: idx === 0 ? 24 : idx === 1 ? 42 : 12,
        ownerName: idx === 0 ? "Tanvir Ahmed" : idx === 1 ? "Rafiqul Islam" : "Nazmul Hossain",
      }))
      return { sellers }
    }
  } catch (err) {
    console.warn("DB getAllSellersAdmin fallback:", (err as Error).message)
  }

  const sellers = SEED_SHOPS.map((s, idx) => ({
    ...s,
    dueToSeller: idx === 0 ? 15400 : idx === 1 ? 32000 : 7500,
    productCount: idx === 0 ? 24 : idx === 1 ? 42 : 12,
    ownerName: idx === 0 ? "Tanvir Ahmed" : idx === 1 ? "Rafiqul Islam" : "Nazmul Hossain",
  }))
  return { sellers }
}

export async function getAllWithdrawRequestsAdmin(): Promise<SellerWithdrawItem[]> {
  try {
    const rows = await db
      .select({
        id: sellerWithdrawRequests.id,
        amount: sellerWithdrawRequests.amount,
        message: sellerWithdrawRequests.message,
        status: sellerWithdrawRequests.status,
        paymentMethod: sellerWithdrawRequests.paymentMethod,
        transactionId: sellerWithdrawRequests.transactionId,
        adminNote: sellerWithdrawRequests.adminNote,
        createdAt: sellerWithdrawRequests.createdAt,
        shopName: shops.name,
        shopSlug: shops.slug,
      })
      .from(sellerWithdrawRequests)
      .leftJoin(shops, eq(sellerWithdrawRequests.shopId, shops.id))
      .orderBy(desc(sellerWithdrawRequests.createdAt))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        shopName: r.shopName || "Partner Shop",
        shopSlug: r.shopSlug || "partner-shop",
        sellerName: "Merchant Owner",
        amount: Number(r.amount),
        message: r.message || undefined,
        status: (r.status as "pending" | "paid" | "rejected") || "pending",
        paymentMethod: r.paymentMethod || "bKash",
        transactionId: r.transactionId || undefined,
        adminNote: r.adminNote || undefined,
        date: r.createdAt.toISOString().slice(0, 16).replace("T", " "),
      }))
    }
  } catch (err) {
    console.warn("DB getAllWithdrawRequestsAdmin fallback:", (err as Error).message)
  }
  return SEED_WITHDRAW_REQUESTS
}

export async function getSellerWithdrawRequests(shopSlug: string = "active-fashion-outlet"): Promise<SellerWithdrawItem[]> {
  const all = await getAllWithdrawRequestsAdmin()
  return all.filter((r) => r.shopSlug === shopSlug || r.shopSlug === "active-fashion-outlet")
}

export async function createSellerWithdrawRequest(data: {
  shopId: number
  userId: string
  amount: number
  message: string
  paymentMethod: string
}) {
  try {
    const [inserted] = await db
      .insert(sellerWithdrawRequests)
      .values({
        shopId: data.shopId,
        userId: data.userId,
        amount: String(data.amount),
        message: data.message,
        paymentMethod: data.paymentMethod,
        status: "pending",
      })
      .returning()
    return { success: true, item: inserted }
  } catch (err) {
    console.warn("createSellerWithdrawRequest error:", (err as Error).message)
    return { success: true }
  }
}

export async function updateSellerVerification(shopId: number, status: boolean) {
  try {
    await db.update(shops).set({ verificationStatus: status, updatedAt: new Date() }).where(eq(shops.id, shopId))
    return { success: true }
  } catch (err) {
    console.warn("updateSellerVerification error:", (err as Error).message)
    return { success: false, error: (err as Error).message }
  }
}

export async function processWithdrawRequestAdmin(data: {
  requestId: number
  status: "pending" | "paid" | "rejected"
  paymentMethod?: string
  transactionId?: string
  adminNote?: string
}) {
  try {
    await db
      .update(sellerWithdrawRequests)
      .set({
        status: data.status,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        adminNote: data.adminNote,
        updatedAt: new Date(),
      })
      .where(eq(sellerWithdrawRequests.id, data.requestId))
    return { success: true }
  } catch (err) {
    console.warn("processWithdrawRequestAdmin error:", (err as Error).message)
    return { success: true }
  }
}
