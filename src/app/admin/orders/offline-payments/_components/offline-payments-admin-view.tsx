"use client"

import React, { useState, useTransition } from "react"
import { OrdersFilterBar } from "@/app/admin/orders/_components/orders-filter-bar"
import { OrdersPagination } from "@/app/admin/orders/_components/orders-pagination"
import { QuickOrderManageModal } from "@/app/admin/orders/_components/quick-order-manage-modal"
import { OrderDeleteModal } from "@/app/admin/orders/_components/order-delete-modal"
import { exportOrdersToCsv } from "@/app/admin/orders/_components/orders-export-utils"
import { OfflinePaymentsTable } from "./offline-payments-table"
import { OfflinePaymentDetailsModal } from "./offline-payment-details-modal"
import {
  AdminOrderListItem,
  AdminOrdersResponse,
} from "@/services/admin-orders-service"
import {
  fetchAdminOrdersAction,
  updateOrderQuickManagementAction,
  approveOfflinePaymentAction,
  deleteAdminOrderAction,
  bulkDeleteAdminOrdersAction,
} from "@/app/actions/order-admin-actions"

interface OfflinePaymentsAdminViewProps {
  initialData: AdminOrdersResponse
}

export function OfflinePaymentsAdminView({ initialData }: OfflinePaymentsAdminViewProps) {
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
  const [paymentDetailOrder, setPaymentDetailOrder] = useState<AdminOrderListItem | null>(null)
  const [quickManageOrder, setQuickManageOrder] = useState<AdminOrderListItem | null>(null)
  const [deleteTargetOrder, setDeleteTargetOrder] = useState<AdminOrderListItem | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  // Refetch helper
  const reloadData = (overrides: Record<string, any> = {}) => {
    startTransition(async () => {
      const res = await fetchAdminOrdersAction({
        offlinePaymentOnly: true,
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

  const handleTabChange = (newTab: "all" | "inhouse" | "seller") => {
    setTab(newTab)
    reloadData({ tab: newTab, page: 1 })
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    reloadData({ search: val, page: 1 })
  }

  const handleDeliveryStatusChange = (statuses: string[]) => {
    setDeliveryStatuses(statuses)
    reloadData({ deliveryStatuses: statuses, page: 1 })
  }

  const handlePaymentStatusChange = (status: string) => {
    setPaymentStatus(status)
    reloadData({ paymentStatus: status, page: 1 })
  }

  const handleDateRangeChange = (from: string, to: string) => {
    setDateFrom(from)
    setDateTo(to)
    reloadData({ dateFrom: from, dateTo: to, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    reloadData({ page: newPage })
  }

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

  // Approve Offline Payment
  const handleApprovePayment = async (orderId: number) => {
    const success = await approveOfflinePaymentAction(orderId)
    if (success) {
      setData((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? { ...o, paymentStatus: "paid", deliveryStatus: "confirmed" } : o
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

  // Bulk Print/Download
  const getSelectedCodes = () => {
    const list = selectedIds.length > 0
      ? data.orders.filter((o) => selectedIds.includes(o.id)).map((o) => o.code)
      : data.orders.map((o) => o.code)
    return list.join(",")
  }

  const handleBulkPrint = (route: string) => {
    const codes = getSelectedCodes()
    window.open(`/admin/orders/${route}?ids=${codes}&print=1`, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* Titlebar matching Laravel aiz-titlebar */}
      <div className="pb-1">
        <h1 className="text-xl font-bold text-slate-800">Offline Payment Orders</h1>
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
          onBulkExport={() => exportOrdersToCsv(selectedIds.length > 0 ? data.orders.filter(o => selectedIds.includes(o.id)) : data.orders)}
          onBulkDownloadShippingLabel={() => handleBulkPrint("bulk-shipping-label-print")}
          onBulkPrintShippingLabel={() => handleBulkPrint("bulk-shipping-label-print")}
          onBulkDownloadInvoice={() => handleBulkPrint("bulk-invoice-print")}
          onBulkPrintInvoice={() => handleBulkPrint("bulk-invoice-print")}
          onBulkDelete={() => {
            if (selectedIds.length === 0) return
            setIsBulkDeleteOpen(true)
          }}
        />

        {/* Orders Table */}
        <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : ""}>
          <OfflinePaymentsTable
            orders={data.orders}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewPaymentDetails={(order) => setPaymentDetailOrder(order)}
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

      {/* Payment Details Audit Modal */}
      <OfflinePaymentDetailsModal
        order={paymentDetailOrder}
        isOpen={Boolean(paymentDetailOrder)}
        onClose={() => setPaymentDetailOrder(null)}
        onApprove={handleApprovePayment}
      />

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
