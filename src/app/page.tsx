import React from "react"
import { HomeFeaturesBar } from "./_components/home-features-bar"
import { HomeHero } from "./_components/home-hero"
import { FlashDealSection } from "./_components/flash-deal-section"
import { FeaturedCategories } from "./_components/featured-categories"
import { PromoBanners } from "./_components/promo-banners"
import { BestSellingSection } from "./_components/best-selling-section"
import { HomeCategoryProducts } from "./_components/home-category-products"
import type { ProductCardProps } from "@/components/product/product-card"
import { getProducts } from "@/lib/data-service"

// Sample Data for Computer & Accessories
const COMPUTER_PRODUCTS: ProductCardProps[] = [
  {
    id: "comp-1",
    name: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
    slug: "mechanical-gaming-keyboard-rgb",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 2200,
    originalPrice: 2800,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 37,
  },
  {
    id: "comp-2",
    name: "Ergonomic Optical Gaming Mouse 7200 DPI RGB Breathing Light",
    slug: "ergonomic-optical-gaming-mouse",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 850,
    originalPrice: 1200,
    discountPercent: 29,
    rating: 4.9,
    reviewCount: 52,
  },
  {
    id: "comp-3",
    name: "1080P Full HD Webcam with Built-in Microphone for Streaming",
    slug: "1080p-full-hd-webcam",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1550,
    originalPrice: 2100,
    discountPercent: 26,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: "comp-4",
    name: "USB 3.0 High-Speed External Hard Drive Enclosure 2.5 inch",
    slug: "usb-3-external-hard-drive-enclosure",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 450,
    originalPrice: 650,
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 44,
  },
  {
    id: "comp-5",
    name: "Aluminum Laptop Cooling Pad Stand with Dual Silent Fans",
    slug: "aluminum-laptop-cooling-pad",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1100,
    originalPrice: 1500,
    discountPercent: 26,
    rating: 4.8,
    reviewCount: 23,
  },
]

// Sample Data for Fashion & Apparel
const FASHION_PRODUCTS: ProductCardProps[] = [
  {
    id: "fash-1",
    name: "Men Regular Fit Denim Jeans Stretchable Blue Trouser",
    slug: "men-regular-fit-denim-jeans",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1650,
    originalPrice: 2400,
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 65,
  },
  {
    id: "fash-2",
    name: "Women Embroidered Georgette Semi-Stitched Salwar Suit",
    slug: "women-embroidered-salwar-suit",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 2450,
    originalPrice: 3500,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: "fash-3",
    name: "Pure Cotton Casual Polo T-Shirt Solid Color for Men",
    slug: "pure-cotton-casual-polo-shirt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 650,
    originalPrice: 950,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: "fash-4",
    name: "Women Stylish Shoulder Handbag with Detachable Crossbody Strap",
    slug: "women-stylish-shoulder-handbag",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1850,
    originalPrice: 2600,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 29,
  },
  {
    id: "fash-5",
    name: "Classic Genuine Leather Formal Reversible Belt for Men",
    slug: "classic-genuine-leather-formal-belt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 850,
    originalPrice: 1300,
    discountPercent: 34,
    rating: 4.8,
    reviewCount: 35,
  },
]

export default async function HomePage() {
  const compRes = await getProducts({ category: "computer-accessories", limit: 5 })
  const computerProducts: ProductCardProps[] = compRes.data.length ? compRes.data : COMPUTER_PRODUCTS

  const fashRes = await getProducts({ category: "men-clothing-fashion", limit: 5 })
  const fashionProducts: ProductCardProps[] = fashRes.data.length ? fashRes.data : FASHION_PRODUCTS

  return (
    <div className="flex flex-col gap-2">
      {/* 1. Value Proposition Features Bar */}
      <HomeFeaturesBar />

      {/* 2. Hero Section: Category Menu + Slider */}
      <HomeHero />

      {/* 3. Flash Deals with Live Countdown */}
      <FlashDealSection />

      {/* 4. Featured Categories Grid */}
      <FeaturedCategories />

      {/* 5. Promotional Banners Grid */}
      <PromoBanners />

      {/* 6. Best Selling Products */}
      <BestSellingSection />

      {/* 7. Category Showcase: Computer & Accessories */}
      <HomeCategoryProducts
        title="Computer & Accessories"
        slug="computer-accessories"
        subcategories={[
          { name: "Keyboards & Mice", slug: "keyboards-mice" },
          { name: "Storage & Drives", slug: "storage-drives" },
          { name: "Webcams", slug: "webcams" },
          { name: "Laptop Accessories", slug: "laptop-accessories" },
        ]}
        products={computerProducts}
        accentColor="#3490f3"
      />

      {/* 8. Category Showcase: Clothing & Fashion */}
      <HomeCategoryProducts
        title="Clothing & Fashion"
        slug="fashion"
        subcategories={[
          { name: "Men Jeans", slug: "men-jeans" },
          { name: "Women Suits", slug: "women-suits" },
          { name: "Polo T-Shirts", slug: "polo-tshirts" },
          { name: "Bags & Accessories", slug: "bags-accessories" },
        ]}
        products={fashionProducts}
        accentColor="#d43533"
      />
    </div>
  )
}
