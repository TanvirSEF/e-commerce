"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Gavel, Plus, Search, Eye, Clock, Trash2, ExternalLink, AlertCircle } from "lucide-react"
import type { AuctionProduct } from "@/db/schema/auction"
import {
  toggleAuctionPublishedAction,
  toggleAuctionFeaturedAction,
  deleteAuctionProductAction,
} from "@/app/actions/ecommerce-actions"

interface SellerAuctionProductsViewProps {
  products: AuctionProduct[]
  sellerSlug?: string
}

export function SellerAuctionProductsView({
  products: initialProducts,
}: SellerAuctionProductsViewProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "closed">("all")
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    const isClosed = p.isClosed || new Date(p.auctionEndDate).getTime() < Date.now()
    if (statusFilter === "live") return !isClosed
    if (statusFilter === "closed") return isClosed
    return true
  })

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: !currentStatus } : item))
    )
    try {
      await toggleAuctionPublishedAction(id, !currentStatus)
      router.refresh()
    } catch (err) {
      console.error("toggleAuctionPublished error:", err)
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: currentStatus } : item))
      )
    }
  }

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, featured: !currentFeatured } : item))
    )
    try {
      await toggleAuctionFeaturedAction(id, !currentFeatured)
      router.refresh()
    } catch (err) {
      console.error("toggleAuctionFeatured error:", err)
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, featured: currentFeatured } : item))
      )
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setIsDeleting(true)
    try {
      await deleteAuctionProductAction(deleteTargetId)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTargetId))
      setDeleteTargetId(null)
      router.refresh()
    } catch (err) {
      console.error("deleteAuctionProduct error:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#d43533]" />
            All Auction Products
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your competitive bidding inventory, track incoming bids, and monitor closing timers
          </p>
        </div>
        <Link
          href="/seller/auction/products/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#d43533] hover:bg-[#b82927] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Auction Product
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type name & hit enter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="all">All Statuses</option>
              <option value="live">Live Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            Total Products: <span className="font-semibold text-gray-800">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-600 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12 font-mono">#</th>
                <th className="py-3 px-4 min-w-[200px]">Product Name</th>
                <th className="py-3 px-4">Starting Bid</th>
                <th className="py-3 px-4">Current Bid</th>
                <th className="py-3 px-4">Total Bids</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4 text-center">Published</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No auction products found. Click &quot;Add New Auction Product&quot; to list your first item.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const endDate = new Date(item.auctionEndDate)
                  const isClosed = item.isClosed || endDate.getTime() < Date.now()
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={item.thumbnail || "/assets/img/placeholder.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block line-clamp-1">{item.name}</span>
                            <span className="text-[10px] text-gray-400 block">
                              Min Inc: +${Number(item.minBidIncrement).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        ${Number(item.startingBid).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#d43533] text-sm">
                        ${Number(item.currentBid).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/seller/auction/bids/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px] hover:bg-amber-100 transition-colors"
                        >
                          <Gavel className="w-3 h-3 text-amber-600" />
                          {item.totalBids} Bids
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-gray-700 font-medium">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{endDate.toLocaleDateString()}</span>
                          </div>
                          {isClosed ? (
                            <span className="inline-block text-[10px] text-gray-400 font-normal">Closed</span>
                          ) : (
                            <span className="inline-block text-[10px] text-emerald-600 font-medium">Live</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={() => handleToggleStatus(item.id, item.status)}
                          className="rounded border-gray-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={() => handleToggleFeatured(item.id, item.featured)}
                          className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/auction-product/${item.slug}`}
                            target="_blank"
                            className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center justify-center transition-colors"
                            title="View Auction Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/seller/auction/bids/${item.id}`}
                            className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 inline-flex items-center justify-center transition-colors"
                            title="View Bids History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(item.id)}
                            className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Auction Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Delete Auction Product?</h3>
            <p className="text-xs text-gray-500 mb-5">
              Are you sure you want to permanently delete this auction listing? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
