"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefundRequestsHeader } from "./refund-requests-header"
import { RefundRequestsFilterBar } from "./refund-requests-filter-bar"
import { RefundRequestsTable } from "./refund-requests-table"
import { RefundDetailModal } from "./refund-detail-modal"
import { RefundPayModal } from "./refund-pay-modal"
import { RefundRejectModal } from "./refund-reject-modal"
import { RefundDeleteModal } from "./refund-delete-modal"
import {
  approveRefundAction,
  rejectRefundAction,
  deleteRefundAction,
} from "@/app/actions/refund-actions"
import type { RefundRequestItem } from "@/services/refund-service"

interface RefundRequestsAdminViewProps {
  initialItems: RefundRequestItem[]
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    totalAmount: number
  }
  presetReasons: string[]
  initialPage: number
  initialTotalPages: number
  initialTotal: number
  initialLimit: number
}

export function RefundRequestsAdminView({
  initialItems,
  stats: initialStats,
  presetReasons,
  initialPage,
  initialTotalPages,
  initialTotal,
  initialLimit,
}: RefundRequestsAdminViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const [items, setItems] = useState<RefundRequestItem[]>(initialItems)
  const [stats, setStats] = useState(initialStats)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(initialPage)

  // Active Modals
  const [inspectItem, setInspectItem] = useState<RefundRequestItem | null>(null)
  const [approveItem, setApproveItem] = useState<RefundRequestItem | null>(null)
  const [rejectItem, setRejectItem] = useState<RefundRequestItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<RefundRequestItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter items on client for immediate responsiveness
  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchOrder = item.orderCode.toLowerCase().includes(q)
      const matchCustomer = item.customerName.toLowerCase().includes(q)
      const matchProduct = item.productName.toLowerCase().includes(q)
      const matchReason = item.reason.toLowerCase().includes(q)
      const matchShop = item.shopName.toLowerCase().includes(q)
      if (!matchOrder && !matchCustomer && !matchProduct && !matchReason && !matchShop) {
        return false
      }
    }
    return true
  })

  // Pagination calculation
  const limit = initialLimit || 15
  const totalFiltered = filtered.length
  const totalPages = Math.ceil(totalFiltered / limit) || 1
  const paginatedItems = filtered.slice((page - 1) * limit, page * limit)

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    setPage(1)
  }

  // Action: Approve & Pay
  const handleConfirmPay = async (refundId: string, adminNote: string) => {
    setIsProcessing(true)
    try {
      const res = await approveRefundAction({ requestId: refundId, adminNote })
      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === refundId
              ? {
                  ...it,
                  status: "approved",
                  adminNote: adminNote || "Approved and refunded to customer wallet.",
                }
              : it
          )
        )
        setStats((prev) => {
          const approvedItem = items.find((i) => i.id === refundId)
          const addedAmount = approvedItem ? approvedItem.amount : 0
          return {
            ...prev,
            pending: Math.max(0, prev.pending - 1),
            approved: prev.approved + 1,
            totalAmount: prev.totalAmount + addedAmount,
          }
        })
        setApproveItem(null)
      }
    } finally {
      setIsProcessing(false)
      startTransition(() => router.refresh())
    }
  }

  // Action: Reject
  const handleConfirmReject = async (
    refundId: string,
    rejectReason: string,
    adminNote: string
  ) => {
    setIsProcessing(true)
    try {
      const res = await rejectRefundAction({
        requestId: refundId,
        rejectReason,
        adminNote,
      })
      if (res.success) {
        const fullNote = [rejectReason, adminNote].filter(Boolean).join(" - ")
        setItems((prev) =>
          prev.map((it) =>
            it.id === refundId ? { ...it, status: "rejected", adminNote: fullNote } : it
          )
        )
        setStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          rejected: prev.rejected + 1,
        }))
        setRejectItem(null)
      }
    } finally {
      setIsProcessing(false)
      startTransition(() => router.refresh())
    }
  }

  // Action: Delete
  const handleConfirmDelete = async (refundId: string) => {
    setIsProcessing(true)
    try {
      const res = await deleteRefundAction(refundId)
      if (res.success) {
        const deleted = items.find((i) => i.id === refundId)
        setItems((prev) => prev.filter((it) => it.id !== refundId))
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          pending:
            deleted?.status === "pending" ? Math.max(0, prev.pending - 1) : prev.pending,
          approved:
            deleted?.status === "approved" ? Math.max(0, prev.approved - 1) : prev.approved,
          rejected:
            deleted?.status === "rejected" ? Math.max(0, prev.rejected - 1) : prev.rejected,
          totalAmount:
            deleted?.status === "approved"
              ? Math.max(0, prev.totalAmount - (deleted.amount || 0))
              : prev.totalAmount,
        }))
        setDeleteItem(null)
      }
    } finally {
      setIsProcessing(false)
      startTransition(() => router.refresh())
    }
  }

  return (
    <div className="space-y-5">
      {/* 1. Header & KPI Cards */}
      <RefundRequestsHeader stats={stats} />

      {/* 2. Main Card with Active eCommerce Filter & Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <RefundRequestsFilterBar
          search={search}
          statusFilter={statusFilter}
          stats={stats}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />

        <RefundRequestsTable
          items={paginatedItems}
          page={page}
          totalPages={totalPages}
          total={totalFiltered}
          limit={limit}
          onPageChange={setPage}
          onInspect={setInspectItem}
          onApprove={setApproveItem}
          onReject={setRejectItem}
          onDelete={setDeleteItem}
        />
      </div>

      {/* Modals */}
      <RefundDetailModal
        refund={inspectItem}
        onClose={() => setInspectItem(null)}
        onOpenApproveModal={(r) => {
          setInspectItem(null)
          setApproveItem(r)
        }}
        onOpenRejectModal={(r) => {
          setInspectItem(null)
          setRejectItem(r)
        }}
      />

      <RefundPayModal
        refund={approveItem}
        isProcessing={isProcessing}
        onClose={() => setApproveItem(null)}
        onConfirmPay={handleConfirmPay}
      />

      <RefundRejectModal
        refund={rejectItem}
        reasons={presetReasons}
        isProcessing={isProcessing}
        onClose={() => setRejectItem(null)}
        onConfirmReject={handleConfirmReject}
      />

      <RefundDeleteModal
        refund={deleteItem}
        isProcessing={isProcessing}
        onClose={() => setDeleteItem(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
