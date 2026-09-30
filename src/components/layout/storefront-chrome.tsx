"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SiteHeader } from "./site-header"
import { Footer } from "./footer"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { StorefrontSaleAlert } from "./storefront-sale-alert"
import { StorefrontDynamicPopup } from "./storefront-dynamic-popup"
import { FloatingButtons } from "./floating-buttons"
import { CookieAlert } from "./cookie-alert"
import { cn } from "@/lib/utils"

interface StorefrontChromeProps {
  children: React.ReactNode
}

export function StorefrontChrome({ children }: StorefrontChromeProps) {
  const pathname = usePathname()

  // Clean document views: Invoices, shipping labels, thermal prints, and receipts
  // MUST NOT render ANY storefront header, footer, bottom nav, popups, or floating buttons
  const isDocumentOrPrint =
    pathname.startsWith("/invoice") ||
    pathname.startsWith("/shipping-label") ||
    pathname.startsWith("/pos/receipt") ||
    pathname.includes("bulk-invoice-print") ||
    pathname.includes("bulk-shipping-label-print")

  if (isDocumentOrPrint) {
    return (
      <main className="w-full min-h-screen bg-white print:bg-white print:m-0 print:p-0">
        {children}
      </main>
    )
  }

  // Admin & Seller portals have their own specialized shells
  const isAdminOrSeller =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/seller") &&
      !pathname.startsWith("/seller/login") &&
      !pathname.startsWith("/seller/register"))

  if (isAdminOrSeller) {
    return <main className="flex-1 w-full">{children}</main>
  }

  // Standard Storefront
  return (
    <>
      <SiteHeader />
      <main className={cn("flex-1 pb-14 lg:pb-0")}>{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <FloatingButtons />
      <StorefrontSaleAlert />
      <StorefrontDynamicPopup />
      <CookieAlert />
    </>
  )
}
