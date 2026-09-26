import { NextRequest, NextResponse } from "next/server"

interface RouteProps {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { id } = await params

  const content = `Active eCommerce Digital Product Delivery
File ID: ${id}
Generated: ${new Date().toISOString()}
License: Valid Commercial Single-Site License
Support: support@active-ecom.com
Thank you for purchasing with Active eCommerce CMS!`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="digital_product_${id}.txt"`,
    },
  })
}
