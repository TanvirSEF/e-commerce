import { db } from "../db"
import { customNotifications, type CustomNotification } from "../db/schema"
import { desc } from "drizzle-orm"

const SEED_NOTIFICATIONS: CustomNotification[] = [
  {
    id: 1,
    title: "Weekend Flash Mega Sale Announcement",
    content: "Up to 50% discount on all electronics and fashion items this weekend only!",
    link: "https://active-ecommerce.test/flash-deals",
    notificationType: "Promotional",
    recipientCount: 1540,
    createdAt: new Date("2026-03-15 10:00:00"),
  },
  {
    id: 2,
    title: "System Maintenance Completed",
    content: "Our servers have been upgraded for faster checkout speeds. Enjoy smooth shopping!",
    link: null,
    notificationType: "System Notice",
    recipientCount: 3200,
    createdAt: new Date("2026-03-01 14:30:00"),
  },
]

export async function getAllCustomNotifications(): Promise<CustomNotification[]> {
  try {
    const list = await db
      .select()
      .from(customNotifications)
      .orderBy(desc(customNotifications.createdAt))

    if (!list || list.length === 0) {
      return SEED_NOTIFICATIONS
    }
    return list
  } catch (error) {
    console.warn("DB getAllCustomNotifications fallback:", error)
    return SEED_NOTIFICATIONS
  }
}

export async function sendCustomNotification(data: {
  title: string
  content: string
  link?: string
  notificationType?: string
  recipientCount?: number
}): Promise<CustomNotification | null> {
  try {
    const [inserted] = await db
      .insert(customNotifications)
      .values({
        title: data.title,
        content: data.content,
        link: data.link || null,
        notificationType: data.notificationType || "General",
        recipientCount: data.recipientCount || 0,
      })
      .returning()
    return inserted || null
  } catch (error) {
    console.error("Failed to send custom notification:", error)
    return null
  }
}

export interface CustomerNotificationItem {
  id: string
  type: "order" | "promo" | "system" | "wallet"
  title: string
  message: string
  orderCode?: string
  trackingCode?: string
  link?: string
  image?: string
  date: string
  isRead: boolean
}

// In-memory deleted IDs store for user sessions (or DB backing)
const deletedNotificationIds = new Set<string>()
const readNotificationIds = new Set<string>()

export async function getUserNotifications(
  userId: string = "usr_customer_default_01"
): Promise<CustomerNotificationItem[]> {
  const items: CustomerNotificationItem[] = []

  // 1. Fetch real customer orders to generate Laravel-exact Order Notifications
  try {
    const { getUserOrders } = await import("./order-service")
    const orders = await getUserOrders(userId)

    for (const order of orders) {
      const orderCode = order.code
      let title = "Order Placed"
      let statusText = "has been Placed"
      if (order.deliveryStatus === "delivered") {
        title = "Order Delivered"
        statusText = "has been delivered"
      } else if (order.deliveryStatus === "on_the_way" || order.deliveryStatus === "shipped") {
        title = "Order On the Way"
        statusText = "is on the way"
      } else if (order.deliveryStatus === "confirmed") {
        title = "Order Confirmed"
        statusText = "has been Confirmed"
      }

      items.push({
        id: `ord-notif-${order.id}-${orderCode}`,
        type: "order",
        title,
        message: `Your Order: [[${orderCode}]] ${statusText}`,
        orderCode,
        trackingCode: `TRK-${orderCode.replace(/\D/g, "").slice(-8)}`,
        link: `/order-confirmed/${orderCode}`,
        date: order.date || new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {
    console.warn("getUserNotifications order fetch fallback:", err)
  }

  // 2. Fetch Admin Broadcast Custom Notifications
  try {
    const customs = await getAllCustomNotifications()
    for (const c of customs) {
      items.push({
        id: `custom-notif-${c.id}`,
        type: c.notificationType === "Promotional" ? "promo" : "system",
        title: c.title,
        message: c.content,
        link: c.link || "/products",
        date: c.createdAt ? c.createdAt.toISOString().slice(0, 10) : "2026-03-20",
        isRead: false,
      })
    }
  } catch (err) {
    console.warn("getUserNotifications custom fetch fallback:", err)
  }

  // 3. If no items yet, provide canonical Laravel seed notifications
  if (items.length === 0) {
    items.push(
      {
        id: "seed-1",
        type: "order",
        title: "Order Placed",
        message: "Your Order: [[20260923-847291]] has been Placed",
        orderCode: "20260923-847291",
        trackingCode: "TRK-847291",
        link: "/order-confirmed/20260923-847291",
        date: "2026-09-23",
        isRead: false,
      },
      {
        id: "seed-2",
        type: "order",
        title: "Order Delivered",
        message: "Your Order: [[20260918-192842]] has been delivered",
        orderCode: "20260918-192842",
        trackingCode: "TRK-192842",
        link: "/order-confirmed/20260918-192842",
        date: "2026-09-18",
        isRead: true,
      },
      {
        id: "seed-3",
        type: "promo",
        title: "Welcome Coupon Activated",
        message: "Welcome Coupon 10% Discount on your purchase within 30 days of Registration (Code: WELCOME10)",
        link: "/products",
        date: "2026-09-10",
        isRead: true,
      },
      {
        id: "seed-4",
        type: "promo",
        title: "Weekend Flash Mega Sale Announcement",
        message: "Up to 50% discount on all electronics and fashion items this weekend only!",
        link: "/products",
        date: "2026-09-05",
        isRead: true,
      }
    )
  }

  // Filter out any deleted notifications and apply read status
  return items
    .filter((it) => !deletedNotificationIds.has(it.id))
    .map((it) => ({
      ...it,
      isRead: it.isRead || readNotificationIds.has(it.id),
    }))
}

export async function deleteUserNotifications(ids: string[]): Promise<{ success: boolean }> {
  for (const id of ids) {
    deletedNotificationIds.add(id)
  }
  return { success: true }
}

export async function markNotificationsAsRead(ids?: string[]): Promise<{ success: boolean }> {
  if (ids && ids.length > 0) {
    for (const id of ids) {
      readNotificationIds.add(id)
    }
  }
  return { success: true }
}
