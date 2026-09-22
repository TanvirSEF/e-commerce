import { Metadata } from "next"
import { getOrderByCode } from "@/services/order-service"
import { InvoiceView, InvoiceData } from "./_components/invoice-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Invoice #${code} | Active eCommerce CMS`,
    description: `Official invoice for order #${code}`,
  }
}

export default async function InvoicePage({ params }: PageProps) {
  const { code } = await params
  const order = await getOrderByCode(code)

  const invoiceData: InvoiceData = order
    ? {
        code: order.code,
        trackingCode: order.trackingCode,
        date: order.date,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.status,
        items: order.items.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
        subtotal: order.total - 100,
        shippingCost: 100,
        couponDiscount: 0,
        grandTotal: order.total,
      }
    : {
        code,
        trackingCode: `TRK-${code}`,
        date: new Date().toISOString().slice(0, 10),
        customerName: "Tanvir Ahmed",
        customerPhone: "+880 1712 345678",
        shippingAddress: "Plot 12, Road 4, Sector 7, Uttara, Dhaka",
        city: "Dhaka",
        country: "Bangladesh",
        paymentMethod: "Cash on Delivery",
        paymentStatus: "paid",
        deliveryStatus: "delivered",
        items: [
          {
            id: "it-1",
            name: "Classic Men's Casual Shirt - Slim Fit 100% Pure Cotton",
            variation: "L",
            quantity: 2,
            price: 1250,
          },
          {
            id: "it-2",
            name: "Premium Wireless Earbuds Active Noise Cancellation",
            variation: "Black",
            quantity: 1,
            price: 2450,
          },
        ],
        subtotal: 4950,
        shippingCost: 100,
        couponDiscount: 200,
        grandTotal: 4850,
      }

  return <InvoiceView invoice={invoiceData} />
}
