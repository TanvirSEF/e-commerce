export interface AdminBlogItem {
  id: number
  title: string
  slug: string
  categoryId: number | null
  categoryName: string
  categorySlug: string
  shortDescription: string
  description: string
  banner: string | null
  status: boolean
  metaTitle: string | null
  metaImg: string | null
  metaDescription: string | null
  metaKeywords: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminBlogsResponse {
  blogs: AdminBlogItem[]
  total: number
  publishedCount: number
  draftCount: number
  categoriesCount: number
}

export interface BlogCategoryItem {
  id: number
  name: string
  categoryName: string
  slug: string
  createdAt?: string
}

export interface BlogInputData {
  title: string
  slug: string
  categoryId?: number | null
  shortDescription: string
  description: string
  banner?: string | null
  status?: boolean
  metaTitle?: string | null
  metaImg?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
}
