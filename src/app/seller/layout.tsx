"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { SellerSidebar } from "./_components/seller-sidebar"
import { SellerHeader } from "./_components/seller-header"

export default function SellerPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Login and register use default storefront layout
  if (
    pathname === "/seller/login" ||
    pathname === "/seller/register"
  ) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <SellerHeader onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
