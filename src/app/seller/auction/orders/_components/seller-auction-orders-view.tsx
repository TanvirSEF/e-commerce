"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Trophy,
  Search,
  CheckCircle,
  Truck,
  Trash2,
  AlertCircle,
  Clock,
  ChevronDown,
  Edit2,
  XCircle,
} from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"
import {
  deleteAuctionOrderAction,
  updateAuctionOrderStatusAction,
} from "@/app/actions/ecommerce-actions"

interface SellerAuctionOrdersViewProps {
  orders: AuctionOrder[]
}

export function SellerAuctionOrdersView({ orders: initialOrders }: SellerAuctionOrdersViewProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Status edit modal state
  const [editingOrder, setEditingOrder] = useState<AuctionOrder | null>(null)
  const [editPaymentStatus, setEditPaymentStatus] = useState("paid")
  const [editDeliveryStatus, setEditDeliveryStatus] = useState("pending")
  const [isUpdating, setIsUpdating] = useState(false)

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false
    if (deliveryFilter !== "all" && o.deliveryStatus !== deliveryFilter) return false
    return true
  })

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return
    setIsDeleting(true)
    try {
      await deleteAuctionOrderAction(deleteTargetId)
      setOrders((prev) => prev.filter((o) => o.id !== deleteTargetId))
      setDeleteTargetId(null)
      router.refresh()
    } catch (err) {
      console.error("deleteAuctionOrder error:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return
    setIsUpdating(true)
    try {
      await updateAuctionOrderStatusAction(editingOrder.id, {
        paymentStatus: editPaymentStatus,
        deliveryStatus: editDeliveryStatus,
      })
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id
            ? { ...o, paymentStatus: editPaymentStatus, deliveryStatus: editDeliveryStatus }
            : o
        )
      )
      setEditingOrder(null)
      router.refresh()
    } catch (err) {
      console.error("updateAuctionOrderStatus error:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Auction Winning Orders
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Winning bidders and completed auction orders ready for processing & dispatch
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search order code or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#d43533] focus:border-[#d43533]"
              />
            </div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            Total Orders: <span className="font-semibold text-gray-800">{filtered.length}</span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-semibold text-gray-600 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12 font-mono">#</th>
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4 min-w-[180px]">Auction Item</th>
                <th className="py-3 px-4">Winning Bidder</th>
                <th className="py-3 px-4">Hammer Price</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No auction orders found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                      {item.orderCode}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 line-clamp-1 block">
                        {item.productName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{item.customerName}</div>
                      <div className="text-[10px] text-gray-400">{item.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 text-sm">
                      ${Number(item.winningBid).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {item.paymentStatus === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.deliveryStatus === "delivered" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Truck className="w-3 h-3 text-emerald-600" />
                          Delivered
                        </span>
                      ) : item.deliveryStatus === "in_transit" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <Truck className="w-3 h-3 text-blue-600" />
                          In Transit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                          <Clock className="w-3 h-3 text-gray-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingOrder(item)
                            setEditPaymentStatus(item.paymentStatus)
                            setEditDeliveryStatus(item.deliveryStatus)
                          }}
                          className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Update Order Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Update Order #{editingOrder.orderCode}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Payment Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Delivery Status</label>
                <select
                  value={editDeliveryStatus}
                  onChange={(e) => setEditDeliveryStatus(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d43533]"
                >
                  <option value="pending">Pending</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#d43533] hover:bg-[#b82927] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Delete Auction Order?</h3>
            <p className="text-xs text-gray-500 mb-5">
              Are you sure you want to permanently delete this auction order record? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
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
