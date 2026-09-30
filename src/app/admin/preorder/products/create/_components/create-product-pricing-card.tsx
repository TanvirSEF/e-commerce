"use client"

import React from "react"

interface CreateProductPricingCardProps {
  price: string
  setPrice: (v: string) => void
  isPrepayment: boolean
  setIsPrepayment: (v: boolean) => void
  prepaymentAmount: string
  setPrepaymentAmount: (v: string) => void
  preorderBatchLimit: number
  setPreorderBatchLimit: (v: number) => void
  discount: string
  setDiscount: (v: string) => void
  discountType: string
  setDiscountType: (v: string) => void
  isCoupon: boolean
  setIsCoupon: (v: boolean) => void
  couponCode: string
  setCouponCode: (v: string) => void
  couponAmount: string
  setCouponAmount: (v: string) => void
}

export function CreateProductPricingCard({
  price,
  setPrice,
  isPrepayment,
  setIsPrepayment,
  prepaymentAmount,
  setPrepaymentAmount,
  preorderBatchLimit,
  setPreorderBatchLimit,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  isCoupon,
  setIsCoupon,
  couponCode,
  setCouponCode,
  couponAmount,
  setCouponAmount,
}: CreateProductPricingCardProps) {
  const handleGenerateCoupon = () => {
    const randomCode = "PRE-" + Math.random().toString(36).substring(2, 8).toUpperCase()
    setCouponCode(randomCode)
  }

  return (
    <div className="card rounded-2 border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 bg-[#f8f9fb]">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Product Price & Discounts</h5>
      </div>
      <div className="card-body p-4 space-y-5">
        {/* Section: Price */}
        <div>
          <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Price</h6>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
              Unit price <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-9 space-y-1">
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="Unit price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
              <p className="text-[11px] text-gray-400">
                Enter the price per unit. [e.g. &quot;49.99&quot;]
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start mt-3">
            <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
              Pre-Order Batch Cap <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-9 space-y-1">
              <input
                type="number"
                min="1"
                required
                placeholder="100"
                value={preorderBatchLimit}
                onChange={(e) => setPreorderBatchLimit(Number(e.target.value))}
                className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
              />
              <p className="text-[11px] text-gray-400">
                Maximum units available for pre-booking before batch closes.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-t border-dashed border-gray-200" />

        {/* Section: Prepayment */}
        <div>
          <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Prepayment</h6>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center mb-3">
            <label className="md:col-span-3 text-xs font-semibold text-gray-700">Enable Prepayment</label>
            <div className="md:col-span-9">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrepayment}
                  onChange={(e) => setIsPrepayment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {isPrepayment && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start mt-3">
              <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">
                Prepay Amount <span className="text-red-500">*</span>
              </label>
              <div className="md:col-span-9 space-y-1">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required={isPrepayment}
                  placeholder="Prepay Amount"
                  value={prepaymentAmount}
                  onChange={(e) => setPrepaymentAmount(e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
                <p className="text-[11px] text-gray-400">
                  Specify the required prepayment amount for pre-orders. [e.g. &quot;10.00&quot;]
                </p>
              </div>
            </div>
          )}
        </div>

        <hr className="border-t border-dashed border-gray-200" />

        {/* Section: Discount Settings */}
        <div>
          <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Discount Settings</h6>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Discount</label>
            <div className="md:col-span-9 space-y-1">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Discount Amount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="flex-1 rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-28 rounded border border-gray-200 px-2 py-2 text-xs text-gray-900 bg-white focus:border-[#d43533] focus:outline-hidden"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat ($/৳)</option>
                </select>
              </div>
              <p className="text-[11px] text-gray-400">
                Specify the discount percentage or flat reduction amount.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-t border-dashed border-gray-200" />

        {/* Section: Coupons */}
        <div>
          <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Coupons</h6>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center mb-3">
            <label className="md:col-span-3 text-xs font-semibold text-gray-700">Use Coupon For This Product</label>
            <div className="md:col-span-9">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCoupon}
                  onChange={(e) => setIsCoupon(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {isCoupon && (
            <div className="space-y-3 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Coupon Code</label>
                <div className="md:col-span-9 flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded border border-gray-200 px-3 py-2 text-xs font-mono uppercase text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCoupon}
                    className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                <label className="md:col-span-3 text-xs font-semibold text-gray-700 pt-2">Discount Amount</label>
                <div className="md:col-span-9">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Coupon Discount Amount"
                    value={couponAmount}
                    onChange={(e) => setCouponAmount(e.target.value)}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:border-[#d43533] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
