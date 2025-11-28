import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PageHeader } from "@/components/layouts/PageHeader";
import type { TRegion } from "@/components/regionManagement/region/RegionForm";
import RegionForm from "@/components/regionManagement/region/RegionForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

function AddRegionPage() {
  const navigate = useNavigate();

  const createRegion = queries.useCreateRegionMutation();
  async function onSubmit(values: TRegion) {
    try {
      toastPromise(createRegion.mutateAsync(values), {
        loading: "Creating region...",
        success: (res) => {
          if (res?.status === true) {
            navigate(constant.ROUTING_URLS.REGION);
          }
          return "Yeah! Region created successfully";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Opps! Failed to create region",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Region"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Region Management" },
          { label: "Regions", path: constant.ROUTING_URLS.REGION },
          { label: "Create Region" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.REGION,
        }}
      />

      <RegionForm title="Create Region" onSubmit={onSubmit} />
    </div>
  );
}

export default AddRegionPage;
