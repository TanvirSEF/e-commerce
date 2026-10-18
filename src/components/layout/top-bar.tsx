"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Phone, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/context/language-context"
import { useCurrency } from "@/lib/context/currency-context"

interface TopBarProps {
  showLanguageSwitcher?: boolean
  showCurrencySwitcher?: boolean
}

export function TopBar({
  showLanguageSwitcher = true,
  showCurrencySwitcher = true,
}: TopBarProps) {
  const { currentLanguage, languages, setLanguage, t } = useLanguage()
  const { currentCurrency, currencies, setCurrency } = useCurrency()
  const [langOpen, setLangOpen] = useState(false)
  const [currOpen, setCurrOpen] = useState(false)
  const [sellerOpen, setSellerOpen] = useState(false)

  const activeLanguages = languages.filter((l) => l.status !== false)
  const activeCurrencies = currencies.filter((c) => c.status !== false)

  return (
    <div className="border-b border-[#f0f0f0] bg-white text-[12px] text-[#292933]">
      <div className="mx-auto flex h-[35px] max-w-[1240px] items-center justify-between px-4">
        {/* Left Section: Language & Currency */}
        <div className="flex items-center gap-5">
          {/* Language Switcher */}
          {showLanguageSwitcher && activeLanguages.length > 0 && (
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
                <span>{currentLanguage.name}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 min-w-[130px] rounded border border-gray-100 bg-white py-1 shadow-md">
                  {activeLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${
                        currentLanguage.code === lang.code ? "font-semibold text-[#d43533]" : "text-gray-700"
                      }`}
                    >
                      <span>{lang.name}</span>
                      {lang.rtl && <span className="text-[10px] text-gray-400">RTL</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Currency Switcher */}
          {showCurrencySwitcher && activeCurrencies.length > 0 && (
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
                <div className="absolute top-full left-0 z-50 mt-1 min-w-[180px] rounded border border-gray-100 bg-white py-1 shadow-md">
                  {activeCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setCurrency(curr.code)
                        setCurrOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] hover:bg-gray-50 ${
                        currentCurrency.code === curr.code ? "font-semibold text-[#d43533]" : "text-gray-700"
                      }`}
                    >
                      <span>{curr.name}</span>
                      <span className="font-semibold text-gray-500">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
              <span>{t("Become a Seller !")}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {sellerOpen && (
              <div className="absolute top-full right-0 z-50 mt-1 min-w-[130px] rounded border border-gray-100 bg-white py-1 shadow-md">
                <Link
                  href="/seller/login"
                  onClick={() => setSellerOpen(false)}
                  className="block px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  {t("Login to Seller")}
                </Link>
                <Link
                  href="/seller/register"
                  onClick={() => setSellerOpen(false)}
                  className="block px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-[#d43533]"
                >
                  {t("Apply Now")}
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
            <span className="hidden md:inline text-gray-500">{t("Helpline:")}</span>
            <span className="font-semibold text-gray-800">+880 1700-000000</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
