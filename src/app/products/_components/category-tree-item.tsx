"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import type { CatalogFilterCategory } from "@/services/product-service"

interface CategoryTreeItemProps {
  category: CatalogFilterCategory
  activeCategory: string
  onSelectCategory: (slug: string) => void
  level?: number
}

export function CategoryTreeItem({
  category,
  activeCategory,
  onSelectCategory,
  level = 0,
}: CategoryTreeItemProps) {
  const hasChildren = Boolean(category.children && category.children.length > 0)
  const isDirectlySelected = category.slug !== "" && activeCategory === category.slug
  const isAncestorOfSelected = Boolean(category.childSlugs?.includes(activeCategory))

  // Auto-expand if this category or any descendant is active
  const [isOpen, setIsOpen] = useState(isAncestorOfSelected || isDirectlySelected)

  useEffect(() => {
    if (isAncestorOfSelected || isDirectlySelected) {
      setIsOpen(true)
    }
  }, [isAncestorOfSelected, isDirectlySelected])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleSelect = () => {
    onSelectCategory(category.slug)
    if (hasChildren && !isOpen) {
      setIsOpen(true)
    }
  }

  const textSize = level === 0 ? "text-xs" : level === 1 ? "text-[11.5px]" : "text-[11px]"
  const fontStyle = isDirectlySelected
    ? "font-bold text-[#d43533] bg-red-50"
    : isAncestorOfSelected
    ? "font-semibold text-gray-900"
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"

  return (
    <div className="flex flex-col">
      <div
        className={`group flex items-center justify-between rounded px-2 py-1 transition-colors ${textSize} ${fontStyle}`}
      >
        <button
          type="button"
          onClick={handleSelect}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left truncate"
        >
          {level > 0 && <span className="text-gray-300 select-none">•</span>}
          <span className="truncate">{category.name}</span>
        </button>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          <span className="text-[10px] text-gray-400">({category.count})</span>
          {hasChildren && (
            <button
              type="button"
              onClick={handleToggle}
              className="rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-200/60 hover:text-gray-800"
              aria-label={isOpen ? "Collapse category" : "Expand category"}
            >
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="ml-2.5 mt-0.5 flex flex-col gap-0.5 border-l border-gray-100 pl-1.5">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.slug}
              category={child}
              activeCategory={activeCategory}
              onSelectCategory={onSelectCategory}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
