import { Metadata } from "next"
import { OrderConfirmedView } from "./_components/order-confirmed-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Order Confirmed #${code} | Active eCommerce`,
    description: `Thank you for your order. View confirmation details for order #${code}.`,
  }
}

export default async function OrderConfirmedPage({ params }: PageProps) {
  const { code } = await params
  return <OrderConfirmedView code={code} />
}
