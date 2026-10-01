import { NextResponse } from "next/server"
import { getAddons } from "@/services/addon-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const addons = await getAddons()
    return NextResponse.json(addons)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch addons" }, { status: 500 })
  }
}
