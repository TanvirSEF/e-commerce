"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Trash2, LogIn, Wallet, Ban, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import type { AdminCustomerItem } from "@/types/customer-admin"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { banToggleCustomerAction, deleteCustomerAction } from "@/app/actions/customer-actions"
import { WalletRechargeDrawer } from "./wallet-recharge-drawer"

interface Props {
  items: AdminCustomerItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  total: number
  onPageChange: (p: number) => void
}

export function CustomerTable({ items, isLoading, currentPage, totalPages, total, onPageChange }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<AdminCustomerItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [rechargeTarget, setRechargeTarget] = useState<AdminCustomerItem | null>(null)
  const [bannedMap, setBannedMap] = useState<Record<string, boolean>>({})
  const [pendingBan, setPendingBan] = useState<string | null>(null)

  const isBanned = (item: AdminCustomerItem) =>
    pendingBan === item.id ? !item.banned : (bannedMap[item.id] ?? item.banned)

  const handleBanToggle = async (item: AdminCustomerItem) => {
    setPendingBan(item.id)
    try {
      const result = await banToggleCustomerAction(item.id)
      setBannedMap((prev) => ({ ...prev, [item.id]: result.banned }))
    } finally {
      setPendingBan(null)
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
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
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
                    ) : item.isSuspicious ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="w-3 h-3" /> Suspicious
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-green-100 text-green-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setRechargeTarget(item)}
                        title="Recharge Wallet"
                        className="p-1.5 rounded text-blue-600 hover:bg-blue-50"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleBanToggle(item)}
                        title={isBanned(item) ? "Unban" : "Ban"}
                        disabled={pendingBan === item.id}
                        className={`p-1.5 rounded ${isBanned(item) ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        title="Delete"
                        className="p-1.5 rounded text-red-600 hover:bg-red-50"
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
