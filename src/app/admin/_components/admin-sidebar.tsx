"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, ExternalLink, Search } from "lucide-react"
import { adminNavItems, type NavItem } from "./admin-nav-items"

interface AdminSidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [disabledAddons, setDisabledAddons] = useState<string[]>([])
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Products: true,
    Sales: true,
  })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/addons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const disabled = data.filter((a) => !a.activated).map((a) => a.uniqueIdentifier)
          setDisabledAddons(disabled)
        }
      })
      .catch(() => {})
  }, [pathname])

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isAddonDisabled = (addonKey?: string) => {
    if (!addonKey) return false
    return disabledAddons.includes(addonKey)
  }

  const filteredNav = adminNavItems.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (item.title.toLowerCase().includes(q)) return true
    if (item.children?.some((c) => c.title.toLowerCase().includes(q))) return true
    return false
  })

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1e293b] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#0f172a] border-b border-slate-800">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded bg-[#d43533] text-white font-black flex items-center justify-center text-lg">
              A
            </span>
            <div className="leading-tight">
              <span className="font-bold text-white text-base tracking-wide">ACTIVE</span>
              <span className="text-[10px] text-red-400 block font-semibold uppercase tracking-widest">
                ADMIN CMS
              </span>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            title="Browse Website"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Menu Search (Active eCommerce style) */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search in menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded text-xs pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {filteredNav.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children && item.children.length > 0
            const isGroupOpen = !!openGroups[item.title]
            const isActive = item.href ? pathname === item.href : false
            const isChildActive = item.children?.some((c) => pathname === c.href)
            const itemDisabled = isAddonDisabled(item.addonKey)

            if (hasChildren) {
              return (
                <div key={item.title} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                      isChildActive
                        ? "text-white bg-slate-800/80"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    } ${itemDisabled ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.title}</span>
                      {itemDisabled && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Off
                        </span>
                      )}
                    </div>
                    {isGroupOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>

                  {isGroupOpen && (
                    <div className="pl-9 pr-2 space-y-0.5 pt-0.5">
                      {item.children?.map((sub) => {
                        const isSubActive = pathname === sub.href
                        const subDisabled = isAddonDisabled(sub.addonKey) || itemDisabled
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onClose}
                            className={`flex items-center justify-between py-1.5 px-3 text-xs rounded transition-colors ${
                              isSubActive
                                ? "bg-[#d43533] text-white font-bold"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            } ${subDisabled ? "opacity-60" : ""}`}
                          >
                            <span>{sub.title}</span>
                            {subDisabled && (
                              <span className="text-[8px] uppercase px-1 rounded bg-slate-700 text-slate-400">
                                Off
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.title}
                href={item.href || "#"}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  isActive
                    ? "bg-[#d43533] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                } ${itemDisabled ? "opacity-50" : ""}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.title}</span>
                </div>
                {itemDisabled && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Off
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Admin Footer / Version info */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Active eCommerce v11.0</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  )
}
