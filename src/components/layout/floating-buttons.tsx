"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LayoutGrid, Zap, Clock, Gavel, ChevronLeft, ChevronRight } from "lucide-react"

export function FloatingButtons() {
  const [collapsed, setCollapsed] = useState(false)
  const [disabledAddons, setDisabledAddons] = useState<string[]>([])

  React.useEffect(() => {
    fetch("/api/addons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const disabled = data.filter((a) => !a.activated).map((a) => a.uniqueIdentifier)
          setDisabledAddons(disabled)
        }
      })
      .catch(() => {})
  }, [])

  const isAddonDisabled = (addonKey?: string) => {
    if (!addonKey) return false
    const key = addonKey.toLowerCase().trim()
    return disabledAddons.some((d) => {
      const dKey = d.toLowerCase().trim()
      if (dKey === key) return true
      if (dKey === `${key}_system` || `${dKey}_system` === key) return true
      if (dKey.replace(/_system$/, "") === key.replace(/_system$/, "")) return true
      if (dKey.replace(/s$/, "") === key.replace(/s$/, "")) return true
      return false
    })
  }

  const BUTTONS = [
    {
      label: "All Categories",
      href: "/categories",
      icon: LayoutGrid,
    },
    {
      label: "Flash Sale",
      href: "/flash-deals",
      icon: Zap,
    },
    {
      label: "Today's Deal",
      href: "/todays-deal",
      icon: Clock,
    },
    {
      label: "Auction",
      href: "/auction-products",
      icon: Gavel,
      addonKey: "auction_system",
    },
  ]

  const visibleButtons = BUTTONS.filter((btn) => !isAddonDisabled(btn.addonKey))

  return (
    <aside
      aria-label="Quick Actions"
      className={`fixed right-0 top-1/2 z-40 -translate-y-1/2 transition-transform duration-300 ${
        collapsed ? "translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Mobile Toggle Handle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Show quick navigation buttons" : "Hide quick navigation buttons"}
        className="absolute -left-6 top-1/2 -translate-y-1/2 flex h-8 w-6 items-center justify-center rounded-l-md bg-[#d43533] text-white shadow-md lg:hidden"
      >
        {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Floating Buttons List (Active eCommerce 1:1) */}
      <div className="flex flex-col gap-2.5 p-2">
        {visibleButtons.map((btn) => {
          const Icon = btn.icon
          return (
            <Link
              key={btn.href}
              href={btn.href}
              className="group relative flex h-11 items-center justify-end rounded-full bg-[#d43533] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-[#b82a28]"
            >
              {/* Sliding label on hover */}
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-white transition-all duration-300 ease-out group-hover:max-w-xs group-hover:px-3">
                {btn.label}
              </span>
              {/* Icon Circle */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d43533] group-hover:bg-[#b82a28]">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
