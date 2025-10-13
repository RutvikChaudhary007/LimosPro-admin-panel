//@ts-nocheck
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import StaffMemberForm from "@/components/staffMember/StaffMemberForm";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const initialData = {
    firstName: "John",
    lastName: "Doe",
    email: "name@email.com",
    password: "password@123",
    role: ["admin"]
}
const EditStaffMemberPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const editStaffMember = queries.useUpdateStaffMemberMutation();
   async function onSubmit(values: object) {
    try {
      if(values?.region) delete values?.region;
      toastPromise(editStaffMember.mutateAsync({id:id as string,regionId: data?.region as string, data: values}),{
        loading: "Updating staff member...",
        success: (res)=>{
           if(res) navigate(constant.ROUTING_URLS.STAFF_MEMBERS)
          return "Yeah! Staff member updated successfully"
        },
        error: (e)=> (e instanceof Error) ? e.message :"Opps! Failed to update staff member",
      });
     
    } catch (error) {
      if(error instanceof Error){
        toast.error(error.message);
      }else{
        toast.error("An unknown error occurred");
      }
    }}
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
    initialData={initialData}
    onSubmit={onSubmit}
    type={"Edit Staff Members"}/>
         </div>
     </AdminRootLayout>
   )
}

export default EditStaffMemberPage
