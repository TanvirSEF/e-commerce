"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Globe, LogOut, User, ShieldCheck } from "lucide-react"
import { NotificationBell } from "@/components/layout/notification-bell"
import type { AdminProfileData } from "@/services/admin-profile-service"

interface AdminHeaderProps {
  onToggleSidebar: () => void
  initialProfile?: AdminProfileData
}

export function AdminHeader({ onToggleSidebar, initialProfile }: AdminHeaderProps) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<AdminProfileData | undefined>(initialProfile)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [imgError, setImgError] = useState(false)

  const getBreadcrumbs = () => {
    if (!pathname || pathname === "/admin") return ["Overview"]
    if (pathname.startsWith("/admin/products/create")) return ["Products", "Product Editor"]
    if (pathname.startsWith("/admin/products/category-discount")) return ["Products", "Category Discount"]
    if (pathname.startsWith("/admin/products/smart-bar")) return ["Products", "Smart Bar"]
    if (pathname.startsWith("/admin/products/size-charts")) return ["Products", "Size Charts"]
    if (pathname.startsWith("/admin/products/measurement-points")) return ["Products", "Measurement Points"]
    if (pathname.startsWith("/admin/products/attributes")) return ["Products", "Attributes"]
    if (pathname.startsWith("/admin/products/colors")) return ["Products", "Colors"]
    if (pathname.startsWith("/admin/products/warranties")) return ["Products", "Warranties"]
    if (pathname.startsWith("/admin/digital-products/create")) return ["Products", "Digital Product Editor"]
    if (pathname.startsWith("/admin/digital-products")) return ["Products", "Digital Products"]
    if (pathname.startsWith("/admin/products")) return ["Products", "All Products"]
    if (pathname.startsWith("/admin/pos-activation")) return ["POS System", "POS Configuration"]
    if (pathname.startsWith("/admin/pos-orders")) return ["POS System", "POS Orders"]
    if (pathname.startsWith("/admin/pos")) return ["POS System", "POS Manager"]
    if (pathname.startsWith("/admin/orders")) return ["Sales", "All Orders"]
    if (pathname.startsWith("/admin/categories")) return ["Products", "Categories"]
    if (pathname.startsWith("/admin/brands/bulk-upload")) return ["Products", "Brands", "Bulk Upload"]
    if (pathname.startsWith("/admin/brands")) return ["Products", "Brands"]
    if (pathname.startsWith("/admin/customers")) return ["Customers", "All Customers"]
    if (pathname.startsWith("/admin/sellers")) return ["Sellers", "All Sellers"]
    if (pathname.startsWith("/admin/custom-labels/create")) return ["Marketing", "Custom Labels", "Create"]
    if (pathname.startsWith("/admin/custom-labels")) return ["Marketing", "Custom Labels"]
    if (pathname.startsWith("/admin/settings")) return ["Settings", "General Settings"]

    const clean = pathname.replace(/^\/admin\/?/, "")
    if (!clean) return ["Overview"]
    return clean.split("/").map((part) =>
      part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
  }

  const breadcrumbs = getBreadcrumbs()

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
    }
  }, [initialProfile])

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AdminProfileData>
      if (customEvent.detail) {
        setProfile((prev) => ({ ...(prev || {}), ...customEvent.detail } as AdminProfileData))
        setImgError(false)
      }
    }
    window.addEventListener("admin-profile-updated", handleProfileUpdate)
    return () => window.removeEventListener("admin-profile-updated", handleProfileUpdate)
  }, [])

  const avatarSrc = profile?.image && profile.image.trim() !== "" ? profile.image : "/assets/img/avatar-place.png"

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Toggle & Dynamic Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
          <Link
            href="/admin"
            className="font-semibold text-gray-800 hover:text-[#d43533] transition-colors"
          >
            Admin Control Panel
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={`${crumb}-${idx}`}>
              <span>/</span>
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-gray-700 font-medium"
                    : "text-gray-500"
                }
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Browse Website Button (1:1 from Active eCommerce) */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          <span>Browse Website</span>
        </Link>

        {/* Real-time Notifications */}
        <div className="relative">
          <NotificationBell variant="admin" align="right" />
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 relative border border-gray-300">
              <img
                src={imgError ? "/assets/img/avatar-place.png" : avatarSrc}
                alt={profile?.name || "Admin"}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            <div className="text-left hidden md:block leading-tight">
              <span className="text-xs font-bold text-gray-800 block truncate max-w-[140px]">
                {profile?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                {profile?.role === "super_admin" || !profile?.role ? "Super Admin" : profile.role}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-xs">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-800 truncate">{profile?.name || "Admin User"}</p>
                  <p className="text-gray-500 text-[11px] truncate">{profile?.email || "admin@example.com"}</p>
                </div>
                <Link
                  href="/admin/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#d43533] transition-colors"
                >
                  <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  Manage Profile
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#d43533] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  General Settings
                </Link>
                <Link
                  href="/login"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2 text-red-400" />
                  Sign Out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
