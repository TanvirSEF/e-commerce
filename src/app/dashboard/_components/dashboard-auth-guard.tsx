"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated via state or persistent storage
    const stored = typeof window !== "undefined" ? localStorage.getItem("active_ecom_user") : null
    if (!stored && !user) {
      router.push("/login")
    } else {
      setChecking(false)
    }
  }, [user, router])

  if (checking) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#d43533]" />
        <span className="text-xs text-gray-500 font-medium">Checking authentication...</span>
      </div>
    )
  }

  return <>{children}</>
}
