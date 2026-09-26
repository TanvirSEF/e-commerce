import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"

import { getUserNotifications } from "@/services/notification-service"
import { CustomerNotificationsView } from "./_components/customer-notifications-view"

export const metadata: Metadata = {
  title: "Notifications | Active eCommerce",
  description: "View all your order updates, delivery statuses, and store announcements in one place.",
}

export default async function CustomerNotificationsPage() {
  let userId = "usr_customer_default_01"
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user?.id) {
      userId = session.user.id
    }
  } catch (e) {
    console.warn("Session fetch fallback on notifications page:", e)
  }

  const notifications = await getUserNotifications(userId)

  return <CustomerNotificationsView initialNotifications={notifications} />
}

