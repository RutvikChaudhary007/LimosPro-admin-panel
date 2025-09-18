// @ts-nocheck
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import type { IAffiliate } from "@/types/affiliate";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function EditAffiliatePage() {
  const handleEditAffiliate = async (data:unknown) => {
    
      console.log("called handleCreateAffiliate")
      return await new Promise((res)=>{
        setTimeout(()=>res(console.log("promise:",data)),5000);
      });
  }
  const initialData: IAffiliate ={
            firstName: "Jhon",
            lastName: "Doe",
            email: "jhondoe@gmail.com",
            password: "jhon@1234",
            isChauffer: false,
            companyName: "AMC pvt ltd",
            businessContactNumber: "1234567890",
            businessAddress: "2145 sunnydale bvd, clearwater, FL, 33764",
            businessEmail: "AMC@gmail.com",
            businessLocation: {
                latitude: 44.0,
                longitude: 75.0,
            },
            entityType: "Private Limited Company (Pvt Ltd)",
            taxId: "tax-husainsdfb",
            commissionRate: "12",
            documents: ["affiliate-documents.pdf"],
            status: "pending",
        }
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.AFFILIATE}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft /> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Affiliate</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Affiliate</span></h4>
            </div>
          </div>
        </Header>
      <AffiliateForm
       onSubmit={handleEditAffiliate}
       initialData={initialData}
       type={"Edit Affiliate"}
      />
      </div>
    </AdminRootLayout>
  )
}

export default EditAffiliatePage;
