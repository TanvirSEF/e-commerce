"use client"

import React from "react"
import { Upload, X } from "lucide-react"

export interface DynamicPopupFormData {
  title: string
  summary: string
  bannerUrl: string
  btnText: string
  btnBackgroundColor: string
  btnTextColor: "white" | "dark"
  link: string
  delaySec: number
  durationSec: number
}

interface DynamicPopupFormFieldsProps {
  formData: DynamicPopupFormData
  onChange: (updated: Partial<DynamicPopupFormData>) => void
  onOpenPicker: () => void
  isPending: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function DynamicPopupFormFields({
  formData,
  onChange,
  onOpenPicker,
  isPending,
  onSubmit,
}: DynamicPopupFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
        Custom Dynamic Popup Information
      </h2>

      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Title <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">(Best within 50 characters)</span>
        </label>
        <input
          type="text"
          required
          maxLength={80}
          placeholder="e.g. Flash Offer! Up to 40% Off on Electronics"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Summary <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">(Best within 200 characters)</span>
        </label>
        <textarea
          required
          rows={3}
          maxLength={300}
          placeholder="e.g. Shop the newest tech gadgets with special discounts today only."
          value={formData.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 block mb-1">
          Popup Banner Image <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">(512x280 recommended)</span>
        </label>
        {formData.bannerUrl ? (
          <div className="relative h-28 w-48 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group">
            <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange({ bannerUrl: "" })}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenPicker}
            className="flex items-center justify-center gap-2 h-20 w-full sm:w-64 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#d43533] hover:bg-red-50/20 text-gray-500 hover:text-[#d43533] text-xs font-medium transition cursor-pointer"
          >
            <Upload className="size-4" />
            <span>Select Banner from Gallery</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-gray-100">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Button Label Text
          </label>
          <input
            type="text"
            value={formData.btnText}
            onChange={(e) => onChange({ btnText: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Button Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.btnBackgroundColor}
              onChange={(e) => onChange({ btnBackgroundColor: e.target.value })}
              className="h-8 w-12 rounded cursor-pointer border border-gray-200 p-0.5"
            />
            <input
              type="text"
              value={formData.btnBackgroundColor}
              onChange={(e) => onChange({ btnBackgroundColor: e.target.value })}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono"
            />
          </div>
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
          onChange={(e) => onChange({ link: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

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
            onChange={(e) => onChange({ delaySec: parseInt(e.target.value) || 0 })}
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
            onChange={(e) => onChange({ durationSec: parseInt(e.target.value) || 15 })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#d43533] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Dynamic Popup"}
        </button>
      </div>
    </form>
  )
}
