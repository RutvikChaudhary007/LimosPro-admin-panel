import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchTestimonialById } from "@/api/testimonial.api";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import TestimonialForm from "@/components/testimonail/TestimonialForm";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TTestimonialFormData } from "@/types/testimonial.type";

const EditTestimonailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchTestimonialById({ id: id || "" });
  const editTestimonialMutation = queries.useEditTestimonialMutation();
  const handleSubmit = async (data: TTestimonialFormData): Promise<void> => {
    try {
      toastPromise(
        editTestimonialMutation.mutateAsync({
          data: {
            customerName: data.name,
            content: data.message,
            customerImage: data.photo,
            rating: data.rating,
            isFeatured: data.isFeatured,
          },
          id: id!,
        }),
        {
          loading: "Updating Testimonail...",
          success: (res) => {
            if (res) navigate(constant.ROUTING_URLS.TESTIMONIALS);
            return "Yeah! Testimonail updated successfully";
          },
          error: (e) => (e instanceof Error ? e.message : "Opps! Failed to update testimonial"),
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected error occured");
      }
    }
  };
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <Link to={constant.ROUTING_URLS.TESTIMONIALS}>
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
            <h2 className="font-medium text-xl text-black">Testimonail</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">Testimonail</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Testimonail</span>
            </h4>
          </div>
        </div>
      </Header>
      {isFetching ? (
        <Spinner />
      ) : (
        <TestimonialForm initialData={data} onSubmit={handleSubmit} type="Edit Testimonail" />
      )}
    </div>
  );
};

export default EditTestimonailPage;
