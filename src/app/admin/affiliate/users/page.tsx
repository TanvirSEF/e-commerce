import React from "react"
import { getAllAffiliateUsers } from "@/services/affiliate-service"
import { AdminAffiliateUsersView } from "./_components/admin-affiliate-users-view"

export const metadata = {
  title: "Affiliate Partners & Users | Admin Panel",
}

export default async function AdminAffiliateUsersPage() {
  const users = await getAllAffiliateUsers()
  return <AdminAffiliateUsersView users={users} />
}
