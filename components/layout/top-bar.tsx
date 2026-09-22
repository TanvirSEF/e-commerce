"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Phone, ChevronDown } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English", flag: "/assets/img/flags/en.png" },
  { code: "bd", name: "Bangla", flag: "/assets/img/flags/bd.png" },
]

const CURRENCIES = [
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "USD", symbol: "$", name: "US Dollar" },
]

export function TopBar() {
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0])
  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES[0])
  const [langOpen, setLangOpen] = useState(false)
  const [currOpen, setCurrOpen] = useState(false)
  const [sellerOpen, setSellerOpen] = useState(false)

  return (
    <div className="border-b border-[#f0f0f0] bg-white text-[12px] text-[#292933]">
      <div className="mx-auto flex h-[35px] max-w-[1240px] items-center justify-between px-4">
        {/* Left Section: Language & Currency */}
        <div className="flex items-center gap-5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangOpen(!langOpen)
                setCurrOpen(false)
                setSellerOpen(false)
              }}
              className="flex items-center gap-1.5 py-1 text-gray-700 transition-colors hover:text-[#d43533]"
            >
              <span>{currentLang.name}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {langOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 min-w-[120px] rounded border border-gray-100 bg-white py-1 shadow-md">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setCurrentLang(lang)
                      setLangOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${
                      currentLang.code === lang.code ? "font-semibold text-[#d43533]" : "text-gray-700"
                    }`}
                  >
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCurrOpen(!currOpen)
                setLangOpen(false)
                setSellerOpen(false)
              }}
              className="flex items-center gap-1 py-1 text-gray-700 transition-colors hover:text-[#d43533]"
            >
              <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {currOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded border border-gray-100 bg-white py-1 shadow-md">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setCurrentCurrency(curr)
                      setCurrOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${
                      currentCurrency.code === curr.code ? "font-semibold text-[#d43533]" : "text-gray-700"
                    }`}
                  >
                    <span>{curr.name}</span>
                    <span className="text-gray-400">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Helpline & Become a Seller */}
        <div className="flex items-center gap-5">
          {/* Become a Seller */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setSellerOpen(!sellerOpen)
                setLangOpen(false)
                setCurrOpen(false)
              }}
              className="flex items-center gap-1 py-1 font-medium text-gray-700 transition-colors hover:text-[#d43533]"
            >
              <span>Become a Seller !</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {sellerOpen && (
              <div className="absolute top-full right-0 z-50 mt-1 min-w-[130px] rounded border border-gray-100 bg-white py-1 shadow-md">
                <Link
                  href="/seller/login"
                  onClick={() => setSellerOpen(false)}
                  className="block px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  Login to Seller
                </Link>
                <Link
                  href="/seller/register"
                  onClick={() => setSellerOpen(false)}
                  className="block px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Helpline Phone */}
          <a
            href="tel:+880170000000"
            className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-[#d43533]"
          >
            <Phone className="h-3.5 w-3.5 text-[#d43533]" />
            <span className="hidden md:inline text-gray-500">Helpline:</span>
            <span className="font-semibold text-gray-800">+880 1700-000000</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
