"use client"

import React, { useState } from "react"
import { Tag, Plus, X, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { createCouponAction } from "@/app/actions/ecommerce-actions"
import type { SeedCoupon } from "@/db/seed/data"

interface SellerCouponsViewProps {
  initialCoupons: SeedCoupon[]
}

export function SellerCouponsView({ initialCoupons }: SellerCouponsViewProps) {
  const [coupons, setCoupons] = useState<SeedCoupon[]>(
    initialCoupons.filter((c) => !c.shopSlug || c.shopSlug === "active-fashion-outlet")
  )
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ code: "", type: "cart_base" as const, discount: "", discountType: "percent" as const, minBuy: "0", maxDiscount: "9999" })
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await createCouponAction({
        code: form.code.toUpperCase(),
        type: form.type,
        discount: parseFloat(form.discount),
        discountType: form.discountType,
        minBuy: parseFloat(form.minBuy),
        maxDiscount: parseFloat(form.maxDiscount),
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      })
      const newCoupon: SeedCoupon = {
        id: `c-${Date.now()}`,
        code: form.code.toUpperCase(),
        type: form.type,
        discount: parseFloat(form.discount),
        discountType: form.discountType,
        minBuy: parseFloat(form.minBuy),
        maxDiscount: parseFloat(form.maxDiscount),
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        status: true,
        shopSlug: "active-fashion-outlet",
      }
      setCoupons((prev) => [newCoupon, ...prev])
      setShowModal(false)
      setForm({ code: "", type: "cart_base", discount: "", discountType: "percent", minBuy: "0", maxDiscount: "9999" })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this coupon?")) return
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Coupons</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create and manage discount coupons for your store</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Buy</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
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
                  <td className="py-3.5 px-4 capitalize text-slate-700 font-medium">{c.type.replace("_", " ")}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {c.discountType === "percent" ? `${c.discount}%` : formatPrice(c.discount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatPrice(c.minBuy)}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{typeof c.startDate === "number" ? new Date(c.startDate).toISOString().slice(0, 10) : c.startDate}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{typeof c.endDate === "number" ? new Date(c.endDate).toISOString().slice(0, 10) : c.endDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400 text-sm">No coupons created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-800 mb-4">Add New Coupon</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input required type="text" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SUMMER20" className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-[#d43533]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount *</label>
                  <input required type="number" min="1" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as any }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-[#d43533]">
                    <option value="percent">Percent (%)</option>
                    <option value="amount">Flat Amount (৳)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Purchase (৳)</label>
                <input type="number" min="0" value={form.minBuy} onChange={(e) => setForm((f) => ({ ...f, minBuy: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#d43533]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded text-xs font-semibold">
                  {isCreating ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
