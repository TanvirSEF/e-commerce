"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertTriangle,
  Package,
  Search,
  Download,
  ChevronDown,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { SeedProduct } from "@/db/seed/data"

interface StockReportViewProps {
  lowStockProducts: SeedProduct[]
  allProducts: SeedProduct[]
}

export function StockReportView({ lowStockProducts, allProducts }: StockReportViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState<"low" | "all">("low")

  const list = stockFilter === "low" ? lowStockProducts : allProducts
  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const outOfStock = allProducts.filter((p) => p.stock === 0).length
  const criticalStock = allProducts.filter((p) => p.stock > 0 && p.stock <= 3).length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Stock Alert Report</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor inventory levels and identify products requiring restocking
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export / Print Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Out of Stock</div>
            <div className="text-xl font-bold text-red-600">{outOfStock}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Critical (1–3 units)</div>
            <div className="text-xl font-bold text-amber-600">{criticalStock}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Low Stock (≤5 units)</div>
            <div className="text-xl font-bold text-slate-800">{lowStockProducts.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStockFilter("low")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              stockFilter === "low"
                ? "bg-[#d43533] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Low Stock Only
          </button>
          <button
            onClick={() => setStockFilter("all")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              stockFilter === "all"
                ? "bg-[#d43533] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Products
          </button>
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
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product, idx) => {
                const stockStatus =
                  product.stock === 0
                    ? "out-of-stock"
                    : product.stock <= 3
                    ? "critical"
                    : "low"

                return (
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
                    <td className="py-3.5 px-4 text-slate-600 capitalize">
                      {product.categorySlug?.replace(/-/g, " ") || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold text-base ${
                        product.stock === 0 ? "text-red-600" : product.stock <= 3 ? "text-amber-600" : "text-slate-800"
                      }`}>
                        {product.stock}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1">units</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          stockStatus === "out-of-stock"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : stockStatus === "critical"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {stockStatus === "out-of-stock"
                          ? "Out of Stock"
                          : stockStatus === "critical"
                          ? "Critical"
                          : "Low Stock"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/products`}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                    ✅ No low stock products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
