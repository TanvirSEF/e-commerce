"use client"

import React from "react"
import Link from "next/link"
import { Plus, Eye } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface SellerTopCardsProps {
  totalProducts: number
  rating: number
  followersCount: number
  customFollowers: number
  totalDeliveredOrders: number
  totalSales: number
  previousMonthSoldAmount: number
}

export function SellerTopCards({
  totalProducts,
  rating,
  followersCount,
  customFollowers,
  totalDeliveredOrders,
  totalSales,
  previousMonthSoldAmount,
}: SellerTopCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Products Card */}
      <div className="rounded-lg bg-[#d43533] text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-red-100 font-medium">Products</p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">{totalProducts}</h3>
          </div>
          <div className="w-14 h-14 opacity-90 text-white shrink-0">
            <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
              <path d="M57.6 19.2l-23-9.2a6.4 6.4-0 00-4.8 0l-23 9.2a3.2 3.2 0 00-2 3v27.4a3.2 3.2 0 002 3l23 9.2a6.4 6.4 0 004.8 0l23-9.2a3.2 3.2 0 002-3V22.2a3.2 3.2 0 00-2-3zm-25.4-7a4.8 4.8 0 013.6 0l20.9 8.4-9.9 3.9-24.5-9.8 9.9-2.5zm1 47.7L10.6 51a1.6 1.6 0 01-1-1.5V23.2l23.2 9.3v27.4zm2-28.8L11 22.1l8.8-5 24.5 9.8-8.9 4.2zm24 18.4a1.6 1.6 0 01-1 1.5l-22.2 8.9V32.5l10.4-4.2v9.9a.8.8 0 001.6 0v-10.5l11.2-4.5v19.4z" />
            </svg>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-red-400/40">
          <Link
            href="/seller/products/create"
            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-red-100 font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 2. Rating Card */}
      <div className="rounded-lg bg-[#d43533] text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-red-100 font-medium">Rating</p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">
              {Number(rating || 0).toFixed(1)}
            </h3>
          </div>
          <div className="w-14 h-14 opacity-90 text-white shrink-0">
            <svg viewBox="0 0 64 61" fill="currentColor" className="w-full h-full">
              <path d="M63.3 22.1a2.8 2.8 0 00-1.8-.9L44 19.5a2.8 2.8 0 01-2.3-1.7L34.6 1.7a2.8 2.8 0 00-5.2 0l-7.1 16.1a2.8 2.8 0 01-2.3 1.7L2.5 21.2a2.8 2.8 0 00-1.6 4.9l13.1 11.7a2.8 2.8 0 01.9 2.7l-3.7 17.2a2.8 2.8 0 004.2 3l15.2-8.8a2.8 2.8 0 012.8 0l15.2 8.8a2.8 2.8 0 004.2-3l-3.7-17.2a2.8 2.8 0 01.9-2.7l13.1-11.7a2.8 2.8 0 00.3-4z" />
            </svg>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-red-400/40 flex items-center justify-between text-[11px] text-red-100">
          <span>Followers {followersCount}</span>
          <span>Custom Followers {customFollowers}</span>
        </div>
      </div>

      {/* 3. Total Order Card */}
      <div className="rounded-lg bg-[#d43533] text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-red-100 font-medium">Total Order</p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">{totalDeliveredOrders}</h3>
          </div>
          <div className="w-14 h-14 opacity-90 text-white shrink-0">
            <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
              <path d="M48 10H16a6 6 0 00-6 6v36a6 6 0 006 6h32a6 6 0 006-6V16a6 6 0 00-6-6zm4 42a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4h32a4 4 0 014 4v36zM22 24h20a1 1 0 000-2H22a1 1 0 000 2zm0 8h20a1 1 0 000-2H22a1 1 0 000 2zm0 8h20a1 1 0 000-2H22a1 1 0 000 2z" />
            </svg>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-red-400/40">
          <Link
            href="/seller/orders"
            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-red-100 font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View All Order</span>
          </Link>
        </div>
      </div>

      {/* 4. Total Sales Card */}
      <div className="rounded-lg bg-[#d43533] text-white p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-red-100 font-medium">Total Sales</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              {formatPrice(totalSales)}
            </h3>
          </div>
          <div className="w-14 h-14 opacity-90 text-white shrink-0">
            <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
              <path d="M54 10a3 3 0 00-4 4l-13 13a3 3 0 00-2.6 0l-6.6-6.6a3 3 0 10-5.4 0L11 31.9a3 3 0 101.4 1.4l11.4-11.4a3 3 0 002.6 0l6.6 6.6a3 3 0 105.4 0l13-13A3 3 0 0054 10zM10 50h44a1 1 0 000-2H10a1 1 0 000 2z" />
            </svg>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-red-400/40 flex items-center justify-between text-xs text-red-100">
          <span>Last Month:</span>
          <span className="font-semibold text-white">{formatPrice(previousMonthSoldAmount)}</span>
        </div>
      </div>
    </div>
  )
}
