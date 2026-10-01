"use client"

import React, { useState, useTransition } from "react"
import { toggleBlogStatusAction } from "@/app/actions/blog-actions"

interface BlogStatusSwitchProps {
  blogId: number
  initialStatus: boolean
}

export function BlogStatusSwitch({ blogId, initialStatus }: BlogStatusSwitchProps) {
  const [isChecked, setIsChecked] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const nextStatus = !isChecked
    setIsChecked(nextStatus)

    startTransition(async () => {
      const res = await toggleBlogStatusAction(blogId, nextStatus)
      if (!res.success) {
        // Rollback on failure
        setIsChecked(!nextStatus)
      }
    })
  }

  return (
    <label
      className={`relative inline-flex items-center cursor-pointer select-none ${
        isPending ? "opacity-60" : ""
      }`}
      title={isChecked ? "Click to unpublish" : "Click to publish"}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        disabled={isPending}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 transition-colors" />
    </label>
  )
}
