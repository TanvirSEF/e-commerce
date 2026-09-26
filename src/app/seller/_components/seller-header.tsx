"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Store,
  ExternalLink,
} from "lucide-react"

interface SellerHeaderProps {
  onToggleSidebar: () => void
}

export function SellerHeader({ onToggleSidebar }: SellerHeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-xs flex items-center justify-between px-4 lg:px-6">
      {/* Left: Menu Toggle + Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#d43533] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Seller Dashboard</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Visit Store */}
        <Link
          href="/shop/active-fashion-outlet"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          My Store
        </Link>

        {/* Notifications */}
        <Link
          href="/seller/notifications"
          className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#d43533] rounded-full" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#d43533] flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">Active Fashion</div>
              <div className="text-[10px] text-slate-400 leading-tight">Seller Account</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <Link
                  href="/seller/shop"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#d43533] transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  Shop Settings
                </Link>
                <Link
                  href="/seller/dashboard"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#d43533] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Account
                </Link>
                <div className="border-t border-slate-100" />
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
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
