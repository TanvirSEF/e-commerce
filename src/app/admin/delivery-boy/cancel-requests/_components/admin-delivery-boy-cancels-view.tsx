"use client"

import React, { useState } from "react"
import { AlertTriangle, Search, CheckCircle, XCircle, Clock } from "lucide-react"
import type { DeliveryCancelRequest } from "@/db/schema/delivery-boy"

interface AdminDeliveryBoyCancelsViewProps {
  requests: DeliveryCancelRequest[]
}

export function AdminDeliveryBoyCancelsView({ requests: initialRequests }: AdminDeliveryBoyCancelsViewProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState("")

  const filtered = requests.filter(
    (r) =>
      r.deliveryBoyName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderCode.toLowerCase().includes(search.toLowerCase())
  )

  const handleAction = (id: number, status: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
          Delivery Boy Cancellation Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review delivery failure disputes and parcel return requests filed by courier personnel
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver or order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Dispute Records: <span className="font-bold text-slate-900">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Courier</th>
                <th className="px-4 py-3.5">Order Code</th>
                <th className="px-4 py-3.5">Reported Cancellation Reason</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No cancellation requests submitted.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{r.deliveryBoyName}</td>
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">{r.orderCode}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 max-w-sm">{r.reason}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {r.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : r.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(r.id, "approved")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(r.id, "rejected")}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium rounded"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Resolved</span>
                      )}
                    </td>
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
