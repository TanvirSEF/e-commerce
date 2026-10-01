import { Metadata } from "next"
import { getAllStaffsAdmin } from "@/services/staff-service"
import { StaffsListContainer } from "./_components/staffs-list-container"

export const metadata: Metadata = {
  title: "All Staffs | Admin",
  description: "View and manage staff accounts and role assignments",
}

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function AdminStaffsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const page = Number(params.page ?? 1)

  const data = await getAllStaffsAdmin({ search, page, limit: 15 })

  return (
    <StaffsListContainer
      initialData={data}
      initialSearch={search}
      initialPage={page}
    />
  )
}
