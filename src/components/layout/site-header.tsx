"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { TopBanner } from "./top-banner"
import { TopBar } from "./top-bar"
import { MiddleHeader } from "./middle-header"
import { BottomNavbar } from "./bottom-navbar"
import { MobileSidebar } from "./mobile-sidebar"

interface SiteHeaderProps {
  showLanguageSwitcher?: boolean
  showCurrencySwitcher?: boolean
}

export function SiteHeader({
  showLanguageSwitcher = true,
  showCurrencySwitcher = true,
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
      />
      <MiddleHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />
      <BottomNavbar />
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  )
}

export default SiteHeader
