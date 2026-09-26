"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, Plus, Download, Edit, Trash2, FileText, CheckCircle } from "lucide-react"

interface DigitalProductItem {
  id: string
  name: string
  category: string
  price: number
  downloadsCount: number
  published: boolean
  fileType: string
}

const SAMPLE_DIGITAL_PRODUCTS: DigitalProductItem[] = [
  {
    id: "dig-1",
    name: "Modern eCommerce UI Kit Figma Templates (150+ Screens)",
    category: "Graphics & Templates",
    price: 3500,
    downloadsCount: 42,
    published: true,
    fileType: "ZIP / FIG",
  },
  {
    id: "dig-2",
    name: "Ultimate SEO & Content Marketing Blueprint eBook (PDF)",
    category: "eBooks & Guides",
    price: 950,
    downloadsCount: 118,
    published: true,
    fileType: "PDF",
  },
]

export function SellerDigitalProductsView() {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState(SAMPLE_DIGITAL_PRODUCTS)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this digital product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Digital Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your downloadable digital assets, software, templates, and ebooks.
          </p>
        </div>
        <Link
          href="/seller/products/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#b82d2b] shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Digital Product</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search digital products..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No digital products found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-50 text-[#d43533] font-bold text-[10px]">
                          {item.fileType}
                        </div>
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ৳{item.price.toLocaleString("en-BD")}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {item.downloadsCount} times
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle className="h-3 w-3" />
                        Published
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/seller/products/create?edit=${item.id}`}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading sample package for ${item.name}`)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                          title="Download Asset"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
