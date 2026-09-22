"use client"

import React, { useState } from "react"
import { TopBar } from "./top-bar"
import { MiddleHeader } from "./middle-header"
import { BottomNavbar } from "./bottom-navbar"
import { MobileSidebar } from "./mobile-sidebar"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      <TopBar />
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
