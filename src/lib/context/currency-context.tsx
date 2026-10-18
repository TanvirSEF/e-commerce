"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

export interface CurrencyItem {
  id: number
  name: string
  symbol: string
  code: string
  exchangeRate: number
  isDefault?: boolean
  status?: boolean
  symbolFormat?: "symbol_first" | "symbol_last"
  numberOfDecimals?: number
}

export const DEFAULT_CURRENCIES: CurrencyItem[] = [
  {
    id: 1,
    name: "Bangladeshi Taka",
    symbol: "৳",
    code: "BDT",
    exchangeRate: 1,
    isDefault: true,
    symbolFormat: "symbol_first",
    numberOfDecimals: 0,
  },
  {
    id: 2,
    name: "US Dollar",
    symbol: "$",
    code: "USD",
    exchangeRate: 120,
    isDefault: false,
    symbolFormat: "symbol_first",
    numberOfDecimals: 2,
  },
  {
    id: 3,
    name: "Euro",
    symbol: "€",
    code: "EUR",
    exchangeRate: 130,
    isDefault: false,
    symbolFormat: "symbol_first",
    numberOfDecimals: 2,
  },
  {
    id: 4,
    name: "Indian Rupee",
    symbol: "₹",
    code: "INR",
    exchangeRate: 1.45,
    isDefault: false,
    symbolFormat: "symbol_first",
    numberOfDecimals: 2,
  },
]

interface CurrencyContextType {
  currentCurrency: CurrencyItem
  currencies: CurrencyItem[]
  setCurrency: (code: string) => void
  formatPrice: (amountInBase: number) => string
  convertPrice: (amountInBase: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = "active_ecom_currency"

export function CurrencyProvider({
  children,
  initialCurrencies = DEFAULT_CURRENCIES,
  defaultCurrencyCode,
  symbolFormat = "symbol_first",
  decimalSeparator = ".",
  numberOfDecimals,
}: {
  children: React.ReactNode
  initialCurrencies?: CurrencyItem[]
  defaultCurrencyCode?: string
  symbolFormat?: "symbol_first" | "symbol_last" | "symbol_amount" | "amount_symbol" | "symbol_space_amount" | "amount_space_symbol"
  decimalSeparator?: "." | ","
  numberOfDecimals?: number
}) {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(initialCurrencies)
  const defaultCurr = useMemo(() => {
    if (defaultCurrencyCode) {
      const byCode = initialCurrencies.find(
        (c) => c.code.toUpperCase() === defaultCurrencyCode.toUpperCase()
      )
      if (byCode) return byCode
    }
    return (
      initialCurrencies.find((c) => c.isDefault) ||
      initialCurrencies[0] ||
      DEFAULT_CURRENCIES[0]
    )
  }, [initialCurrencies, defaultCurrencyCode])

  const [currentCurrency, setCurrentCurrency] = useState<CurrencyItem>(defaultCurr)
  const isHydrated = React.useRef(false)

  // Keep currencies and rates in sync when admin updates them
  useEffect(() => {
    if (initialCurrencies && initialCurrencies.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencies(initialCurrencies)
      setCurrentCurrency((prev) => {
        const found = initialCurrencies.find(
          (c) => c.code.toUpperCase() === prev.code.toUpperCase()
        )
        return found || defaultCurr
      })
    }
  }, [initialCurrencies, defaultCurr])

  // Initialize from localStorage after hydration
  useEffect(() => {
    try {
      const storedCode = localStorage.getItem(STORAGE_KEY)
      if (storedCode) {
        const found = currencies.find(
          (c) => c.code.toUpperCase() === storedCode.toUpperCase()
        )
        if (found) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCurrentCurrency(found)
        }
      }
    } catch {
      // ignore localStorage errors (e.g. private mode)
    }
    isHydrated.current = true
  }, [currencies])

  const setCurrency = useCallback(
    (code: string) => {
      const found = currencies.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      )
      if (found) {
        setCurrentCurrency(found)
        try {
          localStorage.setItem(STORAGE_KEY, found.code)
        } catch {
          // ignore
        }
      }
    },
    [currencies]
  )

  const convertPrice = useCallback(
    (amountInBase: number): number => {
      const num = Number(amountInBase) || 0
      const rate = currentCurrency.exchangeRate > 0 ? currentCurrency.exchangeRate : 1
      return num / rate
    },
    [currentCurrency.exchangeRate]
  )

  const formatPrice = useCallback(
    (amountInBase: number): string => {
      const converted = convertPrice(amountInBase)
      const decimals =
        numberOfDecimals !== undefined
          ? numberOfDecimals
          : currentCurrency.numberOfDecimals !== undefined
            ? currentCurrency.numberOfDecimals
            : currentCurrency.code === "BDT"
              ? 0
              : 2

      let formattedNumber = converted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

      if (decimalSeparator === ",") {
        // Swap decimal dot to comma and comma thousands to dot
        formattedNumber = formattedNumber.replace(/,/g, "X").replace(/\./g, ",").replace(/X/g, ".")
      }

      const sym = currentCurrency.symbol
      const fmt = currentCurrency.symbolFormat || symbolFormat

      if (fmt === "amount_symbol") {
        return `${formattedNumber}${sym}`
      }
      if (fmt === "symbol_last" || fmt === "amount_space_symbol") {
        return `${formattedNumber} ${sym}`
      }
      if (fmt === "symbol_space_amount") {
        return `${sym} ${formattedNumber}`
      }
      // default: symbol_first / symbol_amount
      return `${sym}${formattedNumber}`
    },
    [convertPrice, currentCurrency, symbolFormat, decimalSeparator, numberOfDecimals]
  )

  const contextValue = useMemo<CurrencyContextType>(
    () => ({
      currentCurrency,
      currencies,
      setCurrency,
      formatPrice,
      convertPrice,
    }),
    [currentCurrency, currencies, setCurrency, formatPrice, convertPrice]
  )

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext)
  if (!context) {
    // Graceful fallback for non-provider render tree
    const defaultCurr = DEFAULT_CURRENCIES[0]
    return {
      currentCurrency: defaultCurr,
      currencies: DEFAULT_CURRENCIES,
      setCurrency: () => {},
      formatPrice: (amountInBase: number) => `৳${Number(amountInBase || 0).toLocaleString("en-BD")}`,
      convertPrice: (amountInBase: number) => Number(amountInBase || 0),
    }
  }
  return context
}
