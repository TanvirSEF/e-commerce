"use client"

import React, { useState, useTransition } from "react"
import { PackageCheck, Check, Sparkles, CheckCircle2, AlertCircle } from "lucide-react"
import { purchaseSellerPackageAction } from "@/app/actions/ecommerce-actions"
import type { SellerPackage } from "@/db/schema"

interface SellerPackagesShopViewProps {
  packages: SellerPackage[]
}

export function SellerPackagesShopView({ packages }: SellerPackagesShopViewProps) {
  const [selectedPkg, setSelectedPkg] = useState<SellerPackage | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handlePurchase = (pkg: SellerPackage) => {
    startTransition(async () => {
      const res = await purchaseSellerPackageAction({
        sellerId: 1,
        sellerPackageId: pkg.id,
        amount: pkg.amount,
        paymentMethod,
        packageName: pkg.name,
      })
      if (res.success) {
        setFeedback({ type: "success", text: `Subscribed to "${pkg.name}" plan successfully!` })
        setSelectedPkg(null)
      } else {
        setFeedback({ type: "error", text: "Subscription payment failed" })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[#d43533]" />
          Seller Membership Packages
        </h1>
        <p className="text-xs text-gray-500">Upgrade your vendor subscription plan to unlock higher product listing limits</p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isFree = Number(pkg.amount) === 0
          return (
            <div
              key={pkg.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                pkg.id === 3 ? "border-[#d43533] ring-1 ring-[#d43533]" : "border-gray-200"
              }`}
            >
              <div>
                {pkg.id === 3 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#d43533] bg-red-50 px-2 py-0.5 rounded-full mb-3">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                )}
                <h2 className="text-base font-bold text-gray-900">{pkg.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">
                    {isFree ? "Free" : `$${pkg.amount}`}
                  </span>
                  {!isFree && <span className="text-xs text-gray-500">/ {pkg.duration} days</span>}
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Upload up to <strong>{pkg.productUploadLimit} Products</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Duration: <strong>{pkg.duration} Days</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct storefront verified badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated seller support & POS</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                    pkg.id === 3
                      ? "bg-[#d43533] text-white hover:bg-[#b82a28] shadow-xs"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {isFree ? "Current Baseline Plan" : "Upgrade Plan"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Checkout Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Subscribe to {selectedPkg.name}
            </h3>
            <p className="text-xs text-gray-500">
              Total payment: <strong>${selectedPkg.amount}</strong> for {selectedPkg.duration} days.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["bKash", "Nagad", "Bank Slip"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      paymentMethod === m
                        ? "border-[#d43533] bg-red-50 text-[#d43533]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPkg(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePurchase(selectedPkg)}
                disabled={isPending}
                className="rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] disabled:opacity-50"
              >
                {isPending ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
