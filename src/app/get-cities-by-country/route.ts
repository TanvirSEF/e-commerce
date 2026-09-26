import { NextRequest, NextResponse } from "next/server"
import { getAllShippingCities } from "@/services/shipping-location-service"

export async function POST(request: NextRequest) {
  return handleGetCitiesByCountry(request)
}

export async function GET(request: NextRequest) {
  return handleGetCitiesByCountry(request)
}

async function handleGetCitiesByCountry(request: NextRequest) {
  try {
    const allCities = await getAllShippingCities()
    let html = '<option value="">Select City</option>'
    allCities.forEach((c) => {
      html += `<option value="${c.id}">${c.name}</option>`
    })
    return NextResponse.json(html)
  } catch (err) {
    console.error("get-cities-by-country error:", err)
    return NextResponse.json('<option value="">Select City</option>')
  }
}
