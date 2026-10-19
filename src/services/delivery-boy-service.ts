import { db } from "@/db"
import {
  deliveryBoys,
  deliveryCollections,
  deliveryPayouts,
  deliveryCancelRequests,
  type DeliveryBoy,
  type DeliveryCollection,
  type DeliveryPayout,
  type DeliveryCancelRequest,
} from "@/db/schema/delivery-boy"
import { businessSettings } from "@/db/schema/settings"
import { desc, eq, inArray } from "drizzle-orm"

export const SEED_DELIVERY_BOYS = [
  {
    name: "Tariqul Islam",
    email: "tariq.courier@example.com",
    phone: "+880 1711-892341",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    zoneId: 1,
    zoneName: "Dhaka Metro North",
    status: true,
    totalEarnings: "640.00",
    totalCollection: "3480.00",
    currentPendingDeliveries: 4,
  },
]

export const SEED_DELIVERY_COLLECTIONS = [
  {
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    orderCode: "ORD-202609-1002",
    amount: "145.00",
  },
]

export const SEED_DELIVERY_PAYOUTS = [
  {
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    amount: "400.00",
    paymentMethod: "bKash Agent",
  },
]

export const SEED_DELIVERY_CANCELS = [
  {
    deliveryBoyId: 1,
    deliveryBoyName: "Tariqul Islam",
    orderCode: "ORD-202609-0994",
    reason: "Recipient phone switched off for 3 consecutive delivery attempts at specified address.",
    status: "pending",
  },
]

export const SEED_DELIVERY_CONFIG = {
  commission_type: "fixed",
  commission_value: "3.50",
  cash_collection_limit: "5000.00",
  cancel_request_verification: true,
}

// 1. Get all delivery boys
export async function getAllDeliveryBoys(): Promise<DeliveryBoy[]> {
  return await db.select().from(deliveryBoys).orderBy(desc(deliveryBoys.createdAt))
}

// 2. Get delivery boy by ID
export async function getDeliveryBoyById(id: number): Promise<DeliveryBoy | null> {
  const rows = await db.select().from(deliveryBoys).where(eq(deliveryBoys.id, id))
  return rows[0] || null
}

