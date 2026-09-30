"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { PreorderOrder } from "@/db/schema"
import {
  deletePreorderOrderAction,
  bulkDeletePreorderOrdersAction,
} from "@/app/actions/preorder-actions"
import { PreorderOrdersFilterBar } from "./preorder-orders-filter-bar"
import { PreorderOrdersTable } from "./preorder-orders-table"
import { PreorderOrderDetailModal } from "./preorder-order-detail-modal"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface AdminPreorderOrdersViewProps {
  initialOrders: PreorderOrder[]
  counts: {
    all: number
    requested: number
    acceptedRequests: number
    prepaymentRequests: number
    confirmedPrepayments: number
    finalPreorders: number
    inShipping: number
    delivered: number
    refund: number
  }
}

export function AdminPreorderOrdersView({ initialOrders, counts }: AdminPreorderOrdersViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "all"
  const currentSearch = searchParams.get("search") || ""

  const [orders, setOrders] = useState<PreorderOrder[]>(initialOrders)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState(currentSearch)
  const [bulkAction, setBulkAction] = useState("")
  const [activeModalOrder, setActiveModalOrder] = useState<PreorderOrder | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Keep state synced when props change
  React.useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    params.delete("page")
    router.push(`/admin/preorder/orders?${params.toString()}`)
  }

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set("search", search.trim())
    } else {
      params.delete("search")
    }
    params.delete("page")
    router.push(`/admin/preorder/orders?${params.toString()}`)
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(orders.map((o) => o.id))
    }
  }

  const handleToggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteOne = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this preorder reservation?")) return
    startTransition(async () => {
      const ok = await deletePreorderOrderAction(id)
      if (ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id))
        setSelectedIds((prev) => prev.filter((item) => item !== id))
        showToast("success", "Preorder order deleted successfully.")
        router.refresh()
      } else {
        showToast("error", "Failed to delete order.")
      }
    })
  }

  const handleBulkActionApply = () => {
    if (bulkAction !== "bulk_delete" || selectedIds.length === 0) return
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} preorder orders?`)) return
    startTransition(async () => {
      const ok = await bulkDeletePreorderOrdersAction(selectedIds)
      if (ok) {
        setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)))
        setSelectedIds([])
        setBulkAction("")
        showToast("success", "Selected preorder orders deleted successfully.")
        router.refresh()
      } else {
        showToast("error", "Failed to delete selected orders.")
      }
    })
  }

  const handleOrderUpdated = (updated: PreorderOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <h5 className="text-base font-bold text-gray-800">All Preorders</h5>
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
      <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden p-4 space-y-4">
        <PreorderOrdersFilterBar
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          counts={counts}
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          bulkAction={bulkAction}
          onBulkActionChange={setBulkAction}
          onBulkActionApply={handleBulkActionApply}
          selectedCount={selectedIds.length}
        />

        <PreorderOrdersTable
          orders={orders}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onViewOrder={setActiveModalOrder}
          onDeleteOrder={handleDeleteOne}
        />
      </div>

      {/* View Detail Modal */}
      {activeModalOrder && (
        <PreorderOrderDetailModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  )
}
