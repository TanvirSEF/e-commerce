import { NextResponse } from "next/server"

export async function GET() {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  return new NextResponse(token, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
