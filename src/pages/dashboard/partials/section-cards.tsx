import { MetricCard } from "../../../components/ui/card";

type TData = {
	totalAffiliates: number;
	totalBookings: number;
	totalChauffeurs: number;
	totalFleets: number;
	totalRevenue: number;
};
type TProps = {
	data: TData;
};
export function SectionCards({ data }: TProps) {
	return (
		<div className="grid grid-cols-1 gap-6 px-4 lg:px-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<MetricCard
				title="Total Revenue"
				value={`$${data?.totalRevenue}`}
				percentage="5.2%"
				headerClass="px-[5px]"
				wrapperClass="border-0"
				valueClass="text-3xl"
			/>
			<MetricCard
				title="Total Bookings"
				value={`${data?.totalBookings}`}
				percentage="5.2%"
				headerClass="px-[5px]"
				wrapperClass="border-0"
				valueClass="text-3xl"
			/>
			<MetricCard
				title="Total Affiliates"
				value={`${data?.totalAffiliates}`}
				percentage="5.2%"
				headerClass="px-[5px]"
				wrapperClass="border-0"
				valueClass="text-3xl"
			/>
			<MetricCard
				title="Total Chauffeurs"
				value={`${data?.totalChauffeurs}`}
				percentage="5.2%"
				headerClass="px-[5px]"
				wrapperClass="border-0"
				valueClass="text-3xl"
			/>
		</div>
	);
}
