import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getAllUsers = async (DateRange: DateRange) => {
	const params: Record<string, unknown> = {};
	if (DateRange?.startDate || DateRange?.endDate) {
		params.DateRange = {
			startDate: DateRange.startDate
				? new Date(DateRange.startDate).toISOString()
				: undefined,
			endDate: DateRange.endDate
				? new Date(DateRange.endDate).toISOString()
				: undefined,
		};
	}
	try {
		const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_USERS}`, {
			params,
		});
		// console.log("response:",response)

		return response.data.data;
	} catch (error) {
		if (error instanceof AxiosError && error?.status === 400) {
			// Treat 400 as "no data" instead of an actual error
			return [];
		}
		throw error;
	}
};

const UsefetchAllUsers = ({ DateRange }: { DateRange: DateRange }) =>
	useQuery({
		queryKey: ["users"],
		queryFn: () => getAllUsers(DateRange),
		refetchOnWindowFocus: false,
		// refetchInterval: 60000,
		retry: false,
		// keepPreviousData: true, // for pagination
	});

export default UsefetchAllUsers;
