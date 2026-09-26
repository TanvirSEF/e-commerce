"use client"

import React, { useState } from "react"
import { Bot, Search, Zap, Calendar, TrendingUp } from "lucide-react"

interface TokenLog {
  id: number
  feature: string
  model: string
  tokensUsed: number
  costUsd: string
  generatedAt: string
}

const MOCK_TOKEN_LOGS: TokenLog[] = [
  {
    id: 1,
    feature: "Product Title & Description Generation",
    model: "gpt-4o",
    tokensUsed: 1420,
    costUsd: "0.021",
    generatedAt: "2026-09-25 14:22:10",
  },
  {
    id: 2,
    feature: "SEO Meta Tags & Snippet Optimization",
    model: "gpt-4o-mini",
    tokensUsed: 580,
    costUsd: "0.003",
    generatedAt: "2026-09-25 11:15:45",
  },
  {
    id: 3,
    feature: "Customer Review Sentiment Extraction",
    model: "gpt-4o-mini",
    tokensUsed: 890,
    costUsd: "0.004",
    generatedAt: "2026-09-24 16:40:02",
  },
  {
    id: 4,
    feature: "Product Bulk Features Bullet Generator",
    model: "gpt-4o",
    tokensUsed: 3100,
    costUsd: "0.046",
    generatedAt: "2026-09-24 09:12:30",
  },
]

export function AdminAiTokenReportView() {
  const [logs] = useState(MOCK_TOKEN_LOGS)
  const totalTokens = logs.reduce((acc, l) => acc + l.tokensUsed, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Bot className="w-7 h-7 text-[#d43533]" />
          AI Writer Token Usage Report
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor token consumption, API calls, and OpenAI expenses across platform writers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Tokens Consumed</span>
          <div className="text-2xl font-black text-slate-900">{totalTokens.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Current Month</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total OpenAI API Cost</span>
          <div className="text-2xl font-black text-emerald-600">$0.074</div>
          <span className="text-[11px] text-slate-400">GPT-4o + Mini</span>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Model</span>
          <div className="text-2xl font-black text-blue-600">GPT-4o</div>
          <span className="text-[11px] text-slate-400">High fidelity mode</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Token Consumption Ledger</h2>
          <span className="text-xs text-slate-500">{logs.length} Generation Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">AI Writer Task</th>
                <th className="px-4 py-3.5">LLM Engine</th>
                <th className="px-4 py-3.5">Tokens Used</th>
                <th className="px-4 py-3.5">Estimated Cost</th>
                <th className="px-4 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((l, idx) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{l.feature}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {l.model}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{l.tokensUsed.toLocaleString()}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600">${l.costUsd}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{l.generatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
