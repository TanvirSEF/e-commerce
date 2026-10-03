import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/session-helper"
import { getClubPoints } from "@/services/wallet-service"
import { ensureAddonActivated } from "@/services/addon-service"
import { ClubPointsView } from "./_components/club-points-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Earning Club Points | Active eCommerce CMS",
  description: "Customer club points and conversion history.",
}

export default async function ClubPointsPage() {
  await ensureAddonActivated("club_points")
  const session = await getServerSession()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { totalPoints, convertRate, history } = await getClubPoints(session.user.id)

  return (
    <ClubPointsView
      initialTotalPoints={totalPoints}
      convertRate={convertRate}
      initialHistory={history}
    />
  )
}
