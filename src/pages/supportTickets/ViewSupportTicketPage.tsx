import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { updateSupportTicketStatus, useFetchSupportTicketById } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import { EmptyDataState } from "@/components/EmptyDataState";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
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
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import { formatFieldValue } from "@/utils/formatters";

const ViewSupportTicketPage = () => {
  const { id } = useParams();
  const { data, isFetching, isError, refetch } = useFetchSupportTicketById({
    id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateSupportTicketStatus,
    onSuccess: () => refetch(),
  });

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    await toastPromise(updateStatusMutation.mutateAsync({ id, status }), {
      loading: "Updating status...",
      success: "Ticket status updated",
      error: "Failed to update status",
    });
  };

  const formatTicketDate = (value?: string) => {
    if (!value) return "N/A";
    try {
      return format(new Date(value), "EEEE, dd MMM yyyy");
    } catch {
      return "N/A";
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  if (!isFetching && (!data || !data.id)) {
    return (
      <EmptyDataState
        entityName="Support Ticket"
        listRoute={constant.ROUTING_URLS.SUPPORT_TICKETS}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Support Ticket Details"
        breadcrumbs={[
          { label: "Home", path: "/" },
          {
            label: "Support Tickets",
            path: constant.ROUTING_URLS.SUPPORT_TICKETS,
          },
          { label: "View Ticket" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.SUPPORT_TICKETS,
        }}
        action={[
          {
            label: "Resolve",
            icon: <CheckCircle2 />,
            variant: "outlineNavBtnPrimary",
            onClick: () => handleStatusUpdate("RESOLVED"),
          },
          {
            label: "Closed",
            icon: <XCircle />,
            variant: "outlineNavBtnDestructive",
            onClick: () => handleStatusUpdate("CLOSED"),
          },
        ]}
      />

      {isFetching ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody className="space-y-6">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>{formatFieldValue(data?.title)}</CardTitle>
                  <CardDescription className="text-sm font-bold">
                    Ticket ID: {formatFieldValue(data?.id)}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {formatFieldValue(data?.type)}
                  </Badge>
                  <Badge variant="outline">
                    {formatFieldValue(data?.category)}
                  </Badge>
                  <Badge variant="secondary">
                    {formatFieldValue(data?.priority)}
                  </Badge>
                  <Badge
                    variant={
                      data?.status === "OPEN"
                        ? "destructive"
                        : data?.status === "RESOLVED"
                          ? "success"
                          : "default"
                    }
                  >
                    {formatFieldValue(data?.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <FieldSeparator />
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-lg border border-base-light-gray/60 p-4">
                  <h6 className="font-montserrat font-semibold text-sm text-base-black mb-4">
                    Ticket Summary
                  </h6>
                  <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                    <Label className="font-montserrat font-semibold capitalize">
                      Raised By:
                    </Label>
                    <Label>
                      {formatFieldValue(data?.raisedBy || data?.userType)}
                    </Label>

                    <Label className="font-montserrat font-semibold capitalize">
                      Region:
                    </Label>
                    <Label>{formatFieldValue(data?.region)}</Label>

                    <Label className="font-montserrat font-semibold capitalize">
                      Description:
                    </Label>
                    <Label>{formatFieldValue(data?.description)}</Label>
                  </div>
                </div>

                <div className="rounded-lg border border-base-light-gray/60 p-4 space-y-4">
                  <h6 className="font-montserrat font-semibold text-sm text-base-black">
                    Timeline
                  </h6>
                  <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                    <Label className="font-montserrat font-semibold capitalize">
                      Created:
                    </Label>
                    <Label>{formatTicketDate(data?.createdAt)}</Label>

                    <Label className="font-montserrat font-semibold capitalize">
                      Updated:
                    </Label>
                    <Label>{formatTicketDate(data?.updatedAt)}</Label>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-base-light-gray/60 p-4">
                <h6 className="font-montserrat font-semibold text-sm text-base-black mb-4">
                  Resolution
                </h6>
                <div className="grid grid-cols-[max-content_1fr] gap-4 items-start">
                  <Label className="font-montserrat font-semibold capitalize">
                    Assigned To:
                  </Label>
                  <Label>{formatFieldValue(data?.assignedTo)}</Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    Resolution Notes:
                  </Label>
                  <Label>{formatFieldValue(data?.resolutionNotes)}</Label>

                  <Label className="font-montserrat font-semibold capitalize">
                    Attachments:
                  </Label>
                  <Label>{formatFieldValue(data?.attachments)}</Label>
                </div>
              </div>
            </CardContent>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ViewSupportTicketPage;
