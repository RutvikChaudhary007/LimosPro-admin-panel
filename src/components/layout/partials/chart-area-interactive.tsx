"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import * as React from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const lineChartData = [
  { month: "Jan", revenue: 20 },
  { month: "Feb", revenue: 5 },
  { month: "Mar", revenue: 31 },
  { month: "Apr", revenue: 48 },
  { month: "May", revenue: 2 },
  { month: "Jun", revenue: 22 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 26 },
  { month: "Sep", revenue: 3 },
  { month: "Oct", revenue: 2 },
  { month: "Nov", revenue: 3 },
  { month: "Dec", revenue: 6 },
]
export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  return (
    <div className="px-4 lg:px-8">
      <Card className="border-base-gray @container/card rounded border shadow-none md:max-w-1/2">
        <CardHeader className="gap-0">
          <CardTitle className="font-quicksand text-base-black text-base leading-[100%] font-bold tracking-[0]">
            Total Revenue
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-0">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
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
      </Card>
    </div>
  )
}
