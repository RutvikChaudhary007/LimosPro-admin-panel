import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IpWhiteListForm, {
  type TIpWhiteListForm,
} from "@/components/ipWhiteList/IpWhiteListForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateIpWhiteListPage = () => {
  const navigate = useNavigate();
  const createIPWhiteList = queries.useCreateIPWhiteListMutation();
  const handleSubmit = async (data: TIpWhiteListForm): Promise<void> => {
    try {
      toastPromise(createIPWhiteList.mutateAsync(data), {
        loading: "Creating IP White List...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
          return "Yeah! IP White List created successfully.";
        },
        error: (e) =>
          e instanceof Error
            ? e.message
            : "Failed to create IP White List. Please try again.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create IP White List. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create IP"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "IP White Lists",
            path: constant.ROUTING_URLS.IP_WHITE_LIST,
          },
          { label: "Create IP" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.IP_WHITE_LIST,
        }}
      />
      <IpWhiteListForm onSubmit={handleSubmit} type="Create IP" />
    </div>
  );
};

export default CreateIpWhiteListPage;
