import { NextRequest, NextResponse } from "next/server"
import { createOrder, getOrderByCode } from "@/lib/data-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shipping_address, payment_type, grand_total, coupon_discount, items } = body

    if (!shipping_address || !grand_total || !items || !items.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required order information (shipping_address, grand_total, or items).",
        },
        { status: 400 }
      )
    }

    const order = await createOrder({
      shipping_address,
      payment_type: payment_type || "cash_on_delivery",
      grand_total: Number(grand_total),
      coupon_discount: Number(coupon_discount || 0),
      items,
    })

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Order code or tracking code is required (e.g. ?code=ORD-202609-1234).",
        },
        { status: 400 }
      )
    }

    const order = await getOrderByCode(code)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `No order found with code ${code}.`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
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
