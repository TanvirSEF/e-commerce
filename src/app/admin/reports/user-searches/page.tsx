import React from "react"
import { Metadata } from "next"
import { getUserSearchReport } from "@/services/report-service"
import { UserSearchesView } from "./_components/user-searches-view"

export const metadata: Metadata = {
  title: "User Search Report | Active eCommerce Admin",
}

export default async function AdminUserSearchReportPage() {
  const searches = await getUserSearchReport()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <UserSearchesView searches={searches} />
    </div>
  )
}
