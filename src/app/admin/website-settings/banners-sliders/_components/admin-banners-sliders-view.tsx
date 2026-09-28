"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Sliders, Save, CheckCircle, UploadCloud } from "lucide-react"
import { updateBannersAndSlidersAction } from "@/app/actions/ecommerce-actions"
import type { BannersAndSlidersSettings } from "@/services/settings-service"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"

interface AdminBannersSlidersViewProps {
  initialSettings: BannersAndSlidersSettings
}

export function AdminBannersSlidersView({ initialSettings }: AdminBannersSlidersViewProps) {
  const [settings, setSettings] = useState<BannersAndSlidersSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activePickerField, setActivePickerField] = useState<"large" | "small" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await updateBannersAndSlidersAction(settings)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Save banners error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleMediaSelect = (urls: string[]) => {
    if (urls.length > 0) {
      if (activePickerField === "large") {
        setSettings((prev) => ({ ...prev, flashDealBannerLarge: urls[0] }))
      } else if (activePickerField === "small") {
        setSettings((prev) => ({ ...prev, flashDealBannerSmall: urls[0] }))
      }
    }
    setActivePickerField(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#d43533]" />
          Banners & Sliders Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage promotional page banners, sliders, and target links (Active eCommerce 1:1)
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          Banners updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Flash Deal Banner Large */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Flash Deal Page Banner - Large
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-60 h-28 bg-slate-100 rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
              {settings.flashDealBannerLarge ? (
                <Image
                  src={settings.flashDealBannerLarge}
                  alt="Large Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={settings.flashDealBannerLarge}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, flashDealBannerLarge: e.target.value }))
                }
                placeholder="https://... or select from media"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
              <button
                type="button"
                onClick={() => setActivePickerField("large")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Browse File Manager
              </button>
              <p className="text-[11px] text-slate-400">
                Shown on desktop and large screens. Minimum dimensions: 1370px × 242px.
              </p>
            </div>
          </div>
        </div>

        {/* Flash Deal Banner Small */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            Flash Deal Page Banner - Small (Mobile)
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-60 h-28 bg-slate-100 rounded-md border border-slate-200 overflow-hidden flex items-center justify-center">
              {settings.flashDealBannerSmall ? (
                <Image
                  src={settings.flashDealBannerSmall}
                  alt="Small Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={settings.flashDealBannerSmall}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, flashDealBannerSmall: e.target.value }))
                }
                placeholder="https://... or select from media"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
              <button
                type="button"
                onClick={() => setActivePickerField("small")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded border border-slate-300 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Browse File Manager
              </button>
              <p className="text-[11px] text-slate-400">
                Shown on mobile and small screens.
              </p>
            </div>
          </div>
        </div>

        {/* Flash Deal Banner Link */}
        <div className="space-y-1.5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            Flash Deal Banner Redirect Link
          </label>
          <input
            type="text"
            value={settings.flashDealBannerLink}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, flashDealBannerLink: e.target.value }))
            }
            placeholder="/flash-deals or custom URL"
            className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activePickerField !== null}
        onClose={() => setActivePickerField(null)}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </div>
  )
}
