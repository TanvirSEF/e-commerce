"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, DollarSign } from "lucide-react"
import { updateSellerVerificationAction } from "@/app/actions/ecommerce-actions"
import { SellerMetricsCards } from "./seller-metrics-cards"
import { SellersTable, type SellerTableRow } from "./sellers-table"
import { PaySellerModal, type PaySellerTarget } from "./pay-seller-modal"

interface SellersManagementViewProps {
  initialSellers: SellerTableRow[]
}

export function SellersManagementView({ initialSellers }: SellersManagementViewProps) {
  const [sellers, setSellers] = useState<SellerTableRow[]>(initialSellers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified">("all")
  const [selectedPaySeller, setSelectedPaySeller] = useState<PaySellerTarget | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = sellers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm))
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && s.verificationStatus) ||
      (statusFilter === "unverified" && !s.verificationStatus)
    return matchesSearch && matchesStatus
  })

  const totalDue = sellers.reduce((acc, curr) => acc + curr.dueToSeller, 0)
  const verifiedCount = sellers.filter((s) => s.verificationStatus).length

  const handleToggleVerification = async (seller: SellerTableRow) => {
    setUpdatingId(seller.id)
    const nextStatus = !seller.verificationStatus
    try {
      const numericId = parseInt(seller.id.replace(/\D/g, "")) || 1
      await updateSellerVerificationAction(numericId, nextStatus)
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, verificationStatus: nextStatus } : s))
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handlePaySuccess = (sellerId: string, amount: number) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? { ...s, dueToSeller: Math.max(0, s.dueToSeller - amount) }
          : s
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Sellers</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage vendor accounts, verification credentials, and payout balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/sellers/payout-requests"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Payout Requests
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <SellerMetricsCards
        totalSellers={sellers.length}
        verifiedCount={verifiedCount}
        totalDue={totalDue}
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search seller by shop or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "verified" | "unverified")}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#d43533]"
          >
            <option value="all">All Verification Status</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Sellers Data Table */}
      <SellersTable
        sellers={filtered}
        updatingId={updatingId}
        onToggleVerification={handleToggleVerification}
        onPaySeller={(seller) => setSelectedPaySeller(seller)}
      />

      {/* Pay Seller Modal */}
      <PaySellerModal
        seller={selectedPaySeller}
        onClose={() => setSelectedPaySeller(null)}
        onSuccess={handlePaySuccess}
      />
    </div>
  )
}
