import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { CartProvider } from "@/lib/context/cart-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { SiteHeader } from "@/components/layout/site-header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { StorefrontSaleAlert } from "@/components/layout/storefront-sale-alert"
import { StorefrontDynamicPopup } from "@/components/layout/storefront-dynamic-popup"
import { FloatingButtons } from "@/components/layout/floating-buttons"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Active eCommerce | Complete Shopping Solution",
  description: "A complete solution for E-commerce Business with exclusive features & super responsive layout.",
  icons: {
    icon: "/assets/img/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable, fontMono.variable, "font-sans")}
    >
      <body className="flex min-h-screen flex-col bg-white text-[#292933]">
        <AuthProvider>
          <CartProvider>
            <SiteHeader />
            <main className="flex-1 pb-14 lg:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
            <CartDrawer />
            <FloatingButtons />
            <StorefrontSaleAlert />
            <StorefrontDynamicPopup />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
