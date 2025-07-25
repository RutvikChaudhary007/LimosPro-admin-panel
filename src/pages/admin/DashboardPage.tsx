import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import Navbar from "@/components/layouts/Navbar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ArrowDown, ChevronDown, Dot, TrendingDown, TrendingUp } from "lucide-react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import doticon from "../../../public/graph/dot.svg";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TableAndPieChart from "@/components/dashboard/TableAndPieChart";
interface Point { month: string; earnings: number; }

const data = [
  { month: "Jan", revenue: 20 },
  { month: "Feb", revenue: 37.5 },
  { month: "Mar", revenue: 40 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "July", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-[77px] h-[39px] rounded-lg">
        <div className="bg-[#E0E0E0] px-1 py-0.5 w-full h-[15px] text-[#5A5A5A] text-[8px]">{label} 2025</div>
        <div className="bg-[#F1F1F1] w-full h-6 flex p-1 text-[#5A5A5A] text-[8px] items-end justify-between">Earnings: <span className="text-[#000000] text-xs flex">${payload[0].value}</span></div>
      </div>
    );
  }
  return null;
};

const CustomDot = ({cx, cy})=>{
  return (
      <svg x={cx - 10} y={cy - 10} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="6.00174" cy="6.00009" rx="3.60105" ry="3.6" fill="black"/>
      <path d="M6.00195 0.5C9.04052 0.500114 11.5039 2.96264 11.5039 6C11.5039 9.03736 9.04052 11.4999 6.00195 11.5C2.96329 11.5 0.5 9.03743 0.5 6C0.5 2.96257 2.96329 0.5 6.00195 0.5Z" stroke="black"/>
      </svg>
  )
}


