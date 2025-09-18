//@ts-nocheck
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Table } from "../ui/table"
import { DataTable } from "../table/data-table"
import { getChauffeurAvailablility, type TChauffeurAvailablility } from "../table/column";
import React, { useState } from "react";
import { constant } from "@/lib/constant";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";


const tableData: TChauffeurAvailablility[] = [
  {
    id: "1",
    firstName: "127.0.0.1",
    lastName: "Localhost",
    licenseNumber: "32432AS",
    ratings: "4",
    status: "Active"
  },
  {
    id: "2",
    firstName: "127.0.0.2",
    lastName: "Localhost2",
    licenseNumber: "32432AS",
    ratings: "5",
    status: "Active"
  },
];
function TableAndPieChart() {
  const navigate = useNavigate();
  const [data, setData] = useState(tableData);
  const handleEdit = (id: string) => {
    console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_CHAUFFEUR.replace(":id", id))
  };
  const handleDelete = (id: string) => {
    setData((prev) =>
      prev.filter((row) => row.id !== id))
  };
  const columns = getChauffeurAvailablility(handleEdit, handleDelete);
  ChartJS.register(ArcElement, Tooltip, Legend);
  const Chartdata = {
    labels: ['Most Requested Fleet', 'Least Requested Fleet',],
    datasets: [
      {
        label: '# Requested Fleet',
        data: [12, 3],
        backgroundColor: [
          '#3A3A3A',
          '#939393',
        ],
        borderColor: [
          '#3A3A3A',
          '#939393',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex justify-between">
      {/* table */}
      <div className="1xl:w-[718px] 1xl:h-[415px] p-4">
        <div className="w-full h-6 flex justify-between items-center bg-[#FDFDFD]">
          <div>Chauffeurs Availability</div>
          <div className="flex space-x-1">
            <Button variant="secondary" className="flex justify-between rounded cursor-pointer">
              <span className="text-[#959595]">Add New</span>
              <Plus className="text-[#959595]" />
            </Button>
            <Button variant="secondary" className="flex justify-between rounded cursor-pointer">
              <span className="text-[#959595]">View All</span>
              <ArrowRight className="text-[#959595]" />
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
      {/* pie */}
      <div className="1xl:w-[322px] 1xl:h-[415px] space-y-6  bg-[#EEEEEE] rounded inset-shadow-xs inset-shadow-[#EEEEEE]  shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-y-auto">
        <div className="min-w-full">
          <div className="p-4">Fleet Availability & Demand Ratio</div>
          <hr className="min-w-full border-[#D9D9D9] p-0 pb-0" />
        </div>
        <div className="px-4 w-[290px] h-fit">
          <div className="w-full h-full px-2.5 py-3">
            <div className="shadow-md shadow-[#B6B6B6] border rounded p-2.5">
              <Doughnut data={Chartdata}
                options={{
                  responsive: true,
                  maintainAspectRatio: true, // or false depending on aspect needs
                }}
              />
            </div>
          </div>
        </div>
        <div className="px-4 w-[290px] h-[155px]">
          <div className="w-full">
            {[{
              fleet: "Executive Sedan",
              price: 60,
              duration: "Per Hour"
            },{
              fleet: "Executive Large SUV.",
              price: 75,
              duration: "Per Hour"
            },{
              fleet: "Business Large SUV.",
              price: 90,
              duration: "Per Hour"
            }].map((content,i) =>(
              <React.Fragment key={i}>
              <div className="w-full flex justify-between items-center">
              <p className="text-[#3A3A3A] font-bold text-sm">{content.fleet}</p>
              <p className="text-[#3A3A3A] text-sm"><span>$ {content.price}</span> <span>{content.duration}</span></p>
            </div>
            <hr className="w-full text-sm border mt-2.5 mb-2.5"/>
            </React.Fragment>
            ))}
            
            
          </div>
          <div className="flex items-center justify-end gap-1 min-w-full">
            <Link to={constant.ROUTING_URLS.CREATE_FLEET}>
            <Button className="bg-[#FFFFFF]  text-[#959595] rounded" variant="secondary">Add New <Plus/></Button>
            </Link>
            <Link to={constant.ROUTING_URLS.VIEW_FLEET}>
          <Button className="bg-[#FFFFFF]  text-[#959595] rounded" variant="secondary">View All <ArrowRight/></Button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableAndPieChart
