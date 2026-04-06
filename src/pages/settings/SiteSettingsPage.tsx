import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import GlobalLimitsForm from "@/components/settings/GlobalLimitsForm";
import SiteSettingsForm from "@/components/settings/SiteSettingsForm";
import { generatePageTitle } from "@/utils/seo";

const SiteSettingsPage = () => {
  return (
    <>
      <PageTitle title={generatePageTitle("Setting")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Settings"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Settings" }]}
        />
        <SiteSettingsForm />
        <GlobalLimitsForm />
      </div>
    </>
  );
};

export default SiteSettingsPage;
