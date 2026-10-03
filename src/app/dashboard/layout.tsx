import React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { CustomerSidebar } from "./_components/customer-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[85vh] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-3">
            <CustomerSidebar />
          </aside>
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  )
}
