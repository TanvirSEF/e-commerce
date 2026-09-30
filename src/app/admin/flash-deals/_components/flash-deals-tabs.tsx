"use client"

import React from "react"

export type FlashDealTabType = "all" | "active" | "inactive"

interface FlashDealsTabsProps {
  activeTab: FlashDealTabType
  onTabChange: (tab: FlashDealTabType) => void
  counts: {
    all: number
    active: number
    inactive: number
  }
}

export function FlashDealsTabs({
  activeTab,
  onTabChange,
  counts,
}: FlashDealsTabsProps) {
  const tabs: { id: FlashDealTabType; label: string; count: number }[] = [
    { id: "all", label: "All Flash Deals", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "inactive", label: "Inactive", count: counts.inactive },
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
