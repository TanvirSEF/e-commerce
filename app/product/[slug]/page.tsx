import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductGallery } from "./_components/product-gallery"
import { ProductInfo, type ProductDetailsData } from "./_components/product-info"
import { ProductTabs } from "./_components/product-tabs"
import { ProductRelated } from "./_components/product-related"
import type { ProductCardProps } from "@/components/product/product-card"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, " ")
  return {
    title: `${title.charAt(0).toUpperCase() + title.slice(1)} | Active eCommerce`,
    description: `Buy ${title} online at best price with cash on delivery and fast express delivery.`,
  }
}

// Sample Full Product Details Data Dictionary
const SAMPLE_PRODUCT_DATA: Record<
  string,
  ProductDetailsData & {
    categoryName: string
    categorySlug: string
    images: string[]
    description: string
    specifications: { label: string; value: string }[]
    reviews: { id: string; userName: string; date: string; rating: number; comment: string }[]
  }
> = {
  default: {
    id: "prod-detailed",
    name: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
    slug: "classic-mens-casual-shirt",
    sku: "SHIRT-CTN-001",
    brandName: "Nike",
    brandSlug: "nike",
    categoryName: "Men Clothing & Fashion",
    categorySlug: "men-clothing-fashion",
    price: 1250,
    originalPrice: 1650,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 35,
    stock: 25,
    thumbnail: "/assets/img/placeholder.jpg",
    images: [
      "/assets/img/placeholder.jpg",
      "/assets/img/placeholder-rect.jpg",
      "/assets/img/placeholder.jpg",
    ],
    colors: [
      { name: "Navy Blue", hex: "#1e3a8a" },
      { name: "Pure White", hex: "#ffffff" },
      { name: "Crimson Red", hex: "#dc2626" },
      { name: "Charcoal Black", hex: "#1f2937" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    clubPoints: 25,
    sellerName: "Active Fashion Outlet",
    sellerSlug: "active-fashion-outlet",
    description:
      "Crafted from 100% premium long-staple breathable cotton, this slim-fit casual shirt offers unmatched comfort throughout the day. Features a classic spread collar, button-down front, and durable stitching designed for casual outings or work environments. Easy machine wash and shrink-resistant.",
    specifications: [
      { label: "Material", value: "100% Combed Cotton" },
      { label: "Fit Type", value: "Slim Fit" },
      { label: "Collar Style", value: "Spread Collar" },
      { label: "Sleeve Length", value: "Long Sleeve with Adjustable Cuffs" },
      { label: "Care Instructions", value: "Machine Wash Warm / Gentle Cycle" },
      { label: "Country of Origin", value: "Bangladesh" },
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Tanvir Ahmed",
        date: "2 days ago",
        rating: 5,
        comment: "Excellent fabric quality and perfect fitting. Highly recommended for daily office wear!",
      },
      {
        id: "rev-2",
        userName: "Rashidul Islam",
        date: "1 week ago",
        rating: 5,
        comment: "Very fast delivery in Dhaka, nicely packed, and color exactly matches the photo.",
      },
    ],
  },
}

const RELATED_PRODUCTS: ProductCardProps[] = [
  {
    id: "rel-1",
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
    id: "rel-2",
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
    id: "rel-3",
    name: "Classic Genuine Leather Formal Reversible Belt for Men",
    slug: "classic-genuine-leather-formal-belt",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 850,
    originalPrice: 1300,
    discountPercent: 34,
    rating: 4.8,
    reviewCount: 35,
  },
  {
    id: "rel-4",
    name: "Multi-Pocket Travel Backpack with USB Charging Port",
    slug: "travel-backpack-usb-charging",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "rel-5",
    name: "Breathable Lightweight Athletic Running Shoes for Men",
    slug: "breathable-athletic-running-shoes",
    thumbnail: "/assets/img/placeholder.jpg",
    price: 1450,
    originalPrice: 2100,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 53,
  },
]

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = {
    ...SAMPLE_PRODUCT_DATA.default,
    slug,
    name:
      slug !== "classic-mens-casual-shirt"
        ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : SAMPLE_PRODUCT_DATA.default.name,
  }

  return (
    <div className="bg-gray-50/40 py-5">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#d43533]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-[#d43533]"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* Top Product Section: Left Gallery, Right Details */}
        <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Gallery (5 Cols) */}
            <div className="lg:col-span-5">
              <ProductGallery images={product.images} title={product.name} />
            </div>

            {/* Right: Info & Controls (7 Cols) */}
            <div className="lg:col-span-7">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <ProductTabs
          description={product.description}
          specifications={product.specifications}
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* Related Products Carousel / Grid */}
        <ProductRelated products={RELATED_PRODUCTS} />
      </div>
    </div>
  )
}
