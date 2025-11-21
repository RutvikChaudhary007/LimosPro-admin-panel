import { faker } from "@faker-js/faker";
import type { ChartOptions } from "chart.js";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

interface AreaLineChartProps {
  data?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
      tension?: number;
      borderWidth?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
      [key: string]: any;
      sign?: string;
    }>;
  };
  options?: ChartOptions<"line">;
  isFilled?: boolean;
  chartColor?: string;
  labelColor?: string;
}

// Default options for area chart
const defaultOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgb(214, 142, 41)",
        font: {
          size: 14,
          family: '"Montserrat", sans-serif',
        },
      },
    },
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Default dataset properties
const defaultDatasetProps = {
  fill: true,
  borderColor: "rgb(214, 142, 41)",
  backgroundColor: "rgba(214, 142, 41, 0.5)",
  tension: 0.4,
  borderWidth: 2,
  pointRadius: 3,
  pointHoverRadius: 5,
};

// Generate fake data for demo purposes
const generateFakeData = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  return {
    labels,
    datasets: [
      {
        ...defaultDatasetProps,
        label: "Total Revenue",
        data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      },
    ],
  };
};

export function AreaLineChart({
  data,
  options,
  isFilled = true,
  chartColor = "rgb(214, 142, 41)",
}: AreaLineChartProps) {
  let chartData = data || generateFakeData();

  if (data) {
    chartData = {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => ({
        ...defaultDatasetProps,
        ...dataset,
        fill: isFilled,
        borderColor: chartColor,
        backgroundColor: isFilled
          ? `${chartColor.replace("rgb", "rgba").replace(")", ", 0.5)")}`
          : undefined,
      })),
    };
  } else {
    // Apply to default data as well
    chartData = {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        fill: isFilled,
        borderColor: chartColor,
        backgroundColor: isFilled
          ? `${chartColor.replace("rgb", "rgba").replace(")", ", 0.5)")}`
          : undefined,
      })),
    };
  }

  // Get sign from first dataset if available
  const sign = (chartData.datasets[0] as any)?.sign || "";

  const chartOptions = {
    ...defaultOptions,
    ...options,
    scales: {
      ...defaultOptions.scales,
      y: {
        ...defaultOptions.scales?.y,
        ticks: {
          callback: (value: any) => {
            return sign ? `${sign}${value}` : value;
          },
        },
      },
    },
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins?.legend,
        labels: {
          ...defaultOptions.plugins?.legend?.labels,
          color: chartColor,
        },
      },
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const sign = context.dataset.sign;

            // Show sign representation if provided, otherwise just the value
            return sign ? `${label}: ${sign}${value}` : `${label}: ${value}`;
          },
        },
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}
