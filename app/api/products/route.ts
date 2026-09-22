import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || undefined
    const category = searchParams.get("category") || undefined
    const brand = searchParams.get("brand") || undefined
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
    const sort =
      (searchParams.get("sort") as "newest" | "price_low_high" | "price_high_low" | "rating") ||
      undefined
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12
    const featured = searchParams.get("featured") === "true" ? true : undefined
    const todaysDeal = searchParams.get("todaysDeal") === "true" ? true : undefined

    const result = await getProducts({
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      featured,
      todaysDeal,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
