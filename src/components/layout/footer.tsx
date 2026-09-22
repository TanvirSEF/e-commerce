"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  if (pathname.startsWith("/admin")) {
    return null
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer className="mt-auto bg-[#1b1b28] text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800 bg-[#14141f] py-8">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div>
            <h3 className="text-base font-bold text-white md:text-lg">
              Subscribe to our Newsletter
            </h3>
            <p className="text-xs text-gray-400">
              Get the latest updates, deals, and exclusive discount coupons directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center">
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="h-10 w-full rounded-l border border-gray-700 bg-[#252538] pr-4 pl-10 text-xs text-white placeholder:text-gray-500 focus:border-[#d43533] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex h-10 items-center gap-1.5 rounded-r bg-[#d43533] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#9d1b1a]"
            >
              <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-[1240px] px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-10">
          {/* Column 1: About & Contacts */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#d43533]">
                Active<span className="text-white">Shop</span>
              </span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-gray-400">
              Complete eCommerce business solution with multi-vendor support, verified products, express delivery, and 24/7 dedicated customer care.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#d43533]" />
                <span>House #12, Road #4, Dhanmondi, Dhaka-1205</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#d43533]" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#d43533]" />
                <span>support@active-ecom.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li>
                <Link href="/support-policy" className="transition-colors hover:text-[#d43533]">
                  Support Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="transition-colors hover:text-[#d43533]">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-[#d43533]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[#d43533]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/seller-policy" className="transition-colors hover:text-[#d43533]">
                  Seller Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: My Account */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              My Account
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li>
                <Link href="/login" className="transition-colors hover:text-[#d43533]">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-[#d43533]">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wishlist" className="transition-colors hover:text-[#d43533]">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="transition-colors hover:text-[#d43533]">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="transition-colors hover:text-[#d43533]">
                  Be an Affiliate Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Be a Seller & Mobile App */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Be a Seller
            </h4>
            <p className="mb-3 text-xs text-gray-400">
              Reach millions of customers nationwide. Start selling your products today!
            </p>
            <Link
              href="/seller/register"
              className="mb-5 inline-block rounded bg-[#ffc519] px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-[#dbaa17]"
            >
              Apply as Seller
            </Link>

            <h4 className="mb-3 text-xs font-bold tracking-wider text-white uppercase">
              Follow Us
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252538] text-gray-300 transition-colors hover:bg-[#d43533] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252538] text-gray-300 transition-colors hover:bg-[#d43533] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252538] text-gray-300 transition-colors hover:bg-[#d43533] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252538] text-gray-300 transition-colors hover:bg-[#d43533] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer: Copyright & Payment Badges */}
      <div className="border-t border-gray-800 bg-[#101018] py-4 text-xs">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <div className="text-gray-500">
            © {new Date().getFullYear()} Active eCommerce CMS. All Rights Reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">Secured Payments with</span>
            <div className="flex items-center gap-1.5 font-semibold text-gray-400">
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-pink-400">bKash</span>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-orange-400">Nagad</span>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-blue-400">VISA</span>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-yellow-400">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
