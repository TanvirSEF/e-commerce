"use client"

import React, { useState } from "react"
import { Download, ListTree, X } from "lucide-react"

export interface CategoryReferenceItem {
  id: string | number
  name: string
}

export interface BrandReferenceItem {
  id: string | number
  name: string
}

interface BulkUploadInstructionsCardProps {
  categories: CategoryReferenceItem[]
  brands: BrandReferenceItem[]
}

export function BulkUploadInstructionsCard({
  categories,
  brands,
}: BulkUploadInstructionsCardProps) {
  const [showRefModal, setShowRefModal] = useState(false)

  // 1. Download Demo Skeleton CSV
  const handleDownloadSkeleton = () => {
    const headers = [
      "name",
      "category_id",
      "brand_id",
      "unit_price",
      "current_stock",
      "description",
      "unit",
      "sku",
    ]
    const sampleRows = [
      [
        "Premium Cotton Oxford Shirt",
        categories[0]?.id || "1",
        brands[0]?.id || "1",
        "1850",
        "30",
        "Tailored breathable formal shirt with button-down collar",
        "pc",
        "OXF-SHIRT-001",
      ],
      [
        "Wireless Bluetooth Noise-Cancelling Headphones",
        categories[1]?.id || "2",
        brands[1]?.id || "2",
        "4200",
        "15",
        "High-fidelity wireless sound with 40-hour battery life",
        "pc",
        "HEADPHONE-BT-02",
      ],
      [
        "Men Genuine Leather Slim Bifold Wallet",
        categories[0]?.id || "1",
        brands[0]?.id || "1",
        "950",
        "50",
        "Full-grain cowhide leather with RFID blocking protection",
        "pc",
        "WALLET-LTH-03",
      ],
    ]

    const csvContent =
      headers.join(",") +
      "\n" +
      sampleRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "product_bulk_demo.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 2. Download Category CSV
  const handleDownloadCategory = () => {
    const csvContent =
      "category_id,category_name\n" +
      categories.map((c) => `"${c.id}","${c.name.replace(/"/g, '""')}"`).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "categories_id_reference.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 3. Download Brand CSV
  const handleDownloadBrand = () => {
    const csvContent =
      "brand_id,brand_name\n" +
      brands.map((b) => `"${b.id}","${b.name.replace(/"/g, '""')}"`).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "brands_id_reference.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-[#fafbfc] flex items-center justify-between">
        <h5 className="mb-0 text-sm font-bold text-slate-800">
          Product Bulk Upload
        </h5>
        <button
          type="button"
          onClick={() => setShowRefModal(true)}
          className="inline-flex items-center gap-1.5 text-xs text-[#17a2b8] hover:underline font-semibold cursor-pointer"
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>View Category & Brand IDs</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Step 1 Alert (Active eCommerce Style 1:1) */}
        <div
          className="p-4 rounded border text-xs sm:text-sm leading-relaxed"
          style={{
            color: "#004085",
            backgroundColor: "#cce5ff",
            borderColor: "#b8daff",
          }}
        >
          <strong className="block text-sm mb-1 font-bold">Step 1:</strong>
          <p className="my-0.5">1. Download the skeleton file and fill it with proper data.</p>
          <p className="my-0.5">2. You can download the example file to understand how the data must be filled.</p>
          <p className="my-0.5">3. Once you have downloaded and filled the skeleton file, upload it in the form below and submit.</p>
          <p className="my-0.5">4. After uploading products you need to edit them and set product&apos;s images and choices.</p>
        </div>

        {/* Step 1 Action Button */}
        <div>
          <button
            type="button"
            onClick={handleDownloadSkeleton}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] hover:bg-[#138496] active:bg-[#117a8b] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Step 2 Alert (Active eCommerce Style 1:1) */}
        <div
          className="p-4 rounded border text-xs sm:text-sm leading-relaxed"
          style={{
            color: "#004085",
            backgroundColor: "#cce5ff",
            borderColor: "#b8daff",
          }}
        >
          <strong className="block text-sm mb-1 font-bold">Step 2:</strong>
          <p className="my-0.5">1. Category and Brand should be in numerical id.</p>
          <p className="my-0.5">2. You can download the pdf/csv to get Category and Brand id.</p>
        </div>

        {/* Step 2 Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Category</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBrand}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Brand</span>
          </button>
        </div>
      </div>

      {/* Category & Brand ID Reference Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
              <h5 className="text-sm font-bold text-slate-800">
                Category & Brand ID Reference (Live Database)
              </h5>
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto text-xs">
              {/* Categories */}
              <div>
                <h6 className="font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200">
                  Categories ({categories.length})
                </h6>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100"
                    >
                      <span className="font-medium text-slate-700 truncate">{c.name}</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        ID: {c.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h6 className="font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200">
                  Brands ({brands.length})
                </h6>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100"
                    >
                      <span className="font-medium text-slate-700 truncate">{b.name}</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        ID: {b.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-[#fafbfc] text-right">
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
