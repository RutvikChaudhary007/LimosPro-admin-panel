import { ArrowLeft } from "lucide-react";
import RouteDetailsForm from "@/components/contentManagement/routeDetail/RouteDetailsForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { constant } from "@/lib/constant";

export default function CreatePage() {
  const handleCreateRouteDetail = (data: any) => {
    // data is FormData, so we need to append to it, not spread it
    data.append("pageName", "Route");
    data.append("category", "route");

    try {
      console.log("Creating route detail:", data);
    } catch (error) {
      console.error("Create route detail error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="Route Detail"
        breadcrumbs={[
          { label: "Route", path: "/" },
          {
            label: "Content Management",
            path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          },
          { label: "Create Route Details" },
        ]}
        backAction={{
          variant: "outlinePrimary",
          label: "Back",
          icon: <ArrowLeft />,
          link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
        }}
      />
      <RouteDetailsForm onSubmit={handleCreateRouteDetail} type={"Create"} />
    </div>
  );
}
