"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { OrdersFilterBar } from "./orders-filter-bar"
import { OrdersTable } from "./orders-table"
import { OrdersPagination } from "./orders-pagination"
import { QuickOrderManageModal } from "./quick-order-manage-modal"
import { OrderDeleteModal } from "./order-delete-modal"
import { exportOrdersToCsv } from "./orders-export-utils"
import {
  AdminOrderListItem,
  AdminOrdersResponse,
} from "@/services/admin-orders-service"
import {
  fetchAdminOrdersAction,
  updateOrderQuickManagementAction,
  deleteAdminOrderAction,
  bulkDeleteAdminOrdersAction,
} from "@/app/actions/order-admin-actions"

interface AdminOrdersViewProps {
  initialData: AdminOrdersResponse
}

export function AdminOrdersView({ initialData }: AdminOrdersViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<AdminOrdersResponse>(initialData)
  const [tab, setTab] = useState<"all" | "inhouse" | "seller">("all")
  const [search, setSearch] = useState("")
  const [deliveryStatuses, setDeliveryStatuses] = useState<string[]>([])
  const [paymentStatus, setPaymentStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Modal states
  const [quickManageOrder, setQuickManageOrder] = useState<AdminOrderListItem | null>(null)
  const [deleteTargetOrder, setDeleteTargetOrder] = useState<AdminOrderListItem | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  // Fetch / Refetch helper
  const reloadData = (overrides: Record<string, any> = {}) => {
    startTransition(async () => {
      const res = await fetchAdminOrdersAction({
        tab: overrides.tab !== undefined ? overrides.tab : tab,
        search: overrides.search !== undefined ? overrides.search : search,
        deliveryStatuses:
          overrides.deliveryStatuses !== undefined ? overrides.deliveryStatuses : deliveryStatuses,
        paymentStatus:
          overrides.paymentStatus !== undefined ? overrides.paymentStatus : paymentStatus,
        dateFrom: overrides.dateFrom !== undefined ? overrides.dateFrom : dateFrom,
        dateTo: overrides.dateTo !== undefined ? overrides.dateTo : dateTo,
        page: overrides.page !== undefined ? overrides.page : data.currentPage,
        limit: 15,
      })
      setData(res)
    })
  }

  // Tab change
  const handleTabChange = (newTab: "all" | "inhouse" | "seller") => {
    setTab(newTab)
    reloadData({ tab: newTab, page: 1 })
  }

  // Search with debounce
  const handleSearchChange = (val: string) => {
    setSearch(val)
    reloadData({ search: val, page: 1 })
  }

  // Delivery status filter
  const handleDeliveryStatusChange = (statuses: string[]) => {
    setDeliveryStatuses(statuses)
    reloadData({ deliveryStatuses: statuses, page: 1 })
  }

  // Payment status filter
  const handlePaymentStatusChange = (status: string) => {
    setPaymentStatus(status)
    reloadData({ paymentStatus: status, page: 1 })
  }

  // Date range filter
  const handleDateRangeChange = (from: string, to: string) => {
    setDateFrom(from)
    setDateTo(to)
    reloadData({ dateFrom: from, dateTo: to, page: 1 })
  }

  // Pagination
  const handlePageChange = (newPage: number) => {
    reloadData({ page: newPage })
  }

  // Selection
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (data.orders.every((o) => selectedIds.includes(o.id))) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.orders.map((o) => o.id))
    }
  }

  // Quick Order Save
  const handleSaveQuickManage = async (
    orderId: number,
    updateData: { deliveryStatus: string; paymentStatus: string }
  ) => {
    const success = await updateOrderQuickManagementAction(orderId, updateData)
    if (success) {
      setData((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId
            ? { ...o, deliveryStatus: updateData.deliveryStatus, paymentStatus: updateData.paymentStatus }
            : o
        ),
      }))
    }
  }

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!deleteTargetOrder) return
    const success = await deleteAdminOrderAction(deleteTargetOrder.id)
    if (success) {
      setData((prev) => ({
        ...prev,
        orders: prev.orders.filter((o) => o.id !== deleteTargetOrder.id),
        totalCount: Math.max(0, prev.totalCount - 1),
      }))
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetOrder.id))
    }
  }

  // Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return
    const success = await bulkDeleteAdminOrdersAction(selectedIds)
    if (success) {
      setData((prev) => ({
        ...prev,
        orders: prev.orders.filter((o) => !selectedIds.includes(o.id)),
        totalCount: Math.max(0, prev.totalCount - selectedIds.length),
      }))
      setSelectedIds([])
    }
  }

  // Bulk Actions
  const handleBulkExport = () => {
    const targetOrders =
      selectedIds.length > 0
        ? data.orders.filter((o) => selectedIds.includes(o.id))
        : data.orders
    exportOrdersToCsv(targetOrders)
  }

  const getSelectedCodes = () => {
    const list = selectedIds.length > 0
      ? data.orders.filter((o) => selectedIds.includes(o.id)).map((o) => o.code)
      : data.orders.map((o) => o.code)
    return list.join(",")
  }

  const handleBulkDownloadShippingLabel = () => {
    const codes = getSelectedCodes()
    window.open(`/admin/orders/bulk-shipping-label-print?ids=${codes}&print=1`, "_blank")
  }

  const handleBulkPrintShippingLabel = () => {
    const codes = getSelectedCodes()
    window.open(`/admin/orders/bulk-shipping-label-print?ids=${codes}&print=1`, "_blank")
  }

  const handleBulkDownloadInvoice = () => {
    const codes = getSelectedCodes()
    window.open(`/admin/orders/bulk-invoice-print?ids=${codes}&print=1`, "_blank")
  }

  const handleBulkPrintInvoice = () => {
    const codes = getSelectedCodes()
    window.open(`/admin/orders/bulk-invoice-print?ids=${codes}&print=1`, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* Titlebar matching Laravel aiz-titlebar */}
      <div className="pb-1">
        <h1 className="text-xl font-bold text-slate-800">All Orders</h1>
      </div>

      {/* Main Card Container */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
        {/* Nav Tabs */}
        <div className="border-b border-slate-200 px-4 pt-3 flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors capitalize ${
              tab === "all"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("inhouse")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors capitalize ${
              tab === "inhouse"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Inhouse
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("seller")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors capitalize ${
              tab === "seller"
                ? "border-[#d43533] text-[#d43533]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Seller
          </button>
        </div>

        {/* Filter Bar */}
        <OrdersFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          deliveryStatuses={deliveryStatuses}
          onDeliveryStatusChange={handleDeliveryStatusChange}
          paymentStatus={paymentStatus}
          onPaymentStatusChange={handlePaymentStatusChange}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateRangeChange={handleDateRangeChange}
          selectedCount={selectedIds.length}
          onBulkExport={handleBulkExport}
          onBulkDownloadShippingLabel={handleBulkDownloadShippingLabel}
          onBulkPrintShippingLabel={handleBulkPrintShippingLabel}
          onBulkDownloadInvoice={handleBulkDownloadInvoice}
          onBulkPrintInvoice={handleBulkPrintInvoice}
          onBulkDelete={() => {
            if (selectedIds.length === 0) return
            setIsBulkDeleteOpen(true)
          }}
        />

        {/* Orders Table */}
        <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : ""}>
          <OrdersTable
            orders={data.orders}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onQuickManage={(order) => setQuickManageOrder(order)}
            onDeleteSingle={(order) => setDeleteTargetOrder(order)}
          />
        </div>

        {/* Pagination Footer */}
        <OrdersPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          perPage={data.perPage}
          currentCount={data.orders.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Quick Order Manage Modal */}
      <QuickOrderManageModal
        order={quickManageOrder}
        isOpen={Boolean(quickManageOrder)}
        onClose={() => setQuickManageOrder(null)}
        onSave={handleSaveQuickManage}
      />

      {/* Single Delete Modal */}
      <OrderDeleteModal
        isOpen={Boolean(deleteTargetOrder)}
        isBulk={false}
        onClose={() => setDeleteTargetOrder(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      {/* Bulk Delete Modal */}
      <OrderDeleteModal
        isOpen={isBulkDeleteOpen}
        isBulk={true}
        selectedCount={selectedIds.length}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  )
}
