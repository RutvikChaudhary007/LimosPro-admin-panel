import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import OurPartnerForm, {
  type TOurPartnerForm,
} from "@/components/OurPartner/OurPartnerForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateOurPartnerPage = () => {
  const navigate = useNavigate();
  const createOurPartner = queries.useCreateOurPartnerMutation();
  const handleSubmit = async (data: TOurPartnerForm): Promise<void> => {
    const formData = new FormData();
    try {
      formData.append("companyName", data.companyName);
      formData.append("url", data.url);
      formData.append("logoUrl", data.photo);
      toastPromise(createOurPartner.mutateAsync(formData), {
        loading: "Creating Partner...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.OUR_PARTNERS);
          return "Partner created successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to create partner.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Partners"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Our Partners", path: constant.ROUTING_URLS.OUR_PARTNERS },
          { label: "Create Partners" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.OUR_PARTNERS,
        }}
      />
      <OurPartnerForm onSubmit={handleSubmit} type="Create Partners" />
    </div>
  );
};

export default CreateOurPartnerPage;
