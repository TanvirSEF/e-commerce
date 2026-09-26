import { Metadata } from "next"
import { getUserNotifications } from "@/services/notification-service"
import { CustomerNotificationsView } from "./_components/customer-notifications-view"

export const metadata: Metadata = {
  title: "Notifications | Active eCommerce",
  description: "View all your order updates, delivery statuses, and store announcements in one place.",
}

// Default user ID for customer operations
const CURRENT_USER_ID = "usr_customer_default_01"

export default async function CustomerNotificationsPage() {
  const notifications = await getUserNotifications(CURRENT_USER_ID)

  return <CustomerNotificationsView initialNotifications={notifications} />
}
