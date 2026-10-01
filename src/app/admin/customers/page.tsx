import { Metadata } from "next"
import { getAllCustomersAdmin } from "@/services/customer-service"
import { CustomersListContainer } from "./_components/customers-list-container"

export const metadata: Metadata = {
  title: "All Customers | Admin",
  description: "View and manage all customer accounts",
}

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const status = params.status ?? "all"
  const page = Number(params.page ?? 1)

  const data = await getAllCustomersAdmin({ search, status, page, limit: 15 })

  return <CustomersListContainer initialData={data} initialSearch={search} initialStatus={status} initialPage={page} />
}
