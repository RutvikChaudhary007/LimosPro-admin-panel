import { ChartAreaInteractive } from "@/components/layout/partials/chart-area-interactive"
import { SectionCards } from "@/pages/dashboard/partials/section-cards"
import UserProfile from "./partials/user-profile"
import useFetchDashboard from "@/api/dashboard.api"
import { useEffect } from "react"
// import { DataTable } from "@/components/data-table"
// import data from "./partials/data.json"

export default function Dashboard() {
  const { data, isFetching } = useFetchDashboard({})
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <div className="bg-base-background-light @container/main h-full">
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8">
        {/* User Profile */}
        <UserProfile />

        {/* Cards */}
        {isFetching ? <p>Loading...</p> : <SectionCards data={data?.totals} />}

        {/* Charts */}
        {isFetching ? <p>Loading...</p> : <ChartAreaInteractive data={data?.revenueByMonth} />}

        {/* Table */}
        {/* <DataTable data={data} /> */}
      </div>
    </div>
  )
}
