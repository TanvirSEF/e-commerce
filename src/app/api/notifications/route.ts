import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"

import {
  getUserNotifications,
  markNotificationsAsRead,
  deleteUserNotifications,
} from "@/services/notification-service"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id || "usr_customer_default_01"

    const notifications = await getUserNotifications(userId)
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
    const userId = session?.user?.id || "usr_customer_default_01"
    const body = await req.json()

    if (body.action === "mark_all_read") {
      const all = await getUserNotifications(userId)
      const ids = all.filter((n) => !n.isRead).map((n) => n.id)
      await markNotificationsAsRead(ids, userId)
      return NextResponse.json({ success: true, unreadCount: 0 })
    }

    if (body.action === "mark_read" && body.id) {
      await markNotificationsAsRead([body.id], userId)
      const all = await getUserNotifications(userId)
      const unreadCount = all.filter((n) => !n.isRead).length
      return NextResponse.json({ success: true, unreadCount })
    }

    if (body.action === "delete" && Array.isArray(body.ids)) {
      await deleteUserNotifications(body.ids, userId)
      const all = await getUserNotifications(userId)
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
