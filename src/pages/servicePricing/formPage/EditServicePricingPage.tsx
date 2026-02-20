import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFetchAllFleets, useFetchAllRegions } from "@/api";
import { useFetchServicePricingById } from "@/api/servicePricing.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import ServicePricingForm from "@/components/servicePricing/ServicePricingForm";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const EditServicePricingPage = () => {
  const { id } = useParams();
  const { data: vehicleData, isFetching: isVehicleFetching } =
    useFetchAllFleets({ DateRange: {} });
  const { data: RegionData, isFetching: isRegionFetching } = useFetchAllRegions(
    {},
  );
  const { data, isFetching, isError, refetch } = useFetchServicePricingById({
    id: id!,
  });
  const editServicePricingMutation = queries.useEditServicePricingMutation();

  const handleEditServicePricing = async (
    formData: Record<string, unknown>,
  ) => {
    await toastPromise(
      editServicePricingMutation.mutateAsync({ id: id!, data: formData }),
      {
        loading: "Updating service pricing...",
        success: "Service pricing updated successfully!",
        error: (e) =>
          e instanceof AxiosError
            ? e.response?.data?.data?.error || e.response?.data?.message
            : "Failed to update service pricing.",
      },
    );
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Edit Service Pricing"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Service Pricing",
            path: constant.ROUTING_URLS.SERVICE_PRICING,
          },
          { label: "Edit Service Pricing" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.SERVICE_PRICING,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : isError ? (
        <ErrorCard refetch={refetch} />
      ) : !data || !data.id ? (
        <EmptyDataState
          entityName="Service Pricing"
          listRoute={constant.ROUTING_URLS.SERVICE_PRICING}
        />
      ) : (
        <ServicePricingForm
          initialData={data}
          onSubmit={handleEditServicePricing}
          isVehicleFetching={isVehicleFetching}
          vehicleData={vehicleData}
          RegionData={RegionData}
          isRegionFetching={isRegionFetching}
          type="Edit Service Pricing"
        />
      )}
    </div>
  );
};

export default EditServicePricingPage;
