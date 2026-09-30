"use client"

import React, { useState } from "react"
import { X, RefreshCw } from "lucide-react"

interface ProductItem {
  id: string | number
  name: string
  price: number
}

interface WholesaleTierModalProps {
  product: ProductItem | null
  onClose: () => void
  onAddTier: (productId: string | number, minQty: number, maxQty: number, price: number) => Promise<void>
  isSubmitting: boolean
}

export function WholesaleTierModal({
  product,
  onClose,
  onAddTier,
  isSubmitting,
}: WholesaleTierModalProps) {
  const [minQty, setMinQty] = useState(5)
  const [maxQty, setMaxQty] = useState(20)
  const [price, setPrice] = useState(product ? Math.round(product.price * 0.85) : 100)

  if (!product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (minQty <= 0 || maxQty < minQty || price <= 0) return
    await onAddTier(product.id, minQty, maxQty, price)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
          <div>
            <h5 className="text-sm font-bold text-slate-800">Add Wholesale Tier</h5>
            <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
              {product.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Min Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={minQty}
                onChange={(e) => setMinQty(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Max Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={minQty}
                required
                value={maxQty}
                onChange={(e) => setMaxQty(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tier Unit Price (৳) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ৳
              </span>
              <input
                type="number"
                step="0.01"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] bg-white font-mono font-bold text-slate-800"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Regular price: ৳{product.price}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] disabled:bg-slate-300 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Tier</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
