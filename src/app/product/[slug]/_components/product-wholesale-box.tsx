import React from "react"

interface ProductWholesaleBoxProps {
  tiers?: { minQty: number; maxQty: number; price: number }[]
  quantity: number
}

export function ProductWholesaleBox({ tiers, quantity }: ProductWholesaleBoxProps) {
  if (!tiers || tiers.length === 0) return null

  return (
    <div className="mt-3 rounded-lg border border-indigo-100 bg-white p-3">
      <span className="text-xs font-bold text-indigo-900 block mb-2">
        📦 Wholesale Volume Discount Tiers:
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tiers.map((tier, idx) => {
          const isActive = quantity >= tier.minQty && quantity <= tier.maxQty
          return (
            <div
              key={idx}
              className={`p-2 rounded-md border text-center transition-all ${
                isActive
                  ? "border-indigo-600 bg-indigo-50 font-bold"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <span className="text-[11px] text-gray-500 block">
                {tier.minQty}–{tier.maxQty} pcs
              </span>
              <span className="text-xs font-bold text-indigo-700">
                ৳{tier.price} / pc
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
