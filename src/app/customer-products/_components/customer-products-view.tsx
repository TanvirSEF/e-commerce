"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Tag, MapPin, Phone, Mail, Plus, X, ShieldAlert, Sparkles } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { ClassifiedProductItem } from "@/services/customer-product-service"

interface CustomerProductsViewProps {
  initialProducts: ClassifiedProductItem[]
}

const CATEGORIES = [
  "All Categories",
  "Cellphones & Tabs",
  "Gaming & Consoles",
  "Automobile & Bikes",
  "Computer & Accessories",
  "Consumer Electronics",
  "Home & Furniture",
]

export function CustomerProductsView({ initialProducts }: CustomerProductsViewProps) {
  const [products] = useState<ClassifiedProductItem[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [condition, setCondition] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedProduct, setSelectedProduct] = useState<ClassifiedProductItem | null>(null)

  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All Categories" || p.category.toLowerCase() === category.toLowerCase()
      const matchCond =
        condition === "all" ||
        (condition === "new" && p.condition.toLowerCase().includes("new")) ||
        (condition === "used" && p.condition.toLowerCase().includes("used"))
      return matchSearch && matchCat && matchCond
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.unitPrice - b.unitPrice
      if (sortBy === "price_desc") return b.unitPrice - a.unitPrice
      return b.id - a.id
    })

  return (
    <div className="bg-gray-50/50 py-8 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 space-y-6">
        {/* Top Banner & Header */}
        <div className="bg-gradient-to-r from-[#00002e] to-[#1f2937] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Classifieds Marketplace
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Buy & Sell Second-Hand Products</h1>
            <p className="text-xs text-gray-300 mt-1">
              Verified local listings from genuine customers across Bangladesh. Direct peer-to-peer deals.
            </p>
          </div>
          <Link
            href="/dashboard/customer-products/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Post Your Classified Ad
          </Link>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d43533]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#d43533]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="all">All Conditions</option>
              <option value="new">New / Brand New</option>
              <option value="used">Used / Pre-owned</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#d43533]"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No classified advertisements matched your filters.</p>
            <p className="text-xs mt-1">Try resetting your search query or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={item.thumbnailImg}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs ${
                        item.condition.toLowerCase().includes("new") ? "bg-emerald-600" : "bg-amber-600"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-1 group-hover:text-[#d43533] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Asking Price</span>
                      <span className="text-sm font-extrabold text-[#d43533]">
                        {formatPrice(item.unitPrice)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(item)}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-[#d43533] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Seller Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative space-y-4">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 mb-1">
                  Direct Seller Contact
                </span>
                <h2 className="text-base font-bold text-gray-900">{selectedProduct.name}</h2>
                <div className="text-base font-extrabold text-[#d43533] mt-1">
                  {formatPrice(selectedProduct.unitPrice)}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium w-16">Seller:</span>
                  <span className="font-bold text-gray-900">{selectedProduct.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium w-16">Phone:</span>
                  <a
                    href={`tel:${selectedProduct.customerPhone}`}
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedProduct.customerPhone}
                  </a>
                </div>
                {selectedProduct.customerEmail && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium w-16">Email:</span>
                    <span className="text-gray-900">{selectedProduct.customerEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-medium w-16">Location:</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {selectedProduct.location}
                  </span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Tip:</strong> Meet the seller in a well-lit public area. Always test the product thoroughly before making payment.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
