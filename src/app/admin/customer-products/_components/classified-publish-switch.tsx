"use client"

import React, { useState, useTransition } from "react"
import { updateClassifiedPublishedAction } from "@/app/actions/customer-product-actions"

interface Props {
  id: number
  published: boolean
}

export function ClassifiedPublishSwitch({ id, published: initialPublished }: Props) {
  const [published, setPublished] = useState(initialPublished)
  const [isPending, startTransition] = useTransition()

  const handleChange = () => {
    const next = !published
    setPublished(next)
    startTransition(async () => {
      try {
        await updateClassifiedPublishedAction(id, next)
      } catch {
        setPublished(!next) // revert
      }
    })
  }

  return (
    <label className={`relative inline-flex items-center cursor-pointer ${isPending ? "opacity-60" : ""}`}>
      <input type="checkbox" checked={published} onChange={handleChange} className="sr-only peer" disabled={isPending} />
      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
    </label>
  )
}
