import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { TFaqForm } from "@/components/faq/FaqForm";
import FaqForm from "@/components/faq/FaqForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateFaqPage = () => {
  const navigate = useNavigate();
  const createFaqMutation = queries.useCreateFaqMutation();
  const handleSubmit = async (data: TFaqForm): Promise<void> => {
    try {
      toastPromise(createFaqMutation.mutateAsync(data), {
        loading: "Creating faq...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.FAQ);
          return "Yeah! Faq created successfully";
        },
        error: "Failed to create faq",
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
        title="Create Faq"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Faq", path: constant.ROUTING_URLS.FAQ },
          { label: "Create Faq" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.FAQ,
        }}
      />
      <FaqForm onSubmit={handleSubmit} type="Create Faq" />
    </div>
  );
};

export default CreateFaqPage;
