import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getBlogBySlug, getRecentBlogs } from "@/services/blog-service"
import { BlogDetailView } from "./_components/blog-detail-view"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: "Blog Not Found" }

  return {
    title: `${blog.title} | Active eCommerce CMS`,
    description: blog.shortDescription,
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const recent = await getRecentBlogs(4)

  return <BlogDetailView blog={blog} recentBlogs={recent} />
}
