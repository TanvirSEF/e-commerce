"use client"

import React from "react"
import { Eye, Upload } from "lucide-react"

interface DynamicPopupPreviewProps {
  title: string
  summary: string
  bannerUrl: string
  btnText: string
  btnBackgroundColor: string
  btnTextColor: "white" | "dark"
}

export function DynamicPopupPreview({
  title,
  summary,
  bannerUrl,
  btnText,
  btnBackgroundColor,
  btnTextColor,
}: DynamicPopupPreviewProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-xs font-bold text-gray-900">
        <Eye className="w-4 h-4 text-[#d43533]" />
        Live Storefront Preview
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg">
        <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-xs flex flex-col items-center gap-1">
              <Upload className="w-5 h-5 text-gray-300" />
              <span>512 x 280 Banner Preview</span>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-sm text-gray-900 leading-snug">
            {title || "Your Campaign Title Goes Here"}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {summary || "Summary text describing the promotional event or special discount for visitors."}
          </p>
          <div className="pt-2">
            <div
              style={{
                backgroundColor: btnBackgroundColor || "#d43533",
                color: btnTextColor === "dark" ? "#111827" : "#ffffff",
              }}
              className="w-full text-center py-2 rounded-lg font-bold text-xs shadow-xs"
            >
              {btnText || "Shop Now"}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-3">
        This lightbox appears automatically in the center of the storefront
      </p>
    </div>
  )
}
