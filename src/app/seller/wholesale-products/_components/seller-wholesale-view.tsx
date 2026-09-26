"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import { Layers, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import { addWholesaleTierAction, deleteWholesaleTierAction } from "@/app/actions/ecommerce-actions"
import type { WholesaleTier } from "@/services/wholesale-service"

interface ProductItem {
  id: string | number
  name: string
  price: number
  stock: number
  thumbnail: string
  tiers: WholesaleTier[]
}

interface SellerWholesaleViewProps {
  initialProducts: ProductItem[]
}

export function SellerWholesaleView({ initialProducts }: SellerWholesaleViewProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [minQty, setMinQty] = useState(5)
  const [maxQty, setMaxQty] = useState(25)
  const [price, setPrice] = useState(20)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    startTransition(async () => {
      try {
        const newTier = await addWholesaleTierAction({
          productId: selectedProduct.id,
          minQty: Number(minQty),
          maxQty: Number(maxQty),
          price: Number(price),
        })
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, tiers: [...p.tiers, newTier] } : p
          )
        )
        setFeedback({ type: "success", text: "Wholesale discount tier added" })
        setSelectedProduct(null)
      } catch (err) {
        setFeedback({ type: "error", text: "Failed to add wholesale tier" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  const handleDeleteTier = (productId: string | number, tierId: number) => {
    startTransition(async () => {
      await deleteWholesaleTierAction(tierId)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, tiers: p.tiers.filter((t) => t.id !== tierId) } : p
        )
      )
      setFeedback({ type: "success", text: "Wholesale tier deleted" })
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#d43533]" />
          Wholesale Pricing Manager
        </h1>
        <p className="text-xs text-gray-500">Configure tiered bulk discounts for retail and business buyers</p>
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

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">My Wholesale Products</span>
          <span className="text-xs font-mono text-gray-400">{products.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Wholesale Tiers</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">${item.price}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tiers.map((tier) => (
                        <span
                          key={tier.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-800"
                        >
                          <span>{tier.minQty}–{tier.maxQty} pcs: <strong>${tier.price}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleDeleteTier(item.id, tier.id)}
                            className="text-indigo-400 hover:text-red-600"
                            title="Remove tier"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {item.tiers.length === 0 && (
                        <span className="text-gray-400 italic text-[11px]">No active tiers</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md"
                    >
                      <Plus className="w-3 h-3" /> Add Tier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleAddTier}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-gray-900">
              Add Tier for: {selectedProduct.name}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Min Qty</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={minQty}
                  onChange={(e) => setMinQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Max Qty</label>
                <input
                  type="number"
                  min={minQty}
                  required
                  value={maxQty}
                  onChange={(e) => setMaxQty(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Wholesale Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Save Tier"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
