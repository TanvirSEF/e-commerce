"use client"

import React, { useState } from "react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import type { SellerPackagePaymentRow } from "@/services/seller-panel-service"

interface SellerPaymentListViewProps {
  initialPayments: SellerPackagePaymentRow[]
}

export function SellerPaymentListView({ initialPayments }: SellerPaymentListViewProps) {
  const [payments] = useState<SellerPackagePaymentRow[]>(initialPayments)

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      const day = String(d.getDate()).padStart(2, "0")
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const year = d.getFullYear()
      return `${day}-${month}-${year}`
    } catch {
      return isoString
    }
  }

  const formatPaymentMethod = (p: SellerPackagePaymentRow) => {
    const raw = (p.paymentMethod || "Online").replace(/_/g, " ")
    const method = raw.charAt(0).toUpperCase() + raw.slice(1)
    if (p.paymentDetails && p.paymentDetails.trim()) {
      return `${method} (${p.paymentDetails})`
    }
    return method
  }

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Payment History</h5>
        <Link
          href="/seller/packages"
          className="text-xs text-[#d43533] hover:underline font-medium"
        >
          Browse Packages &rarr;
        </Link>
      </div>

      {payments.length > 0 ? (
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f9fafb] text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment, key) => (
                  <tr key={payment.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">
                      {key + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {formatPrice(Number(payment.amount))}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {formatPaymentMethod(payment)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {payment.packageName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {payment.approval ? (
                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 text-xs">
          <p className="text-gray-400 mb-2">No payment history found.</p>
          <Link
            href="/seller/packages"
            className="inline-block px-3 py-1.5 bg-[#d43533] text-white rounded text-xs hover:bg-[#b82a28] transition-colors"
          >
            Upgrade Seller Package
          </Link>
        </div>
      )}
    </div>
  )
}
