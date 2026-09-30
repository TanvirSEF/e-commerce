"use client"

import React from "react"
import Link from "next/link"
import {
  Layers,
  Bell,
  MessageSquare,
  Mail,
  Send,
  BookOpen,
  ShoppingBag,
  Eye,
  Users,
  Zap,
  Ticket,
} from "lucide-react"

const MARKETING_MODULES = [
  {
    title: "Dynamic Popups",
    description: "Create interactive promotional popups and lightbox modals.",
    href: "/admin/marketing/dynamic-popups",
    icon: Layers,
    color: "bg-red-50 text-[#d43533]",
  },
  {
    title: "Custom Alerts",
    description: "Configure floating corner announcements and flash deal alerts.",
    href: "/admin/marketing/custom-alerts",
    icon: Bell,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Custom Sale Alert",
    description: "Trigger live purchase social proof notifications for browsing visitors.",
    href: "/admin/marketing/custom-sale-alerts",
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Custom Product Visitors",
    description: "Display simulated live visitor counters on product detail pages.",
    href: "/admin/marketing/custom-product-visitors",
    icon: Eye,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Notifications",
    description: "Send broadcast push notifications to customer accounts.",
    href: "/admin/notifications",
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Subscribers",
    description: "View, manage, and export your newsletter subscription list.",
    href: "/admin/subscribers",
    icon: Users,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Newsletters",
    description: "Broadcast email campaigns directly to your subscribers.",
    href: "/admin/newsletter",
    icon: Send,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Flash Deals",
    description: "Set up limited-time countdown sales campaigns.",
    href: "/admin/flash-deals",
    icon: Zap,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Coupons",
    description: "Manage promo discount codes, cart vouchers, and welcome deals.",
    href: "/admin/coupons",
    icon: Ticket,
    color: "bg-indigo-50 text-indigo-600",
  },
]

export function MarketingHubGrid() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-gray-900">Marketing Hub & Campaigns</h2>
        <p className="text-xs text-gray-500">
          Quickly access and manage all marketing channels and customer engagement tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKETING_MODULES.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#d43533] hover:shadow-xs transition-all group block"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#d43533] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
