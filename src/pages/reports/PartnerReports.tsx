import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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
import {
  // mockComplianceData,
  // mockPartnerRevenueBreakdown,
  mockTickets,
} from "@/data/mockReportsData";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function PartnerReports({ reports }: { reports: any }) {
  // Filter tickets for this "Partner" (dummy filter)
  const myDisputes = mockTickets.filter(
    (t) => t.type === "DISPUTE" || t.category === "PAYMENT",
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Revenue Breakdown */}
      <Card className="col-span-4">
        <CardBody>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>
              Breakdown of revenue from Self-drives vs Chauffeur-driven trips.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="w-full h-full">
              <Bar
                options={{ responsive: true, indexAxis: "y" as const }}
                data={{
                  labels: ["Self Revenue"],
                  datasets: [
                    {
                      label: "Revenue Source",
                      data: [reports?.revenue],
                      backgroundColor: ["#4ade80"],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </CardBody>
      </Card>

      {/* Compliance / Doc Status */}
      <Card className="col-span-3">
        <CardBody>
          <CardHeader>
            <CardTitle>Chauffeur Compliance</CardTitle>
            <CardDescription>
              Documents expiring soon or already expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.compliance?.map(
                  (item: {
                    id: string;
                    chauffeurName: string;
                    documentType: string;
                    status: string;
                  }) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.chauffeurName}
                      </TableCell>
                      <TableCell>{item.documentType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "EXPIRED"
                              ? "destructive"
                              : "secondary" // "warning" if available, used secondary as fallback/warning style
                          }
                          className={
                            item.status === "EXPIRING_SOON"
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : ""
                          }
                        >
                          {item.status.replace("_", " ")}
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

      {/* Dispute History */}
      <Card className="col-span-7">
        <CardBody>
          <CardHeader>
            <CardTitle>My Dispute History</CardTitle>
            <CardDescription>
              Payment and service disputes raised by or against you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myDisputes.length > 0 ? (
                  myDisputes.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ticket.status === "OPEN"
                              ? "bg-red-500"
                              : ticket.status === "RESOLVED"
                                ? "bg-green-500"
                                : "bg-blue-500"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No disputes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </CardBody>
      </Card>
    </div>
  );
}
