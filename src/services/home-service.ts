import { db } from "../db"
import {
  products,
  categories,
  brands,
  shops,
  flashDeals,
  coupons,
  preorderProducts,
  auctionProducts,
  businessSettings,
} from "../db/schema"
import { eq, desc, and, isNull, inArray } from "drizzle-orm"
import type { ProductCardProps } from "@/components/product/product-card"

export interface CategoryWithChildren {
  id: number
  name: string
  slug: string
  icon: string | null
  banner: string | null
  featured: boolean
  children: { id: number; name: string; slug: string }[]
}

export interface HomeSliderItem {
  id: number
  title: string
  subtitle: string
  image: string
  link: string
  btnText: string
}

export interface FlashDealData {
  id: number
  title: string
  slug: string
  endDate: number // ms timestamp
  banner: string
  products: ProductCardProps[]
}

export interface TopSellerItem {
  id: number
  name: string
  slug: string
  logo: string
  rating: number
  reviewCount: number
  isVerified: boolean
}

export interface TopBrandItem {
  id: number
  name: string
  slug: string
  logo: string
}

export interface HomeCouponItem {
  id: number
  code: string
  discount: number
  discountType: string
}

export interface HomePreorderItem {
  id: number
  name: string
  slug: string
  price: number
  prepaymentAmount: number
  thumbnail: string
}

export interface HomeAuctionItem {
  id: number
  name: string
  slug: string
  startingBid: number
  currentBid: number
  thumbnail: string
}

export interface HomeCategorySection {
  id: number
  name: string
  slug: string
  subcategories: { name: string; slug: string }[]
  products: ProductCardProps[]
  accentColor: string
}

export interface HomePageData {
  hero: {
    categories: CategoryWithChildren[]
    sliders: HomeSliderItem[]
  }
  flashDeal: FlashDealData | null
  todaysDeals: ProductCardProps[]
  featuredCategories: { id: number; name: string; slug: string; icon: string; banner: string }[]
  featuredProducts: ProductCardProps[]
  bestSellingProducts: ProductCardProps[]
  categorySections: HomeCategorySection[]
  topSellers: TopSellerItem[]
  topBrands: TopBrandItem[]
  coupons: HomeCouponItem[]
  preorders: HomePreorderItem[]
  auctions: HomeAuctionItem[]
}

