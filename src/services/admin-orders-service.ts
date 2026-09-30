import { db } from "../db"
import { orders, orderItems } from "../db/schema"
import { eq, inArray, sql } from "drizzle-orm"

export interface AdminOrderListItem {
  id: number
  code: string
  trackingCode: string | null
  productCount: number
  customerName: string
  sellerName: string
  isSeller: boolean
  grandTotal: number
  deliveryStatus: string
  paymentType: string
  paymentStatus: string
  viewed: boolean
  date: string
  shippingMethod: string | null
  courierTrackingCode: string | null
  hasRefund: boolean
}

export interface GetAdminOrdersParams {
  tab?: "all" | "inhouse" | "seller"
  deliveryStatuses?: string[]
  paymentStatus?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface AdminOrdersResponse {
  orders: AdminOrderListItem[]
  totalCount: number
  currentPage: number
  perPage: number
  totalPages: number
}

export async function getAdminOrdersList(
  params: GetAdminOrdersParams = {}
): Promise<AdminOrdersResponse> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 15)
  const offset = (page - 1) * limit

  try {
    const conditions: string[] = []

    if (params.search && params.search.trim()) {
      const q = params.search.trim().replace(/'/g, "''")
      conditions.push(`(
        o.code ILIKE '%${q}%' OR 
        o.tracking_code ILIKE '%${q}%' OR 
        (o.shipping_address->>'name') ILIKE '%${q}%' OR
        u.name ILIKE '%${q}%'
      )`)
    }

    if (params.deliveryStatuses && params.deliveryStatuses.length > 0) {
      const validStatuses = params.deliveryStatuses
        .filter((s) => s !== "all")
        .map((s) => {
          const norm = s === "cancel" ? "cancelled" : s
          return `'${norm.replace(/'/g, "''")}'`
        })
      if (validStatuses.length > 0) {
        conditions.push(`o.delivery_status IN (${validStatuses.join(", ")})`)
      }
    }

    if (params.paymentStatus) {
      const ps = params.paymentStatus.includes(",")
        ? params.paymentStatus.split(",")[1].trim().toLowerCase()
        : params.paymentStatus.trim().toLowerCase()
      if (ps === "paid" || ps === "unpaid") {
        conditions.push(`o.payment_status = '${ps.replace(/'/g, "''")}'`)
      }
    }

    if (params.dateFrom) {
      conditions.push(`o.created_at >= '${params.dateFrom}'`)
    }
    if (params.dateTo) {
      conditions.push(`o.created_at <= '${params.dateTo} 23:59:59'`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Count query
    const countSql = `
      SELECT COUNT(DISTINCT o.id)::int as count
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ${whereClause}
    `
    const countRes: any = await db.execute(sql.raw(countSql))
    const totalCount = Number(countRes.rows?.[0]?.count || 0)
    const totalPages = Math.ceil(totalCount / limit) || 1

    // Data query
    const dataSql = `
      SELECT 
        o.id,
        o.code,
        o.tracking_code as "trackingCode",
        o.grand_total as "grandTotal",
        o.delivery_status as "deliveryStatus",
        o.payment_status as "paymentStatus",
        o.payment_type as "paymentType",
        o.shipping_address as "shippingAddress",
        o.shipping_method as "shippingMethod",
        o.courier_tracking_code as "courierTrackingCode",
        o.viewed,
        o.created_at as "createdAt",
        COALESCE(COUNT(oi.id), 0)::int as "productCount",
        u.name as "customerName"
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN users u ON u.id = o.user_id
      ${whereClause}
      GROUP BY o.id, u.name
      ORDER BY o.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    const rowsRes: any = await db.execute(sql.raw(dataSql))
    const rows = Array.isArray(rowsRes) ? rowsRes : (rowsRes.rows || [])

    const mapped: AdminOrderListItem[] = rows.map((r: any) => {
      let shipAddr: any = {}
      if (typeof r.shippingAddress === "string") {
        try {
          shipAddr = JSON.parse(r.shippingAddress)
        } catch {
          shipAddr = {}
        }
      } else if (r.shippingAddress && typeof r.shippingAddress === "object") {
        shipAddr = r.shippingAddress
      }

      const customerName = shipAddr.name || r.customerName || "Customer"

      return {
        id: Number(r.id),
        code: r.code || `ORD-${r.id}`,
        trackingCode: r.trackingCode || null,
        productCount: Number(r.productCount) || 1,
        customerName,
        sellerName: "Inhouse",
        isSeller: false,
        grandTotal: Number(r.grandTotal) || 0,
        deliveryStatus: r.deliveryStatus || "pending",
        paymentType: r.paymentType || "cash_on_delivery",
        paymentStatus: r.paymentStatus || "unpaid",
        viewed: Boolean(r.viewed),
        date: r.createdAt
          ? new Date(r.createdAt).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        shippingMethod: r.shippingMethod || null,
        courierTrackingCode: r.courierTrackingCode || null,
        hasRefund: false,
      }
    })

    let finalOrders = mapped
    if (params.tab === "inhouse") {
      finalOrders = mapped.filter((o) => !o.isSeller)
    } else if (params.tab === "seller") {
      finalOrders = mapped.filter((o) => o.isSeller)
    }

    return {
      orders: finalOrders,
      totalCount,
      currentPage: page,
      perPage: limit,
      totalPages,
    }
  } catch (error) {
    console.error("Error in getAdminOrdersList:", error)
    return {
      orders: [],
      totalCount: 0,
      currentPage: 1,
      perPage: limit,
      totalPages: 1,
    }
  }
}

export async function updateOrderQuickManagement(
  orderId: number,
  data: { deliveryStatus: string; paymentStatus: string }
): Promise<boolean> {
  try {
    await db
      .update(orders)
      .set({
        deliveryStatus: data.deliveryStatus,
        paymentStatus: data.paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    return true
  } catch (error) {
    console.error("Error updating order quick management:", error)
    return false
  }
}

export async function deleteAdminOrder(orderId: number): Promise<boolean> {
  try {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId))
    await db.delete(orders).where(eq(orders.id, orderId))
    return true
  } catch (error) {
    console.error("Error deleting order:", error)
    return false
  }
}

export async function bulkDeleteAdminOrders(orderIds: number[]): Promise<boolean> {
  if (!orderIds || orderIds.length === 0) return false
  try {
    await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds))
    await db.delete(orders).where(inArray(orders.id, orderIds))
    return true
  } catch (error) {
    console.error("Error bulk deleting orders:", error)
    return false
  }
}
