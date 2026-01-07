import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchDashboard } from "@/api";
import TableAndPieChart, {
  type FleetStat,
} from "@/components/dashboard/TableAndPieChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ChartAreaInteractive } from "@/components/layouts/shared/chart-area-interactive";
import { Spinner } from "@/components/Spinner";
import { getDashboardColumns } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { constant } from "@/lib/constant";
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

  // console.log("Dashboard Render:", {
  //   selectedTime,
  //   selectedYear,
  //   startDate,
  //   endDate,
  //   isFetching,
  //   isPlaceholderData,
  //   data,
  // });

  const fleetDistributionData = useMemo(
    () => ({
      fleetDis: data?.fleetDistribution ?? [],
      fleets: data?.fleets ?? [],
    }),
    [data?.fleetDistribution, data?.fleets],
  );

  if (isFetching) return <Spinner />;
  return (
    <div className="bg-base-background-light @container/main h-full">
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8">
        {/* User Profile */}
        <ErrorBoundary
          fallback={
            <div className="p-4 border border-dashed rounded text-center text-sm text-gray-500">
              User Profile failed to load
            </div>
          }
        >
          <UserProfile
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </ErrorBoundary>
        {/* Cards */}
        <ErrorBoundary
          fallback={
            <div className="p-4 border border-dashed rounded text-center text-sm text-gray-500">
              Cards failed to load
            </div>
          }
        >
          <SectionCards data={data?.totals} />
        </ErrorBoundary>

        <div className="px-4 lg:px-8 flex flex-col gap-6 md:flex-row overflow-hidden">
          {/* Charts */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border border-dashed rounded text-center text-sm text-gray-500">
                Revenue Chart failed to load
              </div>
            }
          >
            <div className="w-full">
              <ChartAreaInteractive data={data?.revenueByMonth} />
            </div>
          </ErrorBoundary>

          <div className="w-full">
            {/* Charts */}
            <ErrorBoundary
              fallback={
                <div className="p-4 border border-dashed rounded text-center text-sm text-gray-500">
                  Recent Bookings failed to load
                </div>
              }
            >
              <Card className="shadow-none border border-base-gray">
                <CardBody>
                  <CardHeader>
                    <CardTitle>Total Bookings</CardTitle>
                    <CardAction>
                      <Link to={constant.ROUTING_URLS.BOOKING}>
                        <Button
                          variant="outlineBlack"
                          size="xl"
                          spacing="lg"
                          tooltip="View All"
                          className="hover:bg-base-black hover:text-base-white transition-all"
                        >
                          <Eye />
                        </Button>
                      </Link>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="max-h-[180px] overflow-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                    <DataTable
                      columns={columns}
                      rowSelection={rowSelection}
                      onRowSelectionChange={setRowSelection}
                      data={data?.recentBookings || []}
                    />
                  </CardContent>
                </CardBody>
              </Card>
            </ErrorBoundary>
          </div>
        </div>

        <div className="px-4 lg:px-8">
          {/* Table and Pie Chart */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border border-dashed rounded text-center text-sm text-gray-500">
                Fleet Info failed to load
              </div>
            }
          >
            <TableAndPieChart
              key={`${selectedTime}-${selectedYear}`}
              chauffeurAvailability={data?.availability || []}
              fleetDistribution={fleetDistributionData as unknown as FleetStat}
              selectedTime={selectedTime}
              selectedYear={selectedYear}
            />
          </ErrorBoundary>
        </div>

        {/* Table */}
        {/* <DataTable data={data} /> */}
      </div>
    </div>
  );
}
