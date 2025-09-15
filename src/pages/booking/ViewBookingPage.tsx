import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header'
import { Button } from '@/components/ui/button'
import { constant } from '@/lib/constant'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

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
                            <h2 className="font-medium text-xl text-black">Chauffeur</h2>
                            <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Chauffeur</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ View Chauffeur</span></h4>
                        </div>
                    </div>
                </Header>
                {/* <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
                    <CardHeader className="w-full h-[55px] flex items-center justify-between">
                        <div className="w-full h-full">
                            <h4 className="font-semibold text-xl text-[#000000]">Mark Reynolds</h4>
                            <h5 className="text-[#5A5A5A] font-semibold">Location: {data?.location}</h5>
                        </div>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor(selectedStatus.label)} ${selectedStatus.label === "Active" && "text-white"}`}>
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
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[95px] space-y-4">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Contact Details</h6>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Email:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.user.email}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize">Phone:</Label>
                                <span className="text-[#3A3A3A] font-medium">{data?.businessContactNumber}</span>
                            </div>

                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[22px] flex items-center gap-6">
                            <Label className="text-sm font-semibold capitalize">
                                Vehicle ID:
                            </Label>
                            <span className="text-[#3A3A3A] font-medium">FL-12345</span>
                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full  space-y-4">
                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    Pan:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">{data.panNumber}</span>
                            </div>
                            <div className="w-full h-[22px] flex items-center gap-6">
                                <Label className="text-sm font-semibold capitalize w-[80px]">
                                    License:
                                </Label>
                                <span className="text-[#3A3A3A] font-medium">{data.licenseNumber}</span>
                            </div>
                        </div>
                        <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                        <div className="w-full h-[215px]">
                            <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">Documents</h6>
                            {docJsx}
                        </div>
                    </CardContent>
                </Card> */}
            </div>
    </AdminRootLayout>
  )
}

export default ViewBookingPage
