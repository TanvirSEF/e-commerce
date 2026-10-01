import { Metadata } from "next"
import { PackageForm } from "../_components/package-form"

export const metadata: Metadata = {
  title: "Add New Package | Admin",
}

export default function CreateCustomerPackagePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Add New Package</h1>
      </div>
      <PackageForm />
    </div>
  )
}
