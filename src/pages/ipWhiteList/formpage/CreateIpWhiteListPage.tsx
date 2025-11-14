import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IpWhiteListForm, {
  type TIpWhiteListForm,
} from "@/components/ipWhiteList/IpWhiteListForm";
import Header from "@/components/layouts/BreadCramb";
import { Button } from "@/components/ui/button";
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
      <Link to={constant.ROUTING_URLS.IP_WHITE_LIST}>
        <Button
          variant="secondary"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-md mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">IP white list</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">
                IP white list
              </span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                / Add IP
              </span>
            </h4>
          </div>
        </div>
      </Header>
      <IpWhiteListForm onSubmit={handleSubmit} type="Create IP" />
    </div>
  );
};

export default CreateIpWhiteListPage;
