"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Store, FolderTree, Loader2 } from "lucide-react"

interface SearchProduct {
  id: string
  name: string
  slug: string
  thumbnail: string
  price: number
  discountedPrice: number
}

interface SearchCategory {
  id: string
  name: string
  slug: string
}

interface SearchShop {
  id: string
  name: string
  slug: string
  logo: string
  address: string
}

interface SearchDropdownProps {
  keyword: string
  onSelectKeyword: (kw: string) => void
  onClose: () => void
}

const POPULAR_SEARCHES = [
  "Smart Watch",
  "Sneakers",
  "Cotton Hoodie",
  "Wireless Earbuds",
  "Backpack",
]

export function SearchDropdown({ keyword, onSelectKeyword, onClose }: SearchDropdownProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    products: SearchProduct[]
    categories: SearchCategory[]
    shops: SearchShop[]
    keywords: string[]
  }>({
    products: [],
    categories: [],
    shops: [],
    keywords: [],
  })

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const trimmed = keyword.trim()
    if (!trimmed) {
      setData({ products: [], categories: [], shops: [], keywords: [] })
      setLoading(false)
      return
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/ajax-search?q=${encodeURIComponent(trimmed)}`)
        if (res.ok) {
          const result = await res.json()
          setData({
            products: result.products || [],
            categories: result.categories || [],
            shops: result.shops || [],
            keywords: result.keywords || [],
          })
        }
      } catch (err) {
        console.error("Failed to fetch search suggestions", err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [keyword])

  const hasResults =
    data.products.length > 0 ||
    data.categories.length > 0 ||
    data.shops.length > 0 ||
    data.keywords.length > 0

  return (
    <div
      className="absolute top-full left-0 z-50 mt-1.5 w-full max-h-[460px] overflow-y-auto rounded-md border border-gray-100 bg-white p-3 shadow-2xl"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 1. Default: Popular Searches when keyword is empty */}
      {!keyword.trim() && (
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Popular Searches
          </div>
          <div className="flex flex-col gap-1">
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={() => {
                  onSelectKeyword(item)
                  onClose()
                }}
                className="flex items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-gray-700 hover:bg-red-50 hover:text-[#d43533]"
              >
                <Search className="h-3 w-3 text-gray-400" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Loading Spinner */}
      {keyword.trim() && loading && (
        <div className="flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-[#d43533]" />
          <span className="ml-2 text-xs">Searching...</span>
        </div>
      )}

      {/* 3. Empty Results */}
      {keyword.trim() && !loading && !hasResults && (
        <div className="py-6 text-center text-xs text-gray-500">
          Sorry, nothing found for <strong className="text-gray-800">&quot;{keyword}&quot;</strong>
        </div>
      )}

      {/* 4. Active Results List */}
      {keyword.trim() && !loading && hasResults && (
        <div className="space-y-4">
          {/* Keyword suggestions */}
          {data.keywords.length > 0 && (
            <div>
              <div className="mb-1.5 bg-[#f8f9fb] px-2 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Popular Suggestions
              </div>
              <ul className="divide-y divide-gray-50 text-xs">
                {data.keywords.map((kw, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        onSelectKeyword(kw)
                        onClose()
                      }}
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-gray-700 hover:text-[#d43533]"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span>{kw}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Category Suggestions */}
          {data.categories.length > 0 && (
            <div>
              <div className="mb-1.5 bg-[#f8f9fb] px-2 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Category Suggestions
              </div>
              <ul className="divide-y divide-gray-50 text-xs">
                {data.categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/category/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-2 px-2 py-1.5 text-gray-700 hover:text-[#d43533]"
                    >
                      <FolderTree className="h-3.5 w-3.5 text-gray-400" />
                      <span>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Results */}
          {data.products.length > 0 && (
            <div>
              <div className="mb-1.5 bg-[#f8f9fb] px-2 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Products
              </div>
              <ul className="divide-y divide-gray-100 text-xs">
                {data.products.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 p-1.5 rounded hover:bg-gray-50"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                        <Image
                          src={p.thumbnail || "/assets/img/placeholder.jpg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-800 group-hover:text-[#d43533]">
                          {p.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs">
                          {p.discountedPrice < p.price && (
                            <del className="text-[11px] text-gray-400">
                              ${p.price.toFixed(2)}
                            </del>
                          )}
                          <span className="font-bold text-[#d43533]">
                            ${p.discountedPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shops */}
          {data.shops.length > 0 && (
            <div>
              <div className="mb-1.5 bg-[#f8f9fb] px-2 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Shops
              </div>
              <ul className="divide-y divide-gray-100 text-xs">
                {data.shops.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/shop/${s.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 p-1.5 rounded hover:bg-gray-50"
                    >
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-200">
                        <Image
                          src={s.logo || "/assets/img/placeholder.jpg"}
                          alt={s.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-gray-800 group-hover:text-[#d43533]">
                          {s.name}
                        </p>
                        <p className="truncate text-[11px] text-gray-400">
                          {s.address}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
