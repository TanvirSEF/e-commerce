"use client"

import React, { useState, useTransition } from "react"
import { Database, CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal"
import { importDemoDataAction } from "@/app/actions/demo-actions"

export function AdminImportDemoView() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const handleConfirmImport = () => {
    setConfirmModalOpen(false)
    setResult(null)
    startTransition(async () => {
      const res = await importDemoDataAction()
      setResult({ success: res.success, message: res.message })
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Database className="w-7 h-7 text-[#d43533]" />
          Import Demo Data & Sample Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Seed your ecommerce marketplace with ready-to-use sample electronics, fashion, brands, and sellers
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {result.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <h4 className="font-bold">Important Notice Before Import</h4>
            <p>
              This will populate your database with canonical CodeCanyon Active eCommerce sample records
              (Categories, Brands, Inhouse Products, Vendor Stores, and Flash Deals).
              Existing records with identical slugs will be merged. This operation is idempotent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">What will be imported:</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>10 Canonical eCommerce Categories</li>
              <li>8 Top Brand Configurations</li>
              <li>Sample Products with Variations</li>
              <li>Demo Vendor Shops</li>
              <li>Hero Sliders & Promotional Banner Cards</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Pre-seeded Modules:</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Wholesale Discount Brackets</li>
              <li>Pre-Order Batch Listings</li>
              <li>Live Auction Bidding Events</li>
              <li>Affiliate Partner Codes</li>
              <li>Courier Delivery Zones</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setConfirmModalOpen(true)}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isPending ? "Seeding Demo Data..." : "Run 1-Click Demo Import"}
          </button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmImport}
        title="Import Demo Catalog Data"
        message="Importing demo data will populate sample products, sellers, banners, and categories. Proceed with demo seeding?"
      />
    </div>
  )
}
