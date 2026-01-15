import { useState } from "react";
import { useFetchAllReports } from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminReports from "./AdminReports";
import PartnerReports from "./PartnerReports";

export default function ReportsLayout() {
  const [activeTab, setActiveTab] = useState("admin");
  const { data: reports } = useFetchAllReports({});
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reports Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            View insights on disputes, revenue, and compliance.
          </p>
          <p className="text-gray-500 mt-1">
            <strong>
              {" "}
              <span className="text-red-500">*</span>This is just for demo
              purpose.
            </strong>
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="admin">Admin Reports</TabsTrigger>
          <TabsTrigger value="Partner">Partner Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-4">
          <AdminReports reports={reports} />
        </TabsContent>

        <TabsContent value="Partner" className="space-y-4">
          <PartnerReports reports={reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
