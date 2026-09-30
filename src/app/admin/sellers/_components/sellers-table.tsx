"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Phone, MapPin, CheckCircle2, XCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface SellerTableRow {
  id: string
  name: string
  slug: string
  logo: string
  address?: string
  phone?: string
  rating: number
  reviewCount: number
  followersCount: number
  verificationStatus: boolean
  memberSince: string
  dueToSeller: number
  productCount: number
  ownerName: string
}

interface SellersTableProps {
  sellers: SellerTableRow[]
  updatingId: string | null
  onToggleVerification: (seller: SellerTableRow) => void
  onPaySeller: (seller: SellerTableRow) => void
}

export function SellersTable({
  sellers,
  updatingId,
  onToggleVerification,
  onPaySeller,
}: SellersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Shop Info</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4">Due Balance</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sellers.map((seller, idx) => (
              <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={seller.logo}
                        alt={seller.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm hover:text-[#d43533]">
                        <Link href={`/shop/${seller.slug}`} target="_blank" className="flex items-center gap-1">
                          {seller.name}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">Owner: {seller.ownerName}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{seller.phone || "+880 1700 000000"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{seller.address || "Dhaka, Bangladesh"}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">
                  {seller.productCount} items
                </td>
                <td className="py-3.5 px-4 font-bold text-[#d43533]">
                  {formatPrice(seller.dueToSeller)}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onToggleVerification(seller)}
                    disabled={updatingId === seller.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      seller.verificationStatus
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    {seller.verificationStatus ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Unverified
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onPaySeller(seller)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
                    >
                      Pay Seller
                    </button>
                    <Link
                      href={`/shop/${seller.slug}`}
                      target="_blank"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                      title="Visit Shop"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
