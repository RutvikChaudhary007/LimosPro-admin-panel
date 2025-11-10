"use client";

import { Card, CardBody, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TData = {
  month: string;
  revenue: number;
};
type TProps = {
  data: TData[];
};
export function ChartAreaInteractive({ data }: TProps) {
  const isMobile = useIsMobile();
  const [, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  return (
    <div className="px-4 lg:px-8">
      <Card className="border-base-gray @container/card rounded border shadow-none md:max-w-1/2">
        <CardBody>
          <CardHeader>
            <CardTitle className="font-quicksand text-base-black text-base leading-[100%] font-bold tracking-[0]">
              Total Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, "dataMax"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--base-secondary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}
