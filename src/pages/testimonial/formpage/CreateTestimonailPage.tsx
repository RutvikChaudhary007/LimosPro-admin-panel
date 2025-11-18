import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/PageHeader";
import TestimonialForm from "@/components/testimonail/TestimonialForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import type { TTestimonialFormData } from "@/types/testimonial.type";

const CreateTestimonailPage = () => {
  const navigate = useNavigate();
  const createTestimonialMutation = queries.useCreateTestimonialMutation();
  const handleSubmit = async (data: TTestimonialFormData): Promise<void> => {
    try {
      toastPromise(
        createTestimonialMutation.mutateAsync({
          customerName: data.name,
          content: data.message,
          customerImage: data.photo,
          rating: data.rating,
          isFeatured: data.isFeatured,
        }),
        {
          loading: "Creating testimonial...",
          success: (res) => {
            if (res) navigate(constant.ROUTING_URLS.TESTIMONIALS);
            return "Yeah! Testimonial created successfully";
          },
          error: (e) =>
            e instanceof Error
              ? e.message
              : "Opps! Failed to create testimonial",
        },
      );
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
        title="Create Testimonail"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Testimonails", path: constant.ROUTING_URLS.TESTIMONIALS },
          { label: "Create Testimonail" },
        ]}
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.TESTIMONIALS,
        }}
      />
      <TestimonialForm onSubmit={handleSubmit} type="Create Testimonail" />
    </div>
  );
};

export default CreateTestimonailPage;
