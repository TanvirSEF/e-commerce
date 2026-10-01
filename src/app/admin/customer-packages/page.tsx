import { Metadata } from "next"
import { getAllCustomerPackages } from "@/services/customer-package-service"
import { PackagesGridContainer } from "./_components/packages-grid-container"

export const metadata: Metadata = {
  title: "Classified Packages | Admin",
  description: "Manage customer classified packages",
}

export default async function AdminCustomerPackagesPage() {
  const packages = await getAllCustomerPackages()
  return <PackagesGridContainer packages={packages} />
}
