/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */

import {
  ArcElement,
  Chart as ChartJS,
  Tooltip as chartJsToolTip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { SelectDropDown } from "@/components/ui/select";
import WorldMap from "@/components/worldmap/WorldMap";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const data = [
  { month: "Jan", revenue: 60 },
  { month: "Feb", revenue: 45 },
  { month: "Mar", revenue: 50 },
  { month: "Apr", revenue: 40 },
  { month: "May", revenue: 90 },
  { month: "Jun", revenue: 0 },
  { month: "July", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];
type TPayload = {
  value: string;
};
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-[77px] h-[39px] rounded-lg">
        <div className="bg-[#E0E0E0] px-1 py-0.5 w-full h-[15px] text-[#5A5A5A] text-[8px]">
          {label} 2025
        </div>
        <div className="bg-[#F1F1F1] w-full h-6 flex p-1 text-[#5A5A5A] text-[8px] items-end justify-between">
          Earnings:
          <span className="text-[#000000] text-xs flex">
            ${payload?.[0]?.value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// @ts-expect-error: We are intentionally assigning a number to a string type for testing.
const CustomDot = ({ cx, cy }) => {
  return (
    <svg
      x={cx - 10}
      y={cy - 10}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="6.00174" cy="6.00009" rx="3.60105" ry="3.6" fill="black" />
      <path
        d="M6.00195 0.5C9.04052 0.500114 11.5039 2.96264 11.5039 6C11.5039 9.03736 9.04052 11.4999 6.00195 11.5C2.96329 11.5 0.5 9.03743 0.5 6C0.5 2.96257 2.96329 0.5 6.00195 0.5Z"
        stroke="black"
      />
    </svg>
  );
};

const ReportPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const [selected, setSelected] = useState(optionDefaultValue);
  ChartJS.register(ArcElement, chartJsToolTip, Legend);
  const Chartdata = {
    labels: [
      "Total Affiliates",
      "Total Chauffeur",
      "Total Fleets",
      "Total Trips",
    ],
    datasets: [
      {
        // label: '#',
        data: [12, 3, 10, 9],
        backgroundColor: ["#3A3A3A", "#939393", "#8C8A8A", "#BABABA"],
        borderColor: ["#3A3A3A", "#939393", "#8C8A8A", "#BABABA"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <PageTitle title={generatePageTitle("Report")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Reports"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Reports" }]}
        />

        <SelectDropDown
          placeholder={selected}
          items={showOptions}
          value={selected}
          setSelectedItem={setSelected}
        />

        {/* Graph data */}
        <div className="w-full flex gap-8">
          <div className="w-full h-[400px] rounded border border-base-light-gray shadow-base-md p-4">
            <h2 className="font-semibold text-black pb-1">Total Revenue</h2>
            <ResponsiveContainer width="100%" height={355}>
              <LineChart
                data={data}
                margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#000000"
                  strokeWidth={2}
                  activeDot={<CustomDot cx={""} cy={""} />}
                  dot={<CustomDot cx={""} cy={""} />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full h-[400px] rounded border border-base-light-gray shadow-base-md p-4">
            <h2 className="font-semibold text-black pb-1">Total Bookings</h2>
            <ResponsiveContainer width="100%" height={355}>
              <LineChart
                data={data}
                margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#000000"
                  strokeWidth={2}
                  activeDot={<CustomDot cx={""} cy={""} />}
                  dot={<CustomDot cx={""} cy={""} />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full flex gap-8">
          <div className="w-full h-[473px] rounded border border-base-light-gray shadow-base-md p-4">
            <Doughnut
              data={Chartdata}
              options={{
                responsive: true,
                maintainAspectRatio: true, // or false depending on aspect needs
              }}
            />
          </div>
          <div className="w-full h-[473px] rounded border border-base-light-gray shadow-base-md p-4 overflow-hidden">
            <WorldMap />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportPage;
