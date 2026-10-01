"use client"

import React, { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import type { AdminProfileData } from "@/services/admin-profile-service"

interface AdminShellProps {
  children: React.ReactNode
  initialProfile?: AdminProfileData
  initialDisabledAddons?: string[]
}

export function AdminShell({ children, initialProfile, initialDisabledAddons = [] }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        initialDisabledAddons={initialDisabledAddons}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          initialProfile={initialProfile}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
