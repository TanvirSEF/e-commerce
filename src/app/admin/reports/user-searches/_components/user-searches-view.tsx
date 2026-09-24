"use client"

import React, { useState } from "react"
import { type UserSearchReportItem } from "@/services/report-service"
import { Search, Flame, TrendingUp } from "lucide-react"

interface UserSearchesViewProps {
  searches: UserSearchReportItem[]
}

export function UserSearchesView({ searches }: UserSearchesViewProps) {
  const [filterQuery, setFilterQuery] = useState("")

  const filtered = searches.filter((s) =>
    s.query.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const totalSearchCount = searches.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Search Report</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor most frequently searched customer queries and discover demand trends
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-red-50 text-[#d43533] rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Top Search Query</p>
            <p className="text-base font-bold text-gray-800">{searches[0]?.query || "N/A"}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Search Hits Tracked</p>
            <p className="text-lg font-bold text-gray-800">{totalSearchCount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Report Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fafbfc]">
          <h2 className="text-sm font-semibold text-gray-800">Customer Keywords ({filtered.length})</h2>
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search queries..."
              className="text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg outline-none w-48 sm:w-60 focus:border-[#d43533]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Search By</th>
                <th className="py-3 px-4 text-right">Number searches</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{item.query}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#d43533] border border-red-100">
                      {item.count.toLocaleString()} searches
                    </span>
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
