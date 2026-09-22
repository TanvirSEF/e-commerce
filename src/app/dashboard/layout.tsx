import React from "react"
import { CustomerSidebar } from "./_components/customer-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
