import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getAllStaffRoles = async () => {
  const params: Record<string, unknown> = {};

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.ROLES.GET_ALL_STAFF_ROLE}`,
    { params },
  );
  // console.log("response:",response)

  return response.data.data;
};

const useFetchAllStaffRoles = () =>
  useQuery({
    queryKey: ["Roles"],
    queryFn: () => getAllStaffRoles(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllStaffRoles;
