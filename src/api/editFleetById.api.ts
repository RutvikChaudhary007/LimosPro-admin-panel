import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const editFleetById = async ({
	id,
	data,
}: {
	id: string;
	data: object;
}) => {
	const response = await adminAxiosInstance.put(
		API_ENDPOINTS.EDIT_FLEET_BY_ID.replace(":id", id),
		data,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};
