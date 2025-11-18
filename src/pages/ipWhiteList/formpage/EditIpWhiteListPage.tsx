import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchIPWhiteListById } from "@/api/ipWhiteList.api";
import IpWhiteListForm, {
  type TIpWhiteListForm,
} from "@/components/ipWhiteList/IpWhiteListForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditIpWhiteListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchIPWhiteListById(id!);
  const editIpWhiteList = queries.useEditIPWhiteListMutation();
  const handleSubmit = async (data: TIpWhiteListForm): Promise<void> => {
    try {
      toastPromise(editIpWhiteList.mutateAsync({ id: id!, data }), {
        loading: "Updating IP white list...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.IP_WHITE_LIST);
          return "Yeah! IP white list updated successfully.";
        },
        error: (e) =>
          e instanceof Error
            ? e.message
            : "Opps! Failed to edit IP white list. Please try again...",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to edit IP white list. Please try again...");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit IP"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "IP White Lists",
            path: constant.ROUTING_URLS.IP_WHITE_LIST,
          },
          { label: "Edit IP" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.IP_WHITE_LIST,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <IpWhiteListForm
          initialData={data}
          onSubmit={handleSubmit}
          type="Edit IP"
        />
      )}
    </div>
  );
};

export default EditIpWhiteListPage;
