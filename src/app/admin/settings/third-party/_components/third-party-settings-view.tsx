"use client"

import React, { useState } from "react"
import { Globe, Shield, Activity, Save, CheckCircle, Flame, MapPin } from "lucide-react"

export function ThirdPartySettingsView() {
  const [activeTab, setActiveTab] = useState<"google" | "facebook" | "recaptcha">("google")
  const [saved, setSaved] = useState(false)

  // Google State
  const [gaId, setGaId] = useState("G-XXXXXXXXXX")
  const [gtmId, setGtmId] = useState("GTM-XXXXXXX")
  const [googleMapKey, setGoogleMapKey] = useState("")
  const [firebaseKey, setFirebaseKey] = useState("")

  // Facebook State
  const [fbPixelId, setFbPixelId] = useState("123456789012345")
  const [fbCapiToken, setFbCapiToken] = useState("")
  const [fbAppId, setFbAppId] = useState("9876543210")
  const [fbPixelActive, setFbPixelActive] = useState(true)

  // Recaptcha State
  const [recaptchaVersion, setRecaptchaVersion] = useState("v2")
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
  const [recaptchaSecret, setRecaptchaSecret] = useState("6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe")
  const [recaptchaActive, setRecaptchaActive] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Third-Party & Analytics Settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure Google Analytics, Google Maps, reCAPTCHA, and Facebook Pixel integrations
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Settings updated successfully
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("google")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "google"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          Google Services & Maps
        </button>
        <button
          onClick={() => setActiveTab("facebook")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "facebook"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          Facebook Pixel & CAPI
        </button>
        <button
          onClick={() => setActiveTab("recaptcha")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "recaptcha"
              ? "border-[#d43533] text-[#d43533]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Shield className="w-4 h-4" />
          Google reCAPTCHA
        </button>
      </div>

      {/* Tab 1: Google */}
      {activeTab === "google" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google Analytics & GTM Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-800">Google Analytics & Tag Manager</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Google Analytics Tracking ID (GA4)
                  </label>
                  <input
                    type="text"
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Google Tag Manager Container ID (GTM)
                  </label>
                  <input
                    type="text"
                    value={gtmId}
                    onChange={(e) => setGtmId(e.target.value)}
                    placeholder="GTM-XXXXXXX"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  />
                </div>
              </div>
            </div>

            {/* Google Maps & Firebase */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-800">Google Maps & Firebase</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Google Maps API Key
                  </label>
                  <input
                    type="text"
                    value={googleMapKey}
                    onChange={(e) => setGoogleMapKey(e.target.value)}
                    placeholder="AIzaSyA..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Firebase Cloud Messaging (FCM) Server Key
                  </label>
                  <input
                    type="password"
                    value={firebaseKey}
                    onChange={(e) => setFirebaseKey(e.target.value)}
                    placeholder="AAAA..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Google Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Facebook */}
      {activeTab === "facebook" && (
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Facebook Pixel & Conversions API</h3>
              <p className="text-xs text-gray-500">Track ecommerce purchases, add-to-carts, and conversions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={fbPixelActive}
                onChange={(e) => setFbPixelActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Pixel ID</label>
              <input
                type="text"
                value={fbPixelId}
                onChange={(e) => setFbPixelId(e.target.value)}
                placeholder="123456789012345"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook App ID (Comment Plugin)</label>
              <input
                type="text"
                value={fbAppId}
                onChange={(e) => setFbAppId(e.target.value)}
                placeholder="9876543210"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Conversions API Access Token (CAPI)</label>
            <textarea
              rows={3}
              value={fbCapiToken}
              onChange={(e) => setFbCapiToken(e.target.value)}
              placeholder="EAAGNO4..."
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
            />
          </div>

          <div className="text-right pt-2 border-t border-gray-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Facebook Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: reCAPTCHA */}
      {activeTab === "recaptcha" && (
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Google reCAPTCHA Security</h3>
              <p className="text-xs text-gray-500">Protect customer login, registration, and forms from bot abuse</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={recaptchaActive}
                onChange={(e) => setRecaptchaActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">reCAPTCHA Version</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="recaptchaVersion"
                    value="v2"
                    checked={recaptchaVersion === "v2"}
                    onChange={(e) => setRecaptchaVersion(e.target.value)}
                  />
                  <span>v2 (I'm not a robot checkbox)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="recaptchaVersion"
                    value="v3"
                    checked={recaptchaVersion === "v3"}
                    onChange={(e) => setRecaptchaVersion(e.target.value)}
                  />
                  <span>v3 (Invisible score-based)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Site Key</label>
                <input
                  type="text"
                  value={recaptchaSiteKey}
                  onChange={(e) => setRecaptchaSiteKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={recaptchaSecret}
                  onChange={(e) => setRecaptchaSecret(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#d43533]"
                />
              </div>
            </div>
          </div>

          <div className="text-right pt-2 border-t border-gray-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#d43533] hover:bg-[#b82d2b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save reCAPTCHA Settings
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
