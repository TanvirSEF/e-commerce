"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Search, Zap, Calendar, TrendingUp, Cpu } from "lucide-react"
import type { AiTokenReportData } from "@/services/report-service"

interface AdminAiTokenReportViewProps {
  data: AiTokenReportData
  currentDateFilter?: string
}

export function AdminAiTokenReportView({ data, currentDateFilter }: AdminAiTokenReportViewProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filteredLogs = data.logs.filter(
    (l) =>
      l.feature.toLowerCase().includes(search.toLowerCase()) ||
      l.model.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#d43533]" />
            Token Usage History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of AI completions, token consumption metrics, and estimated API usage costs
          </p>
        </div>
      </div>

      {/* 3 Realtime Stats Cards (1:1 with Laravel ai_token_usage.blade.php) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl p-5 text-white shadow-xs overflow-hidden flex items-center justify-between bg-[#207AFC]">
          <div>
            <div className="text-3xl font-bold tracking-tight mb-1">{data.totalRequests}</div>
            <div className="text-xs font-semibold opacity-90">Total Requests</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="rounded-xl p-5 text-white shadow-xs overflow-hidden flex items-center justify-between bg-[#9D87EC]">
          <div>
            <div className="text-3xl font-bold tracking-tight mb-1">{data.totalTokens.toLocaleString()}</div>
            <div className="text-xs font-semibold opacity-90">Total Tokens</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="rounded-xl p-5 text-white shadow-xs overflow-hidden flex items-center justify-between bg-[#EE4D5D]">
          <div>
            <div className="text-3xl font-bold tracking-tight mb-1">{data.avgPerRequest.toLocaleString()}</div>
            <div className="text-xs font-semibold opacity-90">Avg Tokens/Request</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by feature, model, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#d43533]"
            />
          </div>
          <div className="text-xs text-slate-500">
            Audit Records: <span className="font-bold text-slate-800">{filteredLogs.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Feature & Model</th>
                <th className="px-4 py-3 text-right">Prompt Tokens</th>
                <th className="px-4 py-3 text-right">Completion Tokens</th>
                <th className="px-4 py-3 text-right">Total Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No AI token usage logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">{log.feature}</div>
                      <span className="inline-block mt-0.5 text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.model}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                      {log.promptTokens}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                      {log.completionTokens}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {log.totalTokens}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
