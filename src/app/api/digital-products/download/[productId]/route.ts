import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { db } from "@/db"
import { orders, orderItems, products } from "@/db/schema"
import { eq, and } from "drizzle-orm"

interface RouteProps {
  params: Promise<{ productId: string }>
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const { productId } = await params
  const pId = parseInt(productId, 10)

  if (isNaN(pId)) {
    return new NextResponse("Invalid product ID", { status: 400 })
  }

  // 1. Resolve session user
  let userId = "usr_customer_default_01"
  let userName = "Valued Customer"
  let userEmail = "customer@example.com"

  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      userId = session.user.id
      userName = session.user.name || userName
      userEmail = session.user.email || userEmail
    }
  } catch {
    // fallback
  }

  // 2. Verify paid purchase in PostgreSQL
  try {
    const rows = await db
      .select({
        orderCode: orders.code,
        productName: products.name,
        digitalFile: products.digitalFile,
        itemId: orderItems.id,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(orders.userId, userId),
          eq(orderItems.productId, pId),
          eq(orders.paymentStatus, "paid")
        )
      )
      .limit(1)

    if (rows.length === 0) {
      return new NextResponse("Access Denied: You have not purchased this digital product.", {
        status: 403,
      })
    }

    const item = rows[0]
    const licenseKey = `ACT-LIC-${item.itemId}-${item.orderCode.slice(-6)}-${Date.now().toString(36).toUpperCase()}`

    const licenseContent = `=======================================================
Active eCommerce CMS - Official Digital Product License
=======================================================
Product: ${item.productName}
License Key: ${licenseKey}
Order Code: ${item.orderCode}
Customer: ${userName}
Customer Email: ${userEmail}
Date Issued: ${new Date().toISOString()}
Status: Verified & Authenticated Purchase
=======================================================
Instructions:
1. Use the license key above to activate your software or access your asset.
2. For help or technical assistance, visit /dashboard/support-tickets.
Thank you for shopping with Active eCommerce CMS!
=======================================================`

    const filename = `${item.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-license.txt`

    return new NextResponse(licenseContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error("Digital product download error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
