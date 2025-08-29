import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import StaffMemberForm from "@/components/staffMember/StaffMemberForm";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateStaffMemberPage = () => {
 
     async function onSubmit(values: unknown) {
     await new Promise(res => setTimeout(res, 1200)); // artificial delay to notice isSubmitting
   console.log("data:", values);
   }
   return (
     <AdminRootLayout>
         <div className='px-10 py-6 h-[calc(100vh-146px)]'>
             <Link to={constant.ROUTING_URLS.STAFF_MEMBERS}>
       <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
             </Link>
       <Header className='p-4 h-[79px] rounded-[6px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5'>
             <div className=''>
                 <h2 className="font-medium text-xl text-black">Staff Members</h2>
                 <h4><span className="text-[#959595] w-14 h-4">Staff Members</span>  <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Staff Members</span></h4>
             </div>
       </Header>
    <StaffMemberForm
    onSubmit={onSubmit}
    type={"Create Staff Members"}/>
       
         </div>
     </AdminRootLayout>
   )
}

export default CreateStaffMemberPage
