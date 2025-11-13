import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import Header from "@/components/layouts/BreadCramb";
import SettingForm, {
  type TSettingForm,
} from "@/components/settings/SettingForm";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
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
        <Link to={constant.ROUTING_URLS.OUR_PARTNERS}>
          <Button
            variant="secondary"
            className="py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-base-light mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Settings</h2>
              <h4>
                {" "}
                <span className="text-[#959595] w-[116px] h-4 text-xs">
                  Our Partners
                </span>{" "}
                <span className="text-xs text-[#3A3A3A] w-[50px] h-4">
                  / Settings
                </span>
              </h4>
            </div>
          </div>
        </Header>
        <SettingForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default SettingsPage;
