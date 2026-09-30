"use client"

import React from "react"
import { type SmartBarSettings } from "@/services/settings-service"
import { RefreshCw } from "lucide-react"

interface SmartBarFormProps {
  settings: SmartBarSettings
  setSettings: React.Dispatch<React.SetStateAction<SmartBarSettings>>
  onToggleStatusClick: () => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export function SmartBarForm({
  settings,
  setSettings,
  onToggleStatusClick,
  onSubmit,
  isSubmitting,
}: SmartBarFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6 text-xs">
      {/* Show Smart Bar Switch */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-3 pb-5 border-b border-slate-100">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs pt-1">
          Show Smart Bar
        </label>
        <div className="md:col-span-9 space-y-1.5">
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.showSmartBar}
              onChange={onToggleStatusClick}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#28a745]"></div>
          </label>
          <p className="text-[12px] text-slate-500 leading-normal">
            (This bar will show a product summary at the bottom of the product detail page while scrolling.)
          </p>
        </div>
      </div>

      {/* Select Background Design */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs">
          Select Background Design
        </label>
        <div className="md:col-span-9 flex items-center gap-4">
          {/* Plain Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, backgroundDesign: "plain" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.backgroundDesign === "plain"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.backgroundDesign === "plain"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.backgroundDesign === "plain" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Plain</span>
          </label>

          {/* Blur Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, backgroundDesign: "blur" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.backgroundDesign === "blur"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.backgroundDesign === "blur"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.backgroundDesign === "blur" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Blur</span>
          </label>
        </div>
      </div>

      {/* Select Background Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs">
          Select Background Color
        </label>
        <div className="md:col-span-9">
          <div className="flex items-stretch border border-slate-200 rounded overflow-hidden max-w-md focus-within:border-[#d43533]">
            <input
              type="text"
              placeholder="Ex: #e1e1e1"
              value={settings.backgroundColor}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
              }
              className="flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none font-mono"
            />
            <div className="border-l border-slate-200 bg-slate-50 flex items-center px-2">
              <input
                type="color"
                value={
                  settings.backgroundColor.startsWith("#") && settings.backgroundColor.length === 7
                    ? settings.backgroundColor
                    : "#ffffff"
                }
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
                }
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Select Text Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs">
          Select Text Color
        </label>
        <div className="md:col-span-9 flex items-center gap-4">
          {/* Light (white) Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, textColor: "white" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.textColor === "white"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.textColor === "white"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.textColor === "white" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Light</span>
          </label>

          {/* Dark Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, textColor: "dark" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.textColor === "dark"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.textColor === "dark"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.textColor === "dark" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Dark</span>
          </label>
        </div>
      </div>

      {/* Select Button Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs">
          Select Button Color
        </label>
        <div className="md:col-span-9">
          <div className="flex items-stretch border border-slate-200 rounded overflow-hidden max-w-md focus-within:border-[#d43533]">
            <input
              type="text"
              placeholder="Ex: #e1e1e1"
              value={settings.buttonColor}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, buttonColor: e.target.value }))
              }
              className="flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none font-mono"
            />
            <div className="border-l border-slate-200 bg-slate-50 flex items-center px-2">
              <input
                type="color"
                value={
                  settings.buttonColor.startsWith("#") && settings.buttonColor.length === 7
                    ? settings.buttonColor
                    : "#d43533"
                }
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, buttonColor: e.target.value }))
                }
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Select Button Text Color */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
        <label className="md:col-span-3 text-slate-700 font-medium text-xs">
          Select Button Text Color
        </label>
        <div className="md:col-span-9 flex items-center gap-4">
          {/* Light (white) Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, buttonTextColor: "white" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.buttonTextColor === "white"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.buttonTextColor === "white"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.buttonTextColor === "white" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Light</span>
          </label>

          {/* Dark Option */}
          <label
            onClick={() => setSettings((prev) => ({ ...prev, buttonTextColor: "dark" }))}
            className={`flex-1 min-w-[120px] p-3 border rounded cursor-pointer transition-all flex items-center gap-3 bg-white ${
              settings.buttonTextColor === "dark"
                ? "border-[#d43533] ring-1 ring-[#d43533]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                settings.buttonTextColor === "dark"
                  ? "border-[#d43533]"
                  : "border-slate-300"
              }`}
            >
              {settings.buttonTextColor === "dark" && (
                <div className="w-2 h-2 rounded-full bg-[#d43533]" />
              )}
            </div>
            <span className="font-semibold text-slate-800 text-xs">Dark</span>
          </label>
        </div>
      </div>

      {/* Save Button (Aligned Right matching Laravel 1:1) */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#d43533] hover:bg-[#b82a28] disabled:bg-slate-300 text-white font-bold text-xs rounded shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </form>
  )
}
