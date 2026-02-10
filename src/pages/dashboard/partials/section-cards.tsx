import { MetricCard } from "@/components/ui/card";

type TData = {
  totalPartners: number;
  totalBookings: number;
  totalChauffeurs: number;
  totalFleets: number;
  totalRevenue: number;
};
type TProps = {
  data?: TData;
};
export function SectionCards({ data }: TProps) {
  console.log("SectionCards Render:", data);
  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <MetricCard
        title="Total Revenue"
        value={`$${data?.totalRevenue.toFixed(2) ?? 0}`}
        percentage="5.2%"
        bodyClass="pr-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Bookings"
        value={`${data?.totalBookings ?? 0}`}
        percentage="5.2%"
        bodyClass="pr-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Partners"
        value={`${data?.totalPartners ?? 0}`}
        percentage="5.2%"
        bodyClass="pr-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
      <MetricCard
        title="Total Chauffeurs"
        value={`${data?.totalChauffeurs ?? 0}`}
        percentage="5.2%"
        bodyClass="pr-[5px]"
        wrapperClass="border-0"
        valueClass="text-3xl"
      />
    </div>
  );
}
