"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Blocks, Plus, CheckCircle, UploadCloud } from "lucide-react"

interface Addon {
  id: string
  name: string
  version: string
  description: string
  image: string
  installed: boolean
  activated: boolean
  purchaseCode?: string
}

const DEFAULT_ADDONS: Addon[] = [
  {
    id: "club_points",
    name: "Club Point System",
    version: "2.4",
    description: "Reward shoppers with points for purchases, exchangeable for wallet money and coupon vouchers.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "pos_system",
    name: "POS (Point of Sale) System",
    version: "3.1",
    description: "Complete in-store checkout terminal with barcode scanner, thermal receipt printing, and live stock sync.",
    image: "https://images.unsplash.com/photo-1556742049-0a67e5572248?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "otp_system",
    name: "OTP & SMS Notifications",
    version: "2.8",
    description: "Mobile number authentication via Twilio, Fast2SMS, Nexmo, and SMS order alerts.",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "wholesale_system",
    name: "Wholesale Tiered Pricing",
    version: "2.0",
    description: "Multi-tier bulk discount price brackets based on purchase quantity brackets.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "preorder_system",
    name: "Pre-Order System",
    version: "1.9",
    description: "Accept partial deposits or full pre-orders on unreleased and scheduled batch products.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "auction_system",
    name: "Auction & Bidding System",
    version: "2.2",
    description: "Real-time competitive bidding countdown lots for luxury timepieces and rare merchandise.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "affiliate_system",
    name: "Affiliate Partner Program",
    version: "2.5",
    description: "Multi-tier influencer referral links, cookie attribution tracking, and automated payout requests.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "delivery_boy_system",
    name: "Delivery Boy Management",
    version: "3.0",
    description: "Dedicated courier dispatch portal with COD collections, zone assignments, and commission payouts.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "refund_system",
    name: "Refund & Return Management",
    version: "2.1",
    description: "Buyer dispute desk with return reason workflows and automated wallet credits.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
  {
    id: "offline_payments",
    name: "Manual & Offline Payments",
    version: "2.0",
    description: "Support manual bank transfers, bKash, Nagad, and cheque receipts with admin verification.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80",
    installed: true,
    activated: true,
  },
]

export function AdminAddonsView() {
  const [addons, setAddons] = useState(DEFAULT_ADDONS)

  const toggleActivate = (id: string) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, activated: !a.activated } : a))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Blocks className="w-7 h-7 text-[#d43533]" />
            Installed Addons & Modules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervise Active eCommerce CMS CodeCanyon extensions, feature packs, and licensing
          </p>
        </div>
        <Link
          href="/admin/addons/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#d43533] hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Install New Addon
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  v{a.version}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" /> Licensed
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{a.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {a.activated ? "Module Enabled" : "Module Disabled"}
              </span>
              <button
                onClick={() => toggleActivate(a.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  a.activated
                    ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {a.activated ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
