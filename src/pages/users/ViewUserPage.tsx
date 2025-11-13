//@ts-nocheck

import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchUserById from "@/api/getUserById.api";
import Header from "@/components/layouts/BreadCramb";
import { Spinner } from "@/components/Spinner";
import { getStatusColor } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";

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
//     location: "California",
//     status: "Active",
//     createdAt: "2025-05-05T12:19:41.972Z",
//     updatedAt: "2025-05-05T12:19:41.972Z",
// }

const _showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const ViewUserPage = () => {
  const { id } = useParams();
  // const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);

  const { data, isError, refetch, isFetching } = useFetchUserById({ id });
  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <Link to={constant.ROUTING_URLS.USERS}>
        <Button
          variant="outline"
          className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
        >
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <h2 className="font-medium text-xl text-black">User</h2>
            <h4>
              {" "}
              <span className="text-[#959595] w-[116px] h-4 text-xs">User</span>{" "}
              <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                / View User
              </span>
            </h4>
          </div>
        </div>
      </Header>
      {isFetching ? (
        <Spinner />
      ) : (
        <Card className="inset-shadow-xs inset-shadow-[#F1F1F1] bg-[#FDFDFD] rounded-[6px] px-5 space-y-6">
          <Suspense fallback={<h1 className="text-2xl">Loading...</h1>}>
            <CardHeader className="w-full h-[55px] flex items-center justify-between">
              <div className="w-full h-full">
                <h4 className="font-semibold text-xl text-[#000000]">
                  {data?.firstName} {data?.lastName}
                </h4>
                <h5 className="text-[#5A5A5A] font-semibold">
                  Location: {data?.location}
                </h5>
              </div>
              {/* <DropdownMenu >
                            <DropdownMenuTrigger asChild> */}
              <Button
                variant="outline"
                className={`w-[180px] h-[39px] flex items-center justify-between rounded mt-5 shadow-inner shadow-[#F1F1F1] cursor-pointer bg-[#FFFFFF] ${getStatusColor(data?.status?.toLowerCase())} ${data?.status?.toLowerCase() === "active" && "text-white"}`}
              >
                {data?.status}
              </Button>
              {/* </DropdownMenuTrigger>
                            <DropdownMenuContent className={cn(`w-56 bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] cursor-pointer rounded space-y-1`,

                            )} align="start">
                                <DropdownMenuGroup>
                                    {showStatus.map(option => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            className={`flex items-center justify-between cursor-pointer bg-[#FFFFFF] ${getStatusColor(option.label)} ${option.label === "Active" && "text-white"}`}
                                            onClick={() => setSelectedStatus(option)}
                                        >
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
            </CardHeader>
            <CardContent className="space-y-6">
              <hr className="w-full h-[1px] bg-[#EEEEEE]" />
              <div className="w-full h-full space-y-4">
                <h6 className="text-sm text-[#5A5A5A] h-[19px] w-full">
                  All Details
                </h6>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-semibold capitalize">
                    DOB:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.dateOfBirth}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-semibold capitalize">
                    Gender:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.gender}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-semibold capitalize">
                    Email:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.email}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-semibold capitalize">
                    Payment Method:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Label className="text-sm font-semibold capitalize">
                    Phone:
                  </Label>
                  <span className="text-[#3A3A3A] font-medium">
                    {data?.phoneNumber}
                  </span>
                </div>
              </div>
            </CardContent>
          </Suspense>
        </Card>
      )}
    </div>
  );
};

export default ViewUserPage;
