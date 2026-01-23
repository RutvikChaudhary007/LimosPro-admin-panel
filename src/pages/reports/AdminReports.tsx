import {
  ArcElement,
  BarElement,
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
import { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { constant } from "@/lib/constant";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
);

const revenueOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: false, text: "Revenue & Commission" },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function AdminReports({ reports }: { reports: any }) {
  const navigate = useNavigate();
  // Process Revenue Data for Chart
  const revenueChartData = useMemo(() => {
    return {
      labels: reports?.revenue?.map((d: any) => d.month),
      datasets: [
        {
          fill: true,
          label: "Total Revenue ($)",
          data: reports?.revenue?.map((d: any) => d.revenue),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          fill: true,
          label: "Commission ($)",
          data: reports?.revenue?.map((d: any) => d.commission),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    };
  }, []);

  // Process Tickets by Region for Bar Chart

  const ticketsByRegionData = useMemo(() => {
    const disputeCounts: Record<string, number> = {};
    const issueCounts: Record<string, number> = {};

    // Fixed regions as requested
    const predefinedRegions = ["India", "Dubai", "USA"];

    reports?.tickets?.forEach((ticket: { region: string; type: string }) => {
      if (predefinedRegions.includes(ticket.region)) {
        const ticketType = ticket.type?.toLowerCase();
        if (ticketType === "dispute") {
          disputeCounts[ticket.region] =
            (disputeCounts[ticket.region] || 0) + 1;
        } else if (ticketType === "support_issue") {
          issueCounts[ticket.region] = (issueCounts[ticket.region] || 0) + 1;
        }
      }
    });

    return {
      labels: predefinedRegions,
      datasets: [
        {
          label: "Disputes",
          data: predefinedRegions.map((r) => disputeCounts[r] || 0),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
        {
          label: "Support Issues",
          data: predefinedRegions.map((r) => issueCounts[r] || 0),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Revenue Chart */}
      <Card className="col-span-4">
        <CardBody>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Monthly revenue and commission breakdown.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Line
              options={revenueOptions}
              data={revenueChartData}
              height={100}
            />
          </CardContent>
        </CardBody>
      </Card>

      {/* Region Disputes Chart */}
      <Card className="col-span-3">
        <CardBody>
          <CardHeader>
            <CardTitle>Disputes by Region</CardTitle>
            <CardDescription>
              Active and resolved tickets per region.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Bar options={barOptions} data={ticketsByRegionData} />
          </CardContent>
        </CardBody>
      </Card>

      {/* Partner Stats or Other Metrics */}
      <Card className="col-span-3">
        <CardBody>
          <CardHeader>
            <CardTitle>Partner Growth</CardTitle>
            <CardDescription>New Partner signups per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <Line
              options={revenueOptions}
              data={{
                labels: reports?.partnerStats?.map(
                  (s: { month: string }) => s.month,
                ),
                datasets: [
                  {
                    label: "New Signups",
                    data: reports?.partnerStats?.map(
                      (s: { newSignups: number }) => s.newSignups,
                    ),
                    borderColor: "rgb(255, 159, 64)",
                    backgroundColor: "rgba(255, 159, 64, 0.5)",
                    fill: true,
                  },
                ],
              }}
            />
          </CardContent>
        </CardBody>
      </Card>

      {/* Recent Tickets Table */}
      <Card className="col-span-4">
        <CardBody>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
            <CardDescription>
              Latest disputes and support requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.tickets?.map(
                  (ticket: {
                    id: string;
                    title: string;
                    type: string;
                    region: string;
                    status: string;
                  }) => (
                    <TableRow key={ticket.id}>
                      <TableCell
                        className="font-medium"
                        onClick={() =>
                          navigate(constant.ROUTING_URLS.SUPPORT_TICKETS)
                        }
                      >
                        <button
                          type="button"
                          className="text-left text-primary underline-offset-2"
                        >
                          {ticket.id}
                        </button>
                      </TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.type}</Badge>
                      </TableCell>
                      <TableCell>{ticket.region}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ticket.status === "OPEN"
                              ? "destructive"
                              : ticket.status === "RESOLVED"
                                ? "success"
                                : "default"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}
