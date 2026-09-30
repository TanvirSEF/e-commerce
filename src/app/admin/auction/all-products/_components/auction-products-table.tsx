"use client"

import React from "react"
import Link from "next/link"
import { Eye, Trash2, ExternalLink, Calendar, Clock, Gavel } from "lucide-react"
import type { AuctionProduct } from "@/db/schema/auction"

interface AuctionProductsTableProps {
  products: AuctionProduct[]
  selectedIds: number[]
  onToggleSelectAll: () => void
  onToggleSelectOne: (id: number) => void
  onTogglePublished: (id: number, current: boolean) => void
  onToggleFeatured: (id: number, current: boolean) => void
  onDeleteProduct: (id: number) => void
}

export function AuctionProductsTable({
  products,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onTogglePublished,
  onToggleFeatured,
  onDeleteProduct,
}: AuctionProductsTableProps) {
  const isAllSelected = products.length > 0 && selectedIds.length === products.length

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-[#f8f9fb] text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="py-3 px-3 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="w-3.5 h-3.5 text-[#d43533] rounded focus:ring-0"
              />
            </th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Thumb</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Name / Slug</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Seller</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Starting Bid</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Current Bid</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Total Bids</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold">Auction Period</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold text-center">Published</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold text-center">Featured</th>
            <th className="py-3 px-3 uppercase text-[11px] font-bold text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((item) => {
            const isChecked = selectedIds.includes(item.id)
            const endDate = new Date(item.auctionEndDate)
            const isExpired = endDate.getTime() < Date.now()

            return (
              <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSelectOne(item.id)}
                    className="w-3.5 h-3.5 text-[#d43533] rounded focus:ring-0"
                  />
                </td>

                {/* Thumb */}
                <td className="py-3 px-3">
                  <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={item.thumbnail || "/assets/img/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/assets/img/placeholder.jpg"
                      }}
                    />
                  </div>
                </td>

                {/* Name / Slug */}
                <td className="py-3 px-3 max-w-[220px]">
                  <p className="font-semibold text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    Min Inc: +${item.minBidIncrement}
                  </p>
                </td>

                {/* Seller */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="font-medium text-gray-800">
                    {item.sellerName || (item.sellerSlug === "inhouse" ? "Inhouse" : item.sellerSlug)}
                  </span>
                </td>

                {/* Starting Bid */}
                <td className="py-3 px-3 font-semibold text-gray-700 whitespace-nowrap">
                  ${item.startingBid}
                </td>

                {/* Current Bid */}
                <td className="py-3 px-3 font-bold text-[#d43533] text-sm whitespace-nowrap">
                  ${item.currentBid}
                </td>

                {/* Total Bids */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <Link
                    href={`/admin/auction/bids/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-semibold text-xs hover:bg-amber-100 transition-colors"
                  >
                    <Gavel className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.totalBids} Bids</span>
                  </Link>
                </td>

                {/* Auction Period */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{new Date(item.auctionStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[11px] font-medium text-gray-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>Ends: {endDate.toLocaleDateString()}</span>
                    {isExpired ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-gray-100 text-gray-500">
                        Ended
                      </span>
                    ) : (
                      <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Live
                      </span>
                    )}
                  </div>
                </td>

                {/* Published Toggle Switch */}
                <td className="py-3 px-3 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => onTogglePublished(item.id, item.status)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </td>

                {/* Featured Toggle Switch */}
                <td className="py-3 px-3 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={() => onToggleFeatured(item.id, item.featured)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </td>

                {/* Options */}
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/auction-product/${item.slug}`}
                      target="_blank"
                      title="View Public Auction Page"
                      className="p-1.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/auction/bids/${item.id}`}
                      title="Inspect Bids"
                      className="p-1.5 rounded-full text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      title="Delete Product"
                      onClick={() => onDeleteProduct(item.id)}
                      className="p-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={11} className="py-12 text-center text-xs text-gray-400">
                No auction products found for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
