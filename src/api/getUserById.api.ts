import { useSuspenseQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getUserById = async (id?: string) => {
  if (id) {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_USERS_BY_ID.replace(":id", id)}`,
    );
    console.log("response:", response.data);
    return response?.data?.data;
  }
};

const useFetchUserById = ({ id }: { id?: string }) =>
  useSuspenseQuery({
    queryKey: ["userById", id],
    queryFn: () => getUserById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

export default useFetchUserById;
