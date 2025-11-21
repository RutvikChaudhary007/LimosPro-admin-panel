import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import { AreaLineChart } from "@/components/chart/AreaLineChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

type TData = {
  month: string;
  revenue: number;
};

type TProps = {
  data: TData[];
};

export function ChartAreaInteractive({ data }: TProps) {
  const [isFilled, setIsFilled] = React.useState(true);
  const [chartColor, setChartColor] = React.useState("rgb(214, 142, 41)");

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Total Revenue",
        data: data.map((item) => item.revenue),
        sign: "$",
      },
    ],
  };

  const isMobile = useIsMobile();
  const [, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  return (
    <div className="px-4 lg:px-8">
      <Card className="border-base-gray @container/card rounded border shadow-none md:max-w-1/2">
        <CardBody className="p-2">
          <CardHeader>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {/* Filled Toggle Button */}
                  <DropdownMenuItem
                    onClick={() => setIsFilled((prev) => !prev)}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm">Filled</span>
                    <Button
                      size="sm"
                      variant={isFilled ? "black" : "outlineBlack"}
                    >
                      {isFilled ? "On" : "Off"}
                    </Button>
                  </DropdownMenuItem>

                  {/* Color Picker Button */}
                  <DropdownMenuItem className="flex items-center justify-between gap-2">
                    <span className="text-sm">Color</span>
                    <input
                      type="color"
                      value={
                        chartColor === "rgb(214, 142, 41)"
                          ? "#d68e29"
                          : chartColor
                      }
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        setChartColor(`rgb(${r}, ${g}, ${b})`);
                      }}
                      className="w-8 h-8 cursor-pointer p-0 border-none"
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>

          <CardContent>
            <AreaLineChart
              data={chartData}
              isFilled={isFilled}
              chartColor={chartColor}
            />
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}
