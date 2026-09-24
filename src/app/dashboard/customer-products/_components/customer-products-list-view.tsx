"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tag, Plus, Trash2, Eye, CheckCircle2, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { deleteCustomerProductAction } from "@/app/actions/ecommerce-actions"
import type { ClassifiedProductItem } from "@/services/customer-product-service"

interface CustomerProductsListViewProps {
  initialProducts: ClassifiedProductItem[]
}

export function CustomerProductsListView({ initialProducts }: CustomerProductsListViewProps) {
  const [products, setProducts] = useState<ClassifiedProductItem[]>(initialProducts)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this classified advertisement?")) return
    setDeletingId(id)
    await deleteCustomerProductAction(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#d43533]" />
            My Classified Advertisements
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage and track your second-hand items listed for sale on the marketplace.
          </p>
        </div>
        <Link
          href="/dashboard/customer-products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Remaining Free Uploads</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">8 Remaining</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#d43533] flex items-center justify-center font-bold text-sm">
            8/10
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Active Advertisements</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{products.length} Items</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            LIVE
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Asking Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    You have not posted any classified advertisements yet.
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                          <Image src={p.thumbnailImg} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-gray-400">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {p.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {formatPrice(p.unitPrice)}
                    </td>
                    <td className="py-3 px-4">
                      {p.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href="/customer-products"
                          className="p-1 text-gray-500 hover:text-gray-900"
                          title="View on marketplace"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                          title="Delete advertisement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
