import React from "react"
import { notFound } from "next/navigation"
import { getBlogByIdAdmin, getBlogCategories } from "@/services/blog-service"
import { BlogForm } from "../../_components/blog-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const blogId = parseInt(id, 10)
  if (isNaN(blogId)) return { title: "Blog Not Found" }

  const blog = await getBlogByIdAdmin(blogId)
  if (!blog) return { title: "Blog Not Found" }

  return {
    title: `Edit Post - ${blog.title} | Active eCommerce Admin`,
  }
}

export default async function AdminEditBlogPage({ params }: PageProps) {
  const { id } = await params
  const blogId = parseInt(id, 10)

  if (isNaN(blogId)) {
    notFound()
  }

  const [blog, categories] = await Promise.all([
    getBlogByIdAdmin(blogId),
    getBlogCategories(),
  ])

  if (!blog) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <BlogForm initialData={blog} categories={categories} isEdit={true} />
    </div>
  )
}
