import { NextResponse } from "next/server"
import { getCurrentSeller } from "@/services/seller-panel-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const seller = await getCurrentSeller()
    if (!seller) {
      return NextResponse.json({
        success: false,
        shopSlug: "active-fashion-outlet",
        shopName: "Active Fashion Outlet",
      })
    }
    return NextResponse.json({
      success: true,
      shopId: seller.shopId,
      shopSlug: seller.shopSlug,
      shopName: seller.shopName,
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      shopSlug: "active-fashion-outlet",
      shopName: "Active Fashion Outlet",
    })
  }
}
