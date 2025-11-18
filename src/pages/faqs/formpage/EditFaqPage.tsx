import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { TFaqForm } from "@/components/faq/FaqForm";
import FaqForm from "@/components/faq/FaqForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import type { TFaqs } from "@/components/table/column";
import { toastPromise, useToast } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const mockData: TFaqs = {
  id: "1",
  question: "que1",
  answer: "ans1",
};
const EditFaqPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const editFAQ = queries.useEditFaqMutation();
  const handleSubmit = async (data: TFaqForm): Promise<void> => {
    try {
      toastPromise(editFAQ.mutateAsync({ id: id!, data }), {
        loading: "Updating FAQ...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.FAQ);
          return "Yeah! FAQ updated successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Edit FAQ failed",
      });
    } catch (err) {
      if (err instanceof Error)
        toast({
          title: "Edit FAQ failed",
          description: err.message,
          variant: "destructive",
        });
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Faq"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Faq", path: constant.ROUTING_URLS.FAQ },
          { label: "Edit Faq" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.FAQ,
        }}
      />
      <FaqForm initialData={mockData} onSubmit={handleSubmit} type="Edit Faq" />
    </div>
  );
};

export default EditFaqPage;
