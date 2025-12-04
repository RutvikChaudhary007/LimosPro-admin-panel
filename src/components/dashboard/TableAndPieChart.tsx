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

export type FleetStat = {
  id?: string;
  name: string;
  count: number;
};

function TableAndPieChart({
  chauffeurAvailability,
  fleetDistribution,
  selectedTime,
  selectedYear,
}: {
  chauffeurAvailability: chauffeurAvailability[];
  fleetDistribution: FleetStat;
  selectedTime?: string;
  selectedYear?: string;
}) {
  const navigate = useNavigate();
  const handleEdit = (id: string) => {
    navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id));
  };
  const handleDelete = (_id: string) => {
    // setData((prev) =>
    //   prev.filter((row) => row.id !== id))
  };
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const columns = getChauffeurAvailablility(handleEdit, handleDelete);
  ChartJS.register(ArcElement, Tooltip, Legend);

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
  }, [fleetDistribution?.fleetDis, selectedTime, selectedYear]);

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
          backgroundColor: ["#135389", "#d68e29"].slice(
            0,
            Math.max(1, topAndBottom.length),
          ),
          borderColor: ["#135389", "#d68e29"].slice(
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
    <div className="flex gap-6">
      {/* table */}
      <div className="basis-8/12">
        <Card className="shadow-none border border-base-gray">
          <CardBody>
            <CardHeader>
              <CardTitle>Chauffeurs Availability</CardTitle>
              <CardAction className="flex gap-2">
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
            <CardContent className="max-h-60 overflow-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
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
      <div className="basis-4/12">
        <Card className="shadow-none border border-base-gray">
          <CardBody>
            <CardTitle>Fleet Availability & Demand Ratio</CardTitle>
            <div className="max-h-[260px] overflow-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden space-y-4">
              <CardContent className="h-56 grid place-items-center">
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
                <CardTitle className="self-start mb-4">
                  Fleet Demand Ratio
                </CardTitle>
                {fleetDistribution?.fleets?.length > 0 ? (
                  fleetDistribution?.fleets?.map((content, i) => (
                    <React.Fragment key={`${i}-${content.fleet}`}>
                      <div className="w-full flex justify-between items-center">
                        <FieldLabel>{content.fleet}</FieldLabel>
                        <p className="text-base-black text-sm">
                          <span>${content.price}</span>{" "}
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
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default TableAndPieChart;
