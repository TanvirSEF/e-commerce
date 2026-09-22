import { Metadata } from "next"
import { getBlogs, getBlogCategories, getRecentBlogs } from "@/services/blog-service"
import { BlogsView } from "./_components/blogs-view"

export const metadata: Metadata = {
  title: "Blogs & News | Active eCommerce CMS",
  description: "Read latest articles, tips, and trends on Active eCommerce CMS.",
}

export default async function BlogsPage() {
  const [blogs, categories, recent] = await Promise.all([
    getBlogs(),
    getBlogCategories(),
    getRecentBlogs(4),
  ])

  return (
    <BlogsView
      initialBlogs={blogs}
      categories={categories}
      recentBlogs={recent}
    />
  )
}
