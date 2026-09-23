"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  Tag,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  updateClassifiedPublishedAction,
  deleteClassifiedProductAction,
} from "@/app/actions/ecommerce-actions"
import type { ClassifiedProductItem } from "@/services/customer-product-service"

interface ClassifiedProductsAdminViewProps {
  initialProducts: ClassifiedProductItem[]
}

export function ClassifiedProductsAdminView({
  initialProducts,
}: ClassifiedProductsAdminViewProps) {
  const [products, setProducts] = useState<ClassifiedProductItem[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ClassifiedProductItem | null>(null)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleTogglePublished = async (prod: ClassifiedProductItem) => {
    const nextPublished = !prod.published
    await updateClassifiedPublishedAction(prod.id, nextPublished)
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, published: nextPublished } : p))
    )
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this classified ad?")) return
    await deleteClassifiedProductAction(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#d43533]" />
          Classified Customer Products
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer second-hand advertisements, approve listings, and manage marketplace classifieds
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            All Classified Ads ({products.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, seller, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Product Title</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Uploaded By</th>
                <th className="px-5 py-3">Condition</th>
                <th className="px-5 py-3">Published</th>
                <th className="px-5 py-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-slate-400">
                    No classified ads found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                          <Image
                            src={item.thumbnailImg}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/assets/img/placeholder.jpg"
                            }}
                          />
                        </div>
                        <div className="max-w-[220px]">
                          <div className="font-bold text-slate-900 truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.category} • {item.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{item.customerName}</div>
                      <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.published}
                          onChange={() => handleTogglePublished(item)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(item)}
                          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="Inspect Ad"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Ad"
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

      {/* Inspect Classified Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#d43533]" />
                Classified Listing Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                  <Image
                    src={selectedProduct.thumbnailImg}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedProduct.name}
                  </h4>
                  <div className="text-base font-black text-[#d43533] mt-1">
                    {formatPrice(selectedProduct.unitPrice)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Category: <span className="font-semibold text-slate-700">{selectedProduct.category}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" /> Seller Name
                  </div>
                  <div className="font-bold text-slate-800">{selectedProduct.customerName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact
                  </div>
                  <div className="font-bold text-slate-800">{selectedProduct.customerPhone}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="font-medium text-slate-700">{selectedProduct.location}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Condition</div>
                  <div className="font-bold text-blue-600">{selectedProduct.condition}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Listed on: {selectedProduct.date}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
