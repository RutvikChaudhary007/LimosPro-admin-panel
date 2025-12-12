//@ts-nocheck

import { ArrowLeft, MessageSquareMore, Phone, Route, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useFetchTripById } from "@/api";
import { PageHeader } from "@/components/layouts/PageHeader";
import LiveTracking from "@/components/liveTracking/LiveTracking";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constant } from "@/lib/constant";

const TripMapPage = () => {
  const { id } = useParams();
  const { data, isFetching } = useFetchTripById({ id: id! });

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8 relative">
      <PageHeader
        title="Live Trip Tracking"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Trips", path: constant.ROUTING_URLS.TRIPS },
          { label: "Live Trip Tracking" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.TRIPS,
        }}
      />

      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <Card>
            <CardBody className="p-0">
              <div className="w-full h-[600px] rounded border border-base-gray overflow-hidden">
                <LiveTracking
                  dropPosition={data?.dropoffLocation}
                  pickPosition={data?.pickupLocation}
                  // carPosition={car}
                />
              </div>
            </CardBody>
          </Card>

          {/* Passenger & Chauffeur info section */}
          <Content data={data} />
        </>
      )}
    </div>
  );
};

const Content = ({ data }: { data: object }) => {
  return (
    <Card>
      <CardBody>
        <Tabs defaultValue="passengerDetails" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="carAndChauffeur">Car and Chauffeur</TabsTrigger>
            <TabsTrigger value="passengerDetails">
              Passenger's Details
            </TabsTrigger>
            <TabsTrigger value="trackingDetails">Tracking Details</TabsTrigger>
          </TabsList>

          {/* Car and Chauffeur Details */}
          <TabsContent value="carAndChauffeur">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-secondary rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-base-white">
                      {data?.chauffeur?.firstName?.slice(0, 1)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-base-black">
                      {data?.chauffeur?.firstName} {data?.chauffeur?.lastName}
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      Chauffeur
                    </Badge>
                  </div>
                </div>

                {/* Tax Id Number */}
                <div>
                  <Label className="font-montserrat font-semibold">
                    Tax Id Number:
                  </Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.chauffeur?.taxIdNumber || "N/A"}
                  </div>
                </div>

                {/* License */}
                <div>
                  <Label className="font-montserrat font-semibold">
                    License:
                  </Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.chauffeur?.licenseNumber || "N/A"}
                  </div>
                </div>

                {/* Car */}
                <div>
                  <Label className="font-montserrat font-semibold">Car:</Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.vehicle?.make} {data?.vehicle?.model}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="black" size="sm" spacing="sm" asChild>
                    <Link to={`tel:${data?.chauffeur?.phoneNumber}`}>
                      <Phone />
                      Call
                    </Link>
                  </Button>
                  <Button
                    variant="outlineBlack"
                    size="sm"
                    spacing="sm"
                    type="button"
                  >
                    <MessageSquareMore />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          {/* Passenger's Details */}
          <TabsContent value="passengerDetails">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-primary rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-base-white">
                      {data?.user?.firstName?.slice(0, 1)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-base-black">
                      {data?.user?.firstName} {data?.user?.lastName}
                    </div>
                    <Badge variant="default" className="mt-1">
                      Passenger
                    </Badge>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label className="font-montserrat font-semibold">
                    Email:
                  </Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.user?.email}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="font-montserrat font-semibold">
                    Location:
                  </Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.user?.location || "California"}
                  </div>
                </div>

                {/* Primary Address */}
                <div>
                  <Label className="font-montserrat font-semibold">
                    Primary Address:
                  </Label>
                  <div className="text-sm text-base-black/70 mt-1">
                    {data?.user?.address ||
                      "1234 Elm Street, Los Angeles, CA 90001"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="black" size="sm" spacing="sm" asChild>
                    <Link to={`tel:${data?.user?.phoneNumber}`}>
                      <Phone />
                      Call
                    </Link>
                  </Button>
                  <Button
                    variant="outlineBlack"
                    size="sm"
                    spacing="sm"
                    type="button"
                  >
                    <MessageSquareMore />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          {/* Tracking Details */}
          <TabsContent value="trackingDetails">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-info/10 rounded-full flex items-center justify-center">
                    <Send className="text-base-info" />
                  </div>
                  <div>
                    <Label className="font-montserrat font-semibold">
                      Current Location
                    </Label>
                    <div className="text-sm text-base-black/70 mt-1">
                      San Francisco
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-success/10 rounded-full flex items-center justify-center">
                    <Route className="text-base-success" />
                  </div>
                  <div>
                    <Label className="font-montserrat font-semibold">
                      Distance Covered
                    </Label>
                    <div className="text-sm text-base-black/70 mt-1">
                      14 miles
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-warning/10 rounded-full flex items-center justify-center">
                    <Route className="text-base-warning" />
                  </div>
                  <div>
                    <Label className="font-montserrat font-semibold">
                      Total Distance
                    </Label>
                    <div className="text-sm text-base-black/70 mt-1">
                      98 Miles
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default TripMapPage;