function DashboardPage() {
  const tableData = [
    {userName: "Michael Reynolds",bookingId:"AA57329144",price: 1879, status: "Canceled", commute: "One-way"},
    {userName: "David Harrison",bookingId:"AA57329144",price: 1879, status: "Completed", commute: "Two-way"},
    {userName: "James Thornton",bookingId:"AA57329144",price: 1879, status: "On Going", commute: "Round Trip"},
    {userName: "William Foster",bookingId:"AA57329144",price: 1879, status: "Completed", commute: "One-way"},
    {userName: "Andrew Sullivan",bookingId:"AA57329144",price: 1879, status: "On Going", commute: "Hourly"},
    {userName: "Andrew Sullivan",bookingId:"AA57329144",price: 1879, status: "On Going", commute: "Hourly"},
    {userName: "Andrew Sullivan",bookingId:"AA57329144",price: 1879, status: "On Going", commute: "Hourly"},
    {userName: "Andrew Sullivan",bookingId:"AA57329144",price: 1879, status: "On Going", commute: "Hourly"},
  ];
  return (
    <AdminRootLayout >
      <div className="py-6 px-10 h-full">
        <Header className="p-4 h-[86px]">
          <div className="w-full h-[54px]">
            <div className="w-full h-full flex items-center justify-start gap-5">
              <img className="w-[54px] h-[54px]" src="/header/Group.svg" alt="Group.svg" />
              <div className="w-full h-full">
                <h5 className="font-['Akatab'] font-medium text-xl">Hello,Robert Hayes</h5>
                <h6 className="text-sm text-[#3A3A3A]">Welcome to LIMOSPRO Dashboard</h6>
              </div>
            </div>
          </div>
        </Header>
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-2.5">
            <div className="h-4 flex items-center justify-start">
              <Dot />
              <p className="text-xs">In This Week</p>
            </div>
            {/* cards */}
            <div className="h-[126px] w-full grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 w-[250px] h-full rounded-[6px] bg-linear-to-r from-[#FFFFFF] to-[#EBEBEB]">
                  <div className="w-full h-[94px] flex flex-col gap-1.5">
                    <div className="w-full h-6 relative flex items-center justify-center">
                      <div className="absolute right-0 top-0 h-6 w-[57px] bg-[#5E5E5E] rounded-[20px] text-white flex items-center justify-center gap-0.5 p-1.5">
                        <TrendingUp className="w-4 h-4"/>
                        <span className="1xl:w-[27px] 1xl:h-4 flex items-center font-semibold text-xs">5.1%</span>
                      </div>
                    </div>
                    <div className="w-full h-[64px]">

                    </div>
                  </div>
                    {/* <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction >
            <div className="w-[45px] h-4 text-white flex items-center justify-center gap-0.5">
              <TrendingUp className="w-4 h-4"/> */}
              {/* <TrendingDown /> */}
              {/* <span className="text-xs font-semibold">+12.5%</span>
            </div>  
          </CardAction>
        </CardHeader> */}
                    
                </div>
              ))
              }
            </div>
            {/* Graph and Table */}
            <div className="w-full grid grid-cols-2">
              <div className="w-[520px] h-[355px] rounded-[6px]" >
                <ResponsiveContainer width="100%" height={355}>
                    <LineChart
                        data={data}
                        margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip  
                          content={<CustomTooltip />} 
                        />
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
              <div className="w-[520px] h-[355px] p-4 rounded-[6px] flex flex-col gap-1.5" >
                <div className="w-full h-[62px] flex flex-col gap-2.5 relative">
                  <div className="w-full h-6 flex justify-between">
                    <div className="py-[1px] w-[105px]">Total Bookings</div>
                    <div className="w-[71px] rounded-lg bg-[#F5F5F5] shadow-inner shadow-[#EEEEEE] py-2 px-1 flex items-center justify-between">
                      <div className="w-full h-full text-xs text-[#959595] flex items-center">Daily</div>
                      <ChevronDown className="text-[#959595]"/>
                    </div>
                  </div>
                  <div className="min-w-[520px] h-7 bg-[#F5F5F5] relative px-4 py-1.5 -left-4">
                   <table className="w-full table-fixed">
                          <thead >
                            <tr className="">
                              <th className="w-full h-full text-[#3A3A3A] text-xs text-left">USERS</th>
                              <th className="w-full h-full text-[#3A3A3A] text-xs text-center">Booking ID</th>
                              <th className="w-full h-full text-[#3A3A3A] text-xs text-center">Price $</th>
                              <th className="w-full h-full text-[#3A3A3A] text-xs text-right">STATUS</th> 
                              </tr>
                          </thead>
                    </table>
                  </div>
                </div>
                <div className="w-full h-[255px] overflow-y-auto">
                   <table className="w-full table-fixed">
                          <tbody className="">
                            {tableData.map((data,i)=>(
                              <>
                            <tr className="h-[35px]" key={i}>
                              <td className="w-full h-full text-left ">
                                <p className="w-full text-[#3A3A3A] text-sm">{data?.userName}</p>
                                <p className="w-full text-[#939393] text-xs">{data?.commute}</p>
                              </td>
                              <td className="w-full h-full text-center">{data?.bookingId}</td>
                              <td className="w-full h-full text-center">{data?.price}</td>
                              <td className="w-full h-full text-right"><Button className={btnStatus(data?.status)}>{data?.status}</Button></td>
                            </tr>
                            <hr className="bg-[#EEEEEE] w-full mt-2 mb-3"/>
                            </>
                            ))}
                          </tbody>
                    </table>
                </div>
              </div>
            </div>
            {/* Table and Pie Chart */}
            <TableAndPieChart/>
          </div>
        </main>
      </div>
    </AdminRootLayout>

  )
}

export default DashboardPage;

const btnStatus = (status: string)=>{
  if (status === "Canceled") {
    return `bg-[#E4E4E4] text-[#515151] text-sm w-[81px] h-[35px] rounded px-2  py-1.5`;
  } else if (status === "Completed") {
    return `bg-[#535353] text-[#FFFFFF] text-sm w-[81px] h-[35px] rounded px-2  py-1.5`;
  } else if (status === "On Going") {
    return `bg-[#F4F4F4] text-[#000000] text-sm shadow-inner shadow-[#E6E6E6] w-[81px] h-[35px] rounded px-2  py-1.5`;
  } else return;
}