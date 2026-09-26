import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/services/product-service"
import { getCategories } from "@/services/category-service"
import { getShops } from "@/services/shop-service"

export async function GET(request: NextRequest) {
  return handleSearch(request)
}

export async function POST(request: NextRequest) {
  return handleSearch(request)
}

async function handleSearch(request: NextRequest) {
  try {
    let query = ""

    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}))
        query = body.search || body.keyword || body.q || ""
      } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        const formData = await request.formData().catch(() => new FormData())
        query = (formData.get("search") || formData.get("keyword") || formData.get("q") || "").toString()
      }
    }

    if (!query) {
      const { searchParams } = new URL(request.url)
      query = searchParams.get("search") || searchParams.get("keyword") || searchParams.get("q") || ""
    }

    query = query.trim()

    if (!query) {
      return NextResponse.json({
        keywords: ["Smart Watch", "Sneakers", "Cotton Hoodie", "Wireless Earbuds", "Backpack"],
        categories: [],
        products: [],
        shops: [],
      })
    }

    const [productsResult, allCategories, allShops] = await Promise.all([
      getProducts({ search: query, limit: 6 }),
      getCategories(),
      getShops(),
    ])

    const matchedCategories = allCategories
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 4)

    const matchedShops = allShops
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)

    const matchedKeywords = Array.from(
      new Set(
        productsResult.data
          .map((p) => p.name)
          .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      )
    )

    return NextResponse.json({
      keywords: matchedKeywords,
      categories: matchedCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      products: productsResult.data.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        thumbnail: p.thumbnail,
        price: p.price,
        discountedPrice: p.discountPercent ? p.price * (1 - p.discountPercent / 100) : p.price,
      })),
      shops: matchedShops.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        logo: s.logo,
        address: s.address,
      })),
    })
  } catch (error) {
    console.error("AJAX Search Error:", error)
    return NextResponse.json(
      { error: "Failed to process search query", products: [], categories: [], shops: [], keywords: [] },
      { status: 500 }
    )
  }
}
