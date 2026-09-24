"use client"

import React, { useState } from "react"
import { Palette, Globe, Layers, Share2, Save, CheckCircle2 } from "lucide-react"
import { updateAppearanceSettingsAction } from "@/app/actions/ecommerce-actions"
import type { WebsiteAppearanceSettings } from "@/services/appearance-service"

interface AppearanceSettingsViewProps {
  initialSettings: WebsiteAppearanceSettings
}

export function AppearanceSettingsView({ initialSettings }: AppearanceSettingsViewProps) {
  const [settings, setSettings] = useState<WebsiteAppearanceSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<"colors" | "header" | "footer" | "social">("colors")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateAppearanceSettingsAction(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#d43533]" />
          Website Appearance & Layout Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Customize store theme colors, top announcement banner, header toggles, footer widgets, and social links.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Appearance settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("colors")}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === "colors"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Palette className="w-4 h-4" />
          Theme Colors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("header")}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === "header"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Globe className="w-4 h-4" />
          Header & Banner
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("footer")}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === "footer"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          Footer & Branding
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === "social"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Share2 className="w-4 h-4" />
          Social Links
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-900">Brand Color Palette</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Brand Color (Base)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-full text-xs font-mono uppercase border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Default: #d43533</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-full text-xs font-mono uppercase border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Default: #ffc519</span>
              </div>
            </div>
          </div>
        )}

        {/* Header Tab */}
        {activeTab === "header" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-900">Header & Announcement Bar</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Top Announcement Message
                </label>
                <input
                  type="text"
                  value={settings.headerAnnouncement}
                  onChange={(e) => setSettings({ ...settings, headerAnnouncement: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Announcement Action Link URL
                </label>
                <input
                  type="text"
                  value={settings.headerAnnouncementUrl}
                  onChange={(e) => setSettings({ ...settings, headerAnnouncementUrl: e.target.value })}
                  placeholder="/flash-deals"
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.showTopBanner}
                    onChange={(e) => setSettings({ ...settings, showTopBanner: e.target.checked })}
                    className="w-4 h-4 text-[#d43533] rounded focus:ring-[#d43533]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Show Top Notification Banner</div>
                    <div className="text-[10px] text-gray-500">Enable top-level announcement strip</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.stickyHeader}
                    onChange={(e) => setSettings({ ...settings, stickyHeader: e.target.checked })}
                    className="w-4 h-4 text-[#d43533] rounded focus:ring-[#d43533]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Enable Sticky Header</div>
                    <div className="text-[10px] text-gray-500">Stick header on scrolling down</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-900">Footer Widgets & Contact Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  About Marketplace Description
                </label>
                <textarea
                  rows={3}
                  value={settings.footerAboutText}
                  onChange={(e) => setSettings({ ...settings, footerAboutText: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Office Address</label>
                <input
                  type="text"
                  value={settings.footerAddress}
                  onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={settings.footerPhone}
                    onChange={(e) => setSettings({ ...settings, footerPhone: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settings.footerEmail}
                    onChange={(e) => setSettings({ ...settings, footerEmail: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Copyright Notice</label>
                <input
                  type="text"
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Social Media Profile Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Page</label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram Profile</label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">YouTube Channel</label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Updating..." : "Save Appearance Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
