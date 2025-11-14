//@ts-nocheck

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { ArrowRight, Plus } from "lucide-react";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import { constant } from "@/lib/constant";
import { getChauffeurAvailablility } from "../table/column";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

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
type FleetStat = {
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
    <div className="flex justify-between">
      {/* table */}
      <div className="1xl:w-[718px] 1xl:h-[415px] p-4">
        <div className="w-full h-6 flex justify-between items-center bg-[#FDFDFD]">
          <div>Chauffeurs Availability</div>
          <div className="flex space-x-1">
            <Link to={constant.ROUTING_URLS.CREATE_CHAUFFEUR}>
              <Button
                variant="secondary"
                className="flex justify-between rounded cursor-pointer"
              >
                <span className="text-[#959595]">Add New</span>
                <Plus className="text-[#959595]" />
              </Button>
            </Link>
            <Link to={constant.ROUTING_URLS.CHAUFFEUR}>
              <Button
                variant="secondary"
                className="flex justify-between rounded cursor-pointer"
              >
                <span className="text-[#959595]">View All</span>
                <ArrowRight className="text-[#959595]" />
              </Button>
            </Link>
          </div>
        </div>
        <DataTable columns={columns} data={chauffeurAvailability} />
      </div>
      {/* pie */}
      <div className="1xl:w-[322px] 1xl:h-[415px] space-y-6  bg-[#EEEEEE] rounded inset-shadow-xs inset-shadow-[#EEEEEE]  shadow-base-md overflow-y-auto custom-scrollbar-style">
        <div className="min-w-full">
          <div className="p-4">Fleet Availability & Demand Ratio</div>
          <hr className="min-w-full border-[#D9D9D9] p-0 pb-0" />
        </div>
        <div className="px-4 w-[290px] h-fit">
          <div className="w-full h-full px-2.5 py-3">
            <div className="shadow-md shadow-[#B6B6B6] border rounded p-2.5">
              <Doughnut
                data={Chartdata}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        // Use API data for tooltip: show fleet name
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
            </div>
          </div>
        </div>
        <div className="px-4 w-[290px] h-[155px]">
          <div className="w-full">
            {fleetDistribution?.fleets?.length > 0 ? (
              fleetDistribution?.fleets?.map((content, i) => (
                <React.Fragment key={`${i}-${content.fleet}`}>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-[#3A3A3A] font-bold text-sm">
                      {content.fleet}
                    </p>
                    <p className="text-[#3A3A3A] text-sm">
                      <span>$ {content.price}</span>{" "}
                      <span>{content.duration}</span>
                    </p>
                  </div>
                  <hr className="w-full text-sm border mt-2.5 mb-2.5" />
                </React.Fragment>
              ))
            ) : (
              <p>Results not found!</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-1 min-w-full">
            <Link to={constant.ROUTING_URLS.CREATE_FLEET}>
              <Button
                className="bg-[#FFFFFF]  text-[#959595] rounded"
                variant="secondary"
              >
                Add New <Plus />
              </Button>
            </Link>
            <Link to={constant.ROUTING_URLS.FLEETS}>
              <Button
                className="bg-[#FFFFFF]  text-[#959595] rounded"
                variant="secondary"
              >
                View All <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableAndPieChart;
