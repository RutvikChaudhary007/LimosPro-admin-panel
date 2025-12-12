import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchPartnerById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import OurPartnerForm, {
  type TOurPartnerForm,
} from "@/components/OurPartner/OurPartnerForm";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditOurPartnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchPartnerById(id!);
  const editPartner = queries.useEditOurPartnerMutation();
  const handleSubmit = async (data: TOurPartnerForm): Promise<void> => {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("url", data.url);
    formData.append("logoUrl", data.photo);
    try {
      toastPromise(editPartner.mutateAsync({ id: id!, data: formData }), {
        loading: "Updating Partner...",
        success: (res) => {
          if (res) {
            navigate(constant.ROUTING_URLS.OUR_PARTNERS);
          }
          return "Yeah! Partner updated successfully";
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Opps! Failed to update partner",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Partners"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Our Partners", path: constant.ROUTING_URLS.OUR_PARTNERS },
          { label: "Edit Partners" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.OUR_PARTNERS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <OurPartnerForm
          initialData={data}
          onSubmit={handleSubmit}
          type="Edit Partners"
        />
      )}
    </div>
  );
};

export default EditOurPartnerPage;
