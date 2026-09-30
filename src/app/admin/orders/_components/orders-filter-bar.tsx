"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"

interface OrdersFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  deliveryStatuses: string[]
  onDeliveryStatusChange: (statuses: string[]) => void
  paymentStatus: string
  onPaymentStatusChange: (status: string) => void
  dateFrom: string
  dateTo: string
  onDateRangeChange: (from: string, to: string) => void
  selectedCount: number
  onBulkExport: () => void
  onBulkDownloadShippingLabel: () => void
  onBulkPrintShippingLabel: () => void
  onBulkDownloadInvoice: () => void
  onBulkPrintInvoice: () => void
  onBulkDelete: () => void
}

const ALL_DELIVERY_STATUSES = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "picked_up", label: "Picked Up" },
  { id: "on_the_way", label: "On The Way" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancel" },
]

export function OrdersFilterBar({
  search,
  onSearchChange,
  deliveryStatuses,
  onDeliveryStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  dateFrom,
  dateTo,
  onDateRangeChange,
  selectedCount,
  onBulkExport,
  onBulkDownloadShippingLabel,
  onBulkPrintShippingLabel,
  onBulkDownloadInvoice,
  onBulkPrintInvoice,
  onBulkDelete,
}: OrdersFilterBarProps) {
  const [bulkOpen, setBulkOpen] = useState(false)
  const [deliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false)

  const bulkRef = useRef<HTMLDivElement>(null)
  const deliveryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bulkRef.current && !bulkRef.current.contains(event.target as Node)) {
        setBulkOpen(false)
      }
      if (deliveryRef.current && !deliveryRef.current.contains(event.target as Node)) {
        setDeliveryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDeliveryToggle = (id: string) => {
    if (id === "all") {
      if (deliveryStatuses.includes("all")) {
        onDeliveryStatusChange([])
      } else {
        onDeliveryStatusChange(["all", "pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"])
      }
      return
    }

    let updated = deliveryStatuses.filter((s) => s !== "all")
    if (updated.includes(id)) {
      updated = updated.filter((s) => s !== id)
    } else {
      updated = [...updated, id]
    }
    onDeliveryStatusChange(updated)
  }

  const isAllChecked =
    deliveryStatuses.includes("all") ||
    (deliveryStatuses.length >= 6 &&
      ["pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"].every((s) =>
        deliveryStatuses.includes(s)
      ))

  return (
    <div className="bg-white p-4 border-b border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-4">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Orders…"
              className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Bulk Action Dropdown */}
        <div className="lg:col-span-2 relative" ref={bulkRef}>
          <button
            type="button"
            onClick={() => setBulkOpen(!bulkOpen)}
            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-700 transition-colors"
          >
            <span>Bulk Action {selectedCount > 0 && `(${selectedCount})`}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {bulkOpen && (
            <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 text-xs">
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkExport()
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkDownloadShippingLabel()
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Download Shipping Label
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkPrintShippingLabel()
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Print Shipping Label
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkDownloadInvoice()
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkPrintInvoice()
                }}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                Print Invoice
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={() => {
                  setBulkOpen(false)
                  onBulkDelete()
                }}
                className="w-full text-left px-4 py-2 text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
              >
                Delete Selection
              </button>
            </div>
          )}
        </div>

        {/* Filter by Delivery Status Dropdown */}
        <div className="lg:col-span-2 relative" ref={deliveryRef}>
          <button
            type="button"
            onClick={() => setDeliveryDropdownOpen(!deliveryDropdownOpen)}
            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-700 transition-colors"
          >
            <span className="truncate">
              {deliveryStatuses.length === 0
                ? "Filter By delivery Status"
                : `${deliveryStatuses.length} Statuses`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
          </button>

          {deliveryDropdownOpen && (
            <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded shadow-lg py-2 z-30 text-xs">
              <label className="flex items-center px-4 py-1.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={() => handleDeliveryToggle("all")}
                  className="rounded border-slate-300 text-[#d43533] focus:ring-0 mr-2.5 h-3.5 w-3.5"
                />
                <span className="text-slate-700">All</span>
              </label>
              {ALL_DELIVERY_STATUSES.filter((s) => s.id !== "all").map((st) => (
                <label key={st.id} className="flex items-center px-4 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllChecked || deliveryStatuses.includes(st.id)}
                    onChange={() => handleDeliveryToggle(st.id)}
                    className="rounded border-slate-300 text-[#d43533] focus:ring-0 mr-2.5 h-3.5 w-3.5"
                  />
                  <span className="text-slate-700">{st.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filter by Payment Status Select */}
        <div className="lg:col-span-2">
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400"
          >
            <option value="">Filter by Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Filter by Date */}
        <div className="lg:col-span-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateRangeChange(e.target.value, dateTo)}
            placeholder="Filter by date"
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>
    </div>
  )
}
