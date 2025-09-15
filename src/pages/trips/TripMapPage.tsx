import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import LiveTracking from "@/components/liveTracking/LiveTracking";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MessageSquareMore, Phone, Route, Send } from "lucide-react";
import { useState } from "react";

const TripMapPage = () => {
  const pickup = { lat: 30.2672, lng: -97.7431 }; // Austin
  const drop = { lat: 40.7128, lng: -74.006 };   // NYC
  const car = { lat: 35.0, lng: -90.0 }; // Somewhere on route

  return (
    <AdminRootLayout>
      <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-auto relative">
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Track Live Location</h2>
              <h4 className="text-[#959595] text-sm mt-1">
                Trips / Track Live Location
              </h4>
            </div>
          </div>
        </Header>

        <div className="w-full h-[684px] mt-5 rounded overflow-hidden shadow">
          <LiveTracking
            dropPosition={drop}
            livePosition={pickup}
          // carPosition={car} 
          />
        </div>

        {/* Passenger & Chauffeur info section */}
        <Content />
      </div>
    </AdminRootLayout>
  );
};

const Content = () => {
  const [activeTab, setActiveTab] = useState("passengerDetails");
  return (
    <div className="w-full mx-auto bg-white rounded shadow mt-6 flex flex-col md:flex-col items-center justify-center px-6 py-2 gap-6 border">
      {/* Nav Tabs */}
      <div className="w-full h-full flex items-center justify-between">
        <Label className="w-full cursor-pointer block" onClick={() => setActiveTab("carAndChauffeur")}>
          <div className="text-xs font-semibold text-black mb-1 items-start text-center">Car and Chauffeur</div>
          <hr className={cn("w-full h-full border",
            activeTab === "carAndChauffeur" ? "border-black" : "border-[#D9D9D9]"
          )} />
        </Label>

        <Label className="w-full cursor-pointer block" onClick={() => setActiveTab("passengerDetails")}>
          <div className="text-xs font-semibold text-black mb-1 items-center text-center">Passenger’s Details</div>
          <hr className={cn("w-full h-full border",
            activeTab === "passengerDetails" ? "border-black" : "border-[#D9D9D9]"
          )} />
        </Label>
        <Label className="w-full cursor-pointer block" onClick={() => setActiveTab("trackingDetails")}>
          <div className="text-xs font-semibold text-black mb-1 items-end text-center">Tracking Details</div>
          <hr className={cn("w-full h-full border",
            activeTab === "trackingDetails" ? "border-black" : "border-[#D9D9D9]"
          )} />
        </Label>
      </div>
      {/* Car and Chauffeur Details */}
      {activeTab === "carAndChauffeur" && (<div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-600">N</span>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Noah Anderson</div>
            <div className="text-xs text-gray-500">Passenger</div>
          </div>
        </div>
        {/* Pan */}
        <div>
          <div className="font-semibold text-gray-700">PAN:</div>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-semibold">ABCDE1234F</span>
          </div>
        </div>

        {/* license */}
        <div>
          <div className="font-semibold text-gray-700">License:</div>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-semibold">A1234567</span>
          </div>
        </div>

        {/* Car */}
        <div>
          <div className="font-semibold text-gray-700">Car:</div>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-semibold">Executive Sedan Cadillac. Lincoln. Or Similar.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-3 py-1 bg-[#5A5A5A] text-white rounded-lg shadow text-xs font-semibold hover:bg-gray-300 transition">
            <Phone className="w-4 h-4 mr-1 fill-none" />
            Call
          </button>
          <button className="inline-flex items-center px-3 py-1 bg-[#F9F9F9] text-[#5A5A5A] rounded-lg shadow text-xs font-semibold hover:bg-[#F9F9F9] transition">
            <MessageSquareMore className="w-4 h-4 mr-1 fill-none" />
            Chat
          </button>
        </div>
      </div>)}


      {/* Passenger’s Details */}
      {activeTab === "passengerDetails" && (<div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-600">N</span>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Noah Anderson</div>
            <div className="text-xs text-gray-500">Passenger</div>
          </div>
        </div>
        {/* Email */}
        <div>
          <div className="font-semibold text-gray-700">Email:</div>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-semibold">name@email.com</span>
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
            <span className="font-semibold">1234 Elm Street, Los Angeles, CA 90001</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-3 py-1 bg-[#5A5A5A] text-white rounded-lg shadow text-xs font-semibold hover:bg-gray-300 transition">
            <Phone className="w-4 h-4 mr-1 fill-none" />
            Call
          </button>
          <button className="inline-flex items-center px-3 py-1 bg-[#F9F9F9] text-[#5A5A5A] rounded-lg shadow text-xs font-semibold hover:bg-[#F9F9F9] transition">
            <MessageSquareMore className="w-4 h-4 mr-1 fill-none" />
            Chat
          </button>
        </div>
      </div>)}
      

      {/* Tracking Details */}
      {activeTab === "trackingDetails" && (<div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center space-x-3">
          <Send className="text-[#5A5A5A]" />
          <div>
            <div className="font-medium text-gray-700">Current Location</div>
            <div className="text-xs font-medium text-gray-500">San Francisco</div>
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
        
    
        
      </div>)}
    </div>
  );
};

export default TripMapPage;
