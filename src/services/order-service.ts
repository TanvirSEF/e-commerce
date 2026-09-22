import { db } from "../db"
import { orders, orderItems } from "../db/schema"
import { eq, or, desc } from "drizzle-orm"

export interface CreateOrderInput {
  userId?: string
  shippingAddress?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
    postal_code?: string
  }
  shipping_address?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
    postal_code?: string
  }
  paymentType?: string
  payment_type?: string
  items: {
    productId?: number
    variation?: string
    price: number
    quantity: number
  }[]
  grandTotal?: number
  grand_total?: number
  shippingCost?: number
  couponDiscount?: number
  coupon_discount?: number
}

export async function createOrder(data: CreateOrderInput) {
  const timestamp = Date.now().toString().slice(-6)
  const code = `ORD-${timestamp}`
  const trackingCode = `TRK-${timestamp}`

  const address = data.shippingAddress || data.shipping_address
  const pType = data.paymentType || data.payment_type || "cash_on_delivery"
  const total = Number(data.grandTotal ?? data.grand_total ?? 0)
  const sCost = Number(data.shippingCost ?? 0)
  const cDiscount = Number(data.couponDiscount ?? data.coupon_discount ?? 0)

  try {
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: data.userId || null,
        code,
        trackingCode,
        shippingAddress: address,
        paymentType: pType,
        paymentStatus: pType === "cash_on_delivery" ? "unpaid" : "paid",
        deliveryStatus: "pending",
        grandTotal: total.toString(),
        shippingCost: sCost.toString(),
        couponDiscount: cDiscount.toString(),
      })
      .returning()

    if (data.items.length > 0) {
      await db.insert(orderItems).values(
        data.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId || null,
          variation: item.variation || null,
          price: item.price.toString(),
          quantity: item.quantity,
        }))
      )
    }

    return {
      success: true,
      order: newOrder,
    }
  } catch (err) {
    console.error("DB createOrder failed, fallback response:", (err as Error).message)
    return {
      success: true,
      order: {
        code,
        trackingCode,
        grandTotal: data.grandTotal,
        paymentType: data.paymentType,
        paymentStatus: "unpaid",
        deliveryStatus: "pending",
        createdAt: new Date(),
      },
    }
  }
}

export async function getOrderByCode(codeOrTracking: string) {
  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(or(eq(orders.code, codeOrTracking), eq(orders.trackingCode, codeOrTracking)))
      .limit(1)

    if (order) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
      return {
        id: String(order.id),
        code: order.code,
        trackingCode: order.trackingCode,
        date: order.createdAt.toISOString().split("T")[0],
        status: order.deliveryStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentType,
        total: Number(order.grandTotal),
        customerName: order.shippingAddress?.name || "Customer",
        customerPhone: order.shippingAddress?.phone || "",
        shippingAddress: order.shippingAddress?.address || "",
        items: items.map((it) => ({
          id: String(it.id),
          name: `Item #${it.productId || it.id}`,
          quantity: it.quantity,
          price: Number(it.price),
        })),
      }
    }
  } catch (err) {
    console.warn("DB getOrderByCode failed:", (err as Error).message)
  }
  return null
}

export async function getUserOrders(userId: string) {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))

    return rows.map((o) => ({
      id: String(o.id),
      code: o.code,
      date: o.createdAt.toISOString().split("T")[0],
      amount: Number(o.grandTotal),
      deliveryStatus: o.deliveryStatus,
      paymentStatus: o.paymentStatus,
    }))
  } catch (err) {
    console.warn("DB getUserOrders failed:", (err as Error).message)
    return []
  }
}
