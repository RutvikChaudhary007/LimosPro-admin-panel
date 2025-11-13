import { type Libraries, useLoadScript } from "@react-google-maps/api";
import { IconFileDownload, IconFileInfo } from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UsefetchAffiliateById from "@/api/getAffiliateById.api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getStatusColor } from "@/components/table/column";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldSeparator } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { constant } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];
const libraries = ["places", "geocoding"];

const ViewAffiliatePage = () => {
  const [selectedStatus, setSelectedStatus] = useState(showStatus[0]);
  const { id } = useParams();
  const [googleMapsApiKey] = useState<string | null>(
    env?.VITE_GOOGLE_MAP_KEY ?? "",
  );
  const [, setBusinessAddress] = useState<string | undefined>(undefined);
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: libraries as Libraries,
  });

  // console.log("id:",id)
  const { data, isFetching, isError, refetch } = UsefetchAffiliateById({ id });
  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (isLoaded && data && !loadError) {
        try {
          const address = await geoDecoding({
            lat: data?.businessLocation?.latitude,
            lng: data?.businessLocation?.longitude,
          });
          if (isMounted) {
            console.log("Decoded Address:", address);
            if (address) {
              setBusinessAddress(address as string);
            }
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, data]);
  const documentsLength = data?.documents?.length;
  const docJsx = [1, 2, 3, 4].map((i) => (
    <div key={i} className="flex items-center gap-6">
      <Label className="font-semibold w-full max-w-max"> Document {i}:</Label>
      <div
        className={cn(
          "bg-base-white w-full flex items-center space-x-5",
          i > documentsLength && "opacity-50 cursor-no-drop",
        )}
      >
        <Badge variant="black">
          {i <= documentsLength ? "Submitted" : "Pending"}
        </Badge>

        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          rel="noreferrer"
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="View File"
          >
            <IconFileInfo />
          </Button>
        </Link>
        <Link
          to={i <= documentsLength ? data?.documents[i - 1]?.fileUrl : "#"}
          download={i <= documentsLength ? data?.documents[i - 1] : "#"}
          target="_blank"
        >
          <Button
            variant="outlineNavBtnBlack"
            size="xl"
            spacing="lg"
            tooltip="Download File"
          >
            <IconFileDownload />
          </Button>
        </Link>
      </div>
    </div>
  ));
  if (isError) return <ErrorCard refetch={refetch} />;
  // for (let i = 1; i <= 4; i++) {
  //     docJsx.push (
  //         <div key={i} className="flex items-center gap-6">
  //                         <Label className="block text-sm font-semibold capitalize w-[95px] ">Document {i}:</Label>
  //                         <div className={cn("bg-base-white w-full h-[33px] flex items-center space-x-5", i > documentsLength && "opacity-50 cursor-no-drop")} >
  //                         <Label className="inline-block bg-[#444444] text-white px-2 py-0.5 rounded text-xs text-center !w-[70px] h-5">{i<=documentsLength ? "Submitted" : "Pending"}</Label>
  //                         <Link to={i <= documentsLength ? data.Documents[(i - 1)]: "#"} rel="noreferrer" target="_blank"><img src="/document-eye.svg" alt="eye page" /> </Link>
  //                         <Link to={i <= documentsLength ? data.Documents[(i-1)]:"#"} download={i <= documentsLength ? data.Documents[(i-1)]:"#"} target="_blank"><img src="/document-arrow-down.svg" alt="down page" />
  //                         </Link>
  //                         </div>
  //                     </div>
  //     )
  // }
  return (
    <>
      <PageTitle title={generatePageTitle("Affiliate")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Affiliate"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Affiliate", path: constant.ROUTING_URLS.AFFILIATE },
            { label: "View Affiliate" },
          ]}
          action={{
            variant: "outlineBlack",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.AFFILIATE,
          }}
        />

        {isFetching ? (
          <Spinner />
        ) : (
          <Card>
            <CardBody>
              <CardHeader>
                <CardTitle>{data?.companyName}</CardTitle>
                <CardDescription className="text-sm font-bold">
                  {data?.user?.firstName} {data?.user?.lastName}
                </CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="black">{selectedStatus.label}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(`w-full max-w-56`)}
                      align="start"
                    >
                      <DropdownMenuGroup>
                        {showStatus.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            className={`flex items-center justify-between cursor-pointer ${getStatusColor(option.label)} ${option.label === "Active" && "text-base-white"}`}
                            onClick={() => setSelectedStatus(option)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
              <FieldSeparator />
              <CardContent>
                <div className="w-full space-y-4 mb-4">
                  <h6 className="font-montserrat font-bold text-base-black text-sm my-4">
                    Company
                  </h6>
                  {Object.entries(data as Record<string, React.ReactNode>)?.map(
                    ([key]) => {
                      if (
                        ![
                          "businessemail",
                          "businesscontactnumber",
                          "entitytype",
                          "businessaddress",
                        ].includes(key.toLowerCase())
                      ) {
                        return (
                          <div key={key} className="flex items-center gap-6">
                            <Label>{key}:</Label>
                          </div>
                        );
                      }
                      return <></>;
                    },
                  )}
                </div>
                <FieldSeparator />
                <div className="space-y-4">
                  <h6 className="font-montserrat font-bold text-base-black text-sm mt-4">
                    Documents
                  </h6>
                  {docJsx}
                </div>
              </CardContent>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
};

export default ViewAffiliatePage;
