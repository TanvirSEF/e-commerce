import { Metadata } from "next"
import { getAllWalletRechargesAdmin } from "@/services/wallet-service"
import { WalletRechargesContainer } from "./_components/wallet-recharges-container"

export const metadata: Metadata = {
  title: "Wallet Recharges | Admin",
  description: "Manage offline wallet recharge requests",
}

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}

export default async function AdminWalletRechargesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const status = params.status ?? "all"
  const page = Number(params.page ?? 1)

  const data = await getAllWalletRechargesAdmin({ search, status, page, limit: 15 })

  return <WalletRechargesContainer initialData={data} initialSearch={search} initialStatus={status} initialPage={page} />
}
