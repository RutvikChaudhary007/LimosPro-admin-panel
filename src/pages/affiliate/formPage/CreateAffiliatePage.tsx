import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

function CreateAffiliatePage() {
  // const {toast} = useToast();
  // const navigate = useNavigate();
  const createAffiliateMutation = queries.useCreateAffiliateMutation();
  const queryClient = useQueryClient();
  const handleCreateAffiliate = (data: FormData) => {
    console.log("called handleCreateAffiliate", data);
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      // await createAffiliateMutation.mutateAsync(data)
      toastPromise(createAffiliateMutation.mutateAsync(data), {
        loading: "Submitting...",
        success: (res) => {
          if (res) {
            queryClient.invalidateQueries({ queryKey: ["affiliates"] });
          }
          return "Affiliate created successfully!";
        },
        error: (e) => (e instanceof Error ? e.message : "Failed to create affiliate"),
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Login error:", error);
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <Link to={constant.ROUTING_URLS.AFFILIATE}>
        <Button variant="outlineBlack">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <PageHeader title="Affiliate" breadcrumbs={[{ label: "Home", path: "/" }, { label: "Create Affiliate" }]} />
      <AffiliateForm onSubmit={handleCreateAffiliate} type={"Create Affiliate"} />
    </div>
  );
}

export default CreateAffiliatePage;
