"use client"

import React, { useState } from "react"
import { Database, Download, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"

export function AdminImportDemoView() {
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)

  const handleImport = () => {
    if (!confirm("Importing demo data will populate sample products, sellers, banners, and categories. Proceed?")) {
      return
    }
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setImported(true)
    }, 2000)
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

      {imported && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Demo data seeded successfully! All categories, products, and dummy shops are active.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <h4 className="font-bold">Important Notice Before Import</h4>
            <p>
              This will populate your database with canonical CodeCanyon Active eCommerce sample records (Categories, Brands, Inhouse Products, Vendor Stores, and Flash Deals). Existing records with identical slugs will be merged.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-sm text-slate-900">What will be imported:</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>10 Canonical eCommerce Categories</li>
              <li>12 Top Brand Logos & Configurations</li>
              <li>24 Pre-configured Products with Variations</li>
              <li>5 Verified Demo Vendor Shops</li>
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
            onClick={handleImport}
            disabled={importing}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${importing ? "animate-spin" : ""}`} />
            {importing ? "Seeding Demo Data..." : "Run 1-Click Demo Import"}
          </button>
        </div>
      </div>
    </div>
  )
}
