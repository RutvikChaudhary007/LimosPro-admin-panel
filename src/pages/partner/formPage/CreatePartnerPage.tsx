import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layouts/PageHeader";
import PartnerForm from "@/components/partner/PartnerForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

function CreatePartnerPage() {
  const navigate = useNavigate();
  // const {toast} = useToast();
  const createPartnerMutation = queries.useCreatePartnerMutation();
  const handleCreatePartner = async (data: FormData) => {
    // console.log("called handleCreatePartner", data);
    try {
      // Remove remember field before sending to API
      // await loginMutation.mutateAsync(loginData);
      // await createPartnerMutation.mutateAsync(data)
      await toastPromise(createPartnerMutation.mutateAsync(data), {
        loading: "Submitting...",
        success: "Partner created successfully!",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Failed to create Partner",
      });

      navigate(constant.ROUTING_URLS.PARTNER);
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Login error:", error);
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Partner"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Partner", path: constant.ROUTING_URLS.PARTNER },
          { label: "Create Partner" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.PARTNER,
        }}
      />
      <PartnerForm onSubmit={handleCreatePartner} type={"Create Partner"} />
    </div>
  );
}

export default CreatePartnerPage;
