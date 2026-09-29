"use client"

import React, { useState, useTransition } from "react"
import { Search, CheckCircle2, AlertCircle } from "lucide-react"
import {
  CategoryDiscountTable,
  type CategoryDiscountTableItem,
} from "./category-discount-table"
import {
  ConfirmDiscountModal,
  ConfirmSwitchModal,
} from "./category-discount-modals"
import { setProductDiscountAction } from "@/app/actions/ecommerce-actions"

interface CategoryDiscountViewProps {
  initialCategories: CategoryDiscountTableItem[]
}

export function CategoryDiscountView({ initialCategories }: CategoryDiscountViewProps) {
  const [categories, setCategories] = useState<CategoryDiscountTableItem[]>(initialCategories)
  const [search, setSearch] = useState("")
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [pendingDiscountCatId, setPendingDiscountCatId] = useState<string | null>(null)
  const [pendingSwitch, setPendingSwitch] = useState<{ catId: string; enabling: boolean } | null>(null)

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Handle in-memory discount update
  const handleDiscountChange = (id: string, val: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, discount: val } : c))
    )
  }

  // Trigger modal on Enter
  const handleDiscountEnter = (id: string) => {
    setPendingDiscountCatId(id)
  }

  // Confirm Discount Save
  const handleConfirmDiscount = () => {
    if (!pendingDiscountCatId) return
    const cat = categories.find((c) => c.id === pendingDiscountCatId)
    if (!cat) return

    startTransition(async () => {
      const res = await setProductDiscountAction({
        categoryId: cat.id,
        discount: cat.discount,
        dateRange: cat.startDate && cat.endDate ? `${cat.startDate} to ${cat.endDate}` : undefined,
        sellerProductDiscount: cat.sellerDiscount,
      })

      if (res.success) {
        showToast("success", `Discount updated successfully for "${cat.name}"`)
      } else {
        showToast("error", "Failed to update category discount")
      }
      setPendingDiscountCatId(null)
    })
  }

  // Clear Discount
  const handleClearDiscount = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (!cat) return

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, discount: 0 } : c))
    )

    startTransition(async () => {
      await setProductDiscountAction({
        categoryId: id,
        discount: 0,
        dateRange: cat.startDate && cat.endDate ? `${cat.startDate} to ${cat.endDate}` : undefined,
        sellerProductDiscount: cat.sellerDiscount,
      })
      showToast("success", `Discount cleared for "${cat.name}"`)
    })
  }

  // Handle Date Range change & autosave
  const handleDateRangeChange = (id: string, start: string, end: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, startDate: start, endDate: end } : c))
    )

    if (start && end) {
      const cat = categories.find((c) => c.id === id)
      startTransition(async () => {
        await setProductDiscountAction({
          categoryId: id,
          discount: cat ? cat.discount : 0,
          dateRange: `${start} to ${end}`,
          sellerProductDiscount: cat ? cat.sellerDiscount : false,
        })
        showToast("success", "Discount date range updated successfully")
      })
    }
  }

  // Clear Date Range
  const handleClearDateRange = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, startDate: "", endDate: "" } : c))
    )

    startTransition(async () => {
      await setProductDiscountAction({
        categoryId: id,
        discount: cat ? cat.discount : 0,
        dateRange: "",
        sellerProductDiscount: cat ? cat.sellerDiscount : false,
      })
      showToast("success", "Date range cleared successfully")
    })
  }

  // Seller switch modal trigger
  const handleToggleSellerSwitch = (id: string, enabling: boolean) => {
    setPendingSwitch({ catId: id, enabling })
  }

  // Confirm seller switch change
  const handleConfirmSwitch = () => {
    if (!pendingSwitch) return
    const { catId, enabling } = pendingSwitch
    const cat = categories.find((c) => c.id === catId)
    if (!cat) return

    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, sellerDiscount: enabling } : c))
    )

    startTransition(async () => {
      await setProductDiscountAction({
        categoryId: catId,
        discount: cat.discount,
        dateRange: cat.startDate && cat.endDate ? `${cat.startDate} to ${cat.endDate}` : undefined,
        sellerProductDiscount: enabling,
      })
      showToast(
        "success",
        enabling
          ? "Seller product discount enabled successfully"
          : "Seller product discount disabled successfully"
      )
      setPendingSwitch(null)
    })
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Set Category Wise Product Discount
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure global category-level promotional discounts across store products (Active eCommerce 1:1)
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border shadow-2xs ${
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

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Nav Tab (Active eCommerce 1:1) */}
        <div className="border-b border-slate-200 px-4 pt-3">
          <button
            type="button"
            className="px-3 pb-3 text-xs font-semibold text-[#d43533] border-b-2 border-[#d43533] cursor-pointer"
          >
            All Categories
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Categories ..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-hidden focus:border-[#d43533]"
            />
          </div>
        </div>

        {/* Table */}
        <CategoryDiscountTable
          categories={filtered}
          onDiscountChange={handleDiscountChange}
          onDiscountEnter={handleDiscountEnter}
          onClearDiscount={handleClearDiscount}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          onToggleSellerSwitch={handleToggleSellerSwitch}
        />
      </div>

      {/* Modals */}
      <ConfirmDiscountModal
        isOpen={pendingDiscountCatId !== null}
        onClose={() => setPendingDiscountCatId(null)}
        onConfirm={handleConfirmDiscount}
        isLoading={isPending}
      />

      <ConfirmSwitchModal
        isOpen={pendingSwitch !== null}
        isEnabling={pendingSwitch?.enabling ?? false}
        onClose={() => setPendingSwitch(null)}
        onConfirm={handleConfirmSwitch}
        isLoading={isPending}
      />
    </div>
  )
}
