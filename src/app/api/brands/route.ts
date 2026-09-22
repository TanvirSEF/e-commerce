import { NextResponse } from "next/server"
import { getBrands } from "@/lib/data-service"

export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json({
      success: true,
      brands,
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
