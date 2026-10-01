import React from "react"
import { getAllBlogsAdmin } from "@/services/blog-service"
import { BlogsListContainer } from "./_components/blogs-list-container"

export const metadata = {
  title: "All Blog Posts | Active eCommerce Admin",
}

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
  }>
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const status = resolvedParams?.status || "all"

  const blogsData = await getAllBlogsAdmin({
    search,
    status,
  })

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <BlogsListContainer
        initialData={blogsData}
        currentSearch={search}
        currentStatus={status}
      />
    </div>
  )
}
