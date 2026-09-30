"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Search, CheckCircle2, AlertCircle } from "lucide-react"
import {
  addWholesaleTierAction,
  deleteWholesaleTierAction,
} from "@/app/actions/ecommerce-actions"
import {
  WholesaleProductsTable,
  type WholesaleProductItem,
} from "./wholesale-products-table"
import { WholesaleTierModal } from "./wholesale-tier-modal"

interface WholesaleProductsViewProps {
  initialProducts: WholesaleProductItem[]
  filterType: "all" | "inhouse" | "seller"
}

export function WholesaleProductsView({
  initialProducts,
  filterType,
}: WholesaleProductsViewProps) {
  const [products, setProducts] = useState<WholesaleProductItem[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<WholesaleProductItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Handle Add Wholesale Tier (writes directly to PostgreSQL wholesale_prices)
  const handleAddTier = async (
    productId: string | number,
    minQty: number,
    maxQty: number,
    price: number
  ) => {
    setIsSubmitting(true)
    try {
      const newTier = await addWholesaleTierAction({
        productId,
        minQty,
        maxQty,
        price,
      })
      if (newTier) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, tiers: [...p.tiers, newTier] } : p
          )
        )
        showNotification("success", "Wholesale tier bracket added successfully!")
        setSelectedProduct(null)
      } else {
        showNotification("error", "Failed to add wholesale tier.")
      }
    } catch {
      showNotification("error", "Error occurred while saving wholesale tier.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Wholesale Tier (deletes directly from PostgreSQL wholesale_prices)
  const handleDeleteTier = async (productId: string | number, tierId: number) => {
    try {
      const ok = await deleteWholesaleTierAction(tierId)
      if (ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, tiers: p.tiers.filter((t) => t.id !== tierId) }
              : p
          )
        )
        showNotification("success", "Wholesale tier removed successfully!")
      } else {
        showNotification("error", "Failed to remove wholesale tier.")
      }
    } catch {
      showNotification("error", "Error occurred while deleting wholesale tier.")
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      {/* Titlebar (Active eCommerce 1:1) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Wholesale Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure B2B tiered wholesale pricing for commercial bulk buyers
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Wholesale Product</span>
        </Link>
      </div>

      {/* Tabs (Active eCommerce 1:1 Navigation) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Link
          href="/admin/wholesale/all-products"
          className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
            filterType === "all"
              ? "bg-[#d43533] text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          All Products
        </Link>
        <Link
          href="/admin/wholesale/inhouse-products"
          className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
            filterType === "inhouse"
              ? "bg-[#d43533] text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          In House Products
        </Link>
        <Link
          href="/admin/wholesale/seller-products"
          className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
            filterType === "seller"
              ? "bg-[#d43533] text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          Seller Products
        </Link>
      </div>

      {/* Toast Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Type name & Enter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#d43533] bg-white text-slate-800"
          />
        </div>
        <span className="text-xs text-slate-400">
          Total Products: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Products Table Component */}
      <WholesaleProductsTable
        products={filtered}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onDeleteTier={handleDeleteTier}
      />

      {/* Add Wholesale Tier Modal Component */}
      <WholesaleTierModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddTier={handleAddTier}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
