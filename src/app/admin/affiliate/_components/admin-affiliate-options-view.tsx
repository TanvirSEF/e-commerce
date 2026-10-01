"use client"

import React, { useState } from "react"
import { Users, Save, CheckCircle2, Share2, UserPlus, ShoppingBag } from "lucide-react"
import {
  updateAffiliateOptionAction,
  updateCategoryAffiliateRatesAction,
} from "@/app/actions/ecommerce-actions"
import type { AffiliateOption } from "@/db/schema/affiliate"
import { CategoryAffiliateTable } from "./category-affiliate-table"

interface AdminAffiliateOptionsViewProps {
  options: AffiliateOption[]
  categories: Array<{ id: number; name: string; slug: string; icon: string | null }>
}

export function AdminAffiliateOptionsView({
  options: initialOptions,
  categories,
}: AdminAffiliateOptionsViewProps) {
  const [options, setOptions] = useState(initialOptions)
  const [saving, setSaving] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleUpdate = async (type: string, percentage: string, status: boolean) => {
    setSaving(type)
    setFeedback(null)
    try {
      await updateAffiliateOptionAction(type, percentage, status)
      setOptions((prev) => {
        let updated = prev.map((o) => (o.type === type ? { ...o, percentage, status } : o))
        // Enforce mutual exclusivity in local state
        if (type === "product_sharing" && status) {
          updated = updated.map((o) => (o.type === "category_wise_affiliate" ? { ...o, status: false } : o))
        }
        return updated
      })
      setFeedback(`Successfully updated ${type.replace(/_/g, " ")} settings!`)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(null)
    }
  }

  const handleCategorySave = async (rates: Record<string, string>, status: boolean) => {
    await updateCategoryAffiliateRatesAction(rates, status)
    setOptions((prev) => {
      let updated = prev.map((o) =>
        o.type === "category_wise_affiliate"
          ? { ...o, details: JSON.stringify(rates), status }
          : o
      )
      if (status) {
        updated = updated.map((o) => (o.type === "product_sharing" ? { ...o, status: false } : o))
      }
      return updated
    })
    setFeedback("Successfully saved Category Wise Affiliate Commission!")
  }

  const productSharing = options.find((o) => o.type === "product_sharing") || {
    id: 1,
    type: "product_sharing",
    percentage: "5.00",
    status: true,
  }

  const categoryWise = options.find((o) => o.type === "category_wise_affiliate") || {
    id: 2,
    type: "category_wise_affiliate",
    percentage: "0.00",
    details: "{}",
    status: false,
  }

  let parsedCategoryRates: Record<string, string> = {}
  try {
    if (categoryWise.details) parsedCategoryRates = JSON.parse(categoryWise.details)
  } catch {
    parsedCategoryRates = {}
  }

  const userReg = options.find((o) => o.type === "user_registration") || {
    id: 3,
    type: "user_registration",
    percentage: "2.50",
    status: true,
  }

  const userFirstBuy = options.find((o) => o.type === "user_registration_first_purchase") || {
    id: 4,
    type: "user_registration_first_purchase",
    percentage: "3.00",
    status: true,
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-[#d43533]" />
          Affiliate Configurations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure commission channels for product sharing, category rates, and referred user activities
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Grid for General Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Sharing Commission */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d43533] flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Product Sharing Affiliate</h2>
              <p className="text-xs text-slate-500">Universal commission rate credited on product purchases</p>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm font-medium text-slate-700">Enable Product Sharing</span>
              <input
                type="checkbox"
                checked={productSharing.status}
                onChange={(e) =>
                  handleUpdate(productSharing.type, productSharing.percentage, e.target.checked)
                }
                className="w-5 h-5 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Commission Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={productSharing.percentage}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o) =>
                        o.type === productSharing.type ? { ...o, percentage: e.target.value } : o
                      )
                    )
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
              </div>
            </div>

            <button
              onClick={() =>
                handleUpdate(productSharing.type, productSharing.percentage, productSharing.status)
              }
              disabled={saving === productSharing.type}
              className="w-full py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving === productSharing.type ? "Saving..." : "Save Product Sharing Rate"}
            </button>
          </div>
        </div>

        {/* User Registration Commission */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">User Registration Commission</h2>
              <p className="text-xs text-slate-500">Fixed reward when a referred visitor creates an account</p>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm font-medium text-slate-700">Enable Registration Reward</span>
              <input
                type="checkbox"
                checked={userReg.status}
                onChange={(e) => handleUpdate(userReg.type, userReg.percentage, e.target.checked)}
                className="w-5 h-5 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Commission Amount ($ or %)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={userReg.percentage}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o) =>
                        o.type === userReg.type ? { ...o, percentage: e.target.value } : o
                      )
                    )
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              </div>
            </div>

            <button
              onClick={() => handleUpdate(userReg.type, userReg.percentage, userReg.status)}
              disabled={saving === userReg.type}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving === userReg.type ? "Saving..." : "Save Registration Rate"}
            </button>
          </div>
        </div>

        {/* User Registration First Purchase Commission */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Affiliate 1st Purchase Commission</h2>
              <p className="text-xs text-slate-500">
                Bonus awarded to the affiliate on the very first completed purchase made by a referred user
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-sm font-medium text-slate-700">Enable 1st Purchase Reward</span>
              <input
                type="checkbox"
                checked={userFirstBuy.status}
                onChange={(e) =>
                  handleUpdate(userFirstBuy.type, userFirstBuy.percentage, e.target.checked)
                }
                className="w-5 h-5 rounded text-[#d43533] focus:ring-[#d43533] accent-[#d43533]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  value={userFirstBuy.percentage}
                  onChange={(e) =>
                    setOptions((prev) =>
                      prev.map((o) =>
                        o.type === userFirstBuy.type ? { ...o, percentage: e.target.value } : o
                      )
                    )
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d43533]/20 focus:border-[#d43533]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
              </div>
              <button
                onClick={() =>
                  handleUpdate(userFirstBuy.type, userFirstBuy.percentage, userFirstBuy.status)
                }
                disabled={saving === userFirstBuy.type}
                className="px-5 py-2 bg-[#d43533] hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60 whitespace-nowrap"
              >
                {saving === userFirstBuy.type ? "Saving..." : "Save Rate"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Wise Commission Table Section */}
      <CategoryAffiliateTable
        categories={categories}
        initialRates={parsedCategoryRates}
        initialStatus={categoryWise.status}
        onSave={handleCategorySave}
      />
    </div>
  )
}
