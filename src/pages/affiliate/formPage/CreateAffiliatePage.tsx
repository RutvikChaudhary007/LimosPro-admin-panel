import { createAffiliate } from "@/api/createAffiliate";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { toastPromise, useToast } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import type { IAffiliate } from "@/types/affiliate";
import type { ApiErrorResponse } from "@/types/global/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function CreateAffiliatePage() {
  const {toast} = useToast();
  const navigate = useNavigate();
  const createAffiliateMutation = useMutation({
    mutationFn: createAffiliate,
    onSuccess: (response, variables) => {
      console.log(variables, response);
      
      // userPermissions are automatically stored in localStorage by the login API
      
      navigate(constant.ROUTING_URLS.AFFILIATE);
      // Navigate to dashboard
    },
    onError: (err: unknown) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (err && typeof err === 'object' && 'isAxiosError' in err) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage;
      }
      
      // Don't show toast for rate limiting
      if (errorMessage.includes("429")) return;
      toast({
        title: "Create affiliate Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
  const handleCreateAffiliate = async (data:IAffiliate) => {
    
      console.log("called handleCreateAffiliate",data);
      try {
     
        // Remove remember field before sending to API
        // await loginMutation.mutateAsync(loginData);
        await createAffiliateMutation.mutateAsync(data)
       toastPromise(await createAffiliateMutation.mutateAsync(data), {
          loading: "submitting...",
          success: "Affiliate created successfully!",
          error: (e) => (e instanceof Error ? e.message : "Failed to create affiliate"),
        });
      } catch (error) {
        // Error handling is done in onError callback
        console.error('Login error:', error);
      }
  }
  return (
    <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.AFFILIATE}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Affiliate</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Affiliate</span></h4>
            </div>
          </div>
        </Header>
      <AffiliateForm
       onSubmit={handleCreateAffiliate}
       type={"Create Affiliate"}
      />
      </div>
    </AdminRootLayout>
  )
}

export default CreateAffiliatePage;
