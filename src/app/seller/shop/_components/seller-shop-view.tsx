"use client"

import React from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { ShopBasicInfo } from "./shop-basic-info"
import { ShopBannerSettings } from "./shop-banner-settings"
import { ShopSocialLinks } from "./shop-social-links"
import type { shops } from "@/db/schema"

type ShopRow = typeof shops.$inferSelect

interface SellerShopViewProps {
  shop: ShopRow
}

export function SellerShopView({ shop }: SellerShopViewProps) {
  return (
    <div className="space-y-6">
      {/* Titlebar with (Visit Shop) link matching Laravel aiz-titlebar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
        <h1 className="text-xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
          Shop Settings
          <span className="text-sm font-normal text-gray-500">
            (
            <Link
              href={`/shop/${shop.slug}`}
              target="_blank"
              className="text-[#d43533] hover:underline inline-flex items-center gap-1 font-medium"
            >
              Visit Shop <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            )
          </span>
        </h1>
      </div>

      {/* 1. Basic Info */}
      <ShopBasicInfo
        shopId={shop.id}
        initialName={shop.name}
        initialLogo={shop.logo}
        initialPhone={shop.phone}
        initialAddress={shop.address}
        initialMetaTitle={shop.metaTitle}
        initialMetaDescription={shop.metaDescription}
      />

      {/* 2. Banner Settings */}
      <ShopBannerSettings
        shopId={shop.id}
        initialTopBanner={shop.topBanner}
      />

      {/* 3. Social Media Link */}
      <ShopSocialLinks
        shopId={shop.id}
        initialFacebook={shop.facebook}
        initialInstagram={shop.instagram}
        initialTwitter={shop.twitter}
        initialGoogle={shop.google}
        initialYoutube={shop.youtube}
      />
    </div>
  )
}
