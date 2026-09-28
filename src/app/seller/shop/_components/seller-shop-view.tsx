"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Store, Save, CheckCircle, Globe, Phone, MapPin, X } from "lucide-react"
import { MediaPickerModal } from "@/components/ui/media-picker-modal"
import type { SeedShop } from "@/db/seed/data"

interface SellerShopViewProps {
  shop: SeedShop | null
}

export function SellerShopView({ shop }: SellerShopViewProps) {
  const [form, setForm] = useState({
    name: shop?.name || "",
    phone: shop?.phone || "",
    address: shop?.address || "",
    logo: shop?.logo || "",
    topBanner: shop?.topBanner || "",
    facebook: shop?.facebook || "",
    instagram: shop?.instagram || "",
    twitter: shop?.twitter || "",
    youtube: shop?.youtube || "",
    metaTitle: shop?.name || "",
    metaDescription: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<"logo" | "topBanner" | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Shop Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your store profile, contact details, social links, and SEO settings
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Shop settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Shop Info */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            <Store className="w-4 h-4 inline mr-1 text-[#d43533]" />
            Shop Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                <Phone className="w-3 h-3 inline mr-1" />
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 1700 000000"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                Shop Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Shop Media */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            Shop Logo & Banner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Logo <span className="text-gray-400 font-normal">(200x200)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setPickerTarget("logo")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setPickerTarget("logo")}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {form.logo ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {form.logo && (
                <div className="mt-2 relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={form.logo}
                    alt="Shop Logo"
                    fill
                    className="object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, logo: "" }))}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-1">Recommended: 200×200px</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Banner <span className="text-gray-400 font-normal">(1280x300)</span>
              </label>
              <div className="flex rounded border border-slate-300 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setPickerTarget("topBanner")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 font-medium border-r border-slate-300 transition-colors shrink-0 cursor-pointer"
                >
                  Browse
                </button>
                <div
                  onClick={() => setPickerTarget("topBanner")}
                  className="px-3 py-2 text-slate-500 bg-white flex-1 cursor-pointer truncate flex items-center"
                >
                  {form.topBanner ? (
                    <span className="text-slate-800 font-medium truncate">1 File selected</span>
                  ) : (
                    <span className="text-slate-400">Choose File</span>
                  )}
                </div>
              </div>
              {form.topBanner && (
                <div className="mt-2 relative w-32 h-14 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={form.topBanner}
                    alt="Top Banner"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, topBanner: "" }))}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black text-white rounded-full p-0.5"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-1">Recommended: 1280×300px</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 inline mr-1 text-blue-500" />
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
              { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
              { name: "twitter", label: "Twitter / X", placeholder: "https://x.com/..." },
              { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
            ].map((social) => (
              <div key={social.name}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {social.label}
                </label>
                <input
                  type="url"
                  name={social.name}
                  value={form[social.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={social.placeholder}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
            SEO Meta Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="Brief description for search engines..."
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#d43533]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Shop Settings"}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            if (pickerTarget === "logo") {
              setForm((prev) => ({ ...prev, logo: urls[0] }))
            } else if (pickerTarget === "topBanner") {
              setForm((prev) => ({ ...prev, topBanner: urls[0] }))
            }
          }
          setPickerTarget(null)
        }}
        title={pickerTarget === "logo" ? "Select Shop Logo" : "Select Shop Banner"}
      />
    </div>
  )
}
