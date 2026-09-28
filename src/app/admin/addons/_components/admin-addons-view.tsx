"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Blocks, Plus, CheckCircle, ExternalLink, ShieldCheck, Loader2, Sparkles } from "lucide-react"
import { type AddonItem } from "@/services/addon-service"
import { toggleAddonAction } from "@/app/actions/addon-actions"

interface AdminAddonsViewProps {
  initialAddons: AddonItem[]
}

export function AdminAddonsView({ initialAddons }: AdminAddonsViewProps) {
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons)
  const [activeTab, setActiveTab] = useState<"installed" | "available">("installed")
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleToggle = async (addon: AddonItem) => {
    const nextState = !addon.activated
    setLoadingId(addon.id)

    // Optimistic UI update
    setAddons((prev) =>
      prev.map((a) => (a.id === addon.id ? { ...a, activated: nextState } : a))
    )

    try {
      const res = await toggleAddonAction(addon.id, nextState)
      if (res.success) {
        showToast(
          `Module "${addon.name}" is now ${nextState ? "ACTIVATED" : "DEACTIVATED"} in database.`
        )
      } else {
        // Revert on failure
        setAddons((prev) =>
          prev.map((a) => (a.id === addon.id ? { ...a, activated: addon.activated } : a))
        )
        showToast(`Failed to update ${addon.name}. Please try again.`)
      }
    } catch {
      setAddons((prev) =>
        prev.map((a) => (a.id === addon.id ? { ...a, activated: addon.activated } : a))
      )
      showToast("Network error while connecting to database.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Blocks className="w-7 h-7 text-[#d43533]" />
            Installed Addons & Modules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervise Active eCommerce CMS CodeCanyon extensions, feature packs, and licensing (Database Persistent)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/addons/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Install / Upload Addon
          </Link>
        </div>
      </div>

      {/* Tabs (Installed vs Available - matching Laravel 1:1) */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("installed")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "installed"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Installed Addons ({addons.length})
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "available"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Available Official Addons
        </button>
      </div>

      {activeTab === "installed" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((a) => {
            const isLoading = loadingId === a.id
            return (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      v{a.version}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Licensed
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{a.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {a.description}
                    </p>
                  </div>
                  {a.purchaseCode && (
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 truncate">
                      Code: {a.purchaseCode.substring(0, 10)}••••••••
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold flex items-center gap-1.5 ${
                      a.activated ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        a.activated ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    {a.activated ? "Module Enabled" : "Module Disabled"}
                  </span>

                  <button
                    onClick={() => handleToggle(a)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 ${
                      a.activated
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Saving...
                      </>
                    ) : a.activated ? (
                      "Deactivate"
                    ) : (
                      "Activate"
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-[#d43533] rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Active eCommerce Addon Marketplace</h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse official Active eCommerce CMS extensions on CodeCanyon to expand your marketplace capabilities.
            </p>
          </div>
          <a
            href="https://codecanyon.net/user/activeitzone/portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d43533] hover:underline"
          >
            Visit Official ActiveItZone Portfolio
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  )
}
