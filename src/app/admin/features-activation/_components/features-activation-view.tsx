"use client"

import React, { useState } from "react"
import { type FeatureActivations } from "@/services/settings-service"
import { updateFeatureActivationsAction } from "@/app/actions/ecommerce-actions"
import {
  ShieldCheck,
  Store,
  Users,
  Lock,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
  FileCode,
  DollarSign,
  Gift,
  Tag,
  RotateCcw,
  MessageSquare,
  MapPin,
  FileCheck,
  CreditCard,
  UserCheck,
} from "lucide-react"

interface FeaturesActivationViewProps {
  initialSettings: FeatureActivations
}

export function FeaturesActivationView({ initialSettings }: FeaturesActivationViewProps) {
  const [settings, setSettings] = useState<FeatureActivations>(initialSettings)
  const [successKey, setSuccessKey] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async (key: keyof FeatureActivations) => {
    const newVal = !settings[key]
    const nextSettings = { ...settings, [key]: newVal }
    setSettings(nextSettings)
    setIsUpdating(true)
    try {
      await updateFeatureActivationsAction({ [key]: newVal })
      setSuccessKey(key)
      setTimeout(() => setSuccessKey(null), 2500)
    } finally {
      setIsUpdating(false)
    }
  }

  const renderCard = (
    key: keyof FeatureActivations,
    title: string,
    description: string,
    IconComponent: React.ElementType,
    badgeColor: string
  ) => {
    const isActive = settings[key]
    const isJustUpdated = successKey === key

    return (
      <div
        className={`bg-white border rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
          isActive ? "border-gray-200" : "border-gray-100 opacity-80"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${badgeColor}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {isJustUpdated && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Saved
              </span>
            )}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                disabled={isUpdating}
                onChange={() => handleToggle(key)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d43533]"></div>
            </label>
          </div>
        </div>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{description}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Feature Activation</h1>
        <p className="text-xs text-gray-500 mt-1">
          Customize how your business and marketplace systems operate (Active eCommerce CMS Standard)
        </p>
      </div>

      {/* SECTION 1: INFRASTRUCTURE */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <span>Infrastructure &amp; Security</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderCard(
            "forceHttps",
            "HTTPS Force Activation",
            "Force all visitor connections to load securely over SSL / HTTPS.",
            ShieldCheck,
            "bg-blue-50 text-blue-600"
          )}
          {renderCard(
            "maintenanceMode",
            "Maintenance Mode",
            "Temporarily close storefront for maintenance and display notification banner.",
            AlertTriangle,
            "bg-amber-50 text-amber-600"
          )}
          {renderCard(
            "disableImageOptimization",
            "Disable Image Encoding",
            "Skip Next.js dynamic image encoding and serve raw static source files.",
            ImageIcon,
            "bg-purple-50 text-purple-600"
          )}
        </div>
      </div>

      {/* SECTION 2: SELLER & VENDOR */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-[#d43533]" />
            <span>Seller &amp; Multi-Vendor Marketplace</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderCard(
            "vendorSystemActivation",
            "Multi-Vendor Marketplace",
            "Allow independent merchants to register shops, list products, and fulfill orders.",
            Store,
            "bg-red-50 text-[#d43533]"
          )}
          {renderCard(
            "productApproveByAdmin",
            "Admin Product Approval",
            "Require admin inspection and manual approval before merchant products go live.",
            FileCheck,
            "bg-emerald-50 text-emerald-600"
          )}
          {renderCard(
            "sellerOrderManagement",
            "Seller Order Management",
            "Grant registered merchants full permissions to manage, ship, and update order statuses.",
            CreditCard,
            "bg-blue-50 text-blue-600"
          )}
          {renderCard(
            "sellerRegistrationVerify",
            "Seller Email Verification",
            "Enforce email address verification step upon merchant shop registration.",
            UserCheck,
            "bg-indigo-50 text-indigo-600"
          )}
          {renderCard(
            "digitalProductsForSeller",
            "Digital Products for Sellers",
            "Enable third-party sellers to upload and distribute downloadable digital products.",
            FileCode,
            "bg-teal-50 text-teal-600"
          )}
          {renderCard(
            "classifiedProducts",
            "Customer Classified Ads",
            "Allow verified customers to list second-hand used products for direct buyer inquiries.",
            Tag,
            "bg-orange-50 text-orange-600"
          )}
        </div>
      </div>

      {/* SECTION 3: CUSTOMER & CHECKOUT */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Customer &amp; Checkout Experience</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderCard(
            "customerRegistrationVerify",
            "Customer Sign-up Verification",
            "Require verification code or confirmation link on new customer account registrations.",
            UserCheck,
            "bg-emerald-50 text-emerald-600"
          )}
          {renderCard(
            "guestCheckout",
            "Guest Checkout Access",
            "Allow shoppers to complete purchases without creating an account or logging in.",
            Users,
            "bg-sky-50 text-sky-600"
          )}
          {renderCard(
            "pickupPoint",
            "Store Pickup Stations",
            "Offer customers local store collection points as a shipping alternative at checkout.",
            MapPin,
            "bg-rose-50 text-rose-600"
          )}
          {renderCard(
            "walletSystem",
            "Customer Wallet Balance",
            "Activate virtual balance wallets for fast checkout payments, cashbacks, and top-ups.",
            DollarSign,
            "bg-amber-50 text-amber-600"
          )}
          {renderCard(
            "clubPoint",
            "Club Points Loyalty Program",
            "Reward shoppers with loyalty points for each completed order convertible to wallet cash.",
            Gift,
            "bg-pink-50 text-pink-600"
          )}
          {renderCard(
            "couponSystem",
            "Promo Coupon Engine",
            "Enable percentage or flat discount coupon promo codes at checkout.",
            Tag,
            "bg-cyan-50 text-cyan-600"
          )}
          {renderCard(
            "refundSystem",
            "Returns & Refunds Workflow",
            "Enable customer return ticket submissions with dispute approval and wallet refunds.",
            RotateCcw,
            "bg-violet-50 text-violet-600"
          )}
          {renderCard(
            "conversationSystem",
            "Buyer–Seller Messenger",
            "Allow customers to initiate direct real-time inquiries to seller shops from product pages.",
            MessageSquare,
            "bg-yellow-50 text-yellow-600"
          )}
        </div>
      </div>
    </div>
  )
}
