"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Star,
  Package,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SeedProduct } from "@/db/seed/data"

interface SellerProductsViewProps {
  initialProducts: SeedProduct[]
  total: number
}

export function SellerProductsView({ initialProducts, total }: SellerProductsViewProps) {
  const [products, setProducts] = useState<SeedProduct[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [publishedStates, setPublishedStates] = useState<Record<string, boolean>>(
    Object.fromEntries(initialProducts.map((p) => [p.id, true]))
  )
  const [featuredStates, setFeaturedStates] = useState<Record<string, boolean>>(
    Object.fromEntries(initialProducts.map((p) => [p.id, p.featured]))
  )

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product?")) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const togglePublished = (id: string) => {
    setPublishedStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleFeatured = (id: string) => {
    setFeaturedStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {total} total products in your vendor catalog
          </p>
        </div>
        <Link
          href="/seller/products/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product, idx) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="font-bold text-slate-800 hover:text-[#d43533] line-clamp-2 text-sm"
                        >
                          {product.name}
                        </Link>
                        {product.sku && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {formatPrice(product.price)}
                    {product.discountPercent > 0 && (
                      <div className="text-[11px] text-emerald-600 font-medium">
                        -{product.discountPercent}% off
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 5
                          ? "text-amber-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1">units</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#ffc519] fill-[#ffc519]" />
                      <span className="font-bold text-slate-700">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePublished(product.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 transition-colors ${
                        publishedStates[product.id]
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {publishedStates[product.id] ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                      {publishedStates[product.id] ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 transition-colors ${
                        featuredStates[product.id]
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {featuredStates[product.id] ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                      {featuredStates[product.id] ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
