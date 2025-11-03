import { ChartAreaInteractive } from "@/components/layout/partials/chart-area-interactive"
import { SectionCards } from "@/pages/dashboard/partials/section-cards"
import UserProfile from "./partials/user-profile"
// import { DataTable } from "@/components/data-table"
// import data from "./partials/data.json"

export default function Dashboard() {
  return (
    <div className="bg-base-background-light @container/main h-full">
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8">
        {/* User Profile */}
        <UserProfile />

        {/* Cards */}
        <SectionCards />

        {/* Charts */}
        <ChartAreaInteractive />

        {/* Table */}
        {/* <DataTable data={data} /> */}
      </div>
    </div>
  )
}
