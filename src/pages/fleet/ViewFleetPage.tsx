import useFetchFleetById from "@/api/getFleetById.api";
import { Spinner } from "@/components/Spinner";
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// const data = {
//     id: "e3848306-8768-478e-987e-f6e85fa5959e",
//     userId: "b587ee6a-e6e3-4c65-9e11-78dfb77d038d",
//     user: {
//         firstName: "John",
//         lastName: "Doe",
//         email: "name@email.com",
//         gender: "female",
//         dateOfBirth: "20-08-2000"
//     },
//     phone: "+1-424-231-6798",
//     affiliate: "NoahAnderson",
//     description: "Sedan Car 4 Doors. Clean In and out. 2 Rows of Seats. Fit for up to 3 Adults with 2 Check-In Bags, and 1 Carry-On Bag.",
//     status: "Active",
//     createdAt: "2025-05-05T12:19:41.972Z",
//     updatedAt: "2025-05-05T12:19:41.972Z",
// }
const ViewFleetPage = () => {
  const { id } = useParams();
  const { data, isFetching } = useFetchFleetById({ id: id! });
  return (
    <AdminRootLayout>
      <div className="px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll">
        <Link to={constant.ROUTING_URLS.FLEETS}>
          <Button
            variant="outline"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Fleet</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">
                  Fleet
                </span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                  / View Fleet
                </span>
              </h4>
            </div>
          </div>
        </Header>
        {isFetching ? (
          <Spinner />
        ) : (
          <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
            <CardHeader className="w-full  flex items-center justify-between">
              <div className="w-full h-full">
                <h4 className="font-semibold text-xl text-[#000000]">
                  {data?.vehicleType}.
                </h4>
                <h5 className="text-[#5A5A5A] font-semibold">
                  Affiliate: {data?.affiliate}
                </h5>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="w-[154px] h-[154px] bg-[#D9D9D9] rounded">
                    <img
                      src={
                        data?.vehicleImages?.[0]?.url
                          ? data?.vehicleImages?.[0]?.url
                          : "/fleet/fleetimg.svg"
                      }
                      alt="image1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded w-[154px] h-[154px] bg-[#D9D9D9]">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        data?.vehicleImages?.[1]?.url
                          ? data?.vehicleImages?.[1]?.url
                          : "/fleet/fleetimg.svg"
                      }
                      alt="image2"
                    />
                  </div>
                  <div className="w-[154px] h-[154px] bg-[#D9D9D9] rounded">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        data?.vehicleImages?.[2]?.url
                          ? data?.vehicleImages?.[2]?.url
                          : "/fleet/fleetimg.svg"
                      }
                      alt="image3"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <div className="w-full h-full space-y-4">
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Description:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.description}
                  </span>
                </div>
                <hr className="w-full h-[1px] bg-[#EEEEEE]" />

                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Bags:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data.bagsCapacity}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Capacity:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data.capacity}
                  </span>
                </div>
                <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Base Fair:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">15</span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Min Fair:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">3</span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Min Hour:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">10</span>
                </div>
                <hr className="w-full h-[1px] bg-[#EEEEEE]" />
                <div className="flex items-center gap-6">
                  <Label className="w-[153px] text-sm font-semibold capitalize">
                    Price per hour:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">60</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRootLayout>
  );
};

export default ViewFleetPage;
