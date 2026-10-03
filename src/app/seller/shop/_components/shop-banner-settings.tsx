"use client"

import React, { useState } from "react"
import Image from "next/image"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import { updateSellerShopAction } from "@/app/actions/seller-actions"
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ShopBannerSettingsProps {
  shopId: number
  initialTopBanner: string | null
}

export function ShopBannerSettings({ shopId, initialTopBanner }: ShopBannerSettingsProps) {
  const [topBanner, setTopBanner] = useState(initialTopBanner || "")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    const res = await updateSellerShopAction(shopId, { topBanner })
    setIsSubmitting(false)
    if (res.success) {
      setMessage({ type: "success", text: "Banner settings saved successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save banner settings." })
    }
  }

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-200 bg-white">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Banner Settings</h5>
      </div>
      <div className="card-body p-4 md:p-6">
        {message && (
          <div
            className={`mb-4 px-3 py-2 text-xs rounded border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <label className="md:col-span-2 text-xs font-medium text-gray-700 pt-2">
              Top Banner <span className="text-gray-400 font-normal">(1920x360)</span>
            </label>
            <div className="md:col-span-10">
              <div className="border border-dashed border-gray-300 p-4 rounded bg-gray-50/50">
                <div className="flex border border-gray-300 rounded overflow-hidden text-xs bg-white">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 font-medium border-r border-gray-300 transition-colors"
                  >
                    Browse
                  </button>
                  <div
                    onClick={() => setPickerOpen(true)}
                    className="px-3 py-2 text-gray-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                  >
                    {topBanner ? (
                      <span className="text-gray-900 font-medium truncate">{topBanner}</span>
                    ) : (
                      "Choose File"
                    )}
                  </div>
                </div>

                {topBanner && (
                  <div className="mt-3 relative w-full h-28 rounded border border-gray-200 overflow-hidden bg-gray-50">
                    <Image src={topBanner} alt="Top Banner" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setTopBanner("")}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <small className="block text-gray-400 text-[11px] mt-2">
                  We had to limit height to maintain consistency. In some devices both sides of the banner might be cropped for height limitation.
                </small>
              </div>
            </div>
          </div>

          <div className="text-right pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-medium rounded transition-colors"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) setTopBanner(urls[0])
          setPickerOpen(false)
        }}
        title="Select Shop Top Banner"
      />
    </div>
  )
}
