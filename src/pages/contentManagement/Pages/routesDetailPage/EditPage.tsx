import { ArrowLeft } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";
import RouteDetailsForm from "@/components/contentManagement/routeDetail/RouteDetailsForm";
import { PageHeader } from "@/components/layouts/PageHeader";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

export default function EditPage() {
  const handleSubmit = (data: any) => {
    try {
      console.log("Updating route detail:", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Edit Route Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Route Details"
          breadcrumbs={[
            { label: "Route", path: "/" },
            {
              label: "Content Management",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            {
              label: "Route",
              path: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
            },
            { label: "Edit Route" },
          ]}
          backAction={{
            variant: "outlinePrimary",
            label: "Back",
            icon: <ArrowLeft />,
            link: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          }}
        />
        <RouteDetailsForm
          initialData={undefined}
          onSubmit={handleSubmit}
          type="edit"
        />
      </div>
    </>
  );
}
