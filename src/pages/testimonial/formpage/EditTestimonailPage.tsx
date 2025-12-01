import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchTestimonialById } from "@/api/testimonial.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import TestimonialForm from "@/components/testimonail/TestimonialForm";
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
      const formData = new FormData();
      formData.append("customerName", data.name);
      formData.append("content", data.message);
      formData.append("rating", data.rating.toString());
      formData.append("isFeatured", data.isFeatured.toString());

      if (data?.photo) {
        formData.append("customerImage", data?.photo);
      }
      toastPromise(
        editTestimonialMutation.mutateAsync({
          data: formData,
          id: id!,
        }),
        {
          loading: "Updating Testimonail...",
          success: (res) => {
            if (res) navigate(constant.ROUTING_URLS.TESTIMONIALS);
            return "Yeah! Testimonail updated successfully";
          },
          error: (e) =>
            e instanceof Error
              ? e.message
              : "Opps! Failed to update testimonial",
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
      <PageHeader
        title="Edit Testimonail"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Testimonails", path: constant.ROUTING_URLS.TESTIMONIALS },
          { label: "Edit Testimonail" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.TESTIMONIALS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <TestimonialForm
          initialData={data}
          onSubmit={handleSubmit}
          type="Edit Testimonail"
        />
      )}
    </div>
  );
};

export default EditTestimonailPage;
