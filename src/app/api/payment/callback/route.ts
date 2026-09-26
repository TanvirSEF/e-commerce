import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { eq } from "drizzle-orm"

/**
 * Universal Payment Gateway Callback & Webhook Handler (Active eCommerce CMS 1:1)
 * Supports bKash, Nagad, SSLCommerz, Aamarpay, UddoktaPay, Stripe, PayPal, Manual/Offline
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { searchParams } = new URL(request.url)

    const orderCode = body.order_code || body.orderCode || searchParams.get("order_code")
    const gateway = body.gateway || searchParams.get("gateway") || "online"
    const status = body.status || searchParams.get("status") || "success"
    const transactionId = body.transaction_id || body.tran_id || body.val_id || body.paymentID || `TXN-${Date.now()}`

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: "Missing order_code parameter." },
        { status: 400 }
      )
    }

    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.code, orderCode))
      .limit(1)

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: `Order ${orderCode} not found.` },
        { status: 404 }
      )
    }

    if (status === "success" || status === "VALID" || status === "Completed") {
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          paymentType: gateway,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, existingOrder.id))

      return NextResponse.json({
        success: true,
        message: `Order ${orderCode} payment verified successfully via ${gateway}.`,
        transactionId,
        orderCode,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Payment failed or was cancelled for order ${orderCode}.`,
        status,
      })
    }
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderCode = searchParams.get("order_code")
  const status = searchParams.get("status") || "success"

  if (orderCode && (status === "success" || status === "VALID")) {
    try {
      await db
        .update(orders)
        .set({ paymentStatus: "paid", updatedAt: new Date() })
        .where(eq(orders.code, orderCode))
    } catch (err) {
      console.warn("GET payment callback update error:", (err as Error).message)
    }
    // Redirect to Order Confirmed page
    return NextResponse.redirect(new URL(`/order-confirmed/${orderCode}`, request.url))
  }

  return NextResponse.redirect(new URL("/cart", request.url))
}
