import { Plus } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const PageListPage = () => {
  return (
    <>
      <PageTitle title={generatePageTitle("List Page")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="List Page"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Content Management" },
            { label: "List" },
          ]}
          action={{
            label: "Create Page",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
          }}
        />
      </div>
    </>
  );
};

export default PageListPage;
