// @ts-nocheck
import FleetForm from "@/components/fleet/FleetForm"
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header"
import { Button } from "@/components/ui/button"
import { constant } from "@/lib/constant"
import type { TFleetData } from "@/types/fleet"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const dummnyData = {
    
}
const EditFleetPage = () => {
    const handleEditFleet = async (data:TFleetData)=>{
        return new Promise((res)=>setTimeout(()=>res(console.log(data)),3000))
    };
    
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.FLEETS}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Fleet</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Fleet</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Fleet</span></h4>
            </div>
          </div>
        </Header>
        <FleetForm 
        initialData={dummnyData}
        onSubmit={handleEditFleet}
        type={"Create Fleet"} 
        />
      </div>
    </AdminRootLayout>
  )
}

export default EditFleetPage
