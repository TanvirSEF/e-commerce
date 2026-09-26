import { NextRequest, NextResponse } from "next/server"
import { getAllShippingCities } from "@/services/shipping-location-service"

export async function POST(request: NextRequest) {
  return handleGetCities(request)
}

export async function GET(request: NextRequest) {
  return handleGetCities(request)
}

async function handleGetCities(request: NextRequest) {
  try {
    let stateNameOrId = ""

    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}))
        stateNameOrId = String(body.state_id || body.state || "")
      } else {
        const formData = await request.formData().catch(() => new FormData())
        stateNameOrId = String(formData.get("state_id") || formData.get("state") || "")
      }
    }

    if (!stateNameOrId) {
      const { searchParams } = new URL(request.url)
      stateNameOrId = searchParams.get("state_id") || searchParams.get("state") || ""
    }

    const allCities = await getAllShippingCities()
    let filtered = allCities
    if (stateNameOrId) {
      filtered = allCities.filter(
        (c) =>
          c.state.toLowerCase().includes(stateNameOrId.toLowerCase()) ||
          String(c.zoneId) === stateNameOrId
      )
    }
    if (filtered.length === 0) filtered = allCities

    let html = '<option value="">Select City</option>'
    filtered.forEach((c) => {
      html += `<option value="${c.id}">${c.name}</option>`
    })

    return NextResponse.json(html)
  } catch (err) {
    console.error("get-cities error:", err)
    return NextResponse.json('<option value="">Select City</option>')
  }
}
