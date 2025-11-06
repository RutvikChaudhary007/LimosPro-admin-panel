import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getAffiliateById = async (id: string) => {
	const response = await axiosInstance.get(
		`${API_ENDPOINTS.GET_AFFILIATE_BY_ID.replace(":id", id)}`,
	);
	console.log("response:", response.data);
	return response?.data?.data;
};

const UsefetchAffiliateById = ({ id }: { id: string | undefined }) =>
	useQuery({
		queryKey: ["affiliateById", id],
		queryFn: () =>
			id
				? getAffiliateById(id)
				: () => {
						console.log("id missing");
					},
		refetchOnWindowFocus: false,
		retry: false,
	});
export default UsefetchAffiliateById;
