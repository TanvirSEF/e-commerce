"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Layers } from "lucide-react"
import type { CategoryWithChildren, HomeSliderItem } from "@/services/home-service"

interface HomeHeroProps {
  categories: CategoryWithChildren[]
  sliders: HomeSliderItem[]
}

export function HomeHero({ categories = [], sliders = [] }: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredCatId, setHoveredCatId] = useState<number | null>(null)

  useEffect(() => {
    if (sliders.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [sliders.length])

  const nextSlide = () => {
    if (sliders.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % sliders.length)
  }

  const prevSlide = () => {
    if (sliders.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)
  }

  const activeHoveredCat = categories.find((c) => c.id === hoveredCatId)

  return (
    <section className="bg-gray-50/50 py-4">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="relative flex gap-4">
          {/* Left Category Menu (Visible on Desktop >= 1200px) */}
          <div
            className="relative hidden w-[260px] shrink-0 xl:block"
            onMouseLeave={() => setHoveredCatId(null)}
          >
            <div className="h-full rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                <Layers className="h-4 w-4 text-[#d43533]" />
                <span className="text-xs font-bold tracking-wide text-gray-800 uppercase">
                  Categories
                </span>
              </div>
              <ul className="divide-y divide-gray-50 py-1">
                {categories.slice(0, 8).map((cat) => (
                  <li
                    key={cat.id}
                    onMouseEnter={() => setHoveredCatId(cat.id)}
                  >
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`group flex items-center justify-between px-4 py-2.5 text-xs transition-colors ${
                        hoveredCatId === cat.id
                          ? "bg-red-50/70 text-[#d43533] font-semibold"
                          : "text-gray-700 hover:bg-red-50/60 hover:text-[#d43533]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {cat.icon ? (
                          <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                            <Image
                              src={cat.icon}
                              alt={cat.name}
                              fill
                              className="object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">•</span>
                        )}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {cat.children && cat.children.length > 0 && (
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#d43533]" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 p-2.5 text-center">
                <Link
                  href="/categories"
                  className="text-xs font-bold text-[#3490f3] hover:underline"
                >
                  View All Categories →
                </Link>
              </div>
            </div>

            {/* Flyout Subcategory Megamenu on Hover */}
            {activeHoveredCat && activeHoveredCat.children.length > 0 && (
              <div className="absolute top-0 left-[265px] z-50 min-h-[300px] w-[320px] rounded-md border border-gray-100 bg-white p-5 shadow-xl transition-all duration-150">
                <div className="mb-3 border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">
                    {activeHoveredCat.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">Explore subcategories</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeHoveredCat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/products?category=${sub.slug}`}
                      className="group flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#d43533]"
                    >
                      <span>{sub.name}</span>
                      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-[#d43533]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Hero Slider */}
          <div className="relative h-[220px] flex-1 overflow-hidden rounded-md border border-gray-100 bg-gray-100 sm:h-[320px] lg:h-[420px]">
            {sliders.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                {/* Background Image / Placeholder */}
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (!target.src.includes("placeholder-rect.jpg")) {
                        target.src = "/assets/img/placeholder-rect.jpg"
                      }
                    }}
                  />
                  {/* Subtle Dark Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
                </div>

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 text-white sm:px-12 lg:px-16">
                  <span className="mb-2 inline-block max-w-max rounded bg-[#ffc519] px-2.5 py-1 text-[11px] font-bold text-gray-950 uppercase shadow">
                    Special Offer
                  </span>
                  <h2 className="max-w-md text-lg font-extrabold sm:text-2xl lg:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2 max-w-sm text-xs text-gray-200 sm:text-sm">
                    {slide.subtitle}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-1 rounded bg-[#d43533] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#9d1b1a] hover:shadow-xl sm:text-sm"
                    >
                      <span>{slide.btnText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Arrows */}
            {sliders.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-800 shadow-md backdrop-blur transition-all hover:bg-white hover:text-[#d43533]"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-800 shadow-md backdrop-blur transition-all hover:bg-white hover:text-[#d43533]"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlide ? "w-6 bg-[#d43533]" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
