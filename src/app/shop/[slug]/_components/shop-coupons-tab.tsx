"use client"

import { useState } from "react"
import { Copy, Check, Calendar, Tag } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"

interface ShopCouponsTabProps {
  coupons: SeedCoupon[]
  shopName: string
}

export function ShopCouponsTab({ coupons, shopName }: ShopCouponsTabProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (coupons.length === 0) {
    return (
      <div className="py-16 text-center">
        <Tag className="size-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-gray-700">No Active Coupons</h3>
        <p className="text-xs text-gray-500 mt-1">
          {shopName} does not currently have any active voucher campaigns.
        </p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="mb-6 border-b border-gray-200 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Available Coupons ({coupons.length})
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Copy code and apply at checkout to claim instant discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code
          const endDate = new Date(coupon.endDate).toLocaleDateString("en-GB")

          return (
            <div
              key={coupon.id}
              className="relative bg-white rounded-lg border-2 border-dashed border-red-200 p-5 shadow-xs overflow-hidden flex flex-col justify-between hover:border-primary transition-colors"
            >
              {/* Left coupon cutout styling indicator */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-100 text-primary uppercase">
                    {coupon.type === "cart_base" ? "Cart Discount" : "Product Discount"}
                  </span>
                  <div className="text-2xl font-black text-gray-900 mt-2">
                    {coupon.discountType === "percent"
                      ? `${coupon.discount}% OFF`
                      : `৳${coupon.discount} OFF`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Min Spend: <span className="font-semibold text-gray-800">৳{coupon.minBuy}</span>
                  </p>
                </div>

                <div className="p-2 rounded-full bg-red-50 text-primary">
                  <Tag className="size-6" />
                </div>
              </div>

              {/* Bottom bar with Code and Copy button */}
              <div className="mt-5 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Calendar className="size-3.5 text-gray-400" />
                  <span>Valid till {endDate}</span>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    isCopied
                      ? "bg-green-600 text-white"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>{coupon.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
