"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PackageCheck, Check, CheckCircle2, AlertCircle } from "lucide-react"
import { sellerPurchasePackageAction } from "@/app/actions/seller-panel-actions"
import type { SellerPackage } from "@/db/schema"

interface CurrentPackage {
  packageId: number
  name: string
  uploadLimit: number
  expiresAt: string
  remainingUploads: number
}

interface SellerPackagesShopViewProps {
  packages: SellerPackage[]
  current: CurrentPackage | null
}

export function SellerPackagesShopView({ packages, current }: SellerPackagesShopViewProps) {
  const router = useRouter()
  const [selectedPkg, setSelectedPkg] = useState<SellerPackage | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("bKash")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handlePurchase = (pkg: SellerPackage) => {
    startTransition(async () => {
      const res = await sellerPurchasePackageAction(pkg.id, paymentMethod)
      if (res.success) {
        const offline = paymentMethod === "Bank Slip" && Number(pkg.amount) > 0
        setFeedback({
          type: "success",
          text: offline
            ? `Offline payment for "${pkg.name}" submitted. It will activate after admin approval.`
            : `Subscribed to "${pkg.name}" successfully!`,
        })
        setSelectedPkg(null)
        router.refresh()
      } else {
        setFeedback({ type: "error", text: res.error || "Subscription payment failed" })
      }
      setTimeout(() => setFeedback(null), 5000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[#d43533]" />
          Premium Packages for Sellers
        </h1>
        <p className="text-xs text-gray-500">Upgrade your vendor subscription plan to unlock higher product listing limits</p>
      </div>

      {current && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <span className="block text-[10px] uppercase font-bold text-emerald-700/70">Current Package</span>
            <span className="text-sm font-bold">{current.name}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-emerald-700/70">Product Upload Remaining</span>
            <span className="text-sm font-bold">{current.remainingUploads} / {current.uploadLimit}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-emerald-700/70">Expires On</span>
            <span className="text-sm font-bold">{new Date(current.expiresAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>
      )}

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

      {packages.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-xs text-gray-400">
          No packages are available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isFree = Number(pkg.amount) === 0
            const isCurrent = current?.packageId === pkg.id
            return (
              <div
                key={pkg.id}
                className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                  isCurrent ? "border-[#d43533] ring-1 ring-[#d43533]" : "border-gray-200"
                }`}
              >
                <div>
                  {isCurrent && (
                    <span className="inline-flex items-center text-[11px] font-bold text-[#d43533] bg-red-50 px-2 py-0.5 rounded-full mb-3">
                      Current Package
                    </span>
                  )}
                  <h2 className="text-base font-bold text-gray-900">{pkg.name}</h2>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">{isFree ? "Free" : `$${pkg.amount}`}</span>
                    {!isFree && <span className="text-xs text-gray-500">/ {pkg.duration} days</span>}
                  </div>
                  <ul className="mt-6 space-y-2.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Product Upload Limit: <strong>{pkg.productUploadLimit}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Package Duration: <strong>{pkg.duration} Days</strong></span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-default ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400"
                        : "bg-[#d43533] text-white hover:bg-[#b82a28] shadow-xs"
                    }`}
                  >
                    {isCurrent ? "Current Package" : isFree ? "Activate Free Package" : "Purchase Package"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Purchase Package: {selectedPkg.name}</h3>
            <p className="text-xs text-gray-500">
              Total payment: <strong>${selectedPkg.amount}</strong> for {selectedPkg.duration} days.
            </p>

            {Number(selectedPkg.amount) > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {["bKash", "Nagad", "Bank Slip"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
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
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setSelectedPkg(null)} className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePurchase(selectedPkg)}
                disabled={isPending}
                className="rounded-lg bg-[#d43533] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#b82a28] disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
