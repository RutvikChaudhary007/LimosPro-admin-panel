import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header'
import { getStatusColor } from '@/components/table/column'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { constant } from '@/lib/constant'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const data = {
    id: "e3848306-8768-478e-987e-f6e85fa5959e",
    userId: "b587ee6a-e6e3-4c65-9e11-78dfb77d038d",
    affiliateId: "e621b9aa-b4d9-4722-a21f-9e21efd3a768",
    panNumber: "chauffeur_pan_1",
    licenseNumber: "license_number_1",
    vehicleId: "f14fd6ec-2490-46d6-affe-495f384d46ab",
    user: {
        firstName: "John",
        lastName: "Doe",
        email: "name@email.com"
    },
    businessContactNumber: "+1-424-231-6798",
    documents: [
        {
            fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746447580301-seller3.png",
            originalName: "seller3.png",
            mimetype: "image/png",
            size: 406576
        }
    ],
    availability: true,
    location: "California",
    status: "Completed",
    rating: "5.00",
    createdAt: "2025-05-05T12:19:41.972Z",
    updatedAt: "2025-05-05T12:19:41.972Z",
    vehicle: {
        id: "f14fd6ec-2490-46d6-affe-495f384d46ab",
        affiliateId: "ee23cf74-f063-4f45-ad59-524df3fb8716",
        plateNumber: "123459",
        brand: "Miss",
        model: "2017",
        year: 2025,
        color: "red",
        capacity: 4,
        vehicleType: "Executive Sedan Fit for 3 Passengers",
        documents: [
            {
                fileUrl: "https://qb-nauticalnode.s3.ap-south-1.amazonaws.com/chauffeurs/1746453402600-resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
                originalName: "resume_sample_student8ea47e04a8fe67e6b7acff0000376a3b.pdf",
                mimetype: "application/pdf",
                size: 120009
            }
        ],
        createdAt: "2025-05-05T12:12:03.865Z",
        updatedAt: "2025-05-05T12:12:03.865Z",
        deletedAt: null
    }
}

const ViewBookingPage = () => {
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
                <Link to={constant.ROUTING_URLS.EDIT_BOOKING}>
                    <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft /> Back</Button>
                </Link>
                <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
                    <div className="w-full h-full flex items-center justify-between">
                        <div>
                            <h2 className="font-medium text-xl text-black">Bookings</h2>
                            <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Bookings</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View</span></h4>
                        </div>
                    </div>
                </Header>
                 <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
                    <CardHeader className="w-full h-[55px] flex items-center justify-between">
                        <div className="w-full h-full">
                            <h4 className="font-semibold text-xl text-[#000000]">Booking ID: AA57329144</h4>
                            <h5 className="text-[#5A5A5A] font-semibold">Created on: 03-21-2025  at 05:30 PM</h5>
                        </div>
                        
                                <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor("Payment Done")} ${ "text-black"}`}>
                                    Payment Done
                                </Button>
                           
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full  space-y-4 ">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Passenger</h6>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Name:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.user.firstName} {data.user.lastName}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Email:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.user.email}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Phone:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.businessContactNumber}</span>
                            </div>

                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE] mb-5" />
                        <div className="w-full space-y-4">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Car and Chauffeur</h6>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Car Name:</Label>
                                <span className="text-[#3A3A3A] font-medium">Executive luxury Van (Minibus) Mercedes Benz Sprinter, Or Similar.</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Chauffeur:</Label>
                                <span className="text-[#3A3A3A] font-medium underline">David Thompson</span>
                            </div>

                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full space-y-4">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Ride</h6>
                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    Status:
                                </Label>
                                <span className="text-white font-medium bg-[#3A3A3A] px-3.5 py-1 rounded text-xs">{data.status}</span>
                            </div>

                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    Type:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">Airport Transfer</span>
                            </div>

                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    From:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">Houston Airport Marriott at George Bush Intercontinental, John F Kennedy Boulevard, Houston, TX, USA</span>
                            </div>

                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    To:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">Royal Caribbean International-Cruise Terminal 2, Harborside Drive, Galveston, TX, USA</span>
                            </div>

                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    Price:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">$1879</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
    </AdminRootLayout>
  )
}

export default ViewBookingPage
