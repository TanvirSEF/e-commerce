import { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { getCustomerOrderDetails } from "@/services/order-service"
import { CustomerOrderDetailsView } from "./_components/customer-order-details-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Order #${code} Details | Active eCommerce`,
    description: `Order summary and details for #${code}`,
  }
}

export default async function CustomerOrderDetailsPage({ params }: PageProps) {
  const { code } = await params

  let currentUserId = "usr_customer_default_01"
  try {
    const h = await headers()
    const session = await auth.api.getSession({ headers: h })
    if (session?.user?.id) {
      currentUserId = session.user.id
    }
  } catch {
    // fallback
  }

  const order = await getCustomerOrderDetails(currentUserId, code)

  if (!order) {
    notFound()
  }

  return <CustomerOrderDetailsView order={order} />
}
