"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react"
import { createDynamicPopupAction } from "@/app/actions/ecommerce-actions"

export function DynamicPopupCreateView() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    bannerUrl: "",
    btnText: "Shop Now",
    btnBackgroundColor: "#d43533",
    btnTextColor: "white" as "white" | "dark",
    link: "",
    delaySec: 3,
    durationSec: 15,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.bannerUrl) {
      setFeedback({ type: "error", text: "Title and Image URL are required" })
      return
    }

    startTransition(async () => {
      const res = await createDynamicPopupAction(formData)
      if (res) {
        setFeedback({ type: "success", text: "Dynamic popup created successfully! Redirecting..." })
        setTimeout(() => {
          router.push("/admin/marketing/dynamic-popups")
        }, 1200)
      } else {
        setFeedback({ type: "error", text: "Failed to create popup" })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/marketing/dynamic-popups"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Create New Dynamic Popup
            </h1>
            <p className="text-xs text-gray-500">
              Set up a targeted modal banner with interactive button and link
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form: 8 cols */}
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Custom Dynamic Popup Information
          </h2>

          {/* Title */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">(Best within 50 characters)</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Mega Summer Flash Sale - Flat 30% Off!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          {/* Summary */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Summary <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">(Best within 200 characters)</span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={300}
              placeholder="e.g. Discover our hand-picked styles and trendy apparel with special discounted prices this weekend only."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
            />
          </div>

          {/* Banner URL */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Banner Image URL <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">(Recommended 512px x 280px)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/... or /assets/img/slider/1.png"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    bannerUrl:
                      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80",
                  })
                }
                className="px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 shrink-0 font-medium"
              >
                Sample Image
              </button>
            </div>
          </div>

          {/* Button Text & Color */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Button Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={30}
                placeholder="e.g. Shop Now"
                value={formData.btnText}
                onChange={(e) => setFormData({ ...formData, btnText: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Button Color <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.btnBackgroundColor}
                  onChange={(e) => setFormData({ ...formData, btnBackgroundColor: e.target.value })}
                  className="h-9 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.btnBackgroundColor}
                  onChange={(e) => setFormData({ ...formData, btnBackgroundColor: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Button Text Color & Link */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Button Text Contrast
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="btnTextColor"
                    value="white"
                    checked={formData.btnTextColor === "white"}
                    onChange={() => setFormData({ ...formData, btnTextColor: "white" })}
                    className="text-[#d43533] focus:ring-[#d43533]"
                  />
                  Light (White)
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="btnTextColor"
                    value="dark"
                    checked={formData.btnTextColor === "dark"}
                    onChange={() => setFormData({ ...formData, btnTextColor: "dark" })}
                    className="text-[#d43533] focus:ring-[#d43533]"
                  />
                  Dark (Black)
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Button Link / Target URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. /products or /flash-deals"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Delay & Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Delay Before Appearing (seconds)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.delaySec}
                onChange={(e) => setFormData({ ...formData, delaySec: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Auto-dismiss Duration (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.durationSec}
                onChange={(e) => setFormData({ ...formData, durationSec: parseInt(e.target.value) || 15 })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition"
            >
              {isPending ? "Saving..." : "Save Dynamic Popup"}
            </button>
          </div>
        </div>

        {/* Right Column: 4 cols Live Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 text-xs font-bold text-gray-900">
              <Eye className="w-4 h-4 text-[#d43533]" />
              Live Storefront Preview
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg">
              {/* Preview Banner */}
              <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {formData.bannerUrl ? (
                  <img
                    src={formData.bannerUrl}
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

              {/* Preview Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-gray-900 leading-snug">
                  {formData.title || "Your Campaign Title Goes Here"}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {formData.summary || "Summary text describing the promotional event or special discount for visitors."}
                </p>
                <div className="pt-2">
                  <div
                    style={{
                      backgroundColor: formData.btnBackgroundColor || "#d43533",
                      color: formData.btnTextColor === "dark" ? "#111827" : "#ffffff",
                    }}
                    className="w-full text-center py-2 rounded-lg font-bold text-xs shadow-xs"
                  >
                    {formData.btnText || "Shop Now"}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              This lightbox appears automatically in the center of the storefront
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
