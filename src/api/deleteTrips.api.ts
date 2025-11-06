import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const bulkDeleteTrips = async (ids: string[]) => {
	const data = {
		tripIds: ids,
	};
	const response = await adminAxiosInstance.post(
		API_ENDPOINTS.BULK_DELETE_TRIPS,
		data,
	);

	return response.data;
};
