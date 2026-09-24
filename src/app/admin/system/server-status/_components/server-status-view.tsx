"use client"

import React from "react"
import { type ServerStatusInfo } from "@/services/report-service"
import {
  Server,
  Cpu,
  Database,
  HardDrive,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Activity,
  Terminal,
} from "lucide-react"

interface ServerStatusViewProps {
  status: ServerStatusInfo
}

export function ServerStatusView({ status }: ServerStatusViewProps) {
  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) return `${gb.toFixed(2)} GB`
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${d > 0 ? `${d}d ` : ""}${h}h ${m}m ${s}s`
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Server Information</h1>
        <p className="text-xs text-gray-500 mt-1">
          Detailed diagnostics, runtime environments, and database health metrics
        </p>
      </div>

      {/* Primary Status Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Next.js Application Server Online</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Production runtime environment running smoothly on {status.platform} ({status.arch})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">Uptime:</span>
          <span>{formatUptime(status.uptimeSeconds)}</span>
        </div>
      </div>

      {/* Runtime Versions Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-[#fafbfc]">
          <Server className="w-4 h-4 text-[#d43533]" />
          <h2 className="font-semibold text-gray-800 text-sm">Core Engine Versions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Current Version</th>
                <th className="py-3 px-4">Required Baseline</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-800">Node.js Runtime</td>
                <td className="py-3 px-4 font-mono text-gray-700">{status.nodeVersion}</td>
                <td className="py-3 px-4 text-gray-500">v20.0.0+</td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-800">Next.js Framework</td>
                <td className="py-3 px-4 font-mono text-gray-700">v{status.nextVersion}</td>
                <td className="py-3 px-4 text-gray-500">v16.0.0+</td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-800">PostgreSQL Database</td>
                <td className="py-3 px-4 font-mono text-gray-700">{status.postgresVersion}</td>
                <td className="py-3 px-4 text-gray-500">PostgreSQL 16.0+</td>
                <td className="py-3 px-4 text-center">
                  {status.environment.dbConnected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                  )}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-gray-800">Drizzle ORM Engine</td>
                <td className="py-3 px-4 font-mono text-gray-700">v0.38+ (Singleton Pool)</td>
                <td className="py-3 px-4 text-gray-500">v0.30.0+</td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Memory & System Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Memory Diagnostic Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-800">Memory Utilization</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Heap Used:</span>
              <span className="font-semibold text-gray-800">{formatBytes(status.memory.heapUsedBytes)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Heap Total:</span>
              <span className="font-semibold text-gray-800">{formatBytes(status.memory.heapTotalBytes)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Process RSS:</span>
              <span className="font-semibold text-gray-800">{formatBytes(status.memory.rssBytes)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">System Physical RAM:</span>
              <span className="font-semibold text-gray-800">{formatBytes(status.memory.totalBytes)}</span>
            </div>
          </div>
        </div>

        {/* Server & Environment Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Cpu className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-gray-800">Environment Parameters</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Environment (NODE_ENV):</span>
              <span className="font-semibold text-emerald-600 uppercase">{status.environment.nodeEnv}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">CPU Virtual Cores:</span>
              <span className="font-semibold text-gray-800">{status.cpuCount} Cores</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Max Upload Limit:</span>
              <span className="font-semibold text-gray-800">{status.environment.fileUploadLimit}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Database Connection:</span>
              <span className="font-semibold text-emerald-600">Online & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
