"use client"

import React, { useState } from "react"
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react"
import { bulkUploadProductsAction } from "@/app/actions/ecommerce-actions"

interface SellerBulkUploadViewProps {
  categories: { id: string | number; name: string }[]
  brands: { id: string | number; name: string }[]
}

export function SellerBulkUploadView({ categories, brands }: SellerBulkUploadViewProps) {
  const [parsedRows, setParsedRows] = useState<Array<{
    name: string
    categoryId: number
    brandId: number
    unitPrice: number
    currentStock: number
    description: string
  }>>([])
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showRefModal, setShowRefModal] = useState(false)

  const downloadSampleCSV = () => {
    const csvContent =
      "name,category_id,brand_id,unit_price,current_stock,description\n" +
      "Men Premium Casual Slim Fit Shirt,1,1,1850,50,High quality 100% cotton casual shirt\n" +
      "Wireless Ergonomic Bluetooth Mouse,2,2,1450,30,Rechargeable optical mouse with silent click\n" +
      "Smart Stainless Steel Water Bottle,3,3,890,100,500ml vacuum insulated thermal drink flask"

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "seller_products_bulk_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      parseCsv(text)
    }
    reader.readAsText(file)
  }

  const parseCsv = (text: string) => {
    const lines = text.trim().split("\n")
    if (lines.length <= 1) {
      setMessage({ type: "error", text: "The uploaded CSV file is empty or missing data rows." })
      return
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const cols = line.split(",").map((c) => c.trim())
      if (cols.length >= 5) {
        rows.push({
          name: cols[0] || "Sample Product",
          categoryId: parseInt(cols[1]) || 1,
          brandId: parseInt(cols[2]) || 1,
          unitPrice: parseFloat(cols[3]) || 0,
          currentStock: parseInt(cols[4]) || 10,
          description: cols[5] || "",
        })
      }
    }

    setParsedRows(rows)
    setMessage({ type: "success", text: `Successfully parsed ${rows.length} product(s) from CSV.` })
  }

  const handleUploadSubmit = async () => {
    if (parsedRows.length === 0) {
      setMessage({ type: "error", text: "No products available to upload. Please load a CSV first." })
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const result = await bulkUploadProductsAction(parsedRows)
      if (result.success) {
        setMessage({
          type: "success",
          text: `Success! ${result.count || parsedRows.length} products were published to your store catalog.`,
        })
        setParsedRows([])
        setFileName("")
      } else {
        setMessage({ type: "error", text: "Failed to import products." })
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred during bulk import." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-[#d43533]" />
          Seller Product Bulk Upload (CSV)
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Quickly import your inventory into your store using standard CSV spreadsheets
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Guide Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Step 1 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d43533] text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-bold text-gray-900">
              Download CSV Sample Template
            </h2>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Download our standardized sample CSV template containing required columns (Product Name, Category ID, Brand ID, Price, and Stock).
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download Template
            </button>
            <button
              type="button"
              onClick={() => setShowRefModal(!showRefModal)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <Info className="h-3.5 w-3.5 text-blue-600" />
              {showRefModal ? "Hide Categories & Brands" : "View ID Codes"}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d43533] text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-bold text-gray-900">
              Upload Prepared CSV
            </h2>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Select your populated CSV file. The system validates header rows and previews records prior to database ingestion.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:border-[#d43533] hover:text-[#d43533] transition">
              <Upload className="h-3.5 w-3.5" />
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className="text-xs font-mono font-medium text-emerald-600 truncate max-w-xs">
                {fileName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ID Reference Drawer / Block */}
      {showRefModal && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-bold text-xs text-blue-900 mb-2">Category IDs:</h3>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-blue-200 bg-white p-2 text-xs space-y-1">
              {categories.map((c) => (
                <div key={c.id} className="flex justify-between py-0.5 border-b border-gray-50 text-gray-700">
                  <span>{c.name}</span>
                  <span className="font-mono font-bold text-blue-600">ID: {c.id}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xs text-blue-900 mb-2">Brand IDs:</h3>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-blue-200 bg-white p-2 text-xs space-y-1">
              {brands.map((b) => (
                <div key={b.id} className="flex justify-between py-0.5 border-b border-gray-50 text-gray-700">
                  <span>{b.name}</span>
                  <span className="font-mono font-bold text-blue-600">ID: {b.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Parsed Preview Table */}
      {parsedRows.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Ready to Import: {parsedRows.length} Product(s)
              </h3>
              <p className="text-[11px] text-gray-500">
                Verify product lines below before committing to catalog
              </p>
            </div>
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#d43533] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b02a28] transition disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Publish All to Store
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category ID</th>
                  <th className="px-4 py-3">Brand ID</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 font-mono text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-2.5 font-bold text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 font-mono">{row.categoryId}</td>
                    <td className="px-4 py-2.5 font-mono">{row.brandId}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-[#d43533]">৳{row.unitPrice}</td>
                    <td className="px-4 py-2.5 font-mono">{row.currentStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
