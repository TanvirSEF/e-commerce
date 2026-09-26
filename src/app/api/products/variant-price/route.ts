import { NextRequest, NextResponse } from "next/server"
import { getProductById } from "@/services/product-service"

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => ({}))
    } else {
      const formData = await request.formData().catch(() => new FormData())
      formData.forEach((value, key) => {
        body[key] = value.toString()
      })
    }

    const productId = body.id || body.product_id
    if (!productId) {
      return NextResponse.json({ error: "Product id required" }, { status: 400 })
    }

    const product = await getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const quantity = parseInt(body.quantity || "1", 10) || 1
    let unitPrice = product.price

    // Calculate wholesale tiers if applicable
    const prodAny = product as any
    if (prodAny.wholesaleTiers && Array.isArray(prodAny.wholesaleTiers) && prodAny.wholesaleTiers.length > 0) {
      const matchingTier = prodAny.wholesaleTiers.find(
        (t: { minQty: number; maxQty: number; price: number }) =>
          quantity >= t.minQty && quantity <= t.maxQty
      )
      if (matchingTier) {
        unitPrice = matchingTier.price
      }
    }

    const availableStock = product.stock ?? 100
    const inStock = availableStock >= quantity

    return NextResponse.json({
      success: true,
      product_id: product.id,
      price: unitPrice,
      total_price: unitPrice * quantity,
      quantity: availableStock,
      in_stock: inStock,
      max_limit: availableStock,
    })
  } catch (err) {
    console.error("Variant price calculation error:", err)
    return NextResponse.json({ error: "Failed to calculate variant price" }, { status: 500 })
  }
}
