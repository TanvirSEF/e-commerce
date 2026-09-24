"use client"

import React, { useState } from "react"
import {
  Wallet,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  Eye,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { processWalletRechargeAction } from "@/app/actions/ecommerce-actions"
import type { WalletRechargeItem } from "@/services/wallet-service"

interface WalletRechargesAdminViewProps {
  initialRecharges: WalletRechargeItem[]
}

export function WalletRechargesAdminView({
  initialRecharges,
}: WalletRechargesAdminViewProps) {
  const [recharges, setRecharges] = useState<WalletRechargeItem[]>(initialRecharges)
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<WalletRechargeItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const filtered = recharges.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
      (r.trxId && r.trxId.toLowerCase().includes(search.toLowerCase()))
  )

  const pendingCount = recharges.filter((r) => !r.approval).length
  const approvedCount = recharges.filter((r) => r.approval).length

  const handleApprove = async (item: WalletRechargeItem) => {
    setIsProcessing(true)
    try {
      await processWalletRechargeAction(item.id, true)
      setRecharges((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, approval: true } : r))
      )
      setSelectedItem(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (item: WalletRechargeItem) => {
    if (!confirm("Are you sure you want to decline this wallet recharge request?")) return
    setIsProcessing(true)
    try {
      await processWalletRechargeAction(item.id, false)
      setRecharges((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, approval: false } : r))
      )
      setSelectedItem(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#d43533]" />
          Offline Wallet Recharges Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Audit customer manual wallet top-up requests, verify TrxID bank wire deposits, and credit customer balances
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Requests</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{recharges.length}</div>
        </div>
        <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase">Pending Approval</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Approved & Credited</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Wallet Recharge Requests</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, method, TrxID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3">TrxID / Details</th>
                <th className="px-5 py-3">Approval</th>
                <th className="px-5 py-3 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-slate-400">
                    No recharge requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.userName}</td>
                    <td className="px-5 py-3.5 font-black text-slate-900">{formatPrice(item.amount)}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">{item.paymentMethod}</td>
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <div className="font-mono font-bold text-[#d43533]">{item.trxId || "N/A"}</div>
                      {item.paymentDetails && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.paymentDetails}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.approval
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.approval ? "Approved" : "Pending Approval"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!item.approval && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleApprove(item)}
                            className="p-1.5 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Approve & Credit Balance"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-[#d43533]" />
              Wallet Recharge Inspection
            </h3>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{selectedItem.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Amount:</span>
                <span className="font-black text-[#d43533]">{formatPrice(selectedItem.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-semibold text-slate-700">{selectedItem.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">TrxID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedItem.trxId}</span>
              </div>
              {selectedItem.paymentDetails && (
                <div>
                  <div className="text-slate-500 mb-1">Payment Slip Details:</div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-slate-700">
                    {selectedItem.paymentDetails}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {!selectedItem.approval && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApprove(selectedItem)}
                  className="px-5 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                >
                  Approve & Credit Balance
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
