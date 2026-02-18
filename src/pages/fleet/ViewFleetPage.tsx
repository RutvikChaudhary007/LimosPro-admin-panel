import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFetchFleetById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import {
  Card,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";

const ViewFleetPage = () => {
  const { id } = useParams();
  const { data, isFetching, isError, refetch } = useFetchFleetById({ id: id! });
  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Fleet"
        listRoute={constant.ROUTING_URLS.FLEETS}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Fleet Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Fleets", path: constant.ROUTING_URLS.FLEETS },
          { label: "Fleet Details" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.FLEETS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>{data?.vehicleType}</CardTitle>
              <CardDescription className="text-sm font-bold">
                Partner: {data?.partner}
              </CardDescription>
              {data?.vehicleImages?.length > 0 && (
                <div className="flex flex-wrap gap-6 mt-6">
                  {data.vehicleImages.map(
                    (img: { url?: string }, index: number) => (
                      <div key={index} className="w-52 h-52rounded">
                        <img
                          src={img?.url || "/fleet/fleetimg.svg"}
                          alt={`vehicle-${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
                <Label className="font-montserrat font-semibold capitalize">
                  Description:
                </Label>
                <Label> {data?.description}</Label>

                <FieldSeparator className="col-span-full" />

                <Label className="font-montserrat font-semibold capitalize">
                  Bags:
                </Label>
                <Label> {data?.bagsCapacity}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  Capacity:
                </Label>
                <Label> {data?.capacity}</Label>

                <FieldSeparator className="col-span-full" />

                <Label className="font-montserrat font-semibold capitalize">
                  Brand:
                </Label>
                <Label>{data?.brand}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  vehicle Type:
                </Label>
                <Label> {data?.vehicleType}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  model:
                </Label>
                <Label>{data?.model}</Label>

                <Label className="font-montserrat font-semibold capitalize">
                  color:
                </Label>
                <Label>{data?.color}</Label>

                <FieldSeparator className="col-span-full" />

                <Label className="font-montserrat font-semibold capitalize">
                  Plate Number:
                </Label>
                <Label>{data?.plateNumber}</Label>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewFleetPage;