// 3. Create a new delivery boy
export async function createDeliveryBoy(data: {
  name: string
  email: string
  phone: string
  password?: string
  zoneId?: number
  zoneName?: string
  city?: string
  address?: string
  monthlySalary?: string
  commissionRate?: string
  avatar?: string
}): Promise<DeliveryBoy> {
  const [newBoy] = await db
    .insert(deliveryBoys)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || "/assets/img/placeholder.jpg",
      zoneId: data.zoneId || 1,
      zoneName: data.zoneName || "Dhaka Metro North",
      city: data.city || null,
      address: data.address || null,
      monthlySalary: data.monthlySalary || "0.00",
      commissionRate: data.commissionRate || "0.00",
      status: true,
      totalEarnings: "0.00",
      totalCollection: "0.00",
      currentPendingDeliveries: 0,
      createdAt: new Date(),
    })
    .returning()

  // Optionally create user credential if password provided
  if (data.password) {
    try {
      const { hashPassword } = await import("better-auth/crypto")
      const passwordHash = await hashPassword(data.password)
      const { users, accounts } = await import("@/db/schema/auth")

      const userId = `usr_db_${newBoy.id}_${Date.now()}`
      await db.insert(users).values({
        id: userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "delivery_boy",
        createdAt: new Date(),
      })

      await db.insert(accounts).values({
        id: `acc_db_${newBoy.id}`,
        userId,
        accountId: userId,
        providerId: "credential",
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (e) {
      console.warn("Notice: Delivery boy user credential generation skipped:", e)
    }
  }

  return newBoy
}

// 4. Toggle delivery boy ban status
export async function toggleDeliveryBoyBan(id: number): Promise<{ success: boolean }> {
  const boy = await getDeliveryBoyById(id)
  if (!boy) throw new Error("Delivery personnel not found")
  await db.update(deliveryBoys).set({ status: !boy.status }).where(eq(deliveryBoys.id, id))
  return { success: true }
}

// 5. Collect cash from delivery boy (collection-from-delivery-boy in Laravel)
export async function collectCashFromDeliveryBoy(data: {
  deliveryBoyId: number
  amount: string
  orderCode?: string
  notes?: string
}): Promise<{ success: boolean }> {
  const boy = await getDeliveryBoyById(data.deliveryBoyId)
  if (!boy) throw new Error("Delivery personnel not found")

  const collectAmount = parseFloat(data.amount)
  if (isNaN(collectAmount) || collectAmount <= 0) {
    throw new Error("Invalid collection amount")
  }

  // Insert collection record
  await db.insert(deliveryCollections).values({
    deliveryBoyId: data.deliveryBoyId,
    deliveryBoyName: boy.name,
    orderCode: data.orderCode || `COL-${Date.now().toString().slice(-6)}`,
    amount: collectAmount.toFixed(2),
    collectionDate: new Date(),
  })

  // Deduct collection from courier
  const currentCollection = parseFloat(boy.totalCollection || "0")
  const newCollection = Math.max(0, currentCollection - collectAmount).toFixed(2)

  await db
    .update(deliveryBoys)
    .set({ totalCollection: newCollection })
    .where(eq(deliveryBoys.id, data.deliveryBoyId))

  return { success: true }
}

// 6. Pay to delivery boy (paid-to-delivery-boy in Laravel)
export async function payToDeliveryBoy(data: {
  deliveryBoyId: number
  amount: string
  paymentMethod: string
  txnCode?: string
  notes?: string
}): Promise<{ success: boolean }> {
  const boy = await getDeliveryBoyById(data.deliveryBoyId)
  if (!boy) throw new Error("Delivery personnel not found")

  const payAmount = parseFloat(data.amount)
  if (isNaN(payAmount) || payAmount <= 0) {
    throw new Error("Invalid payment amount")
  }

  // Insert payout record
  await db.insert(deliveryPayouts).values({
    deliveryBoyId: data.deliveryBoyId,
    deliveryBoyName: boy.name,
    amount: payAmount.toFixed(2),
    paymentMethod: data.paymentMethod || "Cash",
    txnCode: data.txnCode || null,
    notes: data.notes || null,
    paymentDate: new Date(),
  })

  // Deduct earnings balance
  const currentEarnings = parseFloat(boy.totalEarnings || "0")
  const newEarnings = Math.max(0, currentEarnings - payAmount).toFixed(2)

  await db
    .update(deliveryBoys)
    .set({ totalEarnings: newEarnings })
    .where(eq(deliveryBoys.id, data.deliveryBoyId))

  return { success: true }
}

// 7. Get all delivery collections
export async function getAllDeliveryCollections(): Promise<DeliveryCollection[]> {
  return await db.select().from(deliveryCollections).orderBy(desc(deliveryCollections.collectionDate))
}

// 8. Get all delivery payouts
export async function getAllDeliveryPayouts(): Promise<DeliveryPayout[]> {
  return await db.select().from(deliveryPayouts).orderBy(desc(deliveryPayouts.paymentDate))
}

// 9. Get all delivery cancel requests
export async function getAllDeliveryCancelRequests(): Promise<DeliveryCancelRequest[]> {
  return await db.select().from(deliveryCancelRequests).orderBy(desc(deliveryCancelRequests.createdAt))
}

// 10. Update delivery cancel request status
export async function updateDeliveryCancelRequestStatus(
  id: number,
  status: "approved" | "rejected"
): Promise<{ success: boolean }> {
  const rows = await db
    .select()
    .from(deliveryCancelRequests)
    .where(eq(deliveryCancelRequests.id, id))
  const req = rows[0]
  if (!req) throw new Error("Cancellation request not found")

  await db
    .update(deliveryCancelRequests)
    .set({ status })
    .where(eq(deliveryCancelRequests.id, id))

  // If approved, update order status if matching order exists
  if (status === "approved" && req.orderCode) {
    try {
      const { orders } = await import("@/db/schema/orders")
      const [ord] = await db
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.code, req.orderCode))
        .limit(1)

      await db
        .update(orders)
        .set({ deliveryStatus: "cancelled" })
        .where(eq(orders.code, req.orderCode))

      if (ord?.id) {
        const { handleOrderCancellation } = await import("./order-service")
        await handleOrderCancellation(ord.id)
      }
    } catch (e) {
      console.warn("Notice: Order status update skipped:", e)
    }
  }

  return { success: true }
}

// 11. Get delivery boy configuration from business_settings
export async function getDeliveryBoyConfig(): Promise<{
  commission_type: string
  commission_value: string
  monthly_salary: string
  cash_collection_limit: string
  mail_notification: boolean
  otp_notification: boolean
}> {
  const keys = [
    "delivery_boy_payment_type",
    "delivery_boy_commission",
    "delivery_boy_monthly_salary",
    "delivery_boy_cash_collection_limit",
    "delivery_boy_mail_notification",
    "delivery_boy_otp_notification",
  ]

  const rows = await db
    .select()
    .from(businessSettings)
    .where(inArray(businessSettings.type, keys))

  const settingsMap = new Map(rows.map((r) => [r.type, r.value]))

  return {
    commission_type: settingsMap.get("delivery_boy_payment_type") || "commission",
    commission_value: settingsMap.get("delivery_boy_commission") || "3.50",
    monthly_salary: settingsMap.get("delivery_boy_monthly_salary") || "15000.00",
    cash_collection_limit: settingsMap.get("delivery_boy_cash_collection_limit") || "5000.00",
    mail_notification: settingsMap.get("delivery_boy_mail_notification") !== "0",
    otp_notification: settingsMap.get("delivery_boy_otp_notification") !== "0",
  }
}

