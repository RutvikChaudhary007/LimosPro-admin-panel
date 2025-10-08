import { useFetchIPWhiteListById } from "@/api/ipWhiteList.api";
import IpWhiteListForm, { type TIpWhiteListForm } from "@/components/ipWhiteList/IpWhiteListForm";
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const mockData = {
    id: "1",
    ip: "127.0.0.1",
    name: "Aadmirals"
}
const EditIpWhiteListPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data, isFetching} = useFetchIPWhiteListById(id!);
    const editIpWhiteList = queries.useEditIPWhiteListMutation();
    const handleSubmit = (data:TIpWhiteListForm):Promise<void> => {
      try {
        toastPromise(editIpWhiteList.mutateAsync({id:id!,data}),{
          loading: "Updating IP white list...",
          success: res=>{
            if(res) navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
            return "Yeah! IP white list updated successfully."},
          error: (e)=> (e instanceof Error ? e.message : "Opps! Failed to edit IP white list. Please try again..."),
        })
      } catch (error) {
        if(error instanceof Error){
          toast.error(error.message);
        }else{
          toast.error("Failed to edit IP white list. Please try again...");
        }
      }
    }; 
    
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.IP_WHITE_LIST}>
      <Button variant="secondary" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">IP white list</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">IP white list</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Add IP</span></h4>
            </div>
          </div>
        </Header>
     {isFetching ? <Spinner/>:(<IpWhiteListForm initialData={data} onSubmit={handleSubmit} type="Edit IP"  />)} 
      </div>
    </AdminRootLayout>
  )
}

export default EditIpWhiteListPage
