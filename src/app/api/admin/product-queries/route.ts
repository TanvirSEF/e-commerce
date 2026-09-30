import { NextRequest, NextResponse } from "next/server"
import { getAllQueriesAdmin } from "@/services/product-query-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10) || 1
    const limit = parseInt(searchParams.get("limit") || "20", 10) || 20

    const data = await getAllQueriesAdmin({ page, limit })
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error fetching product queries:", error)
    return NextResponse.json({ error: "Failed to fetch queries" }, { status: 500 })
  }
}
