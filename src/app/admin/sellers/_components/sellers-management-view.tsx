"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Search, Plus, Trash2, Percent, DollarSign } from "lucide-react"
import { updateSellerVerificationAction } from "@/app/actions/ecommerce-actions"
import { SellerMetricsCards } from "./seller-metrics-cards"
import { SellersTable, type SellerTableRow } from "./sellers-table"
import { PaySellerModal, type PaySellerTarget } from "./pay-seller-modal"

interface SellersManagementViewProps {
  initialSellers: SellerTableRow[]
}

type TabType = "all" | "banned" | "suspicious"

export function SellersManagementView({ initialSellers }: SellersManagementViewProps) {
  const [sellers, setSellers] = useState<SellerTableRow[]>(initialSellers)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [emailStatusFilter, setEmailStatusFilter] = useState<"all" | "verified" | "unverified">("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedPaySeller, setSelectedPaySeller] = useState<PaySellerTarget | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const bannedCount = sellers.filter((s) => s.banned).length
  const suspiciousCount = sellers.filter((s) => s.isSuspicious).length
  const verifiedCount = sellers.filter((s) => s.verificationStatus).length
  const totalDue = sellers.reduce((acc, curr) => acc + curr.dueToSeller, 0)

  const filtered = sellers.filter((s) => {
    if (activeTab === "banned" && !s.banned) return false
    if (activeTab === "suspicious" && !s.isSuspicious) return false

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      if (!matchesSearch) return false
    }

    if (emailStatusFilter === "verified" && !s.emailVerified) return false
    if (emailStatusFilter === "unverified" && s.emailVerified) return false

    return true
  })

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((s) => s.id))
    }
  }

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleVerification = async (seller: SellerTableRow) => {
    setUpdatingId(seller.id)
    const nextStatus = !seller.verificationStatus
    try {
      const numericId = parseInt(seller.id.replace(/\D/g, "")) || 1
      await updateSellerVerificationAction(numericId, nextStatus)
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, verificationStatus: nextStatus } : s))
      )
      setActionNotice(`Verification status updated for ${seller.name}`)
      setTimeout(() => setActionNotice(null), 3000)
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

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected sellers?`)) {
      setSellers((prev) => prev.filter((s) => !selectedIds.includes(s.id)))
      setSelectedIds([])
      setActionNotice("Selected sellers deleted successfully")
      setTimeout(() => setActionNotice(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Sellers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage vendor catalog, store credentials, and platform earnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/sellers/payout-requests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Payout Requests
          </Link>
          <button
            type="button"
            onClick={() => alert("To add a seller, invite them or use the seller registration portal.")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
          >
            <span>Add New Seller</span>
            <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium">
          {actionNotice}
        </div>
      )}

      {/* Metric Cards */}
      <SellerMetricsCards
        totalSellers={sellers.length}
        verifiedCount={verifiedCount}
        totalDue={totalDue}
      />

      {/* Tabs & Filter Bar (1:1 with Laravel all_seller_table.blade.php) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2">
          <div className="flex space-x-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All Seller ({sellers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("banned")}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === "banned"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Banned ({bannedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("suspicious")}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === "suspicious"
                  ? "border-[#d43533] text-[#d43533]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Suspicious ({suspiciousCount})
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type name or email or mobile number & Enter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#d43533]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected ({selectedIds.length})
              </button>
            )}

            <Link
              href="/admin/sellers/seller-commission"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <Percent className="w-3.5 h-3.5 text-slate-500" />
              Set Bulk Commission
            </Link>

            <select
              value={emailStatusFilter}
              onChange={(e) => setEmailStatusFilter(e.target.value as "all" | "verified" | "unverified")}
              className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#d43533]"
            >
              <option value="all">Email Verification Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <SellersTable
          sellers={filtered}
          selectedIds={selectedIds}
          updatingId={updatingId}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onToggleVerification={handleToggleVerification}
          onPaySeller={(seller) => setSelectedPaySeller(seller)}
        />
      </div>

      {/* Pay Seller Modal */}
      <PaySellerModal
        seller={selectedPaySeller}
        onClose={() => setSelectedPaySeller(null)}
        onSuccess={handlePaySuccess}
      />
    </div>
  )
}
