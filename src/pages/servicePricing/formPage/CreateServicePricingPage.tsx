import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useFetchAllFleets, useFetchAllRegions } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import ServicePricingForm from "@/components/servicePricing/ServicePricingForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const CreateServicePricingPage = () => {
  const { data: vehicleData, isFetching: isVehicleFetching } =
    useFetchAllFleets({ DateRange: {} });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const createServicePricingMutation =
    queries.useCreateServicePricingMutation();

  const handleCreateServicePricing = async (data: FormData) => {
    await toastPromise(createServicePricingMutation.mutateAsync(data), {
      loading: "Creating service pricing...",
      success: "Service pricing created successfully!",
      error: (e) =>
        e instanceof AxiosError
          ? e.response?.data?.data?.error || e.response?.data?.message
          : "Failed to create service pricing.",
    });
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Create Service Pricing"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Service Pricing",
            path: constant.ROUTING_URLS.SERVICE_PRICING,
          },
          { label: "Create Service Pricing" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.SERVICE_PRICING,
        }}
      />
      <ServicePricingForm
        onSubmit={handleCreateServicePricing}
        isVehicleFetching={isVehicleFetching}
        vehicleData={vehicleData}
        RegionData={RegionData}
        isRegionFetching={isRegionFetching}
        type="Create Service Pricing"
      />
    </div>
  );
};

export default CreateServicePricingPage;
