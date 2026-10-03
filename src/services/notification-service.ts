import { db } from "../db"
import {
  customNotifications,
  notificationReads,
  notificationDeletes,
  type CustomNotification,
} from "../db/schema"
import { desc, eq } from "drizzle-orm"


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
  type: "order" | "promo" | "system" | "wallet" | "preorder" | "product" | "payout"
  title: string
  message: string
  orderCode?: string
  trackingCode?: string
  link?: string
  image?: string
  date: string
  isRead: boolean
}

// In-memory fallback caches
const deletedNotificationIds = new Set<string>()
const readNotificationIds = new Set<string>()

export async function getUserNotifications(
  userId: string = "usr_customer_default_01"
): Promise<CustomerNotificationItem[]> {
  const items: CustomerNotificationItem[] = []

  // Track persistent read & deleted IDs for this user
  const userReadIds = new Set<string>(readNotificationIds)
  const userDeletedIds = new Set<string>(deletedNotificationIds)

  try {
    const reads = await db
      .select({ notificationId: notificationReads.notificationId })
      .from(notificationReads)
      .where(eq(notificationReads.userId, userId))
    reads.forEach((r) => userReadIds.add(r.notificationId))

    const dels = await db
      .select({ notificationId: notificationDeletes.notificationId })
      .from(notificationDeletes)
      .where(eq(notificationDeletes.userId, userId))
    dels.forEach((d) => userDeletedIds.add(d.notificationId))
  } catch (err) {
    console.warn("Notification read/delete DB lookup fallback:", err)
  }

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
    .filter((it) => !userDeletedIds.has(it.id))
    .map((it) => ({
      ...it,
      isRead: it.isRead || userReadIds.has(it.id),
    }))
}

export async function deleteUserNotifications(
  ids: string[],
  userId: string = "usr_customer_default_01"
): Promise<{ success: boolean }> {
  for (const id of ids) {
    deletedNotificationIds.add(id)
    try {
      await db.insert(notificationDeletes).values({ userId, notificationId: id }).catch(() => {})
    } catch {}
  }
  return { success: true }
}

export async function markNotificationsAsRead(
  ids?: string[],
  userId: string = "usr_customer_default_01"
): Promise<{ success: boolean }> {
  if (ids && ids.length > 0) {
    for (const id of ids) {
      readNotificationIds.add(id)
      try {
        await db.insert(notificationReads).values({ userId, notificationId: id }).catch(() => {})
      } catch {}
    }
  }
  return { success: true }
}

