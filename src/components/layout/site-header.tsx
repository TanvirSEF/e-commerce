"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { TopBanner } from "./top-banner"
import { TopBar } from "./top-bar"
import { MiddleHeader } from "./middle-header"
import { BottomNavbar } from "./bottom-navbar"
import { MobileSidebar } from "./mobile-sidebar"

import type { GeneralSettings } from "@/services/settings-service"

interface SiteHeaderProps {
  showLanguageSwitcher?: boolean
  showCurrencySwitcher?: boolean
  generalSettings?: GeneralSettings | null
}

export function SiteHeader({
  showLanguageSwitcher = true,
  showCurrencySwitcher = true,
  generalSettings,
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Hide storefront header inside admin panel and seller panel
  if (pathname.startsWith("/admin")) {
    return null
  }
  if (
    pathname.startsWith("/seller") &&
    !pathname.startsWith("/seller/login") &&
    !pathname.startsWith("/seller/register")
  ) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      <TopBanner />
      <TopBar
        showLanguageSwitcher={showLanguageSwitcher}
        showCurrencySwitcher={showCurrencySwitcher}
        helpline={generalSettings?.systemPhone}
      />
      <MiddleHeader
        onToggleMobileMenu={() => setMobileMenuOpen(true)}
        systemName={generalSettings?.systemName}
        systemLogo={generalSettings?.systemLogo}
      />
      <BottomNavbar />
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  )
}

export default SiteHeader
