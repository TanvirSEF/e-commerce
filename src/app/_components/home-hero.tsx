"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft } from "lucide-react"

const HERO_SLIDERS = [
  {
    id: 1,
    title: "Mega Electronics & Gadgets Sale",
    subtitle: "Up to 50% OFF on Top Brand Smart Watches & Earbuds",
    image: "/assets/img/placeholder.jpg",
    link: "/products?category=consumer-electronics",
    btnText: "Shop Now",
  },
  {
    id: 2,
    title: "Exclusive Fashion Collection",
    subtitle: "Premium Men & Women Apparel with Free Nationwide Shipping",
    image: "/assets/img/placeholder-rect.jpg",
    link: "/products?category=women-clothing-fashion",
    btnText: "Explore Collection",
  },
]

const SIDEBAR_CATEGORIES = [
  { name: "Women Clothing & Fashion", slug: "women-clothing-fashion", icon: "👗", count: 120 },
  { name: "Men Clothing & Fashion", slug: "men-clothing-fashion", icon: "👔", count: 95 },
  { name: "Computer & Accessories", slug: "computer-accessories", icon: "💻", count: 80 },
  { name: "Cellphones & Tabs", slug: "cellphones-tabs", icon: "📱", count: 64 },
  { name: "Consumer Electronics", slug: "consumer-electronics", icon: "🎧", count: 110 },
  { name: "Beauty, Health & Hair", slug: "beauty-health-hair", icon: "💄", count: 45 },
  { name: "Sports & Outdoor", slug: "sports-outdoor", icon: "⚽", count: 38 },
  { name: "Home & Garden", slug: "home-garden", icon: "🏡", count: 52 },
]

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDERS.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDERS.length) % HERO_SLIDERS.length)
  }

  return (
    <section className="bg-gray-50/50 py-4">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="flex gap-4">
          {/* Left Category Menu (Visible on Desktop >= 1200px) */}
          <div className="hidden w-[260px] shrink-0 xl:block">
            <div className="h-full rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                <span className="text-xs font-bold tracking-wide text-gray-800 uppercase">
                  Top Categories
                </span>
              </div>
              <ul className="divide-y divide-gray-50 py-1">
                {SIDEBAR_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="group flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 transition-colors hover:bg-red-50/60 hover:text-[#d43533]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{cat.icon}</span>
                        <span className="font-medium group-hover:font-semibold">{cat.name}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#d43533]" />
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
          </div>

          {/* Right Hero Slider */}
          <div className="relative h-[220px] flex-1 overflow-hidden rounded-md border border-gray-100 bg-gray-100 sm:h-[320px] lg:h-[420px]">
            {HERO_SLIDERS.map((slide, index) => (
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
                      e.currentTarget.src = "/assets/img/placeholder-rect.jpg"
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
              {HERO_SLIDERS.map((_, idx) => (
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
