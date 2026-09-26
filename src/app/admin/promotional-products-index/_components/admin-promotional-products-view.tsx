"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Flame, Star, Zap, Gavel, Search, CheckCircle, ExternalLink } from "lucide-react"

interface PromoProduct {
  id: number
  name: string
  thumbnail: string
  price: string
  category: string
  isTodaysDeal: boolean
  isFeatured: boolean
  isFlashDeal: boolean
}

const INITIAL_PROMO_PRODUCTS: PromoProduct[] = [
  {
    id: 1,
    name: "Apple MacBook Pro 16-inch M3 Max (36GB Unified Memory)",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80",
    price: "3499.00",
    category: "Laptops & Computers",
    isTodaysDeal: true,
    isFeatured: true,
    isFlashDeal: false,
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    price: "399.00",
    category: "Audio & Accessories",
    isTodaysDeal: true,
    isFeatured: false,
    isFlashDeal: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80",
    price: "1299.00",
    category: "Smartphones",
    isTodaysDeal: false,
    isFeatured: true,
    isFlashDeal: true,
  },
  {
    id: 4,
    name: "PlayStation 5 DualSense Wireless Controller Midnight Black",
    thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&auto=format&fit=crop&q=80",
    price: "69.00",
    category: "Gaming & VR",
    isTodaysDeal: true,
    isFeatured: false,
    isFlashDeal: false,
  },
]

export function AdminPromotionalProductsView() {
  const [products, setProducts] = useState(INITIAL_PROMO_PRODUCTS)
  const [activeTab, setActiveTab] = useState<"all" | "todays_deal" | "featured" | "flash_deal">("all")
  const [search, setSearch] = useState("")

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (activeTab === "todays_deal") return p.isTodaysDeal
    if (activeTab === "featured") return p.isFeatured
    if (activeTab === "flash_deal") return p.isFlashDeal
    return true
  })

  const toggleStatus = (id: number, key: "isTodaysDeal" | "isFeatured" | "isFlashDeal") => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: !p[key] } : p))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#d43533]" />
            Promotional Products Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quickly toggle and coordinate items across Today's Deal, Featured Highlights, and Flash Deals
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("todays_deal")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "todays_deal" ? "bg-[#d43533] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Today's Deal
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "featured" ? "bg-amber-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <Star className="w-3.5 h-3.5" /> Featured
            </button>
            <button
              onClick={() => setActiveTab("flash_deal")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "flash_deal" ? "bg-purple-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Flash Deal
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5 text-center">Today's Deal</th>
                <th className="px-4 py-3.5 text-center">Featured Product</th>
                <th className="px-4 py-3.5 text-center">Flash Deal Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                        <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 line-clamp-1">{item.name}</span>
                        <span className="text-xs text-slate-400">{item.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">${item.price}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleStatus(item.id, "isTodaysDeal")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        item.isTodaysDeal
                          ? "bg-red-50 text-[#d43533] border border-red-200 hover:bg-red-100"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {item.isTodaysDeal ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleStatus(item.id, "isFeatured")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        item.isFeatured
                          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {item.isFeatured ? "Featured" : "Regular"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleStatus(item.id, "isFlashDeal")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        item.isFlashDeal
                          ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {item.isFlashDeal ? "Included" : "Excluded"}
                    </button>
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
