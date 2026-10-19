"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Trash2, LogIn, Wallet, Ban, ChevronLeft, ChevronRight, AlertTriangle, MoreVertical } from "lucide-react"
import type { AdminCustomerItem } from "@/types/customer-admin"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { banToggleCustomerAction, suspiciousToggleCustomerAction, deleteCustomerAction } from "@/app/actions/customer-actions"
import { WalletRechargeDrawer } from "./wallet-recharge-drawer"

interface Props {
  items: AdminCustomerItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
  selectedIds?: string[]
  onToggleSelect?: (id: string) => void
  onToggleSelectAll?: () => void
}

export function CustomerTable({
  items,
  isLoading,
  currentPage,
  totalPages,
  total,
  onPageChange,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<AdminCustomerItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rechargeTarget, setRechargeTarget] = useState<AdminCustomerItem | null>(null)
  const [bannedMap, setBannedMap] = useState<Record<string, boolean>>({})
  const [pendingBan, setPendingBan] = useState<string | null>(null)
  const [suspiciousMap, setSuspiciousMap] = useState<Record<string, boolean>>({})
  const [pendingSuspicious, setPendingSuspicious] = useState<string | null>(null)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)

  const isBanned = (item: AdminCustomerItem) =>
    pendingBan === item.id ? !item.banned : (bannedMap[item.id] ?? item.banned)

  const isSuspicious = (item: AdminCustomerItem) =>
    pendingSuspicious === item.id ? !item.isSuspicious : (suspiciousMap[item.id] ?? item.isSuspicious)

  const handleBanToggle = async (item: AdminCustomerItem) => {
    setPendingBan(item.id)
    try {
      const result = await banToggleCustomerAction(item.id)
      setBannedMap((prev) => ({ ...prev, [item.id]: result.banned }))
    } finally {
      setPendingBan(null)
    }
  }

  const handleSuspiciousToggle = async (item: AdminCustomerItem) => {
    setPendingSuspicious(item.id)
    try {
      const result = await suspiciousToggleCustomerAction(item.id)
      setSuspiciousMap((prev) => ({ ...prev, [item.id]: result.isSuspicious }))
    } finally {
      setPendingSuspicious(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteCustomerAction(deleteTarget.id)
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const offset = (currentPage - 1) * 15
  const allSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <>
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[#d43533] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                />
              </th>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id)
                const isMenuOpen = activeDropdownId === item.id

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect?.(item.id)}
                        className="rounded border-gray-300 text-[#d43533] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-medium">{offset + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-[11px] text-gray-400">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.phone ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">৳{item.balance.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {isBanned(item) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-red-700">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      ) : isSuspicious(item) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-yellow-100 text-yellow-700">
                          <AlertTriangle className="w-3 h-3" /> Suspicious
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveDropdownId(isMenuOpen ? null : item.id)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setActiveDropdownId(null)}
                            />
                            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded shadow-xl py-1 z-40 text-left text-xs divide-y divide-gray-50">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    setRechargeTarget(item)
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Wallet className="w-3.5 h-3.5" />
                                  Recharge Wallet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    handleBanToggle(item)
                                  }}
                                  className={`w-full px-3 py-1.5 flex items-center gap-2 transition-colors ${
                                    isBanned(item)
                                      ? "text-emerald-600 hover:bg-emerald-50"
                                      : "text-orange-600 hover:bg-orange-50"
                                  }`}
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  {isBanned(item) ? "Unban Customer" : "Ban Customer"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    handleSuspiciousToggle(item)
                                  }}
                                  className={`w-full px-3 py-1.5 flex items-center gap-2 transition-colors ${
                                    isSuspicious(item)
                                      ? "text-gray-600 hover:bg-gray-50"
                                      : "text-amber-600 hover:bg-amber-50"
                                  }`}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {isSuspicious(item) ? "Remove Suspicious" : "Mark as Suspicious"}
                                </button>
                              </div>
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    alert(`Customer Impersonation Mode: Currently signed in as "${item.name}" (${item.email}). Redirecting to customer dashboard.`)
                                    window.open("/dashboard", "_blank")
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                                  Log in as Customer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null)
                                    setDeleteTarget(item)
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Customer
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{total} total customers</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Customer"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      {/* Wallet drawer */}
      {rechargeTarget && (
        <WalletRechargeDrawer customer={rechargeTarget} onClose={() => setRechargeTarget(null)} />
      )}
    </>
  )
}
