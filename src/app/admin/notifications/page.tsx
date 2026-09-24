import React from "react"
import type { Metadata } from "next"
import { db } from "@/db"
import { users } from "@/db/schema"
import { getAllCustomNotifications } from "@/services/notification-service"
import { NotificationsView } from "./_components/notifications-view"

export const metadata: Metadata = {
  title: "Custom Notifications | Admin | Active eCommerce",
  description: "Send push notifications to customers in Active eCommerce CMS",
}

export default async function AdminNotificationsPage() {
  let customerList: { id: string; name: string; email: string; phone?: string }[] = []

  try {
    const rows = await db.select().from(users).limit(100)
    customerList = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || undefined,
    }))
  } catch (err) {
    console.warn("DB customers fallback:", err)
  }

  if (customerList.length === 0) {
    customerList = [
      { id: "usr_1", name: "Tanvir Ahmed", email: "tanvir@example.com", phone: "+880 1711-223344" },
      { id: "usr_2", name: "Sakib Al Hasan", email: "sakib@example.com", phone: "+880 1722-334455" },
      { id: "usr_3", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+880 1833-445566" },
      { id: "usr_4", name: "Mahmudullah Riyad", email: "mahmud@example.com", phone: "+880 1944-556677" },
    ]
  }

  const history = await getAllCustomNotifications()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <NotificationsView customers={customerList} history={history} />
    </div>
  )
}
