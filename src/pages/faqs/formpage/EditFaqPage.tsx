import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { TFaqForm } from "@/components/faq/FaqForm";
import FaqForm from "@/components/faq/FaqForm";
import Header from "@/components/layouts/BreadCramb";
import type { TFaqs } from "@/components/table/column";
import { Button } from "@/components/ui/button";
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
      <Link to={constant.ROUTING_URLS.FAQ}>
        <Button
          variant="secondary"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">
              Frequently Asked Question
            </h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">Faq</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                / Edit Faq
              </span>
            </h4>
          </div>
        </div>
      </Header>
      <FaqForm initialData={mockData} onSubmit={handleSubmit} type="Edit Faq" />
    </div>
  );
};

export default EditFaqPage;
