import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPosSaleByCode, getPosConfig } from "@/services/pos-service"
import { PosThermalReceiptView } from "./_components/pos-thermal-receipt-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Receipt ${code} | Point of Sale`,
    description: "Thermal print receipt",
  }
}

export default async function PosReceiptPage({ params }: PageProps) {
  const { code } = await params
  const [sale, config] = await Promise.all([
    getPosSaleByCode(code),
    getPosConfig(),
  ])

  if (!sale) {
    notFound()
  }

  return <PosThermalReceiptView sale={sale} width={config.thermalPrinterWidth} />
}
