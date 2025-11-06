import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type TPara = { limit: number };
export const getAllPermissions = async (data?: TPara) => {
	const params: Record<string, unknown> = {};
	if (data?.limit) {
		params.limit = data.limit;
	}
	const response = await axiosInstance.get(
		`${API_ENDPOINTS.PERSMISSIONS.GET_ALL}`,
		{ params },
	);

	return response.data.data;
};

const useFetchAllPermissions = (Data: TPara) =>
	useQuery({
		queryKey: ["Permissions", { Data }],
		queryFn: () => getAllPermissions(Data),
		refetchOnWindowFocus: false,
		// refetchInterval: 60000,
		retry: false,
		// keepPreviousData: true, // for pagination
	});

export default useFetchAllPermissions;
