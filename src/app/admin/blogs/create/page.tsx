import React from "react"
import { getBlogCategories } from "@/services/blog-service"
import { BlogForm } from "../_components/blog-form"

export const metadata = {
  title: "Add New Post | Active eCommerce Admin",
}

export default async function AdminCreateBlogPage() {
  const categories = await getBlogCategories()

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <BlogForm categories={categories} isEdit={false} />
    </div>
  )
}
