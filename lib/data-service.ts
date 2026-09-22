import connectToDatabase from "./mongodb"
import ProductModel from "./models/Product"
import CategoryModel from "./models/Category"
import BrandModel from "./models/Brand"
import OrderModel from "./models/Order"
import {
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_PRODUCTS,
  SEED_FLASH_DEALS,
  type SeedProduct,
  type SeedCategory,
  type SeedBrand,
} from "./seed-data"

export interface ProductQueryFilters {
  category?: string
  brand?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  sort?: "newest" | "price_low_high" | "price_high_low" | "rating"
  page?: number
  limit?: number
  featured?: boolean
  todaysDeal?: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface RawProductDoc {
  _id: { toString(): string }
  name: string
  slug: string
  sku?: string
  category?: { slug?: string } | null
  brand?: { slug?: string } | null
  unit_price: number
  purchase_price?: number
  discount?: number
  rating?: number
  num_of_reviews?: number
  num_of_sale?: number
  current_stock?: number
  unit?: string
  thumbnail_img?: string
  photos?: string[]
  colors?: string[]
  choice_options?: Array<{ values?: string[] }>
  featured?: boolean
  todays_deal?: boolean
  description?: string
}

interface RawCategoryDoc {
  _id: { toString(): string }
  name: string
  slug: string
  icon?: string
  banner?: string
  featured?: boolean
  order_level?: number
}

interface RawBrandDoc {
  _id: { toString(): string }
  name: string
  slug: string
  logo?: string
  top?: boolean
}

export interface OrderInput {
  shipping_address: Record<string, unknown>
  payment_type:
    | "cash_on_delivery"
    | "uddoktapay"
    | "bkash"
    | "nagad"
    | "stripe"
    | "sslcommerz"
    | "wallet"
  grand_total: number
  coupon_discount?: number
  items: Array<Record<string, unknown>>
}

// 1. Fetch Products with Filtering, Search, and Pagination
export async function getProducts(
  filters: ProductQueryFilters = {}
): Promise<PaginatedResult<SeedProduct>> {
  const page = Math.max(1, filters.page || 1)
  const limit = Math.max(1, filters.limit || 12)

  try {
    const conn = await connectToDatabase()
    if (conn) {
      const query: Record<string, unknown> = { published: true }

      if (filters.q) {
        query.name = { $regex: filters.q, $options: "i" }
      }
      if (filters.featured !== undefined) {
        query.featured = filters.featured
      }
      if (filters.todaysDeal !== undefined) {
        query.todays_deal = filters.todaysDeal
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.unit_price = {}
        if (filters.minPrice !== undefined) {
          (query.unit_price as Record<string, number>).$gte = filters.minPrice
        }
        if (filters.maxPrice !== undefined) {
          (query.unit_price as Record<string, number>).$lte = filters.maxPrice
        }
      }

      let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
      if (filters.sort === "price_low_high") sortOption = { unit_price: 1 }
      else if (filters.sort === "price_high_low") sortOption = { unit_price: -1 }
      else if (filters.sort === "rating") sortOption = { rating: -1 }

      const total = await ProductModel.countDocuments(query)
      if (total > 0) {
        const rawProducts = (await ProductModel.find(query)
          .populate("category")
          .populate("brand")
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()) as unknown as RawProductDoc[]

        const data: SeedProduct[] = rawProducts.map((p) => ({
          id: p._id.toString(),
          name: p.name,
          slug: p.slug,
          sku: p.sku || "",
          categorySlug: p.category?.slug || "general",
          brandSlug: p.brand?.slug || "",
          price: p.unit_price,
          originalPrice: p.purchase_price || p.unit_price,
          discountPercent: p.discount || 0,
          rating: p.rating || 0,
          reviewCount: p.num_of_reviews || 0,
          salesCount: p.num_of_sale || 0,
          stock: p.current_stock || 0,
          unit: p.unit || "pc",
          thumbnail: p.thumbnail_img || "/assets/img/placeholder.jpg",
          images: p.photos?.length ? p.photos : ["/assets/img/placeholder.jpg"],
          colors: (p.colors || []).map((c: string) => ({ name: c, hex: c })),
          sizes: (p.choice_options || []).flatMap((opt) => opt.values || []),
          featured: !!p.featured,
          todaysDeal: !!p.todays_deal,
          sellerName: "Inhouse Products",
          sellerSlug: "inhouse",
          description: p.description || "",
          specifications: [],
          reviews: [],
        }))

        return {
          data,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      }
    }
  } catch (err) {
    console.warn("DB query error in getProducts, using fallback:", (err as Error).message)
  }

  // Fallback filtering in memory
  let filtered = [...SEED_PRODUCTS]

  if (filters.q) {
    const qLower = filters.q.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.description.toLowerCase().includes(qLower) ||
        p.categorySlug.toLowerCase().includes(qLower)
    )
  }
  if (filters.category) {
    filtered = filtered.filter((p) => p.categorySlug === filters.category)
  }
  if (filters.brand) {
    filtered = filtered.filter((p) => p.brandSlug === filters.brand)
  }
  if (filters.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === filters.featured)
  }
  if (filters.todaysDeal !== undefined) {
    filtered = filtered.filter((p) => p.todaysDeal === filters.todaysDeal)
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.sort === "price_low_high") {
    filtered.sort((a, b) => a.price - b.price)
  } else if (filters.sort === "price_high_low") {
    filtered.sort((a, b) => b.price - a.price)
  } else if (filters.sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating)
  }

  const total = filtered.length
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  return {
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

// 2. Fetch Single Product by Slug
export async function getProductBySlug(slug: string): Promise<SeedProduct | null> {
  try {
    const conn = await connectToDatabase()
    if (conn) {
      const p = (await ProductModel.findOne({ slug })
        .populate("category")
        .populate("brand")
        .lean()) as unknown as RawProductDoc | null

      if (p) {
        return {
          id: p._id.toString(),
          name: p.name,
          slug: p.slug,
          sku: p.sku || "",
          categorySlug: p.category?.slug || "general",
          brandSlug: p.brand?.slug || "",
          price: p.unit_price,
          originalPrice: p.purchase_price || p.unit_price,
          discountPercent: p.discount || 0,
          rating: p.rating || 0,
          reviewCount: p.num_of_reviews || 0,
          salesCount: p.num_of_sale || 0,
          stock: p.current_stock || 0,
          unit: p.unit || "pc",
          thumbnail: p.thumbnail_img || "/assets/img/placeholder.jpg",
          images: p.photos?.length ? p.photos : ["/assets/img/placeholder.jpg"],
          colors: (p.colors || []).map((c: string) => ({ name: c, hex: c })),
          sizes: (p.choice_options || []).flatMap((opt) => opt.values || []),
          featured: !!p.featured,
          todaysDeal: !!p.todays_deal,
          sellerName: "Inhouse Products",
          sellerSlug: "inhouse",
          description: p.description || "",
          specifications: [],
          reviews: [],
        }
      }
    }
  } catch (err) {
    console.warn("DB query error in getProductBySlug:", (err as Error).message)
  }

  const fallback = SEED_PRODUCTS.find((p) => p.slug === slug)
  return fallback || null
}

// 3. Fetch Categories
export async function getCategories(): Promise<SeedCategory[]> {
  try {
    const conn = await connectToDatabase()
    if (conn) {
      const count = await CategoryModel.countDocuments()
      if (count > 0) {
        const cats = (await CategoryModel.find()
          .sort({ order_level: 1 })
          .lean()) as unknown as RawCategoryDoc[]
        return cats.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          icon: c.icon || "/assets/img/placeholder.jpg",
          banner: c.banner || "/assets/img/placeholder-rect.jpg",
          featured: !!c.featured,
          orderLevel: c.order_level || 0,
          itemCount: 0,
        }))
      }
    }
  } catch (err) {
    console.warn("DB query error in getCategories:", (err as Error).message)
  }

  return SEED_CATEGORIES
}

