"use client"

import React, { useState } from "react"
import { Wallet, Search, Download, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { AdminWalletTransactionItem } from "@/services/wallet-service"

interface WalletHistoryReportViewProps {
  initialTransactions: AdminWalletTransactionItem[]
}

export function WalletHistoryReportView({ initialTransactions }: WalletHistoryReportViewProps) {
  const [transactions] = useState<AdminWalletTransactionItem[]>(initialTransactions)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.paymentMethod.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0)

  const exportCSV = () => {
    const headers = ["ID,Customer,Email,Amount,Type,Payment Method,Approval,Date\n"]
    const rows = filtered.map(
      (t) =>
        `"${t.id}","${t.userName}","${t.userEmail}","${t.amount}","${t.type}","${t.paymentMethod}","${t.approval ? "Approved" : "Pending"}","${t.date}"\n`
    )
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wallet-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#d43533]" />
            Customer Wallet Transaction History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete audit trail of all customer wallet deposits, debits, manual recharges, and automated refunds.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-gray-500" />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Wallet Credits</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">{formatPrice(totalCredit)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Wallet Debits</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">{formatPrice(totalDebit)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Net Wallet Volume</div>
            <div className="text-lg font-bold text-blue-600 mt-0.5">{formatPrice(totalCredit - totalDebit)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer, email, method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d43533]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533] bg-white w-full sm:w-auto"
            >
              <option value="all">All Transaction Types</option>
              <option value="credit">Credit / Deposit (+)</option>
              <option value="debit">Debit / Order Payment (-)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4"># Trx ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No wallet transaction records found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">#{t.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{t.userName}</div>
                      <div className="text-[11px] text-gray-400">{t.userEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.type === "credit" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Deposit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#d43533] font-medium">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Debit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-sm">
                      <span className={t.type === "credit" ? "text-emerald-600" : "text-gray-900"}>
                        {t.type === "credit" ? "+" : "-"} {formatPrice(t.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.approval ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Approval
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
