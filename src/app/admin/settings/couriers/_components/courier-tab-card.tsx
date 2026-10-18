"use client"

import React, { useState } from "react"
import { Activity, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { testCourierPingAction } from "@/app/actions/ecommerce-actions"
import type { CourierConfigItem } from "@/services/courier-config-service"

interface CourierTabCardProps {
  courier: CourierConfigItem
  onUpdate: (updated: CourierConfigItem) => void
}

export function CourierTabCard({ courier, onUpdate }: CourierTabCardProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [pingResult, setPingResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleTestPing = async () => {
    setIsTesting(true)
    setPingResult(null)
    try {
      const res = await testCourierPingAction(courier)
      setPingResult({
        success: res.success,
        message: res.message,
      })
    } catch (err: any) {
      setPingResult({
        success: false,
        message: err.message || "Failed to reach courier API.",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const inputCls =
    "w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-gray-900">{courier.name} Configuration</h2>
          <p className="text-xs text-gray-500">
            Automated parcel booking and tracking integration for {courier.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={courier.isSandbox}
              onChange={(e) => onUpdate({ ...courier, isSandbox: e.target.checked })}
              className="rounded text-[#d43533]"
            />
            <span>Sandbox Mode</span>
          </label>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={courier.active}
              onChange={(e) => onUpdate({ ...courier, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
          </label>
        </div>
      </div>

      {/* Steadfast Fields */}
      {courier.identifier === "steadfast" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value={courier.apiKey || ""}
              onChange={(e) => onUpdate({ ...courier, apiKey: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Secret Key</label>
            <input
              type="password"
              value={courier.secretKey || ""}
              onChange={(e) => onUpdate({ ...courier, secretKey: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Pathao Fields */}
      {courier.identifier === "pathao" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Client ID</label>
            <input
              type="text"
              value={courier.clientId || ""}
              onChange={(e) => onUpdate({ ...courier, clientId: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Client Secret</label>
            <input
              type="password"
              value={courier.secretKey || ""}
              onChange={(e) => onUpdate({ ...courier, secretKey: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username / Email</label>
            <input
              type="text"
              value={courier.username || ""}
              onChange={(e) => onUpdate({ ...courier, username: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={courier.password || ""}
              onChange={(e) => onUpdate({ ...courier, password: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Store ID</label>
            <input
              type="text"
              value={courier.storeId || ""}
              onChange={(e) => onUpdate({ ...courier, storeId: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* RedX Fields */}
      {courier.identifier === "redx" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bearer API Token</label>
            <input
              type="password"
              value={courier.apiKey || ""}
              onChange={(e) => onUpdate({ ...courier, apiKey: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Store / Hub ID</label>
            <input
              type="text"
              value={courier.storeId || ""}
              onChange={(e) => onUpdate({ ...courier, storeId: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Paperfly Fields */}
      {courier.identifier === "paperfly" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={courier.username || ""}
              onChange={(e) => onUpdate({ ...courier, username: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={courier.password || ""}
              onChange={(e) => onUpdate({ ...courier, password: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">API Key</label>
            <input
              type="password"
              value={courier.apiKey || ""}
              onChange={(e) => onUpdate({ ...courier, apiKey: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Live API Ping Diagnostic */}
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={handleTestPing}
          disabled={isTesting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {isTesting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-[#d43533]" />
          )}
          {isTesting ? "Pinging API Server..." : `Test ${courier.name} Live Ping`}
        </button>

        {pingResult && (
          <div
            className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
              pingResult.success
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {pingResult.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
            )}
            <span>{pingResult.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}
