import React from "react"
import { getAllAttributes } from "@/services/attribute-service"
import { AttributesAdminView } from "./_components/attributes-admin-view"

export const metadata = {
  title: "Product Attributes & Variations | Admin Panel",
}

export default async function AdminAttributesPage() {
  const attributes = await getAllAttributes()

  return <AttributesAdminView initialAttributes={attributes} />
}
