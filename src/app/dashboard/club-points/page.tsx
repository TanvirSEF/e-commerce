import { Metadata } from "next"
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
  const { totalPoints, convertRate, history } = await getClubPoints()

  return (
    <ClubPointsView
      initialTotalPoints={totalPoints}
      convertRate={convertRate}
      initialHistory={history}
    />
  )
}
