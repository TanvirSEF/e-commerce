"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tag, Plus, X, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  sellerCreateCouponAction,
  sellerDeleteCouponAction,
  sellerToggleCouponAction,
} from "@/app/actions/seller-panel-actions"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import type { SellerCouponRow } from "@/services/seller-panel-service"

const day = (ms: number) => new Date(ms).toISOString().slice(0, 10)

const emptyForm = () => ({
  code: "",
  type: "cart_base" as "cart_base" | "product_base",
  discount: "",
  discountType: "percent" as "percent" | "amount",
  minBuy: "0",
  maxDiscount: "0",
  startDate: day(Date.now()),
  endDate: day(Date.now() + 30 * 86400000),
})

export function SellerCouponsView({ initialCoupons }: { initialCoupons: SellerCouponRow[] }) {
  const router = useRouter()
  const [coupons, setCoupons] = useState(initialCoupons)
  useEffect(() => setCoupons(initialCoupons), [initialCoupons])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const set = <K extends keyof ReturnType<typeof emptyForm>>(k: K, v: ReturnType<typeof emptyForm>[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsCreating(true)
    try {
      const res = await sellerCreateCouponAction({
        code: form.code,
        type: form.type,
        discount: parseFloat(form.discount),
        discountType: form.discountType,
        minBuy: parseFloat(form.minBuy) || 0,
        maxDiscount: parseFloat(form.maxDiscount) || 0,
        startDate: new Date(form.startDate).getTime(),
        endDate: new Date(form.endDate).getTime() + 86399000,
      })
      if (!res.success) {
        setError(res.error || "Could not create coupon.")
        return
      }
      setShowModal(false)
      setForm(emptyForm())
      router.refresh()
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggle = async (c: SellerCouponRow) => {
    setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: !c.status } : x)))
    const res = await sellerToggleCouponAction(c.id, !c.status)
    if (!res.success) setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: c.status } : x)))
  }

  const handleConfirmDelete = async () => {
    if (couponToDelete === null) return
    setIsDeleting(true)
    try {
      const res = await sellerDeleteCouponAction(couponToDelete)
      if (res.success) setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete))
    } finally {
      setIsDeleting(false)
      setCouponToDelete(null)
    }
  }

  const inputCls =
    "w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]"
  const labelCls = "block text-xs font-semibold text-slate-700 mb-1"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Coupons</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create and manage discount coupons for your store</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Buy</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#d43533] border border-red-200 rounded font-mono font-bold text-xs">
                      <Tag className="w-3 h-3" />
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {c.type === "cart_base" ? "For Total Orders" : "For Products"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {c.discountType === "percent" ? `${c.discount}%` : formatPrice(c.discount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatPrice(c.minBuy)}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{day(c.startDate)}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{day(c.endDate)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={c.status}
                      onChange={() => handleToggle(c)}
                      className="rounded border-slate-300 text-[#d43533] focus:ring-[#d43533] cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setCouponToDelete(c.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-sm">
                    No coupons created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-4">Add New Coupon</h3>
            {error && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className={labelCls}>Coupon Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value as typeof form.type)} className={`${inputCls} bg-white`}>
                  <option value="cart_base">For Total Orders</option>
                  <option value="product_base">For Products</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Coupon Code *</label>
                <input required value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" className={`${inputCls} font-mono`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Discount *</label>
                  <input required type="number" min="1" step="0.01" value={form.discount} onChange={(e) => set("discount", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Discount Type</label>
                  <select value={form.discountType} onChange={(e) => set("discountType", e.target.value as typeof form.discountType)} className={`${inputCls} bg-white`}>
                    <option value="percent">Percent (%)</option>
                    <option value="amount">Flat Amount</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Minimum Shopping</label>
                  <input type="number" min="0" value={form.minBuy} onChange={(e) => set("minBuy", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Maximum Discount</label>
                  <input type="number" min="0" value={form.maxDiscount} onChange={(e) => set("maxDiscount", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Start Date *</label>
                  <input required type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>End Date *</label>
                  <input required type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] disabled:opacity-60 text-white rounded text-xs font-semibold cursor-pointer">
                  {isCreating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={couponToDelete !== null}
        onClose={() => !isDeleting && setCouponToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Confirmation"
        description="Are you sure you want to remove this coupon? Any active orders using this coupon will retain their historical discount."
      />
    </div>
  )
}
