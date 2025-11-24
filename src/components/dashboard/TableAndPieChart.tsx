//@ts-nocheck

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Eye, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import { constant } from "@/lib/constant";
import { getChauffeurAvailablility } from "../table/column";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FieldLabel } from "../ui/field";

// const tableData: TChauffeurAvailablility[] = [
//   {
//     id: "1",
//     firstName: "127.0.0.1",
//     lastName: "Localhost",
//     licenseNumber: "32432AS",
//     ratings: "4",
//     status: "Active"
//   },
//   {
//     id: "2",
//     firstName: "127.0.0.2",
//     lastName: "Localhost2",
//     licenseNumber: "32432AS",
//     ratings: "5",
//     status: "Active"
//   },
// ];
export type FleetStat = {
  id?: string;
  name: string;
  count: number;
};

function TableAndPieChart({
  chauffeurAvailability,
  fleetDistribution,
}: {
  chauffeurAvailability: chauffeurAvailability[];
  fleetDistribution: FleetStat;
}) {
  const navigate = useNavigate();
  // const [data, setData] = useState(tableData);
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id));
  };
  const handleDelete = (_id: string) => {
    // setData((prev) =>
    //   prev.filter((row) => row.id !== id))
  };
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const columns = getChauffeurAvailablility(handleEdit, handleDelete);
  ChartJS.register(ArcElement, Tooltip, Legend);

  // Fleet stats from API (fallback to static data)
  // const [fleetStats, setFleetStats] = useState<FleetStat[]>(fleetDistribution?.fleetDis??[])
  // const [fleetStats, setFleetStats] = useState<FleetStat[]>([
  //   { name: 'Executive Sedan', count: 12 },
  //   { name: 'Executive Large SUV.', count: 3 },
  // ])
  // const [loadingFleetStats, setLoadingFleetStats] = useState<boolean>(false)

  // useEffect(() => {
  //   let isMounted = true
  //   const fetchFleetStats = async () => {
  //     try {
  //       setLoadingFleetStats(true)
  //       // Replace with your real endpoint
  //       const response = await fetch('/api/dashboard/fleet-stats', { credentials: 'include' })
  //       if (!response.ok) throw new Error('Failed to fetch fleet stats')
  //       const json = await response.json()
  //       if (isMounted && Array.isArray(json) && json.length) {
  //         setFleetStats(json as FleetStat[])
  //       }
  //     } catch {
  //       // keep fallback silently
  //     } finally {
  //       if (isMounted) setLoadingFleetStats(false)
  //     }
  //   }
  //   fetchFleetStats()
  //   return () => { isMounted = false }
  // }, [])

  const topAndBottom = useMemo(() => {
    if (!fleetDistribution?.fleetDis?.length) return [] as FleetStat[];
    const most = fleetDistribution?.fleetDis?.reduce((a, b) =>
      a.count >= b.count ? a : b,
    );
    const least = fleetDistribution?.fleetDis?.reduce((a, b) =>
      a.count <= b.count ? a : b,
    );
    if (most === least) return [most];
    return [most, least];
  }, [fleetDistribution?.fleetDis]);

  const Chartdata = useMemo(
    () => ({
      labels:
        topAndBottom.length === 1
          ? ["Most Requested Fleet"]
          : ["Most Requested Fleet", "Least Requested Fleet"],
      datasets: [
        {
          label: "Requested Fleet",
          data: topAndBottom.map((s) => s.count),
          backgroundColor: ["#3A3A3A", "#939393"].slice(
            0,
            Math.max(1, topAndBottom.length),
          ),
          borderColor: ["#3A3A3A", "#939393"].slice(
            0,
            Math.max(1, topAndBottom.length),
          ),
          borderWidth: 1,
        },
      ],
    }),
    [topAndBottom],
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* table */}
      <div className="col-span-9">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Chauffeurs Availability</CardTitle>
              <CardAction className="flex gap-1">
                <Link to={constant.ROUTING_URLS.CREATE_CHAUFFEUR}>
                  <Button
                    variant="outlinePrimary"
                    size="xl"
                    spacing="lg"
                    tooltip="Add New"
                    className="hover:bg-base-primary hover:text-base-white transition-all"
                  >
                    <Plus />
                  </Button>
                </Link>
                <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
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
            <CardContent>
              <DataTable
                columns={columns}
                data={chauffeurAvailability}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
              />
            </CardContent>
          </CardBody>
        </Card>
      </div>
      {/* pie */}
      <div className="col-span-3">
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>Fleet Availability & Demand Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <Doughnut
                data={Chartdata}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) => {
                          const idx = ctx.dataIndex ?? 0;
                          const item = topAndBottom[idx];
                          return item ? `${item.name}` : "";
                        },
                      },
                    },
                    legend: {
                      display: true,
                    },
                  },
                }}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {fleetDistribution?.fleets?.length > 0 ? (
                fleetDistribution?.fleets?.map((content, i) => (
                  <React.Fragment key={`${i}-${content.fleet}`}>
                    <div className="w-full flex justify-between items-center">
                      <FieldLabel>{content.fleet}</FieldLabel>
                      <p className="text-base-black text-sm">
                        <span>$ {content.price}</span>{" "}
                        <span>{content.duration}</span>
                      </p>
                    </div>
                    <hr className="w-full border" />
                  </React.Fragment>
                ))
              ) : (
                <p>Results not found!</p>
              )}
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default TableAndPieChart;
