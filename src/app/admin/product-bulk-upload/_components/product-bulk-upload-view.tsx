"use client"

import React, { useState } from "react"
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react"
import { bulkUploadProductsAction } from "@/app/actions/ecommerce-actions"

interface BulkUploadViewProps {
  categories: { id: string | number; name: string }[]
  brands: { id: string | number; name: string }[]
}

export function ProductBulkUploadView({ categories, brands }: BulkUploadViewProps) {
  const [csvText, setCsvText] = useState("")
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
      "Apple iPhone 15 Pro,1,1,135000,25,Flagship titanium smartphone with A17 Pro chip\n" +
      "Samsung Galaxy S24 Ultra,1,2,142000,18,Galaxy AI powered flagship device with S-Pen\n" +
      "Sony WH-1000XM5 Headphones,2,3,38000,30,Industry leading noise cancelling wireless headphones"

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "product_bulk_demo.csv")
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
      setCsvText(text)
      parseCsv(text)
    }
    reader.readAsText(file)
  }

  const parseCsv = (text: string) => {
    const lines = text.trim().split("\n")
    if (lines.length <= 1) {
      setMessage({ type: "error", text: "CSV file is empty or missing data rows." })
      return
    }

    const rows: typeof parsedRows = []
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""))
      if (cols.length >= 4) {
        rows.push({
          name: cols[0] || `Product ${i}`,
          categoryId: Number(cols[1]) || 1,
          brandId: Number(cols[2]) || 1,
          unitPrice: Number(cols[3]) || 0,
          currentStock: Number(cols[4]) || 10,
          description: cols[5] || cols[0],
        })
      }
    }
    setParsedRows(rows)
    setMessage(null)
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedRows.length === 0) {
      setMessage({ type: "error", text: "Please upload or provide valid CSV product rows first." })
      return
    }

    setIsUploading(true)
    setMessage(null)
    try {
      const res = await bulkUploadProductsAction(parsedRows)
      if (res.success) {
        setMessage({
          type: "success",
          text: `Successfully imported ${res.count} products into catalog!`,
        })
        setParsedRows([])
        setFileName("")
      } else {
        setMessage({ type: "error", text: "Failed to upload products. Please check format." })
      }
    } catch {
      setMessage({ type: "error", text: "Server error occurred during bulk import." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Product Bulk Upload</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Import multiple products via CSV spreadsheet with category and brand mappings
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRefModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
        >
          <Info className="w-4 h-4 text-gray-600" />
          <span>Category & Brand ID Reference</span>
        </button>
      </div>

      {/* Status Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Step Instructions Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#d43533]" />
          <span>Bulk Upload Instructions</span>
        </h2>

        {/* Step 1 Alert */}
        <div className="bg-[#cce5ff] border border-[#b8daff] text-[#004085] p-4 rounded-lg space-y-1.5 text-xs sm:text-sm">
          <div className="font-bold">Step 1: Download Template File</div>
          <p>1. Download the skeleton CSV template and fill it with your product records.</p>
          <p>2. Keep column headers unchanged: name, category_id, brand_id, unit_price, current_stock, description.</p>
          <p>3. After uploading products, you can fine-tune pictures and variations from the product list.</p>
        </div>

        <div>
          <button
            type="button"
            onClick={downloadSampleCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Step 2 Alert */}
        <div className="bg-[#cce5ff] border border-[#b8daff] text-[#004085] p-4 rounded-lg space-y-1.5 text-xs sm:text-sm">
          <div className="font-bold">Step 2: Numeric IDs for Category & Brand</div>
          <p>1. Category and Brand columns must contain valid numerical IDs from your database.</p>
          <p>2. Click &ldquo;Category & Brand ID Reference&rdquo; button above to check matching IDs.</p>
        </div>
      </div>

      {/* Upload Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-base font-bold text-gray-800">Upload Product File</h2>

        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 hover:border-[#d43533] rounded-xl p-8 text-center transition-colors bg-gray-50/50">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-700 mb-1">
              {fileName ? (
                <span className="text-[#d43533] font-semibold">{fileName}</span>
              ) : (
                "Select CSV Spreadsheet File to Upload"
              )}
            </div>
            <p className="text-xs text-gray-500 mb-4">Supported formats: .csv, comma-delimited text</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer shadow-sm">
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  Ready to Import ({parsedRows.length} items detected)
                </span>
                <button
                  type="button"
                  onClick={() => setParsedRows([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                <table className="w-full text-xs text-left text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0 border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Product Name</th>
                      <th className="p-2.5">Category ID</th>
                      <th className="p-2.5">Brand ID</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-2.5 font-medium">{i + 1}</td>
                        <td className="p-2.5 font-semibold text-gray-800">{r.name}</td>
                        <td className="p-2.5">{r.categoryId}</td>
                        <td className="p-2.5">{r.brandId}</td>
                        <td className="p-2.5 font-medium">৳{r.unitPrice}</td>
                        <td className="p-2.5">{r.currentStock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <p className="text-xs text-gray-400 italic">
                  Showing first 10 of {parsedRows.length} rows...
                </p>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading || parsedRows.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] disabled:bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing Products...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Import CSV</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Category & Brand ID Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">Category & Brand ID Reference</h3>
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Categories ({categories.length})
                </h4>
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto text-xs">
                  {categories.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{c.name}</span>
                      <span className="font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">
                        ID: {c.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Brands ({brands.length})
                </h4>
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto text-xs">
                  {brands.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{b.name}</span>
                      <span className="font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">
                        ID: {b.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setShowRefModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
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
