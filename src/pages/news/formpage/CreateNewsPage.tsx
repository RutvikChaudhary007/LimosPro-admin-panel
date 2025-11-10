import Header from "@/components/layouts/BreadCramb";
import NewsForm, { type TNewsForm } from "@/components/news/NewsForm";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateNewsPage = () => {
  const navigate = useNavigate();
  const createNewsMutation = queries.useCreateNewsMutation();
  const handleSubmit = async (data: TNewsForm): Promise<void> => {
    try {
      toastPromise(createNewsMutation.mutateAsync({ body: data.news }), {
        loading: "Creating news...",
        success: (res) => {
          if (res) navigate(constant.ROUTING_URLS.NEWS);
          return "Yeah! News created successfully";
        },
        error: "Failed to create news",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <Link to={constant.ROUTING_URLS.NEWS}>
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
              <h2 className="font-medium text-xl text-black">News</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">News</span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create News</span>
              </h4>
            </div>
          </div>
        </Header>
        <NewsForm onSubmit={handleSubmit} type="Create News" />
      </div>
    </>
  );
};

export default CreateNewsPage;
