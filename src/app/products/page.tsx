import React from "react"
import type { Metadata } from "next"
import { ProductCatalogView } from "./_components/product-catalog-view"
import type { ProductCardProps } from "@/components/product/product-card"
import { getProducts } from "@/lib/data-service"

export const metadata: Metadata = {
  title: "Products Catalog | Active eCommerce",
  description: "Browse all authentic products with exclusive deals, discounts, and nationwide delivery.",
}

// Sample Catalog Products Collection
const CATALOG_PRODUCTS: (ProductCardProps & {
  categorySlug: string
  brandSlug?: string
  colorName?: string
})[] = [
  {
    id: "prod-1",
    name: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
    slug: "classic-mens-casual-shirt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1250,
    originalPrice: 1650,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 35,
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    colorName: "Blue",
  },
  {
    id: "prod-2",
    name: "T800 Ultra Smartwatch with Bluetooth Calling & Heart Rate",
    slug: "t800-ultra-smartwatch",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 48,
    categorySlug: "consumer-electronics",
    brandSlug: "apple",
    colorName: "Black",
  },
  {
    id: "prod-3",
    name: "M10 Wireless TWS Bluetooth Earbuds with Digital LED Display",
    slug: "m10-wireless-earbuds",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 450,
    originalPrice: 900,
    discountPercent: 50,
    rating: 4.7,
    reviewCount: 82,
    categorySlug: "consumer-electronics",
    brandSlug: "xiaomi",
    colorName: "Black",
  },
  {
    id: "prod-4",
    name: "Foldable Laptop Stand Aluminum Adjustable Height Cooling Holder",
    slug: "foldable-laptop-stand-aluminum",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 650,
    originalPrice: 1100,
    discountPercent: 41,
    rating: 4.9,
    reviewCount: 29,
    categorySlug: "computer-accessories",
    brandSlug: "samsung",
    colorName: "Gray",
  },
  {
    id: "prod-5",
    name: "Multi-Pocket Travel Backpack with USB Charging Port Waterproof",
    slug: "travel-backpack-usb-charging",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 19,
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    colorName: "Black",
  },
  {
    id: "prod-6",
    name: "Mechanical Gaming Keyboard RGB Backlit with Blue Switches",
    slug: "mechanical-gaming-keyboard-rgb",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 2200,
    originalPrice: 2800,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 37,
    categorySlug: "computer-accessories",
    brandSlug: "sony",
    colorName: "Black",
  },
  {
    id: "prod-7",
    name: "Ergonomic Optical Gaming Mouse 7200 DPI RGB Breathing Light",
    slug: "ergonomic-optical-gaming-mouse",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 850,
    originalPrice: 1200,
    discountPercent: 29,
    rating: 4.9,
    reviewCount: 52,
    categorySlug: "computer-accessories",
    brandSlug: "xiaomi",
    colorName: "Red",
  },
  {
    id: "prod-8",
    name: "Noise Cancelling Over-Ear Wireless Bluetooth Headphone Pro",
    slug: "noise-cancelling-wireless-headphone",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 94,
    categorySlug: "consumer-electronics",
    brandSlug: "sony",
    colorName: "Black",
  },
  {
    id: "prod-9",
    name: "Men Regular Fit Denim Jeans Stretchable Blue Trouser",
    slug: "men-regular-fit-denim-jeans",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1650,
    originalPrice: 2400,
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 65,
    categorySlug: "men-clothing-fashion",
    brandSlug: "nike",
    colorName: "Blue",
  },
  {
    id: "prod-10",
    name: "Women Embroidered Georgette Semi-Stitched Salwar Suit",
    slug: "women-embroidered-salwar-suit",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 2450,
    originalPrice: 3500,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 41,
    categorySlug: "women-clothing-fashion",
    brandSlug: "adidas",
    colorName: "Red",
  },
  {
    id: "prod-11",
    name: "Breathable Lightweight Athletic Running Shoes for Men & Women",
    slug: "breathable-athletic-running-shoes",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1450,
    originalPrice: 2100,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 53,
    categorySlug: "sports-outdoor",
    brandSlug: "adidas",
    colorName: "White",
  },
  {
    id: "prod-12",
    name: "Fast Charging 20000mAh Power Bank with Dual USB Ports",
    slug: "fast-charging-20000mah-power-bank",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1250,
    originalPrice: 1750,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 112,
    categorySlug: "cellphones-tabs",
    brandSlug: "xiaomi",
    colorName: "White",
  },
]

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    keyword?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams?.category || ""
  const keyword = resolvedParams?.keyword || ""

  const dbRes = await getProducts({
    category: category || undefined,
    q: keyword || undefined,
    limit: 50,
  })

  const products = dbRes.data.length
    ? dbRes.data.map((p) => ({
        ...p,
        categorySlug: p.categorySlug,
        brandSlug: p.brandSlug,
        colorName: p.colors?.[0]?.name,
      }))
    : CATALOG_PRODUCTS

  return (
    <ProductCatalogView
      initialProducts={products}
      initialCategory={category}
      initialKeyword={keyword}
    />
  )
}
