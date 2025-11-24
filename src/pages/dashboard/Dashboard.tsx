import { useMemo, useState } from "react";
import useFetchDashboard from "@/api/dashboard.api";
import TableAndPieChart, {
  type FleetStat,
} from "@/components/dashboard/TableAndPieChart";
import { ChartAreaInteractive } from "@/components/layouts/partials/chart-area-interactive";
import { Spinner } from "@/components/Spinner";
import { getDashboardColumns } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionCards } from "@/pages/dashboard/partials/section-cards";
import UserProfile from "./partials/user-profile";
// import { DataTable } from "@/components/data-table"
// import data from "./partials/data.json"

export default function Dashboard() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const columns = getDashboardColumns();
  const [selectedTime, setSelectedTime] = useState<string | undefined>("");
  const [selectedYear, setSelectedYear] = useState<string | undefined>("");

  const { startDate, endDate } = useMemo(() => {
    if (selectedYear) {
      const year = Number(selectedYear);

      return {
        startDate: new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)),
        endDate: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      };
    }

    if (!selectedTime) {
      return { startDate: undefined, endDate: undefined };
    }

    const now = new Date();

    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    let start: Date | undefined;

    switch (selectedTime) {
      case "weekly":
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 6,
            0,
            0,
            0,
            0,
          ),
        );
        break;

      case "monthly":
        start = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
        );
        break;

      case "quarterly":
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - 2,
            now.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        break;

      case "6_months":
        start = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - 5,
            now.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        break;

      case "yearly":
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
        break;

      default:
        start = undefined;
    }

    return { startDate: start, endDate: end };
  }, [selectedTime, selectedYear]);

  const { data, isFetching } = useFetchDashboard({
    DateRange: { startDate, endDate },
  });

  if (isFetching) return <Spinner />;
  return (
    <div className="bg-base-background-light @container/main h-full">
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8">
        {/* User Profile */}
        <UserProfile
          setSelectedTime={setSelectedTime}
          selectedTime={selectedTime}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
        />

        {/* Cards */}
        <SectionCards data={data?.totals} />

        <div className="px-4 lg:px-8 flex gap-6">
          {/* Charts */}
          <div className="w-full">
            <ChartAreaInteractive data={data?.revenueByMonth} />
          </div>

          <div className="w-full">
            {/* Charts */}
            <Card>
              <CardBody>
                <CardHeader>
                  <CardTitle>Total Bookings</CardTitle>
                  <CardAction>
                    <span className="text-sm text-base-text">View All</span>
                  </CardAction>
                </CardHeader>
                <CardContent className="max-h-[195px] overflow-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                  <DataTable
                    columns={columns}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    data={data?.recentBookings}
                  />
                </CardContent>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="px-4 lg:px-8">
          {/* Table and Pie Chart */}
          <TableAndPieChart
            chauffeurAvailability={data?.availability}
            fleetDistribution={
              {
                fleetDis: data?.fleetDistribution ?? [],
                fleets: data?.fleets ?? [],
              } as unknown as FleetStat
            }
          />
        </div>

        {/* Table */}
        {/* <DataTable data={data} /> */}
      </div>
    </div>
  );
}
