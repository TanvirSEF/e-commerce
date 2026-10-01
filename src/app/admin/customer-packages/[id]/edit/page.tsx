import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCustomerPackageById } from "@/services/customer-package-service"
import { PackageForm } from "../../_components/package-form"

export const metadata: Metadata = {
  title: "Edit Package | Admin",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPackagePage({ params }: PageProps) {
  const { id } = await params
  const pkg = await getCustomerPackageById(Number(id))
  if (!pkg) notFound()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Edit Package</h1>
      </div>
      <PackageForm initialData={pkg} />
    </div>
  )
}
