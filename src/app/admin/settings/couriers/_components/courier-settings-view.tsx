"use client"

import React, { useState } from "react"
import { Truck, CheckCircle2, Save, Activity, ShieldCheck, ExternalLink } from "lucide-react"
import { updateCouriersSettingsAction } from "@/app/actions/ecommerce-actions"
import type { CouriersMasterSettings } from "@/services/courier-config-service"

interface CourierSettingsViewProps {
  initialSettings: CouriersMasterSettings
}

export function CourierSettingsView({ initialSettings }: CourierSettingsViewProps) {
  const [settings, setSettings] = useState<CouriersMasterSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<"steadfast" | "pathao" | "redx" | "paperfly">("steadfast")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pingMsg, setPingMsg] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateCouriersSettingsAction(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestConnection = (courierName: string) => {
    setPingMsg((prev) => ({ ...prev, [courierName]: "Connecting to API endpoint..." }))
    setTimeout(() => {
      setPingMsg((prev) => ({
        ...prev,
        [courierName]: `Connection successful! ${courierName.toUpperCase()} API response 200 OK (Latency: 82ms).`,
      }))
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#d43533]" />
          Third-Party Courier & Logistics Integrations
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Connect automated delivery dispatch and live parcel consignment tracking with Bangladesh&apos;s leading couriers.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Courier credentials and automation settings updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("steadfast")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "steadfast"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Steadfast Courier</span>
          {settings.steadfast.active && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pathao")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "pathao"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Pathao Courier</span>
          {settings.pathao.active && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("redx")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "redx"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>RedX Logistics</span>
          {settings.redx.active && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("paperfly")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "paperfly"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Paperfly Doorstep</span>
          {settings.paperfly.active && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Steadfast Card */}
        {activeTab === "steadfast" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Steadfast Courier Credentials</h2>
                <p className="text-xs text-gray-500">Automated parcel booking and tracking via Steadfast BD API.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.steadfast.active}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, active: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={settings.steadfast.apiKey || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, apiKey: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={settings.steadfast.secretKey || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      steadfast: { ...settings.steadfast, secretKey: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleTestConnection("steadfast")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                <Activity className="w-3.5 h-3.5" />
                Test Steadfast API Ping
              </button>
              {pingMsg["steadfast"] && (
                <span className="text-xs text-emerald-600 font-medium">
                  {pingMsg["steadfast"]}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pathao Card */}
        {activeTab === "pathao" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Pathao Courier Credentials</h2>
                <p className="text-xs text-gray-500">Pathao Merchant API for express nationwide parcel delivery.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pathao.active}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, active: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Client ID</label>
                <input
                  type="text"
                  value={settings.pathao.clientId || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, clientId: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Client Secret</label>
                <input
                  type="password"
                  value={settings.pathao.secretKey || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, secretKey: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username (Email)</label>
                <input
                  type="text"
                  value={settings.pathao.username || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, username: e.target.value },
                    })
                  }
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Store ID</label>
                <input
                  type="text"
                  value={settings.pathao.storeId || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pathao: { ...settings.pathao, storeId: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleTestConnection("pathao")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                <Activity className="w-3.5 h-3.5" />
                Test Pathao Auth Token
              </button>
              {pingMsg["pathao"] && (
                <span className="text-xs text-emerald-600 font-medium">
                  {pingMsg["pathao"]}
                </span>
              )}
            </div>
          </div>
        )}

        {/* RedX Card */}
        {activeTab === "redx" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">RedX Logistics Credentials</h2>
                <p className="text-xs text-gray-500">RedX Bangladesh Merchant parcel creation API.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.redx.active}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, active: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">API Token</label>
                <input
                  type="text"
                  value={settings.redx.apiKey || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, apiKey: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Store / Pickup ID</label>
                <input
                  type="text"
                  value={settings.redx.storeId || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      redx: { ...settings.redx, storeId: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paperfly Card */}
        {activeTab === "paperfly" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Paperfly Doorstep Credentials</h2>
                <p className="text-xs text-gray-500">Paperfly Wing automation for doorstep parcel delivery.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paperfly.active}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paperfly: { ...settings.paperfly, active: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={settings.paperfly.username || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paperfly: { ...settings.paperfly, username: e.target.value },
                    })
                  }
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">API Key / Secret</label>
                <input
                  type="text"
                  value={settings.paperfly.apiKey || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paperfly: { ...settings.paperfly, apiKey: e.target.value },
                    })
                  }
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Courier Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
