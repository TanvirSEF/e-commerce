"use server"

import { revalidatePath } from "next/cache"
import {
  createBlog,
  updateBlog,
  toggleBlogStatus,
  deleteBlog,
} from "@/services/blog-service"
import type { BlogInputData } from "@/types/blog"

export async function createBlogAction(data: BlogInputData) {
  try {
    if (!data.title?.trim() || !data.slug?.trim() || !data.shortDescription?.trim()) {
      return { success: false, message: "Please fill in all required fields." }
    }

    const res = await createBlog(data)
    revalidatePath("/admin/blogs")
    revalidatePath("/blogs")
    return { success: true, message: "Blog post has been created successfully.", blog: res.blog }
  } catch (err) {
    console.error("createBlogAction error:", err)
    return { success: false, message: (err as Error).message || "Failed to create blog post." }
  }
}

export async function updateBlogAction(id: number, data: BlogInputData) {
  try {
    if (!id || !data.title?.trim() || !data.slug?.trim() || !data.shortDescription?.trim()) {
      return { success: false, message: "Please fill in all required fields." }
    }

    const res = await updateBlog(id, data)
    revalidatePath("/admin/blogs")
    revalidatePath("/blogs")
    if (data.slug) {
      revalidatePath(`/blog/${data.slug}`)
    }
    return { success: true, message: "Blog post has been updated successfully.", blog: res.blog }
  } catch (err) {
    console.error("updateBlogAction error:", err)
    return { success: false, message: (err as Error).message || "Failed to update blog post." }
  }
}

export async function toggleBlogStatusAction(id: number, status: boolean) {
  try {
    const res = await toggleBlogStatus(id, status)
    revalidatePath("/admin/blogs")
    revalidatePath("/blogs")
    return res
  } catch (err) {
    console.error("toggleBlogStatusAction error:", err)
    return { success: false }
  }
}

export async function deleteBlogAction(id: number) {
  try {
    const res = await deleteBlog(id)
    revalidatePath("/admin/blogs")
    revalidatePath("/blogs")
    return res
  } catch (err) {
    console.error("deleteBlogAction error:", err)
    return { success: false }
  }
}
