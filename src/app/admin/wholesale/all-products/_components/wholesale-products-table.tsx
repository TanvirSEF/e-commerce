"use client"

import React from "react"
import Link from "next/link"
import { Plus, Edit, Package, X } from "lucide-react"
import type { WholesaleTier } from "@/services/wholesale-service"

export interface WholesaleProductItem {
  id: string | number
  name: string
  slug: string
  price: number
  stock: number
  thumbnail: string
  sellerName?: string
  tiers: WholesaleTier[]
}

interface WholesaleProductsTableProps {
  products: WholesaleProductItem[]
  onSelectProduct: (p: WholesaleProductItem) => void
  onDeleteTier: (productId: string | number, tierId: number) => void
}

export function WholesaleProductsTable({
  products,
  onSelectProduct,
  onDeleteTier,
}: WholesaleProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-lg">
        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
        <p className="text-xs font-medium">No wholesale products found.</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Mark products as wholesale or add wholesale discount tiers to show them here.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fafbfc] text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Added By</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Wholesale Quantity Brackets</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">
                  {idx + 1}
                </td>

                {/* Product Name & Thumbnail */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 max-w-xs sm:max-w-sm">
                      <Link
                        href={`/product/${item.slug}`}
                        target="_blank"
                        className="font-semibold text-slate-800 hover:text-[#d43533] line-clamp-1 block transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </div>
                </td>

                {/* Added By Badge */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.sellerName === "In-House"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {item.sellerName || "In-House"}
                  </span>
                </td>

                {/* Base Retail Price */}
                <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                  ৳{item.price.toLocaleString()}
                </td>

                {/* Current Stock */}
                <td className="py-3 px-4 text-slate-600 font-medium">
                  {item.stock}
                </td>

                {/* Wholesale Quantity Brackets */}
                <td className="py-3 px-4">
                  <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                    {item.tiers.map((tier) => (
                      <span
                        key={tier.id}
                        className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        <span>
                          {tier.minQty}–{tier.maxQty} pcs:{" "}
                          <strong className="font-bold text-indigo-700">
                            ৳{tier.price}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteTier(item.id, tier.id)}
                          className="text-indigo-400 hover:text-red-600 p-0.5 rounded hover:bg-white cursor-pointer transition-colors"
                          title="Remove tier"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {item.tiers.length === 0 && (
                      <span className="text-slate-400 italic text-[11px]">
                        No active discount brackets
                      </span>
                    )}
                  </div>
                </td>

                {/* Action Options */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Tier</span>
                    </button>
                    <Link
                      href={`/admin/products/${item.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
