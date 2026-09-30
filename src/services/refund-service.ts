import { db } from "../db"
import { refundRequests, refundReasons, orders, users, type RefundReason } from "../db/schema"
import { eq, desc, ilike, or, and, sql, count } from "drizzle-orm"

export interface RefundRequestItem {
  id: string
  orderId?: number
  orderCode: string
  productName: string
  customerName: string
  customerEmail?: string
  shopName: string
  amount: number
  reason: string
  details?: string
  attachment?: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  date: string
}

export interface RefundListResult {
  items: RefundRequestItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    totalAmount: number
  }
}

export async function getAllRefundsAdmin(params?: {
  search?: string
  status?: string
  page?: number
  limit?: number
}): Promise<RefundRequestItem[]> {
  const result = await getRefundsAdminWithPagination(params)
  return result.items
}

export async function getRefundsAdminWithPagination(params?: {
  search?: string
  status?: string
  page?: number
  limit?: number
}): Promise<RefundListResult> {
  const page = Math.max(1, params?.page || 1)
  const limit = Math.max(1, Math.min(100, params?.limit || 15))
  const offset = (page - 1) * limit
  const search = params?.search?.trim() || ""
  const status = params?.status?.trim().toLowerCase() || "all"

  try {
    const conditions = []

    if (status && status !== "all") {
      conditions.push(eq(refundRequests.status, status))
    }

    if (search) {
      conditions.push(
        or(
          ilike(refundRequests.orderCode, `%${search}%`),
          ilike(refundRequests.userName, `%${search}%`),
          ilike(refundRequests.productName, `%${search}%`),
          ilike(refundRequests.reason, `%${search}%`),
          ilike(refundRequests.shopName, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // 1. Fetch paginated records with user details
    const rows = await db
      .select({
        id: refundRequests.id,
        orderId: refundRequests.orderId,
        orderCode: refundRequests.orderCode,
        userName: refundRequests.userName,
        userId: refundRequests.userId,
        shopId: refundRequests.shopId,
        shopName: refundRequests.shopName,
        productName: refundRequests.productName,
        amount: refundRequests.amount,
        reason: refundRequests.reason,
        details: refundRequests.details,
        attachment: refundRequests.attachment,
        status: refundRequests.status,
        adminNote: refundRequests.adminNote,
        createdAt: refundRequests.createdAt,
        updatedAt: refundRequests.updatedAt,
      })
      .from(refundRequests)
      .where(whereClause)
      .orderBy(desc(refundRequests.createdAt))
      .limit(limit)
      .offset(offset)

    // 2. Total filtered count
    const [countRow] = await db
      .select({ count: count() })
      .from(refundRequests)
      .where(whereClause)

    const total = Number(countRow?.count || 0)
    const totalPages = Math.ceil(total / limit) || 1

    // 3. Summary stats across ALL requests
    const [statsRow] = await db
      .select({
        total: count(),
        pending: sql<number>`count(case when ${refundRequests.status} = 'pending' then 1 end)`,
        approved: sql<number>`count(case when ${refundRequests.status} = 'approved' then 1 end)`,
        rejected: sql<number>`count(case when ${refundRequests.status} = 'rejected' then 1 end)`,
        totalAmount: sql<number>`coalesce(sum(case when ${refundRequests.status} = 'approved' then ${refundRequests.amount}::numeric else 0 end), 0)`,
      })
      .from(refundRequests)

    const items: RefundRequestItem[] = rows.map((r) => ({
      id: String(r.id),
      orderId: r.orderId || undefined,
      orderCode: r.orderCode,
      productName: r.productName,
      customerName: r.userName,
      shopName: r.shopName || "Active Fashion Outlet",
      amount: Number(r.amount),
      reason: r.reason,
      details: r.details || undefined,
      attachment: r.attachment || undefined,
      status: (r.status as "pending" | "approved" | "rejected") || "pending",
      adminNote: r.adminNote || undefined,
      date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
    }))

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      stats: {
        total: Number(statsRow?.total || 0),
        pending: Number(statsRow?.pending || 0),
        approved: Number(statsRow?.approved || 0),
        rejected: Number(statsRow?.rejected || 0),
        totalAmount: Number(statsRow?.totalAmount || 0),
      },
    }
  } catch (err) {
    console.error("Database query failed in getRefundsAdminWithPagination:", err)
    return {
      items: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 1,
      stats: { total: 0, pending: 0, approved: 0, rejected: 0, totalAmount: 0 },
    }
  }
}

export async function getRefundByIdAdmin(id: number | string): Promise<RefundRequestItem | null> {
  const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""))
  if (!numericId) return null

  try {
    const [row] = await db
      .select()
      .from(refundRequests)
      .where(eq(refundRequests.id, numericId))
      .limit(1)

    if (!row) return null

    return {
      id: String(row.id),
      orderId: row.orderId || undefined,
      orderCode: row.orderCode,
      productName: row.productName,
      customerName: row.userName,
      shopName: row.shopName || "Active Fashion Outlet",
      amount: Number(row.amount),
      reason: row.reason,
      details: row.details || undefined,
      attachment: row.attachment || undefined,
      status: (row.status as "pending" | "approved" | "rejected") || "pending",
      adminNote: row.adminNote || undefined,
      date: row.createdAt ? new Date(row.createdAt).toISOString().slice(0, 10) : "",
    }
  } catch (err) {
    console.error("getRefundByIdAdmin error:", err)
    return null
  }
}

export async function getUserRefunds(userId?: string): Promise<RefundRequestItem[]> {
  if (!userId) return []
  try {
    const rows = await db
      .select()
      .from(refundRequests)
      .where(eq(refundRequests.userId, userId))
      .orderBy(desc(refundRequests.createdAt))

    return rows.map((r) => ({
      id: String(r.id),
      orderId: r.orderId || undefined,
      orderCode: r.orderCode,
      productName: r.productName,
      customerName: r.userName,
      shopName: r.shopName || "Active Fashion Outlet",
      amount: Number(r.amount),
      reason: r.reason,
      details: r.details || undefined,
      attachment: r.attachment || undefined,
      status: (r.status as "pending" | "approved" | "rejected") || "pending",
      adminNote: r.adminNote || undefined,
      date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
    }))
  } catch (err) {
    console.error("getUserRefunds error:", err)
    return []
  }
}

export async function createRefundRequest(data: {
  orderId?: number
  orderCode: string
  userId?: string
  productName: string
  userName: string
  shopId?: number
  shopName?: string
  amount: number
  reason: string
  details?: string
  attachment?: string
}) {
  try {
    const [inserted] = await db
      .insert(refundRequests)
      .values({
        orderId: data.orderId,
        orderCode: data.orderCode,
        userId: data.userId,
        productName: data.productName,
        userName: data.userName,
        shopId: data.shopId,
        shopName: data.shopName || "Active Fashion Outlet",
        amount: String(data.amount),
        reason: data.reason,
        details: data.details,
        attachment: data.attachment,
        status: "pending",
      })
      .returning()

    return { success: true, item: inserted }
  } catch (err) {
    console.error("createRefundRequest error:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function processRefundAdmin(data: {
  requestId: string | number
  status: "approved" | "rejected"
  adminNote?: string
}) {
  try {
    const numericId = typeof data.requestId === "number"
      ? data.requestId
      : parseInt(String(data.requestId).replace(/\D/g, ""))

    if (!numericId) throw new Error("Invalid refund request ID")

    await db
      .update(refundRequests)
      .set({
        status: data.status,
        adminNote: data.adminNote,
        updatedAt: new Date(),
      })
      .where(eq(refundRequests.id, numericId))

    return { success: true }
  } catch (err) {
    console.error("processRefundAdmin error:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function deleteRefundAdmin(id: number | string) {
  try {
    const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""))
    if (!numericId) throw new Error("Invalid refund request ID")

    await db.delete(refundRequests).where(eq(refundRequests.id, numericId))
    return { success: true }
  } catch (err) {
    console.error("deleteRefundAdmin error:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function getRefundReasons(type: string = "customer_refund_reason"): Promise<RefundReason[]> {
  try {
    return await db
      .select()
      .from(refundReasons)
      .where(eq(refundReasons.type, type))
      .orderBy(refundReasons.id)
  } catch (err) {
    console.error("getRefundReasons error:", err)
    return []
  }
}

export async function createRefundReason(reason: string, type: string = "customer_refund_reason"): Promise<boolean> {
  try {
    await db.insert(refundReasons).values({ reason, type, status: true })
    return true
  } catch (err) {
    console.error("createRefundReason error:", err)
    return false
  }
}

export async function deleteRefundReason(id: number): Promise<boolean> {
  try {
    await db.delete(refundReasons).where(eq(refundReasons.id, id))
    return true
  } catch (err) {
    console.error("deleteRefundReason error:", err)
    return false
  }
}