// 4. Fetch Brands
export async function getBrands(): Promise<SeedBrand[]> {
  try {
    const conn = await connectToDatabase()
    if (conn) {
      const count = await BrandModel.countDocuments()
      if (count > 0) {
        const brands = (await BrandModel.find()
          .sort({ top: -1, name: 1 })
          .lean()) as unknown as RawBrandDoc[]
        return brands.map((b) => ({
          id: b._id.toString(),
          name: b.name,
          slug: b.slug,
          logo: b.logo || "/assets/img/placeholder.jpg",
          top: !!b.top,
          productCount: 0,
        }))
      }
    }
  } catch (err) {
    console.warn("DB query error in getBrands:", (err as Error).message)
  }

  return SEED_BRANDS
}

// 5. Fetch Flash Deals
export async function getFlashDeals() {
  return SEED_FLASH_DEALS
}

// 6. Create Order
export async function createOrder(data: OrderInput) {
  const code = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`
  const tracking_code = `TRK-${Math.floor(100000 + Math.random() * 900000)}`

  try {
    const conn = await connectToDatabase()
    if (conn) {
      const newOrder = new OrderModel({
        code,
        shipping_address: data.shipping_address,
        payment_type: data.payment_type,
        payment_status: data.payment_type === "cash_on_delivery" ? "unpaid" : "paid",
        grand_total: data.grand_total,
        coupon_discount: data.coupon_discount || 0,
        items: data.items,
        tracking_code,
        delivery_status: "pending",
      })
      await newOrder.save()
      return newOrder.toObject()
    }
  } catch (err) {
    console.warn("DB write error in createOrder, using local fallback:", (err as Error).message)
  }

  return {
    code,
    tracking_code,
    shipping_address: data.shipping_address,
    payment_type: data.payment_type,
    payment_status: data.payment_type === "cash_on_delivery" ? "unpaid" : "paid",
    grand_total: data.grand_total,
    coupon_discount: data.coupon_discount || 0,
    items: data.items,
    delivery_status: "pending",
    createdAt: new Date().toISOString(),
  }
}

// 7. Get Order by Code or Tracking
export async function getOrderByCode(code: string) {
  try {
    const conn = await connectToDatabase()
    if (conn) {
      const order = await OrderModel.findOne({
        $or: [{ code }, { tracking_code: code }],
      }).lean()
      if (order) return order
    }
  } catch (err) {
    console.warn("DB query error in getOrderByCode:", (err as Error).message)
  }

  return null
}
