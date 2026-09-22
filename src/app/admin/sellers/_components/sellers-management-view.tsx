"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  DollarSign,
  Store,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  X,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { updateSellerVerificationAction } from "@/app/actions/ecommerce-actions"

interface SellerItem {
  id: string
  name: string
  slug: string
  logo: string
  address?: string
  phone?: string
  rating: number
  reviewCount: number
  followersCount: number
  verificationStatus: boolean
  memberSince: string
  dueToSeller: number
  productCount: number
  ownerName: string
}

interface SellersManagementViewProps {
  initialSellers: SellerItem[]
}

export function SellersManagementView({ initialSellers }: SellersManagementViewProps) {
  const [sellers, setSellers] = useState<SellerItem[]>(initialSellers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified">("all")
  const [selectedPaySeller, setSelectedPaySeller] = useState<SellerItem | null>(null)
  const [payAmount, setPayAmount] = useState("")
  const [payMethod, setPayMethod] = useState("bKash")
  const [paySuccess, setPaySuccess] = useState(false)
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

  const handleToggleVerification = async (seller: SellerItem) => {
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

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPaySeller || !payAmount) return
    const amt = parseFloat(payAmount)
    setSellers((prev) =>
      prev.map((s) =>
        s.id === selectedPaySeller.id
          ? { ...s, dueToSeller: Math.max(0, s.dueToSeller - amt) }
          : s
      )
    )
    setPaySuccess(true)
    setTimeout(() => {
      setPaySuccess(false)
      setSelectedPaySeller(null)
      setPayAmount("")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Payout Requests
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#d43533] flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Sellers</div>
            <div className="text-xl font-bold text-slate-800">{sellers.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Verified Stores</div>
            <div className="text-xl font-bold text-slate-800">
              {verifiedCount} / {sellers.length}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Due to Sellers</div>
            <div className="text-xl font-bold text-slate-800">{formatPrice(totalDue)}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search seller by shop or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white focus:outline-none focus:border-[#d43533]"
          >
            <option value="all">All Verification Status</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Sellers Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Shop Info</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Due Balance</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((seller, idx) => (
                <tr key={seller.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={seller.logo}
                          alt={seller.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm hover:text-[#d43533]">
                          <Link href={`/shop/${seller.slug}`} target="_blank" className="flex items-center gap-1">
                            {seller.name}
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">Owner: {seller.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{seller.phone || "+880 1700 000000"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{seller.address || "Dhaka, Bangladesh"}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {seller.productCount} items
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#d43533]">
                    {formatPrice(seller.dueToSeller)}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleVerification(seller)}
                      disabled={updatingId === seller.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        seller.verificationStatus
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      {seller.verificationStatus ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPaySeller(seller)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors"
                      >
                        Pay Seller
                      </button>
                      <Link
                        href={`/shop/${seller.slug}`}
                        target="_blank"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                        title="Visit Shop"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Seller Modal */}
      {selectedPaySeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedPaySeller(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Pay Seller: {selectedPaySeller.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current Due Balance:{" "}
              <span className="font-bold text-[#d43533]">
                {formatPrice(selectedPaySeller.dueToSeller)}
              </span>
            </p>

            {paySuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center text-xs font-semibold">
                Payment recorded successfully!
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount to Pay (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedPaySeller.dueToSeller}
                    placeholder="Enter amount"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                  >
                    <option value="bKash">bKash Merchant</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash in Hand</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaySeller(null)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold transition-colors"
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
