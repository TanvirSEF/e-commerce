"use client"

import React, { useState } from "react"
import { BarChart3, Search, Download, TrendingUp, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface InhouseSaleItem {
  id: number
  productName: string
  category: string
  unitsSold: number
  grossSales: number
  currentStock: number
}

const SEED_INHOUSE_SALES: InhouseSaleItem[] = [
  {
    id: 1,
    productName: "Premium Cotton Casual Shirt (Slim Fit)",
    category: "Men Clothing & Fashion",
    unitsSold: 142,
    grossSales: 262700,
    currentStock: 58,
  },
  {
    id: 2,
    productName: "Casual Denim Jeans Pant",
    category: "Men Clothing & Fashion",
    unitsSold: 98,
    grossSales: 196000,
    currentStock: 34,
  },
  {
    id: 3,
    productName: "Wireless Ergonomic Optical Mouse",
    category: "Computer & Accessories",
    unitsSold: 215,
    grossSales: 182750,
    currentStock: 85,
  },
  {
    id: 4,
    productName: "Mechanical Gaming Keyboard RGB",
    category: "Computer & Accessories",
    unitsSold: 76,
    grossSales: 266000,
    currentStock: 24,
  },
  {
    id: 5,
    productName: "Classic Genuine Leather Formal Belt",
    category: "Men Clothing & Fashion",
    unitsSold: 110,
    grossSales: 93500,
    currentStock: 42,
  },
]

export function InhouseSalesReportView() {
  const [items] = useState<InhouseSaleItem[]>(SEED_INHOUSE_SALES)
  const [search, setSearch] = useState("")

  const filtered = items.filter(
    (i) =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = items.reduce((sum, i) => sum + i.unitsSold, 0)
  const totalRevenue = items.reduce((sum, i) => sum + i.grossSales, 0)

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Product,Category,Units Sold,Gross Sales,Stock Left\n" +
      items
        .map(
          (i) =>
            `"${i.productName}","${i.category}",${i.unitsSold},${i.grossSales},${i.currentStock}`
        )
        .join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `inhouse_sales_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#d43533]" />
            In-House Product Sales Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit store-managed direct inventory sales volumes, gross revenue, and stock depletion
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Report CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total In-House Products</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{items.length} SKUs</div>
        </div>
        <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-blue-600 uppercase">Total Units Sold</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{totalUnits} Units</div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Gross Revenue</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{formatPrice(totalRevenue)}</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">In-House Products Sales</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:border-[#d43533] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Units Sold</th>
                <th className="px-5 py-3">Gross Sales</th>
                <th className="px-5 py-3 text-right">Stock Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 text-slate-400 font-medium">{idx + 1}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800">{item.productName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{item.category}</td>
                  <td className="px-5 py-3.5 font-bold text-blue-600">{item.unitsSold} pcs</td>
                  <td className="px-5 py-3.5 font-black text-slate-900">{formatPrice(item.grossSales)}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-700">
                    {item.currentStock} in stock
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
