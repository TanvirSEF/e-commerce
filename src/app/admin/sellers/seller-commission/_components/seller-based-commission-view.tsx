"use client"

import React, { useState, useTransition } from "react"
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Percent,
  Store,
  Save,
} from "lucide-react"
import { updateSellerCommissionOverrideAction } from "@/app/actions/ecommerce-actions"

interface SellerData {
  id: string
  name: string
  slug: string
  logo?: string
  ownerName?: string
  productCount?: number
  dueToSeller?: number
}

interface SellerBasedCommissionViewProps {
  sellers: SellerData[]
  initialOverrides: Record<string, number>
}

export function SellerBasedCommissionView({
  sellers,
  initialOverrides,
}: SellerBasedCommissionViewProps) {
  const [overrides, setOverrides] = useState<Record<string, number>>(initialOverrides)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredSellers = sellers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.ownerName && s.ownerName.toLowerCase().includes(search.toLowerCase()))
  )

  const handleUpdate = (sellerId: string, rate: number) => {
    startTransition(async () => {
      const res = await updateSellerCommissionOverrideAction(sellerId, rate)
      if (res.success) {
        setOverrides((prev) => ({ ...prev, [sellerId]: rate }))
        setFeedback({ type: "success", text: "Seller commission rate updated successfully!" })
      } else {
        setFeedback({ type: "error", text: "Failed to update commission rate" })
      }
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#d43533]" />
            Seller-Based Commission Overrides
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure custom negotiated commission rates for individual VIP or high-volume merchants
          </p>
        </div>
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

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">
            Registered Vendors ({sellers.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search seller by shop or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Custom Rate (%)</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No vendors found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => {
                  const currentRate = overrides[seller.id] ?? 10
                  return (
                    <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {seller.logo ? (
                              <img src={seller.logo} alt={seller.name} className="h-full w-full object-cover" />
                            ) : (
                              <Store className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900">{seller.name}</span>
                            <div className="text-[10px] text-gray-400 font-mono">/{seller.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {seller.ownerName || "Merchant"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {seller.productCount || 0} items
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={currentRate}
                            onChange={(e) =>
                              setOverrides({
                                ...overrides,
                                [seller.id]: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-20 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                          />
                          <span className="font-bold text-gray-500 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleUpdate(seller.id, overrides[seller.id] ?? 10)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Update
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