// 12. Update delivery boy configuration in business_settings
export async function updateDeliveryBoyConfig(data: {
  commission_type?: string
  commission_value?: string
  monthly_salary?: string
  cash_collection_limit?: string
  mail_notification?: boolean
  otp_notification?: boolean
}): Promise<{ success: boolean }> {
  const updates: Record<string, string> = {}

  if (data.commission_type !== undefined) {
    updates["delivery_boy_payment_type"] = data.commission_type
  }
  if (data.commission_value !== undefined) {
    updates["delivery_boy_commission"] = data.commission_value
  }
  if (data.monthly_salary !== undefined) {
    updates["delivery_boy_monthly_salary"] = data.monthly_salary
  }
  if (data.cash_collection_limit !== undefined) {
    updates["delivery_boy_cash_collection_limit"] = data.cash_collection_limit
  }
  if (data.mail_notification !== undefined) {
    updates["delivery_boy_mail_notification"] = data.mail_notification ? "1" : "0"
  }
  if (data.otp_notification !== undefined) {
    updates["delivery_boy_otp_notification"] = data.otp_notification ? "1" : "0"
  }

  for (const [type, value] of Object.entries(updates)) {
    await db
      .insert(businessSettings)
      .values({ type, value })
      .onConflictDoUpdate({
        target: businessSettings.type,
        set: { value },
      })
  }

  return { success: true }
}

export interface DeliveryBoyOrderItem {
  id: number
  code: string
  trackingCode: string
  customer: string
  phone: string
  address: string
  amount: string
  paymentType: string
  paymentStatus: string
  deliveryStatus: string
  date: string
}

export async function getDeliveryBoyAssignedOrders(
  deliveryBoyId?: number,
  status: "assigned" | "completed" = "assigned"
): Promise<DeliveryBoyOrderItem[]> {
  try {
    const { orders } = await import("@/db/schema/orders")
    const { users } = await import("@/db/schema/auth")
    const { eq, desc, or } = await import("drizzle-orm")

    const condition =
      status === "completed"
        ? eq(orders.deliveryStatus, "delivered")
        : or(
            eq(orders.deliveryStatus, "on_delivery"),
            eq(orders.deliveryStatus, "pending"),
            eq(orders.deliveryStatus, "confirmed"),
            eq(orders.deliveryStatus, "on_the_way")
          )

    const rows = await db
      .select({
        id: orders.id,
        code: orders.code,
        trackingCode: orders.trackingCode,
        shippingAddress: orders.shippingAddress,
        grandTotal: orders.grandTotal,
        paymentType: orders.paymentType,
        paymentStatus: orders.paymentStatus,
        deliveryStatus: orders.deliveryStatus,
        createdAt: orders.createdAt,
        userName: users.name,
        userPhone: users.phone,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(condition)
      .orderBy(desc(orders.createdAt))
      .limit(20)

    return rows.map((r) => {
      const addr = r.shippingAddress || {}
      return {
        id: r.id,
        code: r.code,
        trackingCode: r.trackingCode,
        customer: addr.name || r.userName || "Customer",
        phone: addr.phone || r.userPhone || "+880 1700-000000",
        address: [addr.address, addr.city, addr.country].filter(Boolean).join(", ") || "Dhaka, Bangladesh",
        amount: Number(r.grandTotal || 0).toFixed(2),
        paymentType: r.paymentType === "cash_on_delivery" ? "Cash on Delivery" : "Paid Online",
        paymentStatus: r.paymentStatus,
        deliveryStatus: r.deliveryStatus,
        date: r.createdAt ? r.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }
    })
  } catch (err) {
    console.error("getDeliveryBoyAssignedOrders error:", err)
    return []
  }
}

export async function confirmOrderDeliveryDrop(data: {
  orderId: number
  deliveryBoyId: number
  collectedAmount?: number
  paymentType?: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const { orders } = await import("@/db/schema/orders")
    const { awardOrderClubPoints } = await import("@/services/wallet-service")

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, data.orderId))
      .limit(1)

    if (!order) return { success: false, message: "Order not found" }

    await db
      .update(orders)
      .set({
        deliveryStatus: "delivered",
        ...(order.paymentType === "cash_on_delivery" ? { paymentStatus: "paid" } : {}),
        deliveryViewed: false,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, data.orderId))

    const amountToCollect = data.collectedAmount || Number(order.grandTotal) || 0
    if (order.paymentType === "cash_on_delivery" && amountToCollect > 0) {
      const boy = await getDeliveryBoyById(data.deliveryBoyId)
      await db.insert(deliveryCollections).values({
        deliveryBoyId: data.deliveryBoyId,
        deliveryBoyName: boy?.name || "Delivery Courier",
        orderCode: order.code,
        amount: amountToCollect.toFixed(2),
        collectionDate: new Date(),
      })

      if (boy) {
        const newCollection = (Number(boy.totalCollection || 0) + amountToCollect).toFixed(2)
        const newEarnings = (Number(boy.totalEarnings || 0) + 50).toFixed(2)
        await db
          .update(deliveryBoys)
          .set({
            totalCollection: newCollection,
            totalEarnings: newEarnings,
            currentPendingDeliveries: Math.max(0, (boy.currentPendingDeliveries || 1) - 1),
          })
          .where(eq(deliveryBoys.id, data.deliveryBoyId))
      }
    }

    await awardOrderClubPoints(order.id)
    return { success: true }
  } catch (err: any) {
    console.error("confirmOrderDeliveryDrop error:", err)
    return { success: false, message: err?.message }
  }
}
