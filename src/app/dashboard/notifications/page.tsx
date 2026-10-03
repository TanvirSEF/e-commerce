import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"

import { getUserNotifications } from "@/services/notification-service"
import { CustomerNotificationsView } from "./_components/customer-notifications-view"

export const metadata: Metadata = {
  title: "Notifications | Active eCommerce",
  description: "View all your order updates, delivery statuses, and store announcements in one place.",
}

export default async function CustomerNotificationsPage() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const notifications = await getUserNotifications(session.user.id)

  return <CustomerNotificationsView initialNotifications={notifications} />
}

