"use client"

import React from "react"
import { Ruler } from "lucide-react"

interface ProductVariantPickerProps {
  colors?: { name: string; hex: string }[]
  selectedColor: string
  onSelectColor: (color: string) => void
  sizes?: string[]
  selectedSize: string
  onSelectSize: (size: string) => void
  onOpenSizeGuide: () => void
}

export function ProductVariantPicker({
  colors,
  selectedColor,
  onSelectColor,
  sizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}: ProductVariantPickerProps) {
  return (
    <div className="space-y-4">
      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div>
          <div className="mb-2 font-semibold text-gray-700">
            Color: <span className="font-bold text-gray-900">{selectedColor}</span>
          </div>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelectColor(c.name)}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`h-7 w-7 rounded-full border border-gray-300 transition-all ${
                  selectedColor === c.name
                    ? "scale-110 ring-2 ring-[#d43533] ring-offset-2"
                    : "hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between font-semibold text-gray-700">
            <div>
              Size: <span className="font-bold text-gray-900">{selectedSize}</span>
            </div>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="flex items-center gap-1 text-[11px] font-medium text-[#d43533] hover:underline cursor-pointer"
            >
              <Ruler className="h-3 w-3" />
              <span>Size Guide</span>
            </button>
          </div>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSelectSize(s)}
                className={`rounded border px-3 py-1.5 font-semibold transition-all ${
                  selectedSize === s
                    ? "border-[#d43533] bg-red-50 text-[#d43533]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
