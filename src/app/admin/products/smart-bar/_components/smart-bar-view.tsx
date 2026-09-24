"use client"

import React, { useState } from "react"
import { type SmartBarSettings } from "@/services/settings-service"
import { updateSmartBarSettingsAction } from "@/app/actions/ecommerce-actions"
import { Sparkles, Save, CheckCircle, Smartphone, ShoppingCart } from "lucide-react"

interface SmartBarViewProps {
  initialSettings: SmartBarSettings
}

export function SmartBarView({ initialSettings }: SmartBarViewProps) {
  const [settings, setSettings] = useState<SmartBarSettings>(initialSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSavedSuccess(false)
    try {
      await updateSmartBarSettingsAction(settings)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Smart Bar Configuration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure the sticky product summary bar shown at the bottom of the product page while scrolling
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Smart Bar settings have been saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d43533]" />
            <h2 className="font-semibold text-gray-800 text-sm">Smart Bar Options</h2>
          </div>
          <span className="text-[11px] text-gray-400">Active eCommerce CMS Standard</span>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Show Smart Bar</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Display product summary and instant Add to Cart bar at the bottom while scrolling.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showSmartBar}
                onChange={(e) => setSettings({ ...settings, showSmartBar: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          {/* Background Design */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Select Background Design</label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                  settings.backgroundDesign === "plain"
                    ? "border-[#d43533] bg-red-50/20 text-[#d43533] ring-1 ring-[#d43533]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="backgroundDesign"
                  value="plain"
                  checked={settings.backgroundDesign === "plain"}
                  onChange={() => setSettings({ ...settings, backgroundDesign: "plain" })}
                  className="w-4 h-4 text-[#d43533]"
                />
                <div>
                  <p className="font-bold text-gray-800">Plain Solid</p>
                  <p className="text-[11px] text-gray-500">Solid opaque background with clean borders</p>
                </div>
              </label>

              <label
                className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                  settings.backgroundDesign === "blur"
                    ? "border-[#d43533] bg-red-50/20 text-[#d43533] ring-1 ring-[#d43533]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="backgroundDesign"
                  value="blur"
                  checked={settings.backgroundDesign === "blur"}
                  onChange={() => setSettings({ ...settings, backgroundDesign: "blur" })}
                  className="w-4 h-4 text-[#d43533]"
                />
                <div>
                  <p className="font-bold text-gray-800">Frosted Glass Blur</p>
                  <p className="text-[11px] text-gray-500">Translucent backdrop-blur effect (modern glassmorphism)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="w-9 h-9 p-0.5 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                  className="w-9 h-9 p-0.5 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block font-semibold text-gray-700 mb-2">Live Smart Bar Preview</label>
            <div
              className={`p-3 rounded-xl border shadow-sm flex items-center justify-between gap-4 transition-all ${
                settings.backgroundDesign === "blur" ? "backdrop-blur-md bg-opacity-80" : ""
              }`}
              style={{
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
                borderColor: "#e5e7eb",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold line-clamp-1">iPhone 15 Pro Max - 256GB Natural Titanium</p>
                  <p className="text-[11px] font-semibold opacity-80">৳ 165,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#d43533] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="text-right pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Smart Bar Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
