import React from "react"
import { getSubscribers } from "@/services/marketing-service"
import { SubscribersAdminView } from "./_components/subscribers-admin-view"

export const metadata = {
  title: "Subscribers List | Admin Panel",
}

export default async function AdminSubscribersPage() {
  const subscribers = await getSubscribers()

  return <SubscribersAdminView initialSubscribers={subscribers} />
}
