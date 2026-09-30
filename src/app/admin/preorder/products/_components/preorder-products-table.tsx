"use client"

import React from "react"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import { PreorderProductRow } from "./preorder-product-row"
import type { PreorderProduct } from "@/db/schema"

interface PreorderProductsTableProps {
  products: PreorderProduct[]
  selectedIds: number[]
  page: number
  totalPages: number
  total: number
  limit: number
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onTogglePublished: (id: number, current: boolean) => void
  onToggleFeatured: (id: number, current: boolean) => void
  onDeleteProduct: (product: PreorderProduct) => void
  onPageChange: (newPage: number) => void
}

export function PreorderProductsTable({
  products,
  selectedIds,
  page,
  totalPages,
  total,
  limit,
  onToggleSelect,
  onToggleSelectAll,
  onTogglePublished,
  onToggleFeatured,
  onDeleteProduct,
  onPageChange,
}: PreorderProductsTableProps) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id))
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + products.length, total)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#f8f9fb] text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
          <tr>
            <th className="py-3 px-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
              />
            </th>
            <th className="py-3 px-3 w-16">Image</th>
            <th className="py-3 px-3 min-w-[200px]">Product details</th>
            <th className="py-3 px-3 min-w-[130px]">Product details</th>
            <th className="py-3 px-3 min-w-[140px]">Price</th>
            <th className="py-3 px-3">Discount</th>
            <th className="py-3 px-3 min-w-[120px]">Availability</th>
            <th className="py-3 px-3 min-w-[100px]">Orders</th>
            <th className="py-3 px-3 text-center min-w-[100px]">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {products.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Package className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                  <p className="text-xs font-medium">No preorder products found.</p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <PreorderProductRow
                key={product.id}
                product={product}
                isSelected={selectedIds.includes(product.id)}
                onToggleSelect={onToggleSelect}
                onTogglePublished={onTogglePublished}
                onToggleFeatured={onToggleFeatured}
                onDeleteProduct={onDeleteProduct}
              />
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{endIndex}</span> of{" "}
            <span className="font-semibold text-slate-700">{total}</span> products
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded text-xs font-semibold ${
                  p === page
                    ? "bg-[#d43533] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
