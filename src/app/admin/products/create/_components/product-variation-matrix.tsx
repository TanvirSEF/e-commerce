"use client"

import React, { useState, useEffect } from "react"

export interface VariantItem {
  variant: string
  price: number
  sku: string
  stock: number
  img?: string
}

interface ProductVariationMatrixProps {
  basePrice: number
  baseSku: string
  onVariantsChange: (variants: VariantItem[]) => void
}

const AVAILABLE_COLORS = [
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Red", code: "#E62E04" },
  { name: "Blue", code: "#007BFF" },
  { name: "Green", code: "#28A745" },
  { name: "Yellow", code: "#FFC107" },
  { name: "Grey", code: "#6C757D" },
  { name: "Navy", code: "#001F3F" },
]

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"]

export function ProductVariationMatrix({
  basePrice,
  baseSku,
  onVariantsChange,
}: ProductVariationMatrixProps) {
  const [colorsActive, setColorsActive] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [variants, setVariants] = useState<VariantItem[]>([])

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  // Recompute Cartesian product combinations when colors or sizes change
  useEffect(() => {
    const activeColors = colorsActive && selectedColors.length > 0 ? selectedColors : []
    const activeSizes = selectedSizes.length > 0 ? selectedSizes : []

    let combinations: string[] = []

    if (activeColors.length > 0 && activeSizes.length > 0) {
      activeColors.forEach((color) => {
        activeSizes.forEach((size) => {
          combinations.push(`${color}-${size}`)
        })
      })
    } else if (activeColors.length > 0) {
      combinations = [...activeColors]
    } else if (activeSizes.length > 0) {
      combinations = [...activeSizes]
    }

    if (combinations.length === 0) {
      setVariants([])
      onVariantsChange([])
      return
    }

    const newVariants: VariantItem[] = combinations.map((combo) => {
      const existing = variants.find((v) => v.variant === combo)
      const cleanCombo = combo.replace(/\s+/g, "")
      const skuPrefix = baseSku ? baseSku.trim() : "PRD"
      return {
        variant: combo,
        price: existing?.price ?? (basePrice > 0 ? basePrice : 100),
        sku: existing?.sku ?? `${skuPrefix}-${cleanCombo}`,
        stock: existing?.stock ?? 10,
        img: existing?.img ?? "",
      }
    })

    setVariants(newVariants)
    onVariantsChange(newVariants)
  }, [colorsActive, selectedColors, selectedSizes, basePrice, baseSku])

  const handleVariantFieldChange = (
    index: number,
    field: keyof VariantItem,
    value: string | number
  ) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
    onVariantsChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* 1. Color Selector */}
      <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-800 flex items-center space-x-2">
            <span>Colors Active</span>
            <span className="text-[10px] font-normal text-slate-500">
              (Enable to provide color choices)
            </span>
          </label>
          <input
            type="checkbox"
            checked={colorsActive}
            onChange={(e) => setColorsActive(e.target.checked)}
            className="w-4 h-4 text-[#d43533] rounded focus:ring-0 cursor-pointer"
          />
        </div>

        {colorsActive && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {AVAILABLE_COLORS.map((col) => {
              const selected = selectedColors.includes(col.name)
              return (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => toggleColor(col.name)}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                    selected
                      ? "border-[#d43533] bg-red-50 text-[#d43533] font-bold"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: col.code }}
                  />
                  <span>{col.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 2. Attributes (Sizes) */}
      <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
        <label className="block text-xs font-bold text-slate-800 mb-2">
          Sizes / Attributes
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SIZES.map((sz) => {
            const selected = selectedSizes.includes(sz)
            return (
              <button
                type="button"
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`px-3 py-1 rounded text-xs border transition-colors ${
                  selected
                    ? "border-[#d43533] bg-red-50 text-[#d43533] font-bold"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {sz}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Dynamic SKU Combinations Table (1:1 with Laravel sku_combinations.blade.php) */}
      {variants.length > 0 && (
        <div className="border border-slate-200 rounded overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
            Product Variant Combinations ({variants.length} variations generated)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">Variant Price (৳)</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Stock Quantity</th>
                  <th className="py-2.5 px-3">Photo URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {variants.map((v, idx) => (
                  <tr key={v.variant} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-bold text-slate-800">{v.variant}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={v.price}
                        onChange={(e) =>
                          handleVariantFieldChange(idx, "price", parseFloat(e.target.value) || 0)
                        }
                        className="w-24 px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantFieldChange(idx, "sku", e.target.value)}
                        className="w-36 px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={v.stock}
                        onChange={(e) =>
                          handleVariantFieldChange(idx, "stock", parseInt(e.target.value, 10) || 0)
                        }
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={v.img || ""}
                        placeholder="Image URL"
                        onChange={(e) => handleVariantFieldChange(idx, "img", e.target.value)}
                        className="w-40 px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
