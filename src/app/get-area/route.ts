import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const SAMPLE_AREAS: Record<string, string[]> = {
  dhaka: [
    "Gulshan 1",
    "Gulshan 2",
    "Banani",
    "Dhanmondi",
    "Uttara",
    "Mohakhali",
    "Mirpur 10",
    "Mirpur 1",
    "Bashundhara R/A",
    "Badda",
    "Rampura",
    "Malibagh",
    "Motijheel",
  ],
  chittagong: [
    "Agrabad",
    "GEC Circle",
    "Nasirabad",
    "Halishahar",
    "Panchlaish",
    "Khulshi",
    "Chawkbazar",
  ],
  sylhet: ["Zindabazar", "Ambarkhana", "Upashahar", "Kumarpara", "Subidbazar"],
}

export async function POST(request: NextRequest) {
  return handleGetAreas(request)
}

export async function GET(request: NextRequest) {
  return handleGetAreas(request)
}

async function handleGetAreas(request: NextRequest) {
  try {
    let cityName = ""

    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}))
        cityName = String(body.city_id || body.city || "")
      } else {
        const formData = await request.formData().catch(() => new FormData())
        cityName = String(formData.get("city_id") || formData.get("city") || "")
      }
    }

    if (!cityName) {
      const { searchParams } = new URL(request.url)
      cityName = searchParams.get("city_id") || searchParams.get("city") || ""
    }

    const key = cityName.toLowerCase().trim()
    let areaList = SAMPLE_AREAS[key] || SAMPLE_AREAS["dhaka"]

    let html = '<option value="">Select Area</option>'
    areaList.forEach((area) => {
      html += `<option value="${area}">${area}</option>`
    })

    return NextResponse.json(html)
  } catch (err) {
    console.error("get-area error:", err)
    return NextResponse.json('<option value="">Select Area</option>')
  }
}
