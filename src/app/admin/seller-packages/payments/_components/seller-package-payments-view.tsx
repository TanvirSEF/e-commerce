"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CreditCard, ArrowLeft, Search, CheckCircle2 } from "lucide-react"

interface PaymentItem {
  id: number
  sellerName?: string
  packageName?: string
  amount: string
  paymentMethod: string
  paymentDetails: string | null
  offlinePayment: boolean
  approval: boolean
  createdAt: Date
}

interface SellerPackagePaymentsViewProps {
  initialPayments: PaymentItem[]
}

export function SellerPackagePaymentsView({ initialPayments }: SellerPackagePaymentsViewProps) {
  const [payments] = useState<PaymentItem[]>(initialPayments)
  const [search, setSearch] = useState("")

  const filtered = payments.filter(
    (p) =>
      (p.sellerName && p.sellerName.toLowerCase().includes(search.toLowerCase())) ||
      (p.packageName && p.packageName.toLowerCase().includes(search.toLowerCase())) ||
      p.paymentMethod.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/seller-packages"
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#d43533]" />
            Package Payment History
          </h1>
          <p className="text-xs text-gray-500">Audit trail of seller subscription package purchases and renewals</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by seller, package, or payment method..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#d43533] focus:outline-hidden"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Payment Transactions</span>
          <span className="text-xs font-mono text-gray-400">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Seller</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{item.sellerName || "Seller"}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{item.packageName || "Package"}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">${item.amount}</td>
                  <td className="py-3 px-4 font-medium text-gray-700">{item.paymentMethod}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                    {item.paymentDetails || "Instant Online"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