export async function getAdminNotifications(
  adminId: string = "usr_admin_default_01"
): Promise<CustomerNotificationItem[]> {
  const items: CustomerNotificationItem[] = []
  const userReadIds = new Set<string>(readNotificationIds)
  const userDeletedIds = new Set<string>(deletedNotificationIds)

  try {
    const reads = await db
      .select({ notificationId: notificationReads.notificationId })
      .from(notificationReads)
      .where(eq(notificationReads.userId, adminId))
    reads.forEach((r) => userReadIds.add(r.notificationId))

    const dels = await db
      .select({ notificationId: notificationDeletes.notificationId })
      .from(notificationDeletes)
      .where(eq(notificationDeletes.userId, adminId))
    dels.forEach((d) => userDeletedIds.add(d.notificationId))
  } catch (err) {
    console.warn("Admin notification read/delete DB lookup fallback:", err)
  }

  // 1. Fetch system orders for Admin
  try {
    const { getOrdersAdmin } = await import("./order-service")
    const { orders } = await getOrdersAdmin({ limit: 15 })

    for (const order of orders) {
      items.push({
        id: `admin-order-${order.id}-${order.code}`,
        type: "order",
        title: "New Order Placed",
        message: `A new order: [[${order.code}]] has been placed. Total: ৳${order.total.toLocaleString()}`,
        orderCode: order.code,
        link: `/admin/orders`,
        image: "/assets/img/notification.png",
        date: order.date || new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {
    console.warn("getAdminNotifications orders fallback:", err)
  }

  // 2. Fetch custom notifications
  try {
    const customs = await getAllCustomNotifications()
    for (const c of customs) {
      items.push({
        id: `admin-custom-${c.id}`,
        type: c.notificationType === "Promotional" ? "promo" : "system",
        title: c.title,
        message: c.content,
        link: c.link || "/admin/notifications",
        image: "/assets/img/notification.png",
        date: c.createdAt ? c.createdAt.toISOString().slice(0, 10) : "2026-03-20",
        isRead: false,
      })
    }
  } catch (err) {}

  return items
    .filter((it) => !userDeletedIds.has(it.id))
    .map((it) => ({
      ...it,
      isRead: it.isRead || userReadIds.has(it.id),
    }))
}

export async function getSellerNotifications(
  userId: string = "usr_seller_default_01"
): Promise<CustomerNotificationItem[]> {
  const items: CustomerNotificationItem[] = []
  const userReadIds = new Set<string>(readNotificationIds)
  const userDeletedIds = new Set<string>(deletedNotificationIds)

  try {
    const reads = await db
      .select({ notificationId: notificationReads.notificationId })
      .from(notificationReads)
      .where(eq(notificationReads.userId, userId))
    reads.forEach((r) => userReadIds.add(r.notificationId))

    const dels = await db
      .select({ notificationId: notificationDeletes.notificationId })
      .from(notificationDeletes)
      .where(eq(notificationDeletes.userId, userId))
    dels.forEach((d) => userDeletedIds.add(d.notificationId))
  } catch (err) {
    console.warn("Seller notification read/delete DB lookup fallback:", err)
  }

  // Determine seller store info
  let shopId = 1
  let shopName = "Active Fashion Outlet"
  try {
    const { shops } = await import("../db/schema")
    const [shop] = await db
      .select({ id: shops.id, name: shops.name })
      .from(shops)
      .where(eq(shops.userId, userId))
      .limit(1)
    if (shop) {
      shopId = shop.id
      shopName = shop.name
    }
  } catch {}

  // 1. Fetch Real Seller Orders
  try {
    const { getSellerOrders } = await import("./order-service")
    const { orders } = await getSellerOrders({ shopId, userId, limit: 20 })

    for (const order of orders) {
      items.push({
        id: `seller-order-${order.id}-${order.code}`,
        type: "order",
        title: "Order Placed",
        message: `Order: [[${order.code}]] has been Placed`,
        orderCode: order.code,
        link: `/seller/orders/${order.id}`,
        image: "/assets/img/notification.png",
        date: order.date || new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {
    console.warn("getSellerNotifications orders error:", err)
  }

  // 2. Fetch Real Preorder Orders
  try {
    const { preorderOrders } = await import("../db/schema/preorder")
    const pOrders = await db
      .select()
      .from(preorderOrders)
      .orderBy(desc(preorderOrders.createdAt))
      .limit(10)

    for (const po of pOrders) {
      items.push({
        id: `seller-preorder-${po.id}-${po.orderCode}`,
        type: "preorder",
        title: "Preorder Placed",
        message: `Preorder: [[${po.orderCode}]] for "${po.productName}" has been received`,
        orderCode: po.orderCode,
        link: `/seller/preorder/orders`,
        image: po.productThumbnail || "/assets/img/notification.png",
        date: po.createdAt ? po.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {}

  // 3. Fetch Products Updates / Status
  try {
    const { products } = await import("../db/schema/products")
    const pList = await db
      .select({ id: products.id, name: products.name, published: products.published, createdAt: products.createdAt })
      .from(products)
      .where(eq(products.shopId, shopId))
      .orderBy(desc(products.createdAt))
      .limit(10)

    for (const p of pList) {
      items.push({
        id: `seller-prod-${p.id}`,
        type: "product",
        title: p.published ? "Product Published" : "Product Under Review",
        message: `Product [[${p.name}]] is ${p.published ? "published and live" : "under review"}`,
        link: `/seller/products`,
        image: "/assets/img/notification.png",
        date: p.createdAt ? p.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {}

  // 4. Fetch Seller Payout / Withdrawal Updates
  try {
    const { sellerWithdrawRequests } = await import("../db/schema/shops")
    const payouts = await db
      .select()
      .from(sellerWithdrawRequests)
      .where(eq(sellerWithdrawRequests.shopId, shopId))
      .orderBy(desc(sellerWithdrawRequests.createdAt))
      .limit(10)

    for (const pay of payouts) {
      const statusText =
        pay.status === "paid"
          ? "has been approved and paid"
          : pay.status === "pending"
          ? "is pending review"
          : "has been rejected"
      items.push({
        id: `seller-payout-${pay.id}`,
        type: "payout",
        title: `Payout ${pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}`,
        message: `Your withdrawal request of [[৳${Number(pay.amount).toLocaleString()}]] ${statusText}`,
        link: `/seller/payouts`,
        image: "/assets/img/notification.png",
        date: pay.createdAt ? pay.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        isRead: false,
      })
    }
  } catch (err) {}

  // Initial canonical seed items if store has no records yet
  if (items.length === 0) {
    items.push(
      {
        id: "seed-seller-1",
        type: "order",
        title: "Order Placed",
        message: "Order: [[20260923-847291]] has been Placed",
        orderCode: "20260923-847291",
        link: "/seller/orders",
        image: "/assets/img/notification.png",
        date: "2026-09-23",
        isRead: false,
      },
      {
        id: "seed-seller-2",
        type: "payout",
        title: "Payout Approved",
        message: "Your withdrawal request for [[৳15,000]] has been approved and processed.",
        link: "/seller/payouts",
        image: "/assets/img/notification.png",
        date: "2026-09-21",
        isRead: true,
      },
      {
        id: "seed-seller-3",
        type: "product",
        title: "Product Approved",
        message: 'Your product [["Casual Slim Fit Cotton Shirt"]] is now active.',
        link: "/seller/products",
        image: "/assets/img/notification.png",
        date: "2026-09-18",
        isRead: true,
      }
    )
  }

  return items
    .filter((it) => !userDeletedIds.has(it.id))
    .map((it) => ({
      ...it,
      isRead: it.isRead || userReadIds.has(it.id),
    }))
}




