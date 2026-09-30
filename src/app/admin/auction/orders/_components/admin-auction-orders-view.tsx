"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Trophy, CheckCircle2, AlertCircle } from "lucide-react"
import type { AuctionOrder } from "@/db/schema/auction"
import { deleteAuctionOrderAction } from "@/app/actions/auction-actions"
import { AuctionOrdersTable } from "./auction-orders-table"
import { AuctionOrderDetailModal } from "./auction-order-detail-modal"

interface AdminAuctionOrdersViewProps {
  initialOrders?: AuctionOrder[]
}

export function AdminAuctionOrdersView({
  initialOrders = [],
}: AdminAuctionOrdersViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const [orders, setOrders] = useState<AuctionOrder[]>(initialOrders || [])
  const [search, setSearch] = useState(currentSearch)
  const [activeModalOrder, setActiveModalOrder] = useState<AuctionOrder | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  React.useEffect(() => {
    setOrders(initialOrders || [])
  }, [initialOrders])

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set("search", search.trim())
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  const handleDeleteOrder = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this auction order?")) return
    startTransition(async () => {
      const ok = await deleteAuctionOrderAction(id)
      if (ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id))
        showToast("success", "Auction order deleted successfully.")
        router.refresh()
      } else {
        showToast("error", "Failed to delete auction order.")
      }
    })
  }

  const handleOrderUpdated = (updated: AuctionOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h5 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Auction Orders & Sales
        </h5>
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

      {/* Main card */}
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#f8f9fb]">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search code, customer, or item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#d43533] bg-red-50 hover:bg-red-100 transition-colors"
            >
              Filter
            </button>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Total Sales: <span className="text-gray-900 font-bold">{orders.length}</span>
          </div>
        </div>

        {/* Table */}
        <AuctionOrdersTable
          orders={orders}
          onViewOrder={setActiveModalOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>

      {/* Modal */}
      {activeModalOrder && (
        <AuctionOrderDetailModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  )
}