function formatProductCard(p: any): ProductCardProps {
  const price = Number(p.unitPrice) || 0
  const discount = Number(p.discount) || 0
  let finalPrice = price
  let discountPercent: number | undefined = undefined

  if (p.discountType === "percent" && discount > 0) {
    discountPercent = Math.round(discount)
    finalPrice = Math.max(0, price - (price * discount) / 100)
  } else if (p.discountType === "amount" && discount > 0) {
    finalPrice = Math.max(0, price - discount)
    discountPercent = price > 0 ? Math.round((discount / price) * 100) : undefined
  }

  let badge: string | undefined = undefined
  if (p.todaysDeal) badge = "TODAY"
  else if (p.featured) badge = "HOT"
  else if (discountPercent && discountPercent > 0) badge = `${discountPercent}% OFF`

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    thumbnail: p.thumbnailImg || "/assets/img/placeholder.jpg",
    price: finalPrice,
    originalPrice: finalPrice < price ? price : undefined,
    discountPercent,
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.numOfReviews) || 0,
    badge,
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [
      allCats,
      allProducts,
      flashDealsList,
      allShops,
      allBrands,
      allCoupons,
      preorderList,
      auctionList,
      sliderSettings,
    ] = await Promise.all([
      db.select().from(categories).orderBy(categories.orderLevel, categories.name),
      db.select().from(products).where(eq(products.published, true)),
      db.select().from(flashDeals).where(eq(flashDeals.status, true)).limit(1),
      db.select().from(shops).orderBy(desc(shops.rating)),
      db.select().from(brands).orderBy(desc(brands.top), brands.name),
      db.select().from(coupons),
      db.select().from(preorderProducts).limit(6),
      db.select().from(auctionProducts).limit(4),
      db.select().from(businessSettings).where(eq(businessSettings.type, "home_slider_images")),
    ])

    // 1. Hero Categories (Parent categories with children)
    const parentCats = allCats.filter((c) => !c.parentId)
    const heroCategories: CategoryWithChildren[] = parentCats.map((parent) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      icon: parent.icon,
      banner: parent.banner,
      featured: parent.featured,
      children: allCats
        .filter((child) => child.parentId === parent.id)
        .map((child) => ({ id: child.id, name: child.name, slug: child.slug })),
    }))

    // 2. Sliders
    const heroSliders: HomeSliderItem[] = [
      {
        id: 1,
        title: "Mega Electronics & Gadgets Sale",
        subtitle: "Up to 50% OFF on Top Brand Smart Watches & Earbuds",
        image: "/assets/img/placeholder.jpg",
        link: "/products?category=smartphone-accessories",
        btnText: "Shop Now",
      },
      {
        id: 2,
        title: "Exclusive Fashion Collection",
        subtitle: "Premium Men & Women Apparel with Free Nationwide Shipping",
        image: "/assets/img/placeholder-rect.jpg",
        link: "/products?category=men-clothing-fashion",
        btnText: "Explore Collection",
      },
      {
        id: 3,
        title: "Home & Kitchen Appliances Mega Fest",
        subtitle: "Get Genuine Kitchenwares with Official 1-Year Warranty",
        image: "/assets/img/placeholder-rect.jpg",
        link: "/products?category=kitchen-dining",
        btnText: "Discover Deals",
      },
    ]

    // 3. Flash Deal
    let flashDeal: FlashDealData | null = null
    if (flashDealsList.length > 0) {
      const fd = flashDealsList[0]
      // Pick products with discount or featured
      const dealProds = allProducts
        .filter((p) => Number(p.discount) > 0 || p.featured)
        .slice(0, 6)
        .map(formatProductCard)

      // Ensure endDate is in ms timestamp
      let endTimestamp = Number(fd.endDate)
      if (endTimestamp < 10000000000) {
        endTimestamp *= 1000 // Convert Unix seconds to milliseconds
      }
      // If end date has passed, default to a future active timestamp for live display
      if (endTimestamp < Date.now()) {
        endTimestamp = Date.now() + 7 * 24 * 60 * 60 * 1000
      }

      flashDeal = {
        id: fd.id,
        title: fd.title,
        slug: fd.slug,
        endDate: endTimestamp,
        banner: fd.banner || "/assets/img/placeholder-rect.jpg",
        products: dealProds,
      }
    }

    // 4. Today's Deals
    const todaysDeals = allProducts
      .filter((p) => p.todaysDeal)
      .slice(0, 8)
      .map(formatProductCard)

    // 5. Featured Categories
    const featuredCategories = allCats
      .filter((c) => c.featured)
      .slice(0, 8)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || "/assets/img/placeholder.jpg",
        banner: c.banner || "/assets/img/placeholder-rect.jpg",
      }))

    // 6. Featured Products
    const featuredProducts = allProducts
      .filter((p) => p.featured)
      .slice(0, 10)
      .map(formatProductCard)

    // 7. Best Selling Products (Sorted by numOfSale DESC)
    const bestSellingProducts = [...allProducts]
      .sort((a, b) => (Number(b.numOfSale) || 0) - (Number(a.numOfSale) || 0))
      .slice(0, 10)
      .map(formatProductCard)

    // 8. Category Showcase Sections (Top parent categories that have products)
    const accentColors = ["#3490f3", "#d43533", "#10b981", "#8b5cf6"]
    const categorySections: HomeCategorySection[] = []

    for (const parent of parentCats.slice(0, 4)) {
      const childIds = allCats.filter((c) => c.parentId === parent.id).map((c) => c.id)
      const allowedCatIds = [parent.id, ...childIds]
      const catProds = allProducts.filter((p) => p.categoryId && allowedCatIds.includes(p.categoryId))

      if (catProds.length > 0) {
        categorySections.push({
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          subcategories: allCats
            .filter((c) => c.parentId === parent.id)
            .slice(0, 5)
            .map((c) => ({ name: c.name, slug: c.slug })),
          products: catProds.slice(0, 5).map(formatProductCard),
          accentColor: accentColors[categorySections.length % accentColors.length],
        })
      }
    }

    // 9. Top Sellers (Shops)
    const topSellers: TopSellerItem[] = allShops.slice(0, 8).map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      logo: s.logo || "/assets/img/placeholder.jpg",
      rating: Number(s.rating) || 4.8,
      reviewCount: Number(s.numOfReviews) || 0,
      isVerified: Boolean(s.verificationStatus),
    }))

    // 10. Top Brands
    const topBrands: TopBrandItem[] = allBrands.slice(0, 12).map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo || "/assets/img/placeholder.jpg",
    }))

    // 11. Coupons
    const couponsList: HomeCouponItem[] = allCoupons.slice(0, 4).map((c) => ({
      id: c.id,
      code: c.code,
      discount: Number(c.discount) || 0,
      discountType: c.discountType || "amount",
    }))

    // 12. Preorder Products
    const preorders: HomePreorderItem[] = preorderList.map((pr) => ({
      id: pr.id,
      name: pr.name,
      slug: pr.slug,
      price: Number(pr.price) || 0,
      prepaymentAmount: Number(pr.prepaymentAmount) || 0,
      thumbnail: pr.thumbnail || "/assets/img/placeholder.jpg",
    }))

    // 13. Auction Products
    const auctions: HomeAuctionItem[] = auctionList.map((auc) => ({
      id: auc.id,
      name: auc.name,
      slug: auc.slug,
      startingBid: Number(auc.startingBid) || 0,
      currentBid: Number(auc.currentBid) || Number(auc.startingBid) || 0,
      thumbnail: auc.thumbnail || "/assets/img/placeholder.jpg",
    }))

    return {
      hero: {
        categories: heroCategories,
        sliders: heroSliders,
      },
      flashDeal,
      todaysDeals,
      featuredCategories,
      featuredProducts,
      bestSellingProducts,
      categorySections,
      topSellers,
      topBrands,
      coupons: couponsList,
      preorders,
      auctions,
    }
  } catch (err) {
    console.error("Error in getHomePageData:", err)
    return {
      hero: { categories: [], sliders: [] },
      flashDeal: null,
      todaysDeals: [],
      featuredCategories: [],
      featuredProducts: [],
      bestSellingProducts: [],
      categorySections: [],
      topSellers: [],
      topBrands: [],
      coupons: [],
      preorders: [],
      auctions: [],
    }
  }
}
