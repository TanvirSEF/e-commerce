"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  ExternalLink,
  Save,
  Building,
} from "lucide-react"
import { submitSellerVerificationAction } from "@/app/actions/ecommerce-actions"
import type { SeedShop } from "@/db/seed/data"

interface SellerVerifyViewProps {
  shop: SeedShop | null
}

export function SellerVerifyView({ shop }: SellerVerifyViewProps) {
  const [form, setForm] = useState({
    tradeLicense: "TRAD/DNCC/029141",
    nidNumber: "19942691234567890",
    documentType: "Trade License & NID Card",
    documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
    bankName: "City Bank PLC",
    bankAccount: "1102948192001",
    bankBranch: "Gulshan Branch, Dhaka",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const isVerified = shop?.verificationStatus ?? true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitSellerVerificationAction(1, {
        tradeLicense: form.tradeLicense,
        nidNumber: form.nidNumber,
        documentType: form.documentType,
        documentUrl: form.documentUrl,
        bankName: form.bankName,
        bankAccount: form.bankAccount,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shop Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit your legal trade documents to receive the verified seller badge
          </p>
        </div>
        <Link
          href={`/shop/${shop?.slug || "active-fashion-outlet"}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Live Store
        </Link>
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-4 rounded-lg border flex items-center gap-3 ${
          isVerified
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isVerified ? <ShieldCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">
            {isVerified
              ? "Verified Merchant Status Active"
              : "Verification Documents Under Review"}
          </div>
          <div className="text-xs mt-0.5 opacity-90">
            {isVerified
              ? "Your shop is fully verified and displays the trust badge across all product listings."
              : "Our compliance team is verifying your trade license and NID documents. Typically takes 24 hours."}
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4" />
          Verification documents submitted to admin review desk successfully!
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Documents Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d43533]" />
            Business & Legal Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trade License Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.tradeLicense}
                onChange={(e) => setForm((f) => ({ ...f, tradeLicense: e.target.value }))}
                placeholder="e.g. TRAD/DNCC/029141"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                National ID (NID) Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.nidNumber}
                onChange={(e) => setForm((f) => ({ ...f, nidNumber: e.target.value }))}
                placeholder="e.g. 19942691234567890"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={form.documentType}
                onChange={(e) => setForm((f) => ({ ...f, documentType: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 bg-white focus:outline-none focus:border-[#d43533]"
              >
                <option value="Trade License & NID Card">Trade License & NID Card</option>
                <option value="Trade License Only">Trade License Only</option>
                <option value="TIN / VAT Certificate">TIN / VAT Certificate</option>
                <option value="Passport / NID">Passport / NID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document URL / Attachment Scan
              </label>
              <input
                type="url"
                value={form.documentUrl}
                onChange={(e) => setForm((f) => ({ ...f, documentUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Banking Settlement Info */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Payout Settlement Bank Account
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                placeholder="e.g. City Bank PLC"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={form.bankAccount}
                onChange={(e) => setForm((f) => ({ ...f, bankAccount: e.target.value }))}
                placeholder="e.g. 1102948192001"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch Name
              </label>
              <input
                type="text"
                value={form.bankBranch}
                onChange={(e) => setForm((f) => ({ ...f, bankBranch: e.target.value }))}
                placeholder="e.g. Gulshan Branch"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit Verification Info"}
          </button>
        </div>
      </form>
    </div>
  )
}
