"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Search,
  Check,
  X,
  Eye,
  Building,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react"
import { updateSellerVerificationAction } from "@/app/actions/ecommerce-actions"
import type { SellerVerificationItem } from "@/services/seller-service"

interface SellerVerificationAdminViewProps {
  initialVerifications: SellerVerificationItem[]
}

export function SellerVerificationAdminView({
  initialVerifications,
}: SellerVerificationAdminViewProps) {
  const [verifications, setVerifications] =
    useState<SellerVerificationItem[]>(initialVerifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeller, setSelectedSeller] =
    useState<SellerVerificationItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleReview = async (shopId: number, approve: boolean) => {
    setIsProcessing(true)
    try {
      await updateSellerVerificationAction(shopId, approve)
      setVerifications((prev) =>
        prev.map((v) =>
          v.shopId === shopId ? { ...v, verificationStatus: approve } : v
        )
      )
      setSelectedSeller(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const filtered = verifications.filter(
    (v) =>
      v.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.tradeLicense?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nidNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const verifiedCount = verifications.filter((v) => v.verificationStatus).length
  const pendingCount = verifications.filter((v) => !v.verificationStatus).length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Seller Verification Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trade licenses, NIDs, and verify legitimate merchant accounts
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Verifications</div>
            <div className="text-xl font-bold text-slate-800">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Verified Merchants</div>
            <div className="text-xl font-bold text-slate-800">{verifiedCount}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop, owner, trade license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
          />
        </div>
      </div>

      {/* Verifications Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Shop</th>
                <th className="py-3 px-4">Owner & Contact</th>
                <th className="py-3 px-4">Trade License</th>
                <th className="py-3 px-4">NID Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={item.shopId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{item.shopName}</div>
                    <Link
                      href={`/shop/${item.shopSlug}`}
                      target="_blank"
                      className="text-[11px] text-[#d43533] hover:underline inline-flex items-center gap-0.5"
                    >
                      Visit Shop <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{item.ownerName}</div>
                    <div className="text-[11px] text-slate-500">{item.ownerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{item.tradeLicense}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{item.nidNumber}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.verificationStatus
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.verificationStatus ? (
                        <>
                          <Check className="w-3 h-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSeller(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect Docs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Documents Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95 space-y-4">
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                Seller Verification: {selectedSeller.shopName}
              </h3>
              <p className="text-xs text-slate-500">Submitted on {selectedSeller.submittedAt}</p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Trade License Number</span>
                  <span className="font-mono font-bold">{selectedSeller.tradeLicense}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">National ID Number</span>
                  <span className="font-mono font-bold">{selectedSeller.nidNumber}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[10px]">Settlement Bank</span>
                  <span className="font-semibold">{selectedSeller.bankName}</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[10px]">Account Number</span>
                  <span className="font-mono font-semibold">{selectedSeller.bankAccount}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Attached Business Identification Document:
                </span>
                <div className="p-3 bg-slate-100 rounded border flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-4 h-4 text-[#d43533]" />
                    {selectedSeller.documentType}
                  </span>
                  <a
                    href={selectedSeller.documentUrl}
                    target="_blank"
                    className="text-[#d43533] hover:underline font-bold text-xs inline-flex items-center gap-1"
                  >
                    Preview Scan <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedSeller(null)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(selectedSeller.shopId, false)}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview(selectedSeller.shopId, true)}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                >
                  Approve & Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
