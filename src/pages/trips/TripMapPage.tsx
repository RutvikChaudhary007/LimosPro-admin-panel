//@ts-nocheck

import { ArrowLeft, MessageSquareMore, Phone, Route, Send } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchTripById from "@/api/getTripById.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import LiveTracking from "@/components/liveTracking/LiveTracking";
import { Spinner } from "@/components/Spinner";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";

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
        action={{
          variant: "outlineBlack",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.TRIPS,
        }}
      />

      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <div className="w-full h-[600px] mt-5 rounded overflow-hidden shadow-base-md">
            <LiveTracking
              dropPosition={data?.dropoffLocation}
              pickPosition={data?.pickupLocation}
              // carPosition={car}
            />
          </div>

          {/* Passenger & Chauffeur info section */}
          <Content data={data} />
        </>
      )}
    </div>
  );
};

const Content = ({ data }: { data: object }) => {
  const [activeTab, setActiveTab] = useState("passengerDetails");
  return (
    <div className="w-full mx-auto bg-white rounded shadow mt-6 flex flex-col md:flex-col items-center justify-center px-6 py-2 gap-6 border">
      {/* Nav Tabs */}
      <div className="w-full h-full flex items-center justify-between">
        <Label
          className="w-full cursor-pointer block"
          onClick={() => setActiveTab("carAndChauffeur")}
        >
          <div className="text-xs font-semibold text-black mb-1 items-start text-center">
            Car and Chauffeur
          </div>
          <hr
            className={cn(
              "w-full h-full border",
              activeTab === "carAndChauffeur"
                ? "border-black"
                : "border-[#D9D9D9]",
            )}
          />
        </Label>

        <Label
          className="w-full cursor-pointer block"
          onClick={() => setActiveTab("passengerDetails")}
        >
          <div className="text-xs font-semibold text-black mb-1 items-center text-center">
            Passenger’s Details
          </div>
          <hr
            className={cn(
              "w-full h-full border",
              activeTab === "passengerDetails"
                ? "border-black"
                : "border-[#D9D9D9]",
            )}
          />
        </Label>
        <Label
          className="w-full cursor-pointer block"
          onClick={() => setActiveTab("trackingDetails")}
        >
          <div className="text-xs font-semibold text-black mb-1 items-end text-center">
            Tracking Details
          </div>
          <hr
            className={cn(
              "w-full h-full border",
              activeTab === "trackingDetails"
                ? "border-black"
                : "border-[#D9D9D9]",
            )}
          />
        </Label>
      </div>
      {/* Car and Chauffeur Details */}
      {activeTab === "carAndChauffeur" && (
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {data?.chauffeur?.firstName?.slice(0, 1)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-700">
                {data?.chauffeur?.firstName} {data?.chauffeur?.lastName}
              </div>
              <div className="text-xs text-gray-500">Chauffeur</div>
            </div>
          </div>
          {/* Pan */}
          <div>
            <div className="font-semibold text-gray-700">PAN:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">
                {data?.chauffeur?.panNumber}
              </span>
            </div>
          </div>

          {/* license */}
          <div>
            <div className="font-semibold text-gray-700">License:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">
                {data?.chauffeur?.licenseNumber}
              </span>
            </div>
          </div>

          {/* Car */}
          <div>
            <div className="font-semibold text-gray-700">Car:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">
                Executive Sedan Cadillac. Lincoln. Or Similar.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`tel:${data?.chauffeur?.phoneNumber}`}
              className="inline-flex items-center px-3 py-1 bg-[#5A5A5A] text-white rounded-lg shadow text-xs font-semibold hover:bg-gray-300 transition "
            >
              <Phone className="w-4 h-4 mr-1 fill-none" />
              Call
              {/* </button> */}
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 bg-[#F9F9F9] text-[#5A5A5A] rounded-lg shadow text-xs font-semibold hover:bg-[#F9F9F9] transition"
            >
              <MessageSquareMore className="w-4 h-4 mr-1 fill-none" />
              Chat
            </button>
          </div>
        </div>
      )}

      {/* Passenger’s Details */}
      {activeTab === "passengerDetails" && (
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {data?.user?.firstName?.slice(0, 1)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-700">
                {data?.user?.firstName} {data?.user?.lastName}
              </div>
              <div className="text-xs text-gray-500">Passenger</div>
            </div>
          </div>
          {/* Email */}
          <div>
            <div className="font-semibold text-gray-700">Email:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">{data?.user?.email}</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="font-semibold text-gray-700">Location:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">California</span>
            </div>
          </div>

          {/* Primary Address: */}
          <div>
            <div className="font-semibold text-gray-700">Primary Address:</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-semibold">
                1234 Elm Street, Los Angeles, CA 90001
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`tel:${data?.user?.phoneNumber}`}
              className="inline-flex items-center px-3 py-1 bg-[#5A5A5A] text-white rounded-lg shadow text-xs font-semibold hover:bg-gray-300 transition"
            >
              <Phone className="w-4 h-4 mr-1 fill-none" />
              Call
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1 bg-[#F9F9F9] text-[#5A5A5A] rounded-lg shadow text-xs font-semibold hover:bg-[#F9F9F9] transition"
            >
              <MessageSquareMore className="w-4 h-4 mr-1 fill-none" />
              Chat
            </button>
          </div>
        </div>
      )}

      {/* Tracking Details */}
      {activeTab === "trackingDetails" && (
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center space-x-3">
            <Send className="text-[#5A5A5A]" />
            <div>
              <div className="font-medium text-gray-700">Current Location</div>
              <div className="text-xs font-medium text-gray-500">
                San Francisco
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <img src="/icons/Vector_19.svg" />
            <div>
              <div className="font-medium text-gray-700">Distance Covered</div>
              <div className="text-xs font-medium text-gray-500">14 miles</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Route className="text-[#5A5A5A]" />
            <div>
              <div className="font-medium text-gray-700">Total Distance</div>
              <div className="text-xs font-medium text-gray-500">98 Miles</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMapPage;
