import { NextResponse } from "next/server"
import { getCategories } from "@/lib/data-service"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({
      success: true,
      categories,
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
