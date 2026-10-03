import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/session-helper"

import {
  getUserNotifications,
  getAdminNotifications,
  markNotificationsAsRead,
  deleteUserNotifications,
} from "@/services/notification-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const variant = req.nextUrl.searchParams.get("variant") || "storefront"

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        notifications: [],
        unreadCount: 0,
        authenticated: false,
      })
    }

    let notifications
    if (variant === "admin") {
      notifications = await getAdminNotifications(session.user.id)
    } else {
      notifications = await getUserNotifications(session.user.id)
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      authenticated: true,
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
    const session = await getServerSession()
    const variant = req.nextUrl.searchParams.get("variant") || "storefront"

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }
    const userId = session.user.id
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
