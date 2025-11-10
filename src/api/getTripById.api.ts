import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const getTripById = async (id: string) => {
  const params = {};
  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_TRIP_BY_ID.replace(":id", id)}`, { params });
  // console.log("response:",response)

  return response.data.data;
};

const useFetchTripById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["TripById", id],
    queryFn: () => getTripById(id),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchTripById;
