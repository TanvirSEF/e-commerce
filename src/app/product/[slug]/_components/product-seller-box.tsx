"use client"

import React from "react"
import Link from "next/link"
import { Store } from "lucide-react"

interface ProductSellerBoxProps {
  sellerName?: string
  sellerSlug?: string
}

export function ProductSellerBox({ sellerName, sellerSlug }: ProductSellerBoxProps) {
  if (!sellerName) return null

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
          <Store className="h-4 w-4 text-[#d43533]" />
        </div>
        <div>
          <div className="text-[10px] text-gray-400 uppercase">Sold by</div>
          <div className="font-bold text-gray-800">{sellerName}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/conversations"
          className="rounded border border-[#d43533] bg-red-50/50 px-2.5 py-1.5 text-xs font-semibold text-[#d43533] transition-colors hover:bg-[#d43533] hover:text-white"
        >
          Chat with Seller
        </Link>
        <Link
          href={`/shop/${sellerSlug || "store"}`}
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#d43533] hover:text-[#d43533]"
        >
          Visit Store
        </Link>
      </div>
    </div>
  )
}
