import React from "react"
import { getBlogs, getBlogCategories } from "@/services/blog-service"
import { BlogsAdminView } from "./_components/blogs-admin-view"

export const metadata = {
  title: "Blog Management | Active eCommerce Admin",
}

export default async function AdminBlogsPage() {
  const [blogs, categories] = await Promise.all([getBlogs(), getBlogCategories()])

  return <BlogsAdminView initialBlogs={blogs} categories={categories} />
}
