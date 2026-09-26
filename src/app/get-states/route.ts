import { NextRequest, NextResponse } from "next/server"
import { getAllStates } from "@/services/geographic-service"

export async function POST(request: NextRequest) {
  return handleGetStates(request)
}

export async function GET(request: NextRequest) {
  return handleGetStates(request)
}

async function handleGetStates(request: NextRequest) {
  try {
    let countryId: number | undefined

    if (request.method === "POST") {
      const contentType = request.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}))
        countryId = body.country_id ? Number(body.country_id) : undefined
      } else {
        const formData = await request.formData().catch(() => new FormData())
        const val = formData.get("country_id")
        countryId = val ? Number(val) : undefined
      }
    }

    if (!countryId) {
      const { searchParams } = new URL(request.url)
      const val = searchParams.get("country_id")
      countryId = val ? Number(val) : undefined
    }

    const states = await getAllStates(undefined, countryId)
    let html = '<option value="">Select State</option>'
    states.forEach((s) => {
      html += `<option value="${s.id}">${s.name}</option>`
    })

    return NextResponse.json(html)
  } catch (err) {
    console.error("get-states error:", err)
    return NextResponse.json('<option value="">Select State</option>')
  }
}
