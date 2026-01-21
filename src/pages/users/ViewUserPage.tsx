//@ts-nocheck

import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFetchUserById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardBody,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";

const ViewUserPage = () => {
  const { id } = useParams();

  const { data, isError, refetch, isFetching } = useFetchUserById({ id });
  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="User"
        listRoute={constant.ROUTING_URLS.USERS}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="User Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Users", path: constant.ROUTING_URLS.USERS },
          { label: "View User" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.USERS,
        }}
      />
      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardHeader>
              <CardTitle>
                {data?.firstName} {data?.lastName}
              </CardTitle>
              <CardDescription className="text-sm font-bold">
                Location: {data?.location}
              </CardDescription>
              <CardAction>
                <Button variant="black" className="capitalize">
                  {data?.status}
                </Button>
              </CardAction>
            </CardHeader>
            <FieldSeparator />
            <CardContent>
              <h6 className="texfont-montserrat font-bold text-base-black text-sm mb-4">
                All Details
              </h6>
              <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                <Label className="font-montserrat font-semibold capitalize">
                  DOB:
                </Label>
                <Label>{data?.dateOfBirth}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Gender:
                </Label>
                <Label>{data?.gender}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Email:
                </Label>
                <Label>{data?.email}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Payment Method:
                </Label>
                <Label>{data?.paymentMethod}</Label>
                <Label className="font-montserrat font-semibold capitalize">
                  Phone:
                </Label>
                <Label>{data?.phoneNumber}</Label>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewUserPage;
