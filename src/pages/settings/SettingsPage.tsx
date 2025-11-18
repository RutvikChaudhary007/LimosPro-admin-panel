import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import SettingForm, {
  type TSettingForm,
} from "@/components/settings/SettingForm";
import { generatePageTitle } from "@/utils/seo";

const SettingsPage = () => {
  const handleSubmit = (data: TSettingForm): Promise<void> =>
    new Promise((res) =>
      setTimeout(() => res(console.log("data:", data)), 2000),
    );

  return (
    <>
      <PageTitle title={generatePageTitle("Settings")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Settings"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Settings" }]}
        />
        <SettingForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default SettingsPage;
