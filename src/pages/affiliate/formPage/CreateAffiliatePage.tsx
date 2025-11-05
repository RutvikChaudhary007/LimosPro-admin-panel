import AffiliateForm from "@/components/affiliate/AffiliateForm"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { toastPromise } from "@/hooks/use-toast"
import { constant } from "@/lib/constant"
import queries from "@/lib/queries"
import type { IAffiliate } from "@/types/affiliate/affiliate.type"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

function CreateAffiliatePage() {
  const createAffiliateMutation = queries.useCreateAffiliateMutation()
  const queryClient = useQueryClient()
  const handleCreateAffiliate = async (data: IAffiliate) => {
    console.log("called handleCreateAffiliate", data)
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      // await createAffiliateMutation.mutateAsync(data)
      toastPromise(createAffiliateMutation.mutateAsync(data), {
        loading: "Submitting...",
        success: (res) => {
          if (res.status === true) {
            queryClient.invalidateQueries({ queryKey: ["affiliates"] })
          }
          return "Affiliate created successfully!"
        },
        error: (e) => (e instanceof Error ? e.message : "Failed to create affiliate"),
      })
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Login error:", error)
    }
  }
  return (
    <div className="p-8">
      <Link to={constant.ROUTING_URLS.AFFILIATE}>
        <Button variant="outlinePrimary">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="mt-4 mb-5 h-[79px] bg-[#FDFDFD] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex h-full w-full items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-black">Affiliate</h2>
            <h4>
              {" "}
              <span className="h-4 w-[116px] text-xs text-[#959595]">LIMOSPRO</span>{" "}
              <span className="h-4 w-[50px] text-xs text-[#3A3A3A]">/ Create Affiliate</span>
            </h4>
          </div>
        </div>
      </Header>
      <AffiliateForm onSubmit={handleCreateAffiliate} type={"Create Affiliate"} />
    </div>
  )
}

export default CreateAffiliatePage
