import { useEffect } from "react";
import useFetchDashboard from "@/api/dashboard.api";
import { ChartAreaInteractive } from "@/components/layouts/partials/chart-area-interactive";
import { Spinner } from "@/components/Spinner";
import { SectionCards } from "@/pages/dashboard/partials/section-cards";
import UserProfile from "./partials/user-profile";
// import { DataTable } from "@/components/data-table"
// import data from "./partials/data.json"

export default function Dashboard() {
	const { data, isFetching } = useFetchDashboard({});
	useEffect(() => {
		console.log(data);
	}, [data]);
	if (isFetching) return <Spinner />;
	return (
		<div className="bg-base-background-light @container/main h-full">
			<div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-8">
				{/* User Profile */}
				<UserProfile />

				{/* Cards */}
				<SectionCards data={data?.totals} />

				{/* Charts */}
				<ChartAreaInteractive data={data?.revenueByMonth} />

				{/* Table */}
				{/* <DataTable data={data} /> */}
			</div>
		</div>
	);
}
