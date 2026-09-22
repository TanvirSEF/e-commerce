"use client"

import { useState } from "react"
import { Plus, Search, Trash2, X } from "lucide-react"
import { SeedCoupon } from "@/db/seed/data"
import { createCouponAction } from "@/app/actions/ecommerce-actions"

interface CouponsManagerProps {
  initialCoupons: SeedCoupon[]
}

export function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState<SeedCoupon[]>(initialCoupons)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  // Form states
  const [code, setCode] = useState("")
  const [type, setType] = useState<"cart_base" | "product_base">("cart_base")
  const [discount, setDiscount] = useState<number | "">("")
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent")
  const [minBuy, setMinBuy] = useState<number | "">("")
  const [maxDiscount, setMaxDiscount] = useState<number | "">("")
  const [startDateStr, setStartDateStr] = useState("")
  const [endDateStr, setEndDateStr] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !discount || !startDateStr || !endDateStr) return

    setSubmitting(true)
    const start = new Date(startDateStr).getTime()
    const end = new Date(endDateStr).getTime()

    const res = await createCouponAction({
      code: code.trim().toUpperCase(),
      type,
      discount: Number(discount),
      discountType,
      minBuy: Number(minBuy || 0),
      maxDiscount: Number(maxDiscount || 0),
      startDate: start,
      endDate: end,
    })

    if (res.coupon) {
      setCoupons([res.coupon, ...coupons])
    }

    setSubmitting(false)
    setShowModal(false)
    setCode("")
    setDiscount("")
    setMinBuy("")
    setMaxDiscount("")
    setStartDateStr("")
    setEndDateStr("")
  }

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Coupons</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure promotional discount coupons, cart-level vouchers, and validity limits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors"
        >
          <Plus className="size-4" />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Coupons Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-xs text-gray-500">{filteredCoupons.length} coupons</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">
                    No promotional coupons found.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon, idx) => {
                  const startDate = new Date(coupon.startDate).toLocaleDateString("en-GB")
                  const endDate = new Date(coupon.endDate).toLocaleDateString("en-GB")

                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 capitalize">
                        {coupon.type.replace("_", " ")}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {coupon.discountType === "percent"
                          ? `${coupon.discount}%`
                          : `৳${coupon.discount}`}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">৳{coupon.minBuy}</td>
                      <td className="py-3.5 px-4 text-gray-600">{startDate}</td>
                      <td className="py-3.5 px-4 text-gray-600">{endDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            coupon.status ? "bg-primary" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              coupon.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Add New Promotional Coupon</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Coupon Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "cart_base" | "product_base")}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="cart_base">Cart Base</option>
                    <option value="product_base">Product Base</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MEGA2026"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-xs font-mono font-bold uppercase border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 15"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="amount">Flat Amount (৳)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Minimum Shopping (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000"
                    value={minBuy}
                    onChange={(e) => setMinBuy(e.target.value ? Number(e.target.value) : "")}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Max Discount (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 bg-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded p-2.5 bg-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
