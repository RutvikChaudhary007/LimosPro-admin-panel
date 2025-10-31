import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/pages/dashboard/partials/section-cards"
// import data from "./partials/data.json"

export default function Dashboard() {
  return (
    <div className="bg-base-background-light flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8">
          <SectionCards />
          <div className="px-4 lg:px-8">
            <ChartAreaInteractive />
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  )
}
