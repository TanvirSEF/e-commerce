"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CheckCircle2, AlertCircle, ExternalLink, Plus } from "lucide-react"
import type { AddonItem, AvailableAddonItem } from "@/types/addon"
import { InstalledAddonsList } from "./installed-addons-list"
import { AvailableAddonsGrid } from "./available-addons-grid"

interface Props {
  initialAddons: AddonItem[]
  availableAddons: AvailableAddonItem[]
}

export function AdminAddonsView({ initialAddons, availableAddons }: Props) {
  const [activeTab, setActiveTab] = useState<"installed" | "available">("installed")
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleFeedback = (msg: { type: "success" | "error"; text: string }) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-4">
      {/* 1:1 Active eCommerce Top Bar matching backend/addons/index.blade.php */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-2">
        {/* Left: Tab Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("installed")}
            className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
              activeTab === "installed"
                ? "border-b-2 border-[#d43533] text-[#d43533] bg-white font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Installed Addon ({initialAddons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
              activeTab === "available"
                ? "border-b-2 border-[#d43533] text-[#d43533] bg-white font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Available Addon
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="https://activeitzone.com/activation/addon"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#1d3557] hover:bg-[#16304d] text-white rounded transition-colors"
          >
            <span>Activate Addon Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <Link
            href="/admin/addons/create"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#d43533] hover:bg-[#b82a28] text-white rounded transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Install/Update Addon</span>
          </Link>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "installed" ? (
          <InstalledAddonsList
            initialAddons={initialAddons}
            onFeedback={handleFeedback}
          />
        ) : (
          <AvailableAddonsGrid addons={availableAddons} />
        )}
      </div>
    </div>
  )
}
