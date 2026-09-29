import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"

import {
  getUserNotifications,
  getAdminNotifications,
  markNotificationsAsRead,
  deleteUserNotifications,
} from "@/services/notification-service"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const variant = req.nextUrl.searchParams.get("variant") || "storefront"

    let notifications
    if (variant === "admin") {
      const adminId = session?.user?.id || "usr_admin_default_01"
      notifications = await getAdminNotifications(adminId)
    } else {
      const userId = session?.user?.id || "usr_customer_default_01"
      notifications = await getUserNotifications(userId)
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      authenticated: !!session?.user,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const variant = req.nextUrl.searchParams.get("variant") || "storefront"
    const userId = session?.user?.id || (variant === "admin" ? "usr_admin_default_01" : "usr_customer_default_01")
    const body = await req.json()

    const fetchCurrent = () => (variant === "admin" ? getAdminNotifications(userId) : getUserNotifications(userId))

    if (body.action === "mark_all_read") {
      const all = await fetchCurrent()
      const ids = all.filter((n) => !n.isRead).map((n) => n.id)
      await markNotificationsAsRead(ids, userId)
      return NextResponse.json({ success: true, unreadCount: 0 })
    }

    if (body.action === "mark_read" && body.id) {
      await markNotificationsAsRead([body.id], userId)
      const all = await fetchCurrent()
      const unreadCount = all.filter((n) => !n.isRead).length
      return NextResponse.json({ success: true, unreadCount })
    }

    if (body.action === "delete" && Array.isArray(body.ids)) {
      await deleteUserNotifications(body.ids, userId)
      const all = await fetchCurrent()
      const unreadCount = all.filter((n) => !n.isRead).length
      return NextResponse.json({ success: true, unreadCount })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update notifications" },
      { status: 500 }
    )
  }
}
