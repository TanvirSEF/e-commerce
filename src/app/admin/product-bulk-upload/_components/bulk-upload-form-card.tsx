"use client"

import React, { useState, useRef } from "react"
import { Upload, RefreshCw, Trash2, FileCheck } from "lucide-react"

export interface ParsedProductRow {
  name: string
  categoryId: number
  brandId: number
  unitPrice: number
  currentStock: number
  description: string
  unit: string
  sku?: string
}

interface BulkUploadFormCardProps {
  onUploadSubmit: (rows: ParsedProductRow[]) => Promise<void>
  isUploading: boolean
}

export function BulkUploadFormCard({
  onUploadSubmit,
  isUploading,
}: BulkUploadFormCardProps) {
  const [fileName, setFileName] = useState("")
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setParseError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      parseCsv(text)
    }
    reader.readAsText(file)
  }

  const parseCsv = (text: string) => {
    try {
      const lines = text
        .split(/\r\n|\n/)
        .map((l) => l.trim())
        .filter(Boolean)

      if (lines.length <= 1) {
        setParseError("The selected file is empty or missing data rows.")
        setParsedRows([])
        return
      }

      // Read header
      const headerLine = lines[0].toLowerCase()
      const headers = headerLine.split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

      const nameIdx = headers.findIndex((h) => h === "name" || h.includes("product"))
      const catIdx = headers.findIndex((h) => h.includes("category"))
      const brandIdx = headers.findIndex((h) => h.includes("brand"))
      const priceIdx = headers.findIndex((h) => h.includes("price"))
      const stockIdx = headers.findIndex((h) => h.includes("stock") || h.includes("qty"))
      const descIdx = headers.findIndex((h) => h.includes("desc"))
      const unitIdx = headers.findIndex((h) => h === "unit")
      const skuIdx = headers.findIndex((h) => h === "sku")

      const rows: ParsedProductRow[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (!line) continue

        // Split respecting quoted strings
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",")
        const cols = matches.map((m) => m.trim().replace(/^"|"$/g, "").replace(/""/g, '"'))

        const name = nameIdx !== -1 ? cols[nameIdx] : cols[0]
        if (!name) continue

        const unitPrice = parseFloat(priceIdx !== -1 ? cols[priceIdx] : cols[3] || "0") || 0
        const currentStock = parseInt(stockIdx !== -1 ? cols[stockIdx] : cols[4] || "10", 10) || 10
        const categoryId = parseInt(catIdx !== -1 ? cols[catIdx] : cols[1] || "1", 10) || 1
        const brandId = parseInt(brandIdx !== -1 ? cols[brandIdx] : cols[2] || "1", 10) || 1
        const description = descIdx !== -1 ? cols[descIdx] : cols[5] || name
        const unit = unitIdx !== -1 ? cols[unitIdx] : "pc"
        const sku = skuIdx !== -1 ? cols[skuIdx] : undefined

        rows.push({
          name,
          categoryId,
          brandId,
          unitPrice,
          currentStock,
          description,
          unit,
          sku,
        })
      }

      if (rows.length === 0) {
        setParseError("Could not parse any valid product rows from CSV.")
        setParsedRows([])
      } else {
        setParsedRows(rows)
        setParseError(null)
      }
    } catch {
      setParseError("Failed to parse the CSV file format. Please check formatting.")
      setParsedRows([])
    }
  }

  const handleClear = () => {
    setFileName("")
    setParsedRows([])
    setParseError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedRows.length === 0) {
      setParseError("Please select a valid CSV file before uploading.")
      return
    }
    onUploadSubmit(parsedRows)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-[#fafbfc]">
        <h5 className="mb-0 text-sm font-bold text-slate-800">
          Upload Product File
        </h5>
      </div>

      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Active eCommerce Custom File Input 1:1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-9">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-stretch border border-slate-200 rounded cursor-pointer overflow-hidden bg-white hover:border-slate-300 transition-colors"
              >
                <div className="bg-slate-100 text-slate-700 px-3.5 py-2 text-xs font-medium border-r border-slate-200 shrink-0">
                  Choose File
                </div>
                <div className="px-3 py-2 text-xs text-slate-500 truncate flex-1 flex items-center justify-between">
                  <span>{fileName || "Choose File"}</span>
                  {fileName && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClear()
                      }}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="bulk_file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </div>
          </div>

          {parseError && (
            <p className="text-xs text-red-600 font-medium">{parseError}</p>
          )}

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-emerald-700">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>{parsedRows.length} products ready to import</span>
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-red-500 hover:underline text-[11px]"
                >
                  Clear File
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded max-h-56 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fafbfc] border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                    <tr>
                      <th className="py-2 px-3 w-10">#</th>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3 text-center">Cat ID</th>
                      <th className="py-2 px-3 text-center">Brand ID</th>
                      <th className="py-2 px-3 text-right">Price</th>
                      <th className="py-2 px-3 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-3 font-medium text-slate-800">
                          {row.name}
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono text-slate-600">
                          {row.categoryId}
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono text-slate-600">
                          {row.brandId}
                        </td>
                        <td className="py-1.5 px-3 text-right font-semibold text-slate-800">
                          ৳{row.unitPrice}
                        </td>
                        <td className="py-1.5 px-3 text-right text-slate-600">
                          {row.currentStock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <p className="text-[11px] text-slate-400 italic">
                  Showing first 10 of {parsedRows.length} rows...
                </p>
              )}
            </div>
          )}

          {/* Active eCommerce Upload CSV Button 1:1 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading || parsedRows.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] hover:bg-[#138496] active:bg-[#117a8b] disabled:bg-slate-300 text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading Products...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload CSV</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
