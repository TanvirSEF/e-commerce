"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ExternalLink, ShieldCheck, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitSellerVerificationAction } from "@/app/actions/seller-actions"
import type { shops } from "@/db/schema"

type ShopRow = typeof shops.$inferSelect

interface SellerVerifyViewProps {
  shop: ShopRow
}

export function SellerVerifyView({ shop }: SellerVerifyViewProps) {
  const existingInfo = shop.verificationInfo as {
    tradeLicense?: string
    nidNumber?: string
    documentType?: string
    documentUrl?: string
    bankName?: string
    bankAccount?: string
    submittedAt?: string
  } | null

  const isVerified = shop.verificationStatus === true
  const isPending = !shop.verificationStatus && !!existingInfo

  const [form, setForm] = useState({
    tradeLicense: existingInfo?.tradeLicense || "",
    nidNumber: existingInfo?.nidNumber || "",
    documentType: existingInfo?.documentType || "Trade License & NID Card",
    documentUrl: existingInfo?.documentUrl || "",
    bankName: existingInfo?.bankName || shop.bankName || "",
    bankAccount: existingInfo?.bankAccount || shop.bankAccNo || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const res = await submitSellerVerificationAction(shop.id, {
      tradeLicense: form.tradeLicense,
      nidNumber: form.nidNumber,
      documentType: form.documentType,
      documentUrl: form.documentUrl,
      bankName: form.bankName,
      bankAccount: form.bankAccount,
    })

    setIsSubmitting(false)
    if (res.success) {
      setMessage({
        type: "success",
        text: "Your shop verification request has been submitted successfully!",
      })
    } else {
      setMessage({
        type: "error",
        text: (res && "error" in res && res.error) || "Failed to submit verification request.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Titlebar with (Visit Shop) link matching Laravel aiz-titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <h1 className="text-xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
          Shop Verification
          <span className="text-sm font-normal text-gray-500">
            (
            <Link
              href={`/shop/${shop.slug}`}
              target="_blank"
              className="text-[#d43533] hover:underline inline-flex items-center gap-1 font-medium"
            >
              Visit Shop <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            )
          </span>
        </h1>
      </div>

      {/* Verification Status Banner */}
      {isVerified && (
        <div className="p-4 rounded-sm border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold">Verified Merchant Status Active</div>
            <div className="text-xs text-emerald-700 mt-0.5">
              Your store is fully verified and displays the trust badge across all marketplace listings.
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="p-4 rounded-sm border bg-amber-50 border-amber-200 text-amber-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold">Verification Request Under Review</div>
            <div className="text-xs text-amber-700 mt-0.5">
              Your legal documents were submitted on{" "}
              {existingInfo?.submittedAt
                ? new Date(existingInfo.submittedAt).toLocaleDateString()
                : "recently"}{" "}
              and are awaiting administrative review.
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-3 text-xs rounded border flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Verification Form Card */}
      <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
        <div className="card-header px-4 py-3 border-b border-gray-200 bg-white">
          <h4 className="mb-0 text-sm font-semibold text-gray-800">Verification info</h4>
        </div>

        <div className="card-body p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Document Type */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                Document Type <span className="text-[#d43533]">*</span>
              </label>
              <div className="md:col-span-9">
                <select
                  value={form.documentType}
                  onChange={(e) => setForm((prev) => ({ ...prev, documentType: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none bg-white"
                >
                  <option value="Trade License & NID Card">Trade License & NID Card</option>
                  <option value="Trade License Only">Trade License Only</option>
                  <option value="TIN / VAT Certificate">TIN / VAT Certificate</option>
                  <option value="National ID Card / Passport">National ID Card / Passport</option>
                </select>
              </div>
            </div>

            {/* Trade License */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                Trade License Number <span className="text-[#d43533]">*</span>
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  required
                  value={form.tradeLicense}
                  onChange={(e) => setForm((prev) => ({ ...prev, tradeLicense: e.target.value }))}
                  placeholder="e.g. TRAD/DNCC/029141"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            {/* National ID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                National ID (NID) Number <span className="text-[#d43533]">*</span>
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  required
                  value={form.nidNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, nidNumber: e.target.value }))}
                  placeholder="e.g. 19942691234567890"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            {/* Document URL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                Document URL / Attachment <span className="text-[#d43533]">*</span>
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  required
                  value={form.documentUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, documentUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            {/* Bank Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                Settlement Bank Name
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
                  placeholder="e.g. City Bank PLC"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
              </div>
            </div>

            {/* Bank Account */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-3 text-xs font-medium text-gray-700">
                Bank Account Number
              </label>
              <div className="md:col-span-9">
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(e) => setForm((prev) => ({ ...prev, bankAccount: e.target.value }))}
                  placeholder="e.g. 1102948192001"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-medium rounded transition-colors"
              >
                {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
