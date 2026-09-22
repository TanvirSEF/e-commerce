import { NextRequest, NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/data-service"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const product = await getProductBySlug(slug)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product,
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
