"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Store,
  X,
} from "lucide-react"
import { updateSellerCommissionOverrideAction } from "@/app/actions/ecommerce-actions"

interface SellerData {
  id: string
  name: string
  slug: string
  logo?: string
  ownerName?: string
  phone?: string
  email?: string
  productCount?: number
  dueToSeller?: number
  emailVerified?: boolean
  banned?: boolean
}

interface SellerBasedCommissionViewProps {
  sellers?: SellerData[]
  initialOverrides?: Record<string, number>
}

export function SellerBasedCommissionView({
  sellers = [],
  initialOverrides = {},
}: SellerBasedCommissionViewProps) {
  const [overrides, setOverrides] = useState<Record<string, number>>(initialOverrides || {})
  const [search, setSearch] = useState("")
  const [pendingConfirmSeller, setPendingConfirmSeller] = useState<SellerData | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredSellers = (sellers || []).filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    )
  })

  const handleRateChange = (sellerId: string, val: string) => {
    const num = parseFloat(val) || 0
    setOverrides((prev) => ({ ...prev, [sellerId]: num }))
  }

  const handleConfirmSet = () => {
    if (!pendingConfirmSeller) return
    const sellerId = pendingConfirmSeller.id
    const rate = overrides[sellerId] ?? 0
    startTransition(async () => {
      const res = await updateSellerCommissionOverrideAction(sellerId, rate)
      if (res.success) {
        setFeedback({
          type: "success",
          text: `Commission rate for "${pendingConfirmSeller.name}" set to ${rate}%!`,
        })
      } else {
        setFeedback({ type: "error", text: "Failed to update commission rate" })
      }
      setPendingConfirmSeller(null)
      setTimeout(() => setFeedback(null), 3500)
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#d43533]" />
            Set Seller Based Commission
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure custom negotiated commission rates for individual vendors
          </p>
        </div>
      </div>

      {/* Alert Notice (1:1 with Laravel set_commission.blade.php) */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 text-xs text-sky-900 space-y-1">
        <p className="font-semibold">
          Seller-Based Commission rates apply directly to each vendor&apos;s product sales.
        </p>
        <p className="text-slate-600">
          Ensure commission type is set to Seller Based under{" "}
          <Link href="/admin/sellers/commission" className="text-[#d43533] font-bold underline">
            Seller Commission Settings
          </Link>.
        </p>
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

      {/* Main Table Card (1:1 with Laravel seller_based_commission/set_commission.blade.php) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Sellers ({sellers.length})
          </h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Type name or email or mobile number & Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Num. of Products</th>
                <th className="px-4 py-3">Email Verification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-44">Commission</th>
                <th className="px-4 py-3 text-right w-24">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400">
                    No vendors found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller, idx) => {
                  const currentRate = overrides[seller.id] ?? 10
                  return (
                    <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded border border-gray-200 overflow-hidden shrink-0 relative bg-slate-100">
                            {seller.logo ? (
                              <Image
                                src={seller.logo}
                                alt={seller.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <Store className="h-4 w-4 text-gray-400 m-auto" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{seller.name}</span>
                            <span className="text-[11px] text-slate-400 font-medium">{seller.ownerName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {seller.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {seller.email || "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {seller.productCount || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            seller.emailVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {seller.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            seller.banned
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {seller.banned ? "Banned" : "Regular"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={currentRate}
                            onChange={(e) => handleRateChange(seller.id, e.target.value)}
                            className="w-20 rounded-l border border-gray-200 px-2 py-1 text-xs font-bold text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                          />
                          <span className="bg-gray-100 border border-l-0 border-gray-200 px-2 py-1 text-xs text-gray-600 font-bold rounded-r">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPendingConfirmSeller(seller)}
                          className="rounded bg-[#d43533] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#b02a28] transition"
                        >
                          Set
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

      {/* Confirmation Modal (1:1 with Laravel confirm-modal) */}
      {pendingConfirmSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 text-xs">
            <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Confirm Seller Commission
            </h3>
            <p className="text-slate-500 mb-4">
              Are you sure you want to set Seller Based Commission for &quot;{pendingConfirmSeller.name}&quot; to{" "}
              <span className="font-bold text-[#d43533]">{overrides[pendingConfirmSeller.id] ?? 10}%</span>?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setPendingConfirmSeller(null)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSet}
                disabled={isPending}
                className="px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white font-semibold rounded transition"
              >
                {isPending ? "Setting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
