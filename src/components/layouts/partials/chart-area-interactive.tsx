import * as React from "react";
import { AreaLineChart } from "@/components/chart/AreaLineChart";
import { Card, CardBody, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useMobile";

type TData = {
  month: string;
  revenue: number;
};

type TProps = {
  data: TData[];
};

export function ChartAreaInteractive({ data }: TProps) {
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
    <Card className="border-base-gray @container/card rounded border shadow-none">
      <CardBody>
        <CardContent>
          <AreaLineChart data={chartData} />
        </CardContent>
      </CardBody>
    </Card>
  );
}
