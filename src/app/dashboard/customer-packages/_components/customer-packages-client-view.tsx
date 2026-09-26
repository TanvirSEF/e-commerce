"use client"

import React, { useState } from "react"
import { Package, Check, Sparkles, CheckCircle2 } from "lucide-react"
import type { CustomerPackage } from "@/db/schema"

interface CustomerPackagesClientViewProps {
  packages: CustomerPackage[]
}

export function CustomerPackagesClientView({ packages }: CustomerPackagesClientViewProps) {
  const [purchasedId, setPurchasedId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handlePurchase = (pkg: CustomerPackage) => {
    setPurchasedId(pkg.id)
    setFeedback(`Successfully upgraded to "${pkg.name}" plan! You now have ${pkg.productUpload} classified ad slots.`)
    setTimeout(() => setFeedback(null), 4000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#d43533]" />
          Classified Ad Packages
        </h1>
        <p className="text-xs text-gray-500">Upgrade your customer account to post more used products and classified listings</p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {packages.map((pkg) => {
          const isFree = Number(pkg.amount) === 0
          return (
            <div
              key={pkg.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between ${
                pkg.id === 2 ? "border-[#d43533] ring-1 ring-[#d43533]" : "border-gray-200"
              }`}
            >
              <div>
                {pkg.id === 2 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#d43533] bg-red-50 px-2 py-0.5 rounded-full mb-3">
                    <Sparkles className="w-3 h-3" /> Recommended
                  </span>
                )}
                <h2 className="text-base font-bold text-gray-900">{pkg.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">
                    {isFree ? "Free" : `$${pkg.amount}`}
                  </span>
                </div>

                <ul className="mt-5 space-y-2 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Upload <strong>{pkg.productUpload} Classified Ads</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Direct chat inquiries with buyers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>No listing commission fee</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                    purchasedId === pkg.id
                      ? "bg-emerald-600 text-white"
                      : "bg-[#d43533] text-white hover:bg-[#b82a28]"
                  }`}
                >
                  {purchasedId === pkg.id ? "Active Plan" : isFree ? "Free Plan" : "Purchase Plan"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
