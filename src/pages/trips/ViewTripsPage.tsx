import useFetchTripById from "@/api/getTripById"
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { getStatusColor } from "@/components/table/column"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { constant } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

const data = {
    id: "e3848306-8768-478e-987e-f6e85fa5959e",
    userId: "b587ee6a-e6e3-4c65-9e11-78dfb77d038d",
    user: {
        firstName: "John",
        lastName: "Doe",
        email: "name@email.com",
        gender: "female",
        dateOfBirth: "20-08-2000"
    },
    phone: "+1-424-231-6798",
    affiliate: "NoahAnderson",
    description: "Sedan Car 4 Doors. Clean In and out. 2 Rows of Seats. Fit for up to 3 Adults with 2 Check-In Bags, and 1 Carry-On Bag.",
    status: "Active",
    createdAt: "2025-05-05T12:19:41.972Z",
    updatedAt: "2025-05-05T12:19:41.972Z",
}
const showStatus = [
    { label: 'Completed', value: 'completed' },
    { label: 'In-Progress', value: 'inProgress' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Pending', value: 'pending' },
];

const newStatus = [
    {label: "Payment Done", css:'bg-[#444444] text-white', value: "paymentDone"},
    {label: "Payment Pending", css:'bg-[#959595]', value: "paymentPending"},
    {label: "Refund In-progress", css:'bg-[#959595]', value: "RefundInProgress"},
    {label: "Refund Done", css:'bg-[#959595]', value: "RefundDone"},
    {label: "Refund Requested", css:'bg-[#959595]', value: "RefundRequested"},
]

const getNewStatusColor = (value: string)=>{
    console.log(value.toLowerCase().trim())
    console.log("newStatus:",newStatus.find(status=> status.value.toLowerCase().trim() === value.toLowerCase().trim()))
    return newStatus.find(status=> status.value.toLowerCase().trim() === value.toLowerCase().trim())
}
const ViewTripsPage = () => {
    const  {id} = useParams();
    useFetchTripById({id});
        const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
    
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
                <Link to={constant.ROUTING_URLS.TRIPS}>
                    <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft /> Back</Button>
                </Link>
                <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
                    <div className="w-full h-full flex items-center justify-between">
                        <div>
                            <h2 className="font-medium text-xl text-black">Trips</h2>
                            <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Trips</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View Trips</span></h4>
                        </div>
                    </div>
                </Header>
                <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
                    <CardHeader className="w-full  flex items-center justify-between">
                        <div className="w-full h-full space-y-6">
                            <div className="flex items-center justify-between">
                                <div>

                            <h4 className="font-semibold text-xl text-[#000000]">Booking ID: AA57329144.</h4>
                            <h5 className="text-[#5A5A5A] font-semibold">Created on: 03-21-2025  at 05:30 PM</h5>
                                </div>
                                <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}>
                                    {selectedStatus.label}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={cn(`w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer rounded space-y-1`,

                            )} align="start">
                                <DropdownMenuGroup>
                                    {showStatus.map(option => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF] ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                                            onClick={() => setSelectedStatus(option)}
                                        >
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                            </div>
                            <Link to={"#"}> 
                           <Button variant={"secondary"}>View Live Location</Button></Link>
                        </div>
                        
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-full space-y-4">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Passenger</h6>
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Name:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.user.firstName} {data?.user.lastName}</span>
                            </div>
                                                        <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Email:</Label>
                                <span className="text-[#3A3A3A] font-medium">name@email.com</span>
                            </div>
                                                        <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">phone:</Label>
                                <span className="text-[#3A3A3A] font-medium">+1-424-231-6798</span>
                            </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Car and Chauffeur</h6>
                                
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Car Name::</Label>
                                <span className="text-[#3A3A3A] font-medium">Executive luxury Van (Minibus) Mercedes Benz Sprinter, Or Similar.</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Chauffeur:</Label>
                                <span className="text-[#3A3A3A] font-medium">David Thompson</span>
                            </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Trip</h6>
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Price:</Label>
                                <span className="text-[#3A3A3A] font-medium">$1879</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">Status:</Label>
                                <span className={`text-[#3A3A3A] font-medium ${getNewStatusColor("paymentDone")?.css} px-2 py-0.5 rounded`}>Payment Done</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">type:</Label>
                                <span className="text-[#3A3A3A] font-medium">Airport Transfer</span>
                            </div>
                        <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">From:</Label>
                                <span className="text-[#3A3A3A] font-medium">Houston Airport Marriott at George Bush Intercontinental, John F Kennedy Boulevard, Houston, TX, USA</span>
                            </div>
                        <div className="flex items-center gap-6">
                                <Label className="min-w-[153px] text-sm font-semibold capitalize">To:</Label>
                                <span className="text-[#3A3A3A] font-medium">Royal Caribbean International-Cruise Terminal 2, Harborside Drive, Galveston, TX, USA</span>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            </div>
    </AdminRootLayout>
  )
}

export default ViewTripsPage
