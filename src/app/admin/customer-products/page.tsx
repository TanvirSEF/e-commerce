import { Metadata } from "next"
import { getClassifiedProductsAdminPaginated } from "@/services/customer-product-service"
import { ClassifiedProductsContainer } from "./_components/classified-products-container"

export const metadata: Metadata = {
  title: "Classified Products | Admin",
  description: "Manage customer classified product listings",
}

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function AdminCustomerProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const page = Number(params.page ?? 1)

  const data = await getClassifiedProductsAdminPaginated({ search, page, limit: 15 })

  return <ClassifiedProductsContainer initialData={data} initialSearch={search} initialPage={page} />
}
