"use client"

import React, { useState } from "react"
import { X, Store, Eye, EyeOff, Plus } from "lucide-react"
import { createSellerAdminAction } from "@/app/actions/ecommerce-actions"
import type { SellerTableRow } from "./sellers-table"

interface AddSellerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newSeller: SellerTableRow) => void
}

export function AddSellerModal({ isOpen, onClose, onSuccess }: AddSellerModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [shopName, setShopName] = useState("")
  const [address, setAddress] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !shopName.trim()) {
      setError("Name, email, and shop name are required.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createSellerAdminAction({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password: password.trim() || undefined,
        shopName: shopName.trim(),
        address: address.trim() || undefined,
      })

      if (res.success && res.shop) {
        const s = res.shop
        const createdRow: SellerTableRow = {
          id: String(s.id),
          userId: res.user?.id,
          name: s.name,
          slug: s.slug,
          logo: s.logo || "/assets/img/placeholder.jpg",
          topBanner: s.topBanner || "/assets/img/placeholder-rect.jpg",
          sliders: s.sliders || ["/assets/img/placeholder-rect.jpg"],
          address: s.address || "—",
          phone: s.phone || phone || "—",
          email: email.trim(),
          rating: Number(s.rating || 5.0),
          reviewCount: s.numOfReviews || 0,
          followersCount: 0,
          verificationStatus: true,
          memberSince: "Just now",
          dueToSeller: 0,
          productCount: 0,
          ownerName: name.trim(),
          banned: false,
          isSuspicious: false,
          emailVerified: true,
        }
        onSuccess(createdRow)
        onClose()
      } else {
        setError(res.error || "Failed to create seller")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 relative animate-in fade-in zoom-in-95 text-xs">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Store className="w-5 h-5 text-[#d43533]" />
          <h3 className="text-base font-bold text-slate-800">Add New Seller</h3>
        </div>
        <p className="text-slate-500 mb-4">
          Create a verified merchant store account directly from admin
        </p>

        {error && (
          <div className="p-2.5 mb-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Owner Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="seller@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+880 1700 000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Default: 12345678"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block font-semibold text-slate-700 mb-1">Shop Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Lifestyle Outlet"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Shop Address</label>
            <input
              type="text"
              placeholder="Market / Plaza, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 border border-slate-300 text-slate-600 rounded font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white rounded font-semibold transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSubmitting ? "Creating..." : "Create Seller"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
