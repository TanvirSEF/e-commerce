"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Tag, RefreshCw } from "lucide-react"
import {
  createCustomLabelAction,
  updateCustomLabelAction,
} from "@/app/actions/ecommerce-actions"
import type { CustomLabel } from "@/db/schema"

interface ProductItem {
  id: number
  name: string
  thumbnailImg?: string
}

interface CustomLabelCreateViewProps {
  products: ProductItem[]
  initialLabel?: CustomLabel
}

export function CustomLabelCreateView({
  products,
  initialLabel,
}: CustomLabelCreateViewProps) {
  const router = useRouter()
  const isEdit = Boolean(initialLabel)

  const [text, setText] = useState(initialLabel?.text || "")
  const [backgroundColor, setBackgroundColor] = useState(
    initialLabel?.backgroundColor || "#e62e04"
  )
  const [textColor, setTextColor] = useState<"white" | "dark">(
    initialLabel?.textColor === "dark" ? "dark" : "white"
  )
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
    initialLabel?.productIds || []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleProduct = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      setError("Please enter label text.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      if (isEdit && initialLabel) {
        const res = await updateCustomLabelAction(initialLabel.id, {
          text: text.trim(),
          backgroundColor,
          textColor,
          productIds: selectedProductIds,
        })
        if (res) {
          router.push("/admin/custom-labels")
        } else {
          setError("Failed to update custom label. Please try again.")
        }
      } else {
        const res = await createCustomLabelAction({
          text: text.trim(),
          backgroundColor,
          textColor,
          productIds: selectedProductIds,
          userType: "admin",
          addedBy: "Admin",
          sellerAccess: true,
        })
        if (res) {
          router.push("/admin/custom-labels")
        } else {
          setError("Failed to create custom label. Please try again.")
        }
      }
    } catch {
      setError("Server error while saving label.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/custom-labels"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Custom Label" : "Create Custom Label"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {isEdit
                ? `Update "${initialLabel?.text}" promotional badge and assigned products`
                : "Configure promotional text, background badge styling, and assigned products"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Label Attributes (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-6">
          <h2 className="text-base font-bold text-gray-800">Label Details</h2>

          {/* Text */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Label Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. MEGA DEAL, TOP CHOICE, 20% OFF"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#d43533] focus:bg-white"
            />
          </div>

          {/* Background Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Background Color <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono uppercase text-gray-800"
              />
            </div>
          </div>

          {/* Text Color Selection */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Text Color <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition-colors ${
                  textColor === "white"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="textColor"
                  value="white"
                  checked={textColor === "white"}
                  onChange={() => setTextColor("white")}
                  className="hidden"
                />
                <span className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                <span>Light (White)</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition-colors ${
                  textColor === "dark"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="textColor"
                  value="dark"
                  checked={textColor === "dark"}
                  onChange={() => setTextColor("dark")}
                  className="hidden"
                />
                <span className="w-3 h-3 rounded-full bg-gray-800" />
                <span>Dark (Charcoal)</span>
              </label>
            </div>
          </div>

          {/* Product Multi-select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-gray-700">
                Apply to Products ({selectedProductIds.length} selected)
              </label>
              <button
                type="button"
                onClick={() =>
                  setSelectedProductIds(
                    selectedProductIds.length === products.length
                      ? []
                      : products.map((p) => p.id)
                  )
                }
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                {selectedProductIds.length === products.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto space-y-1.5 bg-gray-50/50">
              {products.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(p.id)}
                    onChange={() => handleToggleProduct(p.id)}
                    className="w-4 h-4 text-[#d43533] rounded border-gray-300 focus:ring-[#d43533] cursor-pointer"
                  />
                  <span className="text-xs text-gray-800 font-medium line-clamp-1">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Badge Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#d43533]" />
              <span>Live Badge Preview</span>
            </h2>

            <div className="p-8 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-4 text-center border border-dashed border-gray-300">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-2xs transition-all"
                style={{
                  backgroundColor,
                  color: textColor === "dark" ? "#1f2937" : "#ffffff",
                }}
              >
                {text.trim() || "LABEL PREVIEW"}
              </span>
              <p className="text-xs text-gray-400">
                This is how the badge will appear on catalog cards and product detail banners.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isEdit ? "Updating Label..." : "Saving Label..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? "Update Custom Label" : "Save Custom Label"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
