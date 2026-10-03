"use client"

import React, { useState } from "react"
import { updateSellerShopAction } from "@/app/actions/seller-actions"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ShopSocialLinksProps {
  shopId: number
  initialFacebook: string | null
  initialInstagram: string | null
  initialTwitter: string | null
  initialGoogle: string | null
  initialYoutube: string | null
}

export function ShopSocialLinks({
  shopId,
  initialFacebook,
  initialInstagram,
  initialTwitter,
  initialGoogle,
  initialYoutube,
}: ShopSocialLinksProps) {
  const [facebook, setFacebook] = useState(initialFacebook || "")
  const [instagram, setInstagram] = useState(initialInstagram || "")
  const [twitter, setTwitter] = useState(initialTwitter || "")
  const [google, setGoogle] = useState(initialGoogle || "")
  const [youtube, setYoutube] = useState(initialYoutube || "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    const res = await updateSellerShopAction(shopId, {
      facebook,
      instagram,
      twitter,
      google,
      youtube,
    })
    setIsSubmitting(false)
    if (res.success) {
      setMessage({ type: "success", text: "Social media links saved successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save social links." })
    }
  }

  const socialFields = [
    { label: "Facebook", value: facebook, setter: setFacebook, placeholder: "Facebook" },
    { label: "Instagram", value: instagram, setter: setInstagram, placeholder: "Instagram" },
    { label: "Twitter", value: twitter, setter: setTwitter, placeholder: "Twitter" },
    { label: "Google", value: google, setter: setGoogle, placeholder: "Google" },
    { label: "Youtube", value: youtube, setter: setYoutube, placeholder: "Youtube" },
  ]

  return (
    <div className="card bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-200 bg-white">
        <h5 className="mb-0 text-sm font-semibold text-gray-800">Social Media Link</h5>
      </div>
      <div className="card-body p-4 md:p-6">
        {message && (
          <div
            className={`mb-4 px-3 py-2 text-xs rounded border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {socialFields.map((field) => (
            <div key={field.label} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <label className="md:col-span-2 text-xs font-medium text-gray-700">
                {field.label}
              </label>
              <div className="md:col-span-10">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:border-[#d43533] focus:outline-none"
                />
                <small className="block text-gray-400 text-[11px] mt-0.5">
                  Insert link with https
                </small>
              </div>
            </div>
          ))}

          <div className="text-right pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#d43533] hover:bg-[#b82a28] text-white text-xs font-medium rounded transition-colors"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
