"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  DollarSign,
  Ban,
  Trash2,
  Eye,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface SellerTableRow {
  id: string
  name: string
  slug: string
  logo: string
  address?: string
  phone?: string
  email?: string
  rating: number
  reviewCount: number
  followersCount: number
  verificationStatus: boolean
  memberSince: string
  dueToSeller: number
  productCount: number
  ownerName: string
  banned?: boolean
  isSuspicious?: boolean
  emailVerified?: boolean
}

interface SellersTableProps {
  sellers: SellerTableRow[]
  selectedIds: string[]
  updatingId: string | null
  onToggleSelectAll: () => void
  onToggleSelectOne: (id: string) => void
  onToggleVerification: (seller: SellerTableRow) => void
  onPaySeller: (seller: SellerTableRow) => void
  onViewVerification?: (seller: SellerTableRow) => void
}

export function SellersTable({
  sellers,
  selectedIds,
  updatingId,
  onToggleSelectAll,
  onToggleSelectOne,
  onToggleVerification,
  onPaySeller,
  onViewVerification,
}: SellersTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const isAllSelected = sellers.length > 0 && selectedIds.length === sellers.length

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-[#d43533] focus:ring-[#d43533]"
                />
              </th>
              <th className="py-3 px-3 w-16">Logo</th>
              <th className="py-3 px-4">Shop Info</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Business Info</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-center">Approval</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No sellers found matching the selected filters.
                </td>
              </tr>
            ) : (
              sellers.map((seller) => {
                const isSelected = selectedIds.includes(seller.id)
                return (
                  <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectOne(seller.id)}
                        className="rounded border-slate-300 text-[#d43533] focus:ring-[#d43533]"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="relative w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={seller.logo}
                          alt={seller.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-sm hover:text-[#d43533]">
                        <Link href={`/shop/${seller.slug}`} target="_blank" className="inline-flex items-center gap-1.5">
                          {seller.banned ? (
                            <span title="Banned">
                              <Ban className="w-3.5 h-3.5 text-red-500" />
                            </span>
                          ) : seller.isSuspicious ? (
                            <span title="Suspicious">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          ) : (
                            <span title="Active">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            </span>
                          )}
                          <span>{seller.name}</span>
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Owner: <span className="font-medium text-slate-700">{seller.ownerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{seller.phone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{seller.email || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="border-l-2 border-sky-500 pl-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Products</span>
                        <span className="text-xs font-semibold text-slate-700">{seller.productCount} items</span>
                      </div>
                      <div className="border-l-2 border-amber-500 pl-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Due to Seller</span>
                        <span className="text-xs font-bold text-[#d43533]">{formatPrice(seller.dueToSeller)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            seller.emailVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {seller.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            seller.verificationStatus
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {seller.verificationStatus ? "Verified" : "Not Verified"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={seller.verificationStatus}
                          onChange={() => onToggleVerification(seller)}
                          disabled={updatingId === seller.id}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPaySeller(seller)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
                        >
                          Pay
                        </button>
                        <Link
                          href={`/shop/${seller.slug}`}
                          target="_blank"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="Visit Shop"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
